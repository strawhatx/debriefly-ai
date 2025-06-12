-- Create analysis_jobs table
CREATE TABLE public.analysis_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trading_account_id UUID NOT NULL REFERENCES public.trading_accounts(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    session_date TIMESTAMPTZ NOT NULL,
    trades JSONB NOT NULL
);

-- Create indexes
CREATE INDEX idx_analysis_jobs_user_id ON public.analysis_jobs(user_id);
CREATE INDEX idx_analysis_jobs_status ON public.analysis_jobs(status);
CREATE INDEX idx_analysis_jobs_created_at ON public.analysis_jobs(created_at);

-- Enable RLS
ALTER TABLE public.analysis_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own analysis jobs"
    ON public.analysis_jobs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analysis jobs"
    ON public.analysis_jobs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to notify worker of new jobs
CREATE OR REPLACE FUNCTION public.notify_new_analysis_job()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify for new pending jobs
    IF NEW.status = 'pending' THEN
        PERFORM pg_notify('new_job', NEW.id::text);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notifications
CREATE TRIGGER notify_new_analysis_job
    AFTER INSERT ON public.analysis_jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_new_analysis_job();

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.analysis_jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 