-- Create trade_analysis table
CREATE TABLE public.trade_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trading_account_id UUID REFERENCES public.trading_accounts(id) ON DELETE CASCADE,
    model TEXT NULL,
    analysis JSON NOT NULL,
    session_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for foreign keys
CREATE INDEX idx_trade_analysis_user_id ON public.trade_analysis (user_id);
CREATE INDEX idx_trade_analysis_trading_account_id ON public.trade_analysis (trading_account_id);

-- Enable Row Level Security
ALTER TABLE public.trade_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own trade analysis"
    ON public.trade_analysis FOR SELECT
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own trade_analysis"
    ON public.trade_analysis FOR INSERT
    WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own trade_analysis"
    ON public.trade_analysis FOR UPDATE
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own trade_analysis"
    ON public.trade_analysis FOR DELETE
    USING ((select auth.uid()) = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.trade_analysis
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 