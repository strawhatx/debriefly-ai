-- Create enum types
CREATE TYPE public.asset_type AS ENUM ('STOCK', 'OPTION', 'FUTURES', 'FOREX', 'CRYPTO');
CREATE TYPE public.broker_field_type AS ENUM ('TEXT', 'PASSWORD', 'APIKEY');
CREATE TYPE public.import_status AS ENUM ('PENDING', 'UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE public.insight_type AS ENUM ('debrief', 'pattern', 'suggestion');
CREATE TYPE public.profit_calc_method AS ENUM ('FIFO', 'LIFO');
CREATE TYPE public.subscription_tier AS ENUM ('FREE', 'PREMIUM');
CREATE TYPE public.trade_status AS ENUM ('DRAFT', 'PUBLISHED');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create brokers table
CREATE TABLE public.brokers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    asset_types TEXT[] DEFAULT '{}',
    broker_sync_enabled BOOLEAN DEFAULT false,
    file_upload_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create futures_multipliers table
CREATE TABLE public.futures_multipliers (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR NULL,
    symbol TEXT NOT NULL UNIQUE,
    point_value NUMERIC NOT NULL,
    tick_size NUMERIC NULL,
    tick_value NUMERIC NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.futures_multipliers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING ((select auth.uid()) = id );

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

-- Set up Storage!
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Users can update their own avatars." on storage.objects
  for update using (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own avatars." on storage.objects
  for delete using (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create RLS policies for brokers
CREATE POLICY "Anyone can view brokers"
    ON public.brokers FOR SELECT
    TO authenticated
    USING (true);

-- Create RLS policies for futures_multipliers
CREATE POLICY "Anyone can view futures multipliers"
    ON public.futures_multipliers FOR SELECT
    TO authenticated
    USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.brokers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.futures_multipliers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seeding data
INSERT INTO "public"."brokers" ("id", "name", "description", "asset_types", "created_at", "updated_at", "file_upload_enabled", "broker_sync_enabled") 
VALUES ('1ebe9408-1f8e-4973-ab17-befbc7a10585', 'Tradovate', 'Futures trading platform', '{"futures"}', '2025-02-11 07:22:25.833548+00', '2025-02-11 07:22:25.833548+00', 'true', 'true'), 
('26c4abc3-c30c-4c0e-9f4f-6dff7d5a72c3', 'Robinhood', 'Commission-free investing platform', '{"stocks","options","crypto"}', '2025-02-11 07:22:25.833548+00', '2025-02-11 07:22:25.833548+00', 'true', 'false'), 
('3c210844-1d30-4c83-9068-30ec27619184', 'TradingView Paper Trading', 'Paper trading simulation through TradingView platform', '{"stocks","crypto","forex","futures"}', '2025-02-11 08:11:14.646779+00', '2025-02-11 08:11:14.646779+00', 'true', 'false'), 
('476531c2-3207-4766-a796-6e56b7b487b9', 'Coinbase', 'Cryptocurrency exchange platform', '{"crypto"}', '2025-02-11 07:22:25.833548+00', '2025-02-11 07:22:25.833548+00', 'true', 'true'), 
('5b18e2b0-dc19-4b6e-83d1-171598c136e1', 'TradeStation', 'Online securities and futures brokerage', '{"stocks","options","futures"}', '2025-02-11 07:22:25.833548+00', '2025-02-11 07:22:25.833548+00', 'true', 'false'), 
('5bb66bd8-7f00-4c2c-b807-2cfbba2fb05b', 'Webull', 'Commission-free trading platform', '{"stocks","options"}', '2025-02-11 07:22:25.833548+00', '2025-02-11 07:22:25.833548+00', 'true', 'false'), 
('5e2bd55f-bc42-46b0-bfac-7f77d91764a9', 'Charles Schwab', 'Financial services and brokerage', '{"stocks","options"}', '2025-02-11 07:22:25.833548+00', '2025-02-11 07:22:25.833548+00', 'true', 'false'), 
('70a56075-64a9-492a-9287-cbcc926bbc3f', 'Forex.com', 'Foreign exchange trading', '{"forex"}', '2025-02-11 07:22:25.833548+00', '2025-02-11 07:22:25.833548+00', 'true', 'false'), 
('dc3ab23a-b1c9-4ce5-bda8-418f0ced2eb1', 'Oanda', 'Forex and CFD trading', '{"forex"}', '2025-02-11 07:22:25.833548+00', '2025-02-11 07:22:25.833548+00', 'true', 'false');


INSERT INTO "public"."futures_multipliers" ("id", "symbol", "point_value", "created_at", "updated_at", "name", "tick_size", "tick_value") 
VALUES ('0277ec8a-de22-43cc-bf46-ff1b84187ac2', 'ZT', '2000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'U.S. 2-Year Note', '0.0025', '15.625'), 
('05dc19d3-b38f-4e33-a9b9-98cba25ec597', 'XK', '10.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'E-mini Soybean', '0.0025', '12.50'), 
('0b851857-17fe-4ace-88a5-cdc3b81f786c', 'MES', '5.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro E-mini S&P 500', '0.25', '1.25'), 
('0d2e1353-79c2-4e8e-bde6-768265b4e107', 'ES', '50.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'E-mini S&P 500', '0.25', '12.50'), 
('0f73743a-d048-4103-ad94-4205c09c0aee', 'KE', '50.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'KC Hard Red Winter Wheat', '0.25', '12.50'), 
('14b0c4bf-2e6f-40de-8b93-e4d66770f28b', '6B', '62500.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'British Pound', '0.0001', '6.25'), 
('198a352d-9f6f-4780-983a-03867d4b9c3f', 'ZQ', '4167.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Fed Funds', '0.005', '20.835'), 
('1eb524bf-a9d3-4a36-b7c6-8bc179fc80f2', 'OJ', '150.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Orange Juice ICE1', '0.05', '7.50'), 
('21af0415-c896-48aa-abef-498b1ef5fe87', 'MNG', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro Natural Gas', '0.1', '1.00'), 
('23a1a6ae-c124-4ea6-ada8-2e5b105cf1ee', 'ZL', '600.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Soybean Oil', '0.01', '6.00'), 
('248a8ff6-6e8b-406b-a723-c3de22f1632a', 'SI', '5000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Silver', '0.005', '25.00'), 
('299b97ad-adbb-4db4-96f0-8bdf88df55c9', 'VX', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'CBOE Volatility Index (VIX)', '0.05', '50.00'), 
('2fdb6832-eda2-4c32-91af-ab0d2971cae8', 'LE', '400.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Live Cattle', '0.025', '10.00'), 
('32f04dfa-8395-4ce2-9f40-caf5624a2c8f', 'ZO', '50.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Oats', '0.25', '12.50'), 
('333d2c38-5c02-4545-abd6-fa6ddc02f848', '6A', '100000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Australian Dollar', '0.0001', '10.00'), 
('33747fdd-ee68-491b-ae9d-1825a39f8342', 'MGC', '10.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro Gold', '0.1', '1.00'), 
('36e57981-83d5-45a0-9584-2795cf9ade1f', 'MSF', '12500.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro CHFUSD', '0.005', '25.00'), 
('37e932fb-3c74-4589-a139-e845c06b4531', 'MBT', '0.10', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'CME Micro Bitcoin', '5', '0.50'), 
('3a19ea63-526f-43f3-a3f2-a6950b32768a', 'CC', '10.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Cocoa ICE1', '1', '10.00'), 
('3da32895-226c-4fe0-8b6a-c202d3ff9bac', 'BZ', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Brent Crude Oil', '0.01', '10.00'), 
('4895b499-6842-4c1d-9e3c-4fcba60e0977', 'AW', '100.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Bloomberg Commodity Index', '0.25', '12.50'), 
('506228f2-21f7-4fdf-9aeb-43469d450c03', 'GF', '500.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Feeder Cattle', '0.025', '12.50'), 
('526741ee-0737-449d-9162-441e7bc4370e', 'NKD', '5.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Nikkei 225 (CME)', '5', '25.00'), 
('55bae49e-e78d-46e8-b04a-0e17e29e2168', 'BTC', '5.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'CME Bitcoin', '5', '25.00'), 
('586779cf-bc13-4d77-ba5a-9225c2d367e7', 'MWE', '50.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Minneapolis Wheat', '0.25', '12.50'), 
('591d2320-24ba-42e0-89c3-0ee7c9c91cc1', 'VXM', '100.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Mini CBOE Volatility Index', '0.05', '5.00'), 
('5f9f5fc9-7413-4bc0-bd63-2eac4c29df4e', 'ZS', '50.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Soybean', '0.25', '12.50'), 
('65467208-5bad-4746-b4d3-947ca0051223', '6E', '125000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Euro FX', '0.00005', '6.25'), 
('69de942f-290b-4c21-968b-2ebb922b770f', 'TN', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Ultra 10-Year T-Note', '0.015625', '15.625'), 
('6a58a29a-4e31-400c-a344-39195f720219', 'XW', '10.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'E-mini Wheat', '0.25', '12.50'), 
('6f3792bb-4315-4a3d-a260-617e54654ca8', 'SIL', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro Silver', '0.005', '25.00'), 
('72b7f839-ce59-49ef-8a25-cad23fe7d337', 'M2K', '5.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro E-mini Russell 2000', '0.1', '0.50'),
('7353e7b2-0fb4-41a4-af8f-bd148c1348de', 'J7', '6250000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'E-mini Japanese Yen', '0.000001', '6.25'), 
('743ff978-7be3-4de5-ae89-bef23a76fd08', 'ZN', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'U.S. 10-Year Note', '0.015625', '15.625'), 
('7909240d-0be7-442f-85a2-b1800bb70860', 'XC', '10.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'E-mini Corn', '0.25', '12.50'), 
('7ab31648-fd1f-450f-baa7-43a8aea59b14', '6C', '100000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Canadian Dollar', '0.00005', '5.00'), 
('7c6d6b36-e57a-4a96-b061-c1e82e571f36', 'HO', '42000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Heating Oil', '0.0001', '4.20'), 
('7c8ae08e-6669-4d33-ad53-2c869ba1d6f7', 'QG', '2500.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'E-mini Natural Gas', '0.005', '12.50'), 
('7cb8c5b3-b230-4723-9990-f2c9f2e0d48f', '6L', '100000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Brazilian Real', '0.00005', '5.00'), 
('7ef7ae36-64a4-44ba-bed8-77d542ec3ece', 'GC', '100.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Gold', '0.1', '10.00'), 
('7fe8e11c-b52c-4901-96dc-585283abf15e', 'ZC', '50.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Corn', '0.25', '12.50'), 
('811c029f-0f74-4d32-9135-c3d7cc92f2a4', '6Z', '500000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'South African Rand', '0.00001', '10.00'), 
('84a64124-e86a-4917-8284-c9eba578914f', 'ZM', '100.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Soybean Meal', '0.1', '10.00'), 
('8af8ec91-9823-4a1d-95bc-62b37fdc31f1', 'NQ', '20.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'E-mini Nasdaq', '0.25', '5.00'), 
('8b559707-9124-48ea-9839-ce3624f53a66', 'MYM', '0.50', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro E-mini DOW', '1', '0.50'), 
('8be4fb2a-0c00-4afa-be00-2d880aa6c936', 'HG', '25000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Copper', '0.0005', '12.50'),
('910035fd-9930-470c-a3a2-70d1653b3a90', 'DC', '2000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Milk', '0.01', '20.00'), 
('9173a96e-12cc-4780-afca-59f0d5d7fef4', 'QM', '500.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'E-mini Crude Oil', '0.025', '12.50'), 
('9215d430-335e-405e-93a0-cc2bb005b995', '6S', '125000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Swiss Franc', '0.0001', '12.50'), 
('97ec9ecd-f53b-467d-bf54-22a8f4a81b8a', 'RB', '42000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'RBOB Gasoline', '0.0001', '4.20'), 
('9aa62709-1e76-47d8-99d7-c8d1ac02edb1', 'M6B', '6250.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro GBPUSD', '0.0001', '0.625'), 
('a3bccbe1-5e44-4e38-b24e-0c4b1bf3a08d', 'MNQ', '2.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro E-mini Nasdaq-100', '0.25', '0.50'), 
('a738c300-a8e1-4d94-a8b2-49c7f6215de3', 'CT', '500.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Cotton ICE1', '0.01', '5.00'), 
('a82c377c-4c18-4d35-98ce-5f2bccfe3fe3', 'DX ', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'U.S. Dollar Index1', '0.005', '5.00'), 
('aafee26b-ae69-4f2b-ad51-a84ad3f20cc5', 'MET', '0.10', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'CME Micro Ether', '0.05', '2.50'), 
('b2bd98f0-9547-4bf5-b031-278a3cf9141f', 'YM', '5.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Mini Dow Jones', '1', '5.00'), 
('b8b3393e-5b59-449c-8138-0711b61ef097', 'HE', '400.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Lean Hog', '0.00025', '10.00'), 
('bd538219-6cb2-465a-a2f4-43901e231b92', 'UB', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Ultra Bond', '0.03125', '31.25'), 
('bf970a4e-1573-47d7-86dd-a0a5b398268c', 'RTY', '50.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'E-mini Russell 2000', '0.1', '5.00'), 
('c2e04927-98ae-424f-b5ce-5704e0b3cc0b', 'ZF', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'U.S. 5-Year Note', '0.015625', '15.625'), 
('caa951e7-e495-4e68-8df5-da7ebf046018', 'M6E', '12500.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro EURUSD', '0.0001', '1.25'), 
('cb1243ff-e022-43b4-814c-ae80215ce481', 'MCL', '100.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro WTI Crude Oil', '0.01', '1.00'), 
('cb88aee5-d658-4cd1-a5b0-4fa24f3c6c0f', '6M', '500000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Mexican Peso', '0.0001', '50.00'), 
('cfbfdc1e-4d05-497d-86d8-6e0997c41b63', 'MCD', '10000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro CADUSD', '0.0001', '1.00'), 
('d103d6d1-df4c-4d33-bcd5-10a3f3c3dbfc', 'ZR', '2000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Rough Rice', '0.005', '10.00'), 
('e30ddf0e-f0f1-4474-b21b-65d4700a5a2a', 'MME', '50.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'MSCI Emerging Markets Index (ICE)1', '0.25', '1.25'), 
('e72d3705-f0ea-43b9-9973-708c45c2e7bb', 'ETH', '50.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'CME Ether', '0.5', '25.00'), 
('e7a38ce3-665e-4c99-9bb5-2f3e77ed423e', 'EMD', '100.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'E-mini S&P Mid-Cap 400', '0.1', '10.00'), 
('eaa00f2b-55a8-4a14-b70d-fd9bf6f5b67c', '6N', '100000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'New Zealand Dollar', '0.0001', '10.00'), 
('edab8fd0-2ee2-42bd-b13a-f57db4223d88', 'ZB', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'U.S. 30-Year Bond', '0.03125', '31.25'), 
('ef01aa3e-b077-4110-a630-a1aaa9a2633e', 'MHG', '2500.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro Copper', '0.25', '0.50'), 
('f0d9d286-7a99-42d7-8dbd-71dd76b82d90', 'E7', '62500.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'E-mini Euro FX', '0.00005', '3.125'), 
('f51da5ea-2881-4863-96f1-130c353fbddc', 'KC', '375.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Coffee ICE1', '0.05', '18.75'), 
('f93b1d5e-f1b8-4263-851b-ed4f0c7f85cc', '6J', '12500000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Japanese Yen', '5e-7', '6.25'), 
('fa49aced-8692-49a5-ae53-31e069a6518c', 'CL', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Crude Oil', '0.01', '10.00'), 
('fbe22b81-4976-41f8-aa5d-e91fb5bb1794', 'M6A', '10000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro AUDUSD', '0.0001', '1.00'), 
('fc6000f0-1b9d-4f00-b6ca-790faf4d37b1', 'ZW', '50.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Wheat', '0.25', '12.50'), 
('fe1a5d9e-d345-4440-bcee-ea9838edef75', 'NG', '10000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Natural Gas', '0.001', '10.00'), 
('fecc9bad-cea0-452b-8c7d-efb42cb63764', '10Y', '1000.00', '2025-02-13 09:42:57.645589+00', '2025-02-13 09:42:57.645589+00', 'Micro 10 Yr. Yield', '0.015625', '15.625');


