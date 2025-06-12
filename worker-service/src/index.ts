import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { AnalysisJob, AnalysisResult, GeminiResponse, TradeAnalysis } from './types';
import { tradeDebriefPrompt } from './prompts';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Rate limiting configuration
const RATE_LIMIT = 15; // requests per minute (Gemini free tier)
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MIN_REQUEST_GAP = 100; // minimum 100ms between requests
const requestTimestamps: number[] = [];

// Helper function to check rate limit
function checkRateLimit(): boolean {
  const now = Date.now();
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_WINDOW) {
    requestTimestamps.shift();
  }
  return requestTimestamps.length < RATE_LIMIT;
}

// Helper function to get wait time
function getWaitTime(): number {
  const now = Date.now();
  if (requestTimestamps.length >= RATE_LIMIT) {
    return RATE_WINDOW - (now - requestTimestamps[0]);
  }
  return MIN_REQUEST_GAP;
}

// Helper function for Gemini API calls with rate limiting
async function analyzeWithGemini(prompt: string): Promise<AnalysisResult> {
  // Check rate limit
  if (!checkRateLimit()) {
    const waitTime = getWaitTime();
    console.log(`Rate limit reached. Waiting ${waitTime}ms before continuing...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  // Add timestamp for rate limiting
  requestTimestamps.push(Date.now());

  // Make Gemini API call
  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    }
  );

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    if (errorText.includes("429") || errorText.includes("Too Many Requests")) {
      console.warn("Rate limit hit, retrying after delay...");
      await new Promise(resolve => setTimeout(resolve, getWaitTime()));
      return analyzeWithGemini(prompt); // Retry the request
    }
    throw new Error(`Gemini API error: ${geminiResponse.statusText} - ${errorText}`);
  }

  const result = await geminiResponse.json() as GeminiResponse;
  const insights = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!insights) {
    throw new Error("No response from Gemini");
  }

  try {
    return {
      insights: JSON.parse(insights),
      model: "gemini-pro"
    };
  } catch (e) {
    console.warn("Failed to parse Gemini response as JSON, using raw text");
    return {
      insights,
      model: "gemini-pro"
    };
  }
}

// Process a single job
async function processJob(jobId: string) {
  console.log(`🔄 Processing job: ${jobId}`);
  
  try {
    // Update job status to processing
    const { data: job, error: updateError } = await supabase
      .from("analysis_jobs")
      .update({ 
        status: "processing",
        started_at: new Date().toISOString()
      })
      .eq("id", jobId)
      .select()
      .single();

    if (updateError || !job) {
      throw new Error(`Failed to update job status: ${updateError?.message}`);
    }

    // Generate and run analysis
    const prompt = tradeDebriefPrompt(job.trades as any[]);
    const analysis = await analyzeWithGemini(prompt);
    
    if (!analysis) {
      throw new Error("Gemini analysis failed");
    }

    const insights = typeof analysis.insights === 'string' 
      ? analysis.insights.replace(/```json|```/g, "").trim()
      : analysis.insights;

    // Save analysis results
    const { error: saveError } = await supabase
      .from("trade_analysis")
      .insert({
        user_id: job.user_id,
        trading_account_id: job.trading_account_id,
        session_date: job.session_date,
        analysis: typeof insights === 'string' ? JSON.parse(insights) : insights,
        model: analysis.model,
        created_at: new Date().toISOString(),
      } satisfies TradeAnalysis)
      .select();

    if (saveError) {
      throw new Error(`Failed to save analysis: ${saveError.message}`);
    }

    // Mark job as completed
    await supabase
      .from("analysis_jobs")
      .update({ 
        status: "completed",
        completed_at: new Date().toISOString()
      })
      .eq("id", jobId);

    console.log(`✅ Job completed successfully: ${jobId}`);

  } catch (error) {
    console.error(`❌ Error processing job ${jobId}:`, error);
    
    // Mark job as failed
    await supabase
      .from("analysis_jobs")
      .update({ 
        status: "failed",
        error_message: error instanceof Error ? error.message : String(error),
        completed_at: new Date().toISOString()
      })
      .eq("id", jobId);
  }
}

// Main function to listen for new jobs
async function startWorker() {
  console.log('🎧 Starting worker...');
  
  try {
    // Poll for pending jobs
    setInterval(async () => {
      const { data: pendingJobs, error: jobsError } = await supabase
        .from("analysis_jobs")
        .select()
        .eq("status", "pending")
        .limit(1);

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        return;
      }

      if (pendingJobs && pendingJobs.length > 0) {
        const job = pendingJobs[0];
        await processJob(job.id);
      }
    }, 5000); // Check every 5 seconds

    // Keep the process running
    process.on('SIGINT', () => {
      console.log('Shutting down...');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error in worker:', error);
    process.exit(1);
  }
}

// Start the worker
startWorker(); 