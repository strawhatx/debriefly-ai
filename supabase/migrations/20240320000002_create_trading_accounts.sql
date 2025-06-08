-- Create trading_accounts table
CREATE TABLE public.trading_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    broker_id UUID NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
    account_name TEXT NOT NULL,
    account_balance NUMERIC NOT NULL DEFAULT 0,
    broker_connected BOOLEAN DEFAULT false,
    broker_credentials JSONB,
    market TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own trading accounts"
    ON public.trading_accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trading accounts"
    ON public.trading_accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trading accounts"
    ON public.trading_accounts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trading accounts"
    ON public.trading_accounts FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.trading_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 