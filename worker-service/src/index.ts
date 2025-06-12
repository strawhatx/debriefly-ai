import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

// Helper function for Gemini API calls
async function analyzeWithGemini(prompt: string) {
  // Check rate limit
  if (!checkRateLimit()) {
    const waitTime = getWaitTime();
    console.log(`Rate limit reached. Waiting ${waitTime}ms before continuing...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  // Add timestamp for rate limiting
  requestTimestamps.push(Date.now());

  // Make Gemini API call
  const response = await fetch(
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

  if (!response.ok) {
    const errorText = await response.text();
    if (errorText.includes("429") || errorText.includes("Too Many Requests")) {
      console.warn("Rate limit hit, retrying after delay...");
      await new Promise(resolve => setTimeout(resolve, getWaitTime()));
      return analyzeWithGemini(prompt);
    }
    throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
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
  console.log(`Processing job ${jobId}`);
  
  try {
    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('analysis_jobs')
      .select()
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      throw new Error(`Failed to fetch job: ${jobError?.message || 'Job not found'}`);
    }

    // Update status to processing
    await supabase
      .from('analysis_jobs')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', jobId);

    // Process each session
    for (const session of job.sessions) {
      console.log(`Analyzing session ${session.trade_day}`);
      
      if (!session.trades || session.trades.length === 0) {
        console.warn(`No trade data for session ${session.trade_day}`);
        continue;
      }

      const analysis = await analyzeWithGemini(JSON.stringify(session.trades));
      
      // Store results
      await supabase
        .from('trade_analysis')
        .insert({
          user_id: job.user_id,
          trading_account_id: job.trading_account_id,
          session_date: session.trade_day,
          analysis: analysis.insights,
          model: analysis.model,
          created_at: new Date().toISOString()
        });
    }

    // Mark job as complete
    await supabase
      .from('analysis_jobs')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);

    console.log(`Completed job ${jobId}`);

  } catch (error) {
    console.error(`Error processing job ${jobId}:`, error);
    
    // Handle errors
    await supabase
      .from('analysis_jobs')
      .update({ 
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);
  }
}

// Main function to listen for new jobs
async function startWorker() {
  const client = await pool.connect();
  
  try {
    // Listen for new jobs
    await client.query('LISTEN new_job');
    console.log('🎧 Listening for new jobs...');

    client.on('notification', async (msg) => {
      const jobId = JSON.parse(msg.payload!);
      await processJob(jobId);
    });

    // Keep the process running
    process.on('SIGINT', () => {
      console.log('Shutting down...');
      client.release();
      process.exit(0);
    });

  } catch (error) {
    console.error('Error in worker:', error);
    client.release();
    process.exit(1);
  }
}

// Start the worker
startWorker().catch(console.error); 