-- Create positions table
CREATE TABLE public.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trading_account_id UUID NOT NULL REFERENCES public.trading_accounts(id) ON DELETE CASCADE,
    entry_trade_id UUID NOT NULL REFERENCES public.trade_history(id) ON DELETE CASCADE,
    close_trade_id UUID NOT NULL REFERENCES public.trade_history(id) ON DELETE CASCADE,
    symbol TEXT,
    asset_type public.asset_type,
    position_type TEXT,
    quantity NUMERIC,
    fill_price NUMERIC,
    stop_price NUMERIC,
    fees NUMERIC,
    pnl NUMERIC,
    leverage NUMERIC,
    tags jsonb NULL DEFAULT '[]'::jsonb,
    strategy TEXT NULL,
    risk SMALLINT NULL DEFAULT '1'::smallint,
    reward REAL NULL,
    score REAL NULL,
    state public.trade_status null default 'DRAFT'::trade_status,
    entry_date TIMESTAMPTZ NOT NULL,
    closing_date TIMESTAMPTZ,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own positions"
    ON public.positions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own positions"
    ON public.positions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own positions"
    ON public.positions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own positions"
    ON public.positions FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.positions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 