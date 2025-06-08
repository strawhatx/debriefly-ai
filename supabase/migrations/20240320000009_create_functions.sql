-- Create check account limit trigger function
CREATE OR REPLACE FUNCTION public.check_trading_account_limit() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    account_count INT;
    max_accounts INT;
BEGIN
    -- Determine max allowed accounts based on subscription tier
    SELECT 
        COUNT(*) INTO account_count
    FROM 
        public.trading_accounts
    WHERE 
        user_id = NEW.user_id;

    -- Basic/Free: price_1QwsM12c1fXi1EZHRerWIEBh
    SELECT 
        CASE 
            WHEN stripe_price_id = 'price_1QwsM12c1fXi1EZHRerWIEBh' THEN 5
            ELSE 10
        END
    INTO max_accounts
    FROM public.subscriptions
    WHERE user_id = NEW.user_id;

    -- Check if adding a new account would exceed the limit
    IF account_count >= max_accounts THEN
        RAISE EXCEPTION 'Trading account limit reached for your subscription tier. Please upgrade to add more accounts.';
    END IF;

    RETURN NEW;
END;
$$;

-- Create get position history function
CREATE OR REPLACE FUNCTION public.get_position_history(pos_id UUID) 
RETURNS TABLE (
    account_name TEXT,
    symbol TEXT,
    order_type TEXT,
    side TEXT,
    fill_price NUMERIC,
    stop_price NUMERIC,
    quantity NUMERIC,
    entry_date TIMESTAMPTZ,
    closing_date TIMESTAMPTZ,
    fees NUMERIC,
    status TEXT,
    order_id TEXT,
    leverage NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        a.account_name,
        h.symbol,
        h.order_type,
        h.side,
        h.fill_price,
        h.stop_price,
        h.quantity,
        h.entry_date,
        h.closing_date,
        h.fees,
        h.status,
        h.external_id AS order_id,
        h.leverage
    FROM positions p
    JOIN trade_history h ON h.id = p.entry_trade_id OR h.id = p.close_trade_id
    JOIN trading_accounts a ON a.id = h.trading_account_id
    WHERE p.id = pos_id;
END;
$$;

-- Create get unanalyzed positions function
CREATE OR REPLACE FUNCTION public.get_unanalyzed_positions(
    user_id_param UUID, 
    trading_account_id_param UUID
) 
RETURNS TABLE (
    trade_day TIMESTAMPTZ,
    trades JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('day', p.entry_date) as trade_day,
        jsonb_build_object(
            'trades', 
            jsonb_agg(
                jsonb_build_object(
                    'id', p.id,
                    'entry_date', p.entry_date,
                    'symbol', p.symbol,
                    'pnl', p.pnl,
                    'position_type', p.position_type,
                    'asset_type', p.asset_type,
                    'quantity', p.quantity,
                    'fill_price', p.fill_price,
                    'stop_price', p.stop_price,
                    'closing_date', p.closing_date,
                    'fees', p.fees,
                    'leverage', p.leverage,
                    'strategy', p.strategy,
                    'risk_reward', CONCAT(p.risk, ':', p.reward),
                    'emotional_tags', p.tags
                )
            )
        ) as trades
    FROM positions p
    LEFT JOIN trade_analysis a 
        ON a.session_date = DATE_TRUNC('day', p.entry_date)
        AND (trading_account_id_param IS NULL OR a.trading_account_id = trading_account_id_param)
    WHERE p.user_id = user_id_param
        AND (trading_account_id_param IS NULL OR p.trading_account_id = trading_account_id_param)
        AND a.session_date IS NULL
    GROUP BY DATE_TRUNC('day', p.entry_date)
    ORDER BY DATE_TRUNC('day', p.entry_date) DESC
    LIMIT 50;
END;
$$;

-- Create process new import trigger function
CREATE OR REPLACE FUNCTION public.process_new_import() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only process if status is pending
    IF NEW.status = 'PENDING' THEN
        -- Update status to uploaded to indicate processing should begin
        UPDATE public.imports 
        SET status = 'UPLOADED',
            updated_at = now()
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create update insights timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_insights_updated_at() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;