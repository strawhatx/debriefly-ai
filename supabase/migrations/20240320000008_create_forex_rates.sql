create table public.forex_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency text null,
  quote_currency text null,
  rate_date date null,
  rate numeric null,
  constraint forex_rates_base_currency_quote_currency_rate_date_key unique (base_currency, quote_currency, rate_date)
)

-- Enable Row Level Security
ALTER TABLE public.forex_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Anyone can view forex rates"
    ON public.forex_rates FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Anyone can insert forex rates"
    ON public.forex_rates FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can update forex rates"
    ON public.forex_rates FOR UPDATE
    WITH CHECK (true);