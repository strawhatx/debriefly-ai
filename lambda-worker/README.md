# Debriefly Lambda Worker

This is the AWS Lambda worker service for Debriefly AI that handles trade analysis using the Gemini API.

## Features

- Scheduled job processing (runs every minute)
- Rate-limited Gemini API calls using DynamoDB
- Transaction-safe job processing
- Automatic deployment via GitHub Actions

## Development

### Prerequisites

- Node.js 18+
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

3. Build the project:
```bash
npm run build
```

### Local Development

To deploy from your local machine:
```bash
npm run deploy
```

## GitHub Actions Deployment

The service is automatically deployed when changes are pushed to the `main` branch in the `lambda-worker` directory.

### Required GitHub Secrets

Set up the following secrets in your GitHub repository:

- `AWS_ACCESS_KEY_ID`: AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for deployment
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `GOOGLE_GEMINI_API_KEY`: Your Google Gemini API key

## Architecture

### Components

- **AWS Lambda**: Runs the worker function every minute
- **DynamoDB**: Handles distributed rate limiting
- **Supabase**: Stores jobs and analysis results
- **Gemini API**: Performs AI analysis of trading data

### Database Functions

The worker uses a Supabase stored procedure `complete_analysis_job` to handle job completion in a transaction-safe way.

### Rate Limiting

Rate limiting is implemented using DynamoDB to ensure proper limits across multiple Lambda instances:

- 15 requests per minute to Gemini API
- Automatic cleanup of old rate limit records using TTL
- Exponential backoff for rate limit retries

## Monitoring

Monitor the worker using AWS CloudWatch:
- Lambda execution logs
- DynamoDB capacity metrics
- CloudWatch Alarms for errors

## Troubleshooting

Common issues:

1. Rate Limit Errors:
   - Check DynamoDB rate limit table
   - Verify Gemini API quota

2. Job Processing Issues:
   - Check Lambda logs in CloudWatch
   - Verify Supabase connection
   - Check job status in database

3. Deployment Issues:
   - Verify GitHub secrets are set correctly
   - Check GitHub Actions logs
   - Verify AWS credentials have sufficient permissions 