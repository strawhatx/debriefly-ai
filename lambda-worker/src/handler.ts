import { createClient } from '@supabase/supabase-js';
import { ScheduledHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { Database, Json, AnalysisResult, GeminiResponse } from './types';
import { generateTradeAnalysisPrompt } from './prompts';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const dynamodb = new DynamoDB.DocumentClient();
const RATE_LIMIT_TABLE = process.env.RATE_LIMIT_TABLE!;
const RATE_LIMIT = 15; // requests per minute (Gemini free tier)
const RATE_WINDOW = 60; // 1 minute

async function checkRateLimit(): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const windowStart = now - RATE_WINDOW;

  // Clean up old timestamps and get current count
  const result = await dynamodb.update({
    TableName: RATE_LIMIT_TABLE,
    Key: { id: 'gemini-api' },
    UpdateExpression: 'SET timestamps = list_append(if_not_exists(timestamps, :empty_list), :new_timestamp)',
    ConditionExpression: 'attribute_not_exists(timestamps) OR size(timestamps) < :limit',
    ExpressionAttributeValues: {
      ':empty_list': [],
      ':new_timestamp': [now],
      ':limit': RATE_LIMIT
    },
    ReturnValues: 'ALL_NEW'
  }).promise().catch(() => null);

  return result !== null;
}

async function analyzeWithGemini(trades: Json[]): Promise<AnalysisResult> {
  // Check rate limit
  if (!await checkRateLimit()) {
    console.log('Rate limit reached, waiting before retry...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return analyzeWithGemini(trades); // Retry
  }

  const prompt = generateTradeAnalysisPrompt(trades);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: { temperature: 0.7 }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    if (errorText.includes("429") || errorText.includes("Too Many Requests")) {
      console.warn("Rate limit hit, retrying after delay...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return analyzeWithGemini(trades); // Retry the request
    }
    throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
  }

  const result = await response.json() as GeminiResponse;
  const insights = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!insights) {
    throw new Error("No response from Gemini");
  }

  try {
    return {
      insights: JSON.parse(insights.replace(/```json|```/g, "").trim()),
      model: "gemini-pro"
    };
  } catch (e) {
    console.warn("Failed to parse Gemini response as JSON, using raw text");
    return {
      insights: insights.replace(/```json|```/g, "").trim(),
      model: "gemini-pro"
    };
  }
}

export const processJobs: ScheduledHandler = async (event) => {
  let currentJobId: string | undefined;
  
  try {
    // Get pending jobs with a transaction to ensure no other Lambda grabs the same job
    const { data: pendingJobs, error: jobsError } = await supabase
      .from("analysis_jobs")
      .select()
      .eq("status", "pending")
      .limit(1)
      .single();

    if (jobsError) {
      if (jobsError.message.includes('No rows found')) {
        console.log("No pending jobs found");
        return;
      }
      throw jobsError;
    }

    currentJobId = pendingJobs.id;

    // Update job to processing
    const { error: updateError } = await supabase
      .from("analysis_jobs")
      .update({ 
        status: "processing",
        started_at: new Date().toISOString()
      })
      .eq("id", currentJobId)
      .eq("status", "pending"); // Ensure no other Lambda grabbed it

    if (updateError) {
      console.log("Job was picked up by another Lambda");
      return;
    }

    // Generate and run analysis
    const analysis = await analyzeWithGemini(pendingJobs.trades);
    
    // Save analysis results and mark job as completed in a transaction
    const { error: saveError } = await supabase.rpc('complete_analysis_job', {
      p_job_id: currentJobId,
      p_user_id: pendingJobs.user_id,
      p_trading_account_id: pendingJobs.trading_account_id,
      p_session_date: pendingJobs.session_date,
      p_analysis: typeof analysis.insights === 'string' ? JSON.parse(analysis.insights) : analysis.insights,
      p_model: analysis.model
    });

    if (saveError) {
      throw saveError;
    }

    console.log(`Successfully processed job: ${currentJobId}`);

  } catch (error) {
    console.error('Error:', error);

    if (currentJobId) {
      await supabase
        .from("analysis_jobs")
        .update({ 
          status: "failed",
          error_message: error instanceof Error ? error.message : String(error),
          completed_at: new Date().toISOString()
        })
        .eq("id", currentJobId)
        .eq("status", "processing"); // Only update if still processing
    }
  }
}; 