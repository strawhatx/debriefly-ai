-- Create broker_connection_fields table
CREATE TABLE public.broker_connection_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    field_type public.broker_field_type NOT NULL,
    description TEXT,
    required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

  constraint broker_connection_fields_broker_id_field_name_key unique (broker_id, field_name),
);

create index IF not exists idx_broker_connection_fields_broker_id on public.broker_connection_fields using btree (broker_id) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.broker_connection_fields ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view broker connection fields"
    ON public.broker_connection_fields FOR SELECT
    TO authenticated
    USING (true);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.broker_connection_fields
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 


-- Seeding data
INSERT INTO "public"."broker_connection_fields" ("id", "field_name", "field_type", "required", "display_name", "description", "created_at", "updated_at", "broker_id") 
VALUES ('167855a6-d3da-472b-8163-e78f94bb222b', 'api_secret', 'PASSWORD', 'true', 'API Secret', 'Your Coinbase API secret', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '476531c2-3207-4766-a796-6e56b7b487b9'), 
('1d9987f6-0548-4ecd-aa06-32ba2399a6f9', 'api_secret', 'PASSWORD', 'true', 'API Secret', 'Your Tradovate API secret', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '1ebe9408-1f8e-4973-ab17-befbc7a10585'), 
('327cda3f-7a65-4e8d-8a1d-5a8508028d18', 'api_key', 'APIKEY', 'true', 'API Key', 'Your TradingView API key from the Paper Trading settings', '2025-02-11 08:14:40.412041+00', '2025-02-11 08:14:40.412041+00', '3c210844-1d30-4c83-9068-30ec27619184'), 
('4e5eb321-e4a1-4de6-9e4d-0d66398316d9', 'api_key', 'APIKEY', 'true', 'API Key', 'Your Coinbase API key', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '476531c2-3207-4766-a796-6e56b7b487b9'), 
('6731eb63-97c1-4f37-b60c-c9430ab5e04e', 'username', 'TEXT', 'true', 'Username', 'Your Charles Schwab username', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '5e2bd55f-bc42-46b0-bfac-7f77d91764a9'), 
('6813daaf-5ae3-43d4-a3de-3d4bf7f5b2c4', 'api_key', 'APIKEY', 'true', 'API Key', 'Your Oanda API key', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', 'dc3ab23a-b1c9-4ce5-bda8-418f0ced2eb1'), 
('688c99a4-b5d7-41ac-a0aa-9355472be2d6', 'username', 'TEXT', 'true', 'Username', 'Your Robinhood username', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '26c4abc3-c30c-4c0e-9f4f-6dff7d5a72c3'), 
('6e606570-5c99-489d-b48c-1bb55015e470', 'api_key', 'APIKEY', 'true', 'API Key', 'Your TradeStation API key', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '5b18e2b0-dc19-4b6e-83d1-171598c136e1'), 
('723469c3-f3f6-4bb6-bad8-2504eb1f855c', 'username', 'TEXT', 'true', 'Username', 'Your TradingView username', '2025-02-11 08:14:40.412041+00', '2025-02-11 08:14:40.412041+00', '3c210844-1d30-4c83-9068-30ec27619184'), 
('7437ce88-5472-42c0-ab64-9c70e1c5295f', 'username', 'TEXT', 'true', 'Username', 'Your Webull username', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '5bb66bd8-7f00-4c2c-b807-2cfbba2fb05b'), 
('74909122-6009-44e1-b6eb-2ffc77b957b2', 'account_id', 'TEXT', 'true', 'Account ID', 'Your Oanda Account ID', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', 'dc3ab23a-b1c9-4ce5-bda8-418f0ced2eb1'), 
('847011f7-cde7-437d-a2db-9576c6965468', 'password', 'PASSWORD', 'true', 'Password', 'Your Charles Schwab password', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '5e2bd55f-bc42-46b0-bfac-7f77d91764a9'), 
('899ad8bb-c5ec-41cf-b58a-39e7d61d00af', 'password', 'PASSWORD', 'true', 'Password', 'Your Webull password', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '5bb66bd8-7f00-4c2c-b807-2cfbba2fb05b'), 
('9b09e72d-b059-47f3-9bf3-7e3771f8d3ab', 'api_key', 'APIKEY', 'true', 'API Key', 'Your Tradovate API key', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '1ebe9408-1f8e-4973-ab17-befbc7a10585'), 
('bc824d56-5897-4b88-b30a-d62b3d697dca', 'api_key', 'APIKEY', 'true', 'API Key', 'Your Forex.com API key', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '70a56075-64a9-492a-9287-cbcc926bbc3f'), 
('c6680fa1-f712-4653-b713-fad38360785b', 'password', 'PASSWORD', 'true', 'Password', 'Your Robinhood password', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '26c4abc3-c30c-4c0e-9f4f-6dff7d5a72c3'), 
('d4774f28-28e9-498a-b55f-6e14ae63d902', 'api_secret', 'PASSWORD', 'true', 'API Secret', 'Your TradeStation API secret', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '5b18e2b0-dc19-4b6e-83d1-171598c136e1'), 
('fc8fec58-4fc6-46dc-8b76-8823f68ef8ce', 'api_secret', 'PASSWORD', 'true', 'API Secret', 'Your Forex.com API secret', '2025-02-11 06:48:47.700608+00', '2025-02-11 06:48:47.700608+00', '70a56075-64a9-492a-9287-cbcc926bbc3f');