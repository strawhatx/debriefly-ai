-- Create trade_history table
CREATE TABLE public.trade_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trading_account_id UUID NOT NULL REFERENCES public.trading_accounts(id) ON DELETE CASCADE,
    import_id UUID REFERENCES public.imports(id) ON DELETE SET NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    fill_price NUMERIC NOT NULL,
    fees NUMERIC,
    entry_date TIMESTAMPTZ NOT NULL,
    closing_date TIMESTAMPTZ,
    order_type TEXT,
    status TEXT,
    stop_price NUMERIC,
    leverage NUMERIC,
    external_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    constraint unique_trade_external_id unique (external_id, trading_account_id),
    constraint trades_leverage_check check (
        (
            leverage = any (
                array[
                (0)::numeric,
                (50)::numeric,
                (100)::numeric,
                (200)::numeric,
                (300)::numeric,
                (400)::numeric,
                (500)::numeric
                ]
            )
        )
    ),
    constraint trades_side_check check (
        (
        side = any (
            array[
            ('BUY'::character varying)::text,
            ('SELL'::character varying)::text
            ]
        )
        )
    )
);

-- Indexes for foreign keys
CREATE INDEX idx_trade_history_user_id ON public.trade_history (user_id);
CREATE INDEX idx_trade_history_trading_account_id ON public.trade_history (trading_account_id);
CREATE INDEX idx_trade_history_import_id ON public.trade_history (import_id);

-- Enable Row Level Security
ALTER TABLE public.trade_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own trade history"
    ON public.trade_history FOR SELECT
    USING ( (select auth.uid()) = user_id );

CREATE POLICY "Users can insert their own trade history"
    ON public.trade_history FOR INSERT
    WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own trade history"
    ON public.trade_history FOR UPDATE
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own trade history"
    ON public.trade_history FOR DELETE
    USING ((select auth.uid()) = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.trade_history
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 