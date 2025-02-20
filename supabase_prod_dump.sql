
--
-- Name: asset_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.asset_type AS ENUM (
    'STOCK',
    'OPTION',
    'FUTURES',
    'FOREX',
    'CRYPTO'
);


--
-- Name: broker_field_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.broker_field_type AS ENUM (
    'TEXT',
    'PASSWORD',
    'APIKEY'
);


--
-- Name: import_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.import_status AS ENUM (
    'PENDING',
    'UPLOADED',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);


--
-- Name: insight_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.insight_type AS ENUM (
    'DEBRIEF',
    'PATTERN',
    'SUGGESTION'
);


--
-- Name: profit_calc_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.profit_calc_method AS ENUM (
    'FIFO',
    'LIFO'
);


--
-- Name: subscription_tier; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subscription_tier AS ENUM (
    'FREE',
    'PREMIUM'
);


--
-- Name: check_trading_account_limit(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_trading_account_limit() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE
    account_count INT;
    user_tier subscription_tier;
    max_accounts INT;
BEGIN
    -- Get user's subscription tier
    SELECT tier INTO user_tier
    FROM public.subscriptions
    WHERE user_id = NEW.user_id;

    -- Set max accounts based on tier
    IF user_tier = 'FREE' THEN
        max_accounts := 1;
    ELSE -- premium
        max_accounts := 10;
    END IF;

    -- Count existing accounts
    SELECT COUNT(*) INTO account_count
    FROM public.trading_accounts
    WHERE user_id = NEW.user_id;

    -- Check if adding new account would exceed limit
    IF account_count >= max_accounts THEN
        RAISE EXCEPTION 'Trading account limit reached for your subscription tier. Please upgrade to add more accounts.';
    END IF;

    RETURN NEW;
END;$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


--
-- Name: handle_new_user_subscription(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user_subscription() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$begin
  INSERT INTO public.subscriptions (user_id, tier)
    VALUES (NEW.id, 'FREE');
    RETURN NEW;
end;$$;


--
-- Name: process_new_import(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.process_new_import() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
  -- Only process if status is pending
  IF NEW.status = 'PENDING' THEN
    -- Update status to uploaded to indicate processing should begin
    UPDATE public.imports 
    SET status = 'UPLOADED',
        updated_at = now()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;$$;


--
-- Name: update_insights_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_insights_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

--
-- Name: broker_connection_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.broker_connection_fields (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    field_name text NOT NULL,
    field_type public.broker_field_type NOT NULL,
    required boolean DEFAULT true NOT NULL,
    display_name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    broker_id uuid NOT NULL
);


--
-- Name: brokers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brokers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    asset_types text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    file_upload_enabled boolean DEFAULT true NOT NULL,
    broker_sync_enabled boolean DEFAULT false NOT NULL
);


--
-- Name: currency_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.currency_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(3) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: futures_multipliers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.futures_multipliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    symbol character varying NOT NULL,
    multiplier numeric NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    name character varying
);


--
-- Name: imports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.imports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    trading_account_id uuid NOT NULL,
    import_type character varying(50) NOT NULL,
    status public.import_status DEFAULT 'PENDING'::public.import_status NOT NULL,
    error_message text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    original_filename text,
    file_path text,
    file_size integer,
    file_type text,
    CONSTRAINT imports_import_type_check CHECK (((import_type)::text = ANY (ARRAY[('csv'::character varying)::text, ('excel'::character varying)::text, ('coinbase_sync'::character varying)::text, ('oanda_sync'::character varying)::text, ('schwab_sync'::character varying)::text])))
);


--
-- Name: insights; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    position_id uuid,
    type public.insight_type NOT NULL,
    content jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_date timestamp with time zone
);


--
-- Name: positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.positions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    trading_account_id uuid NOT NULL,
    symbol text,
    asset_type public.asset_type DEFAULT 'STOCK'::public.asset_type,
    position_type text,
    quantity double precision,
    fill_price double precision,
    stop_price double precision,
    entry_date timestamp with time zone NOT NULL,
    closing_date timestamp with time zone,
    fees double precision DEFAULT 0,
    multiplier integer DEFAULT 1,
    pnl double precision,
    leverage double precision,
    status text,
    entry_trade_id uuid NOT NULL,
    close_trade_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text,
    full_name text,
    avatar_url text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tier public.subscription_tier DEFAULT 'FREE'::public.subscription_tier NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: trade_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trade_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    trading_account_id uuid NOT NULL,
    import_id uuid,
    symbol character varying(50) NOT NULL,
    order_type character varying,
    side character varying(10) NOT NULL,
    fill_price numeric NOT NULL,
    stop_price numeric,
    quantity numeric NOT NULL,
    entry_date timestamp with time zone NOT NULL,
    closing_date timestamp with time zone,
    fees numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    status character varying,
    external_id character varying,
    leverage numeric DEFAULT '0'::numeric,
    CONSTRAINT trades_leverage_check CHECK ((leverage = ANY (ARRAY[(0)::numeric, (50)::numeric, (100)::numeric, (200)::numeric, (300)::numeric, (400)::numeric, (500)::numeric]))),
    CONSTRAINT trades_side_check CHECK (((side)::text = ANY (ARRAY[('BUY'::character varying)::text, ('SELL'::character varying)::text])))
);


--
-- Name: trading_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trading_accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    account_name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    profit_calculation_method public.profit_calc_method DEFAULT 'FIFO'::public.profit_calc_method NOT NULL,
    account_balance numeric(20,2) DEFAULT 0.00 NOT NULL,
    broker_credentials jsonb,
    broker_connected boolean DEFAULT false,
    broker_id uuid NOT NULL
);


--
-- Data for Name: broker_connection_fields; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.broker_connection_fields (id, field_name, field_type, required, display_name, description, created_at, updated_at, broker_id) FROM stdin;
\.


--
-- Data for Name: brokers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brokers (id, name, description, asset_types, created_at, updated_at, file_upload_enabled, broker_sync_enabled) FROM stdin;
\.


--
-- Data for Name: currency_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.currency_codes (id, code, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: futures_multipliers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.futures_multipliers (id, symbol, multiplier, created_at, updated_at, name) FROM stdin;
\.


--
-- Data for Name: imports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.imports (id, user_id, trading_account_id, import_type, status, error_message, created_at, updated_at, original_filename, file_path, file_size, file_type) FROM stdin;
\.


--
-- Data for Name: insights; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.insights (id, user_id, position_id, type, content, created_at, updated_at, session_date) FROM stdin;
\.


--
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.positions (id, user_id, trading_account_id, symbol, asset_type, position_type, quantity, fill_price, stop_price, entry_date, closing_date, fees, multiplier, pnl, leverage, status, entry_trade_id, close_trade_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, username, full_name, avatar_url, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscriptions (id, user_id, tier, active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: trade_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trade_history (id, user_id, trading_account_id, import_id, symbol, order_type, side, fill_price, stop_price, quantity, entry_date, closing_date, fees, created_at, updated_at, status, external_id, leverage) FROM stdin;
\.


--
-- Data for Name: trading_accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trading_accounts (id, user_id, account_name, created_at, updated_at, profit_calculation_method, account_balance, broker_credentials, broker_connected, broker_id) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
\.

--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Name: broker_connection_fields broker_connection_fields_broker_id_field_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.broker_connection_fields
    ADD CONSTRAINT broker_connection_fields_broker_id_field_name_key UNIQUE (broker_id, field_name);


--
-- Name: broker_connection_fields broker_connection_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.broker_connection_fields
    ADD CONSTRAINT broker_connection_fields_pkey PRIMARY KEY (id);


--
-- Name: brokers brokers_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brokers
    ADD CONSTRAINT brokers_name_key UNIQUE (name);


--
-- Name: brokers brokers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brokers
    ADD CONSTRAINT brokers_pkey PRIMARY KEY (id);


--
-- Name: currency_codes currency_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.currency_codes
    ADD CONSTRAINT currency_codes_code_key UNIQUE (code);


--
-- Name: currency_codes currency_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.currency_codes
    ADD CONSTRAINT currency_codes_pkey PRIMARY KEY (id);


--
-- Name: futures_multipliers futures_multipliers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.futures_multipliers
    ADD CONSTRAINT futures_multipliers_pkey PRIMARY KEY (id);


--
-- Name: imports imports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT imports_pkey PRIMARY KEY (id);


--
-- Name: insights insights_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insights
    ADD CONSTRAINT insights_pkey PRIMARY KEY (id);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);


--
-- Name: trade_history trades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trade_history
    ADD CONSTRAINT trades_pkey PRIMARY KEY (id);


--
-- Name: trading_accounts trading_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_accounts
    ADD CONSTRAINT trading_accounts_pkey PRIMARY KEY (id);


--
-- Name: trade_history unique_trade_external_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trade_history
    ADD CONSTRAINT unique_trade_external_id UNIQUE (external_id, trading_account_id);


--
-- Name: futures_multipliers_symbol_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX futures_multipliers_symbol_idx ON public.futures_multipliers USING btree (symbol);


--
-- Name: idx_broker_connection_fields_broker_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_broker_connection_fields_broker_id ON public.broker_connection_fields USING btree (broker_id);


--
-- Name: idx_imports_trading_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_imports_trading_account_id ON public.imports USING btree (trading_account_id);


--
-- Name: idx_imports_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_imports_user_id ON public.imports USING btree (user_id);


--
-- Name: idx_trades_entry_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trades_entry_date ON public.trade_history USING btree (entry_date);


--
-- Name: idx_trades_external_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trades_external_id ON public.trade_history USING btree (external_id, trading_account_id);


--
-- Name: idx_trades_import_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trades_import_id ON public.trade_history USING btree (import_id);


--
-- Name: idx_trades_symbol; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trades_symbol ON public.trade_history USING btree (symbol);


--
-- Name: idx_trades_trading_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trades_trading_account_id ON public.trade_history USING btree (trading_account_id);


--
-- Name: idx_trades_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trades_user_id ON public.trade_history USING btree (user_id);


--
-- Name: trades_user_account_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trades_user_account_idx ON public.trade_history USING btree (user_id, trading_account_id);


--
-- Name: broker_connection_fields broker_connection_fields_broker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.broker_connection_fields
    ADD CONSTRAINT broker_connection_fields_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.brokers(id);


--
-- Name: imports fk_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: imports imports_trading_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT imports_trading_account_id_fkey FOREIGN KEY (trading_account_id) REFERENCES public.trading_accounts(id) ON DELETE CASCADE;


--
-- Name: imports imports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT imports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: insights insights_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insights
    ADD CONSTRAINT insights_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(id);


--
-- Name: insights insights_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insights
    ADD CONSTRAINT insights_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- Name: positions positions_entry_trade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_entry_trade_id_fkey FOREIGN KEY (entry_trade_id) REFERENCES public.trade_history(id) ON DELETE CASCADE;


--
-- Name: positions positions_exit_trade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_exit_trade_id_fkey FOREIGN KEY (close_trade_id) REFERENCES public.trade_history(id) ON DELETE CASCADE;


--
-- Name: positions positions_trading_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_trading_account_id_fkey FOREIGN KEY (trading_account_id) REFERENCES public.trading_accounts(id) ON DELETE CASCADE;


--
-- Name: positions positions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_user_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: trade_history trade_history_import_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trade_history
    ADD CONSTRAINT trade_history_import_id_fkey FOREIGN KEY (import_id) REFERENCES public.imports(id);


--
-- Name: trade_history trade_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trade_history
    ADD CONSTRAINT trade_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: trade_history trades_trading_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trade_history
    ADD CONSTRAINT trades_trading_account_id_fkey FOREIGN KEY (trading_account_id) REFERENCES public.trading_accounts(id) ON DELETE CASCADE;


--
-- Name: trading_accounts trading_accounts_broker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_accounts
    ADD CONSTRAINT trading_accounts_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.brokers(id);


--
-- Name: trading_accounts trading_accounts_user_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_accounts
    ADD CONSTRAINT trading_accounts_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: broker_connection_fields Allow read access to authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read access to authenticated users" ON public.broker_connection_fields TO authenticated USING (true);


--
-- Name: brokers Allow read access to authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read access to authenticated users" ON public.brokers TO authenticated USING (true);


--
-- Name: currency_codes Allow read access to authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read access to authenticated users" ON public.currency_codes TO authenticated USING (true);


--
-- Name: futures_multipliers Allow read access to authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read access to authenticated users" ON public.futures_multipliers TO authenticated USING (true);


--
-- Name: imports Enable insert for users based on user_id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for users based on user_id" ON public.imports FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: positions Enable insert for users based on user_id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for users based on user_id" ON public.positions FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: trade_history Enable insert for users based on user_id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for users based on user_id" ON public.trade_history FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: trading_accounts Enable insert for users based on user_id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for users based on user_id" ON public.trading_accounts FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: imports Enable users to view their own data only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable users to view their own data only" ON public.imports FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: positions Enable users to view their own data only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable users to view their own data only" ON public.positions FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: profiles Public profiles are viewable by everyone.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);


--
-- Name: trading_accounts Users can delete own trading_accounts.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own trading_accounts." ON public.trading_accounts FOR DELETE USING ((( SELECT auth.uid() AS uid) = id));


--
-- Name: insights Users can delete their own insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own insights" ON public.insights FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: insights Users can insert their own insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own insights" ON public.insights FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = id));


--
-- Name: imports Users can update own imports.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own imports." ON public.imports FOR UPDATE USING ((( SELECT auth.uid() AS uid) = id));


--
-- Name: profiles Users can update own profile.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING ((( SELECT auth.uid() AS uid) = id));


--
-- Name: trade_history Users can update own trades.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own trades." ON public.trade_history FOR UPDATE USING ((( SELECT auth.uid() AS uid) = id));


--
-- Name: trading_accounts Users can update own trading_accounts.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own trading_accounts." ON public.trading_accounts FOR UPDATE USING ((( SELECT auth.uid() AS uid) = id));


--
-- Name: insights Users can update their own insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own insights" ON public.insights FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: insights Users can view their own insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own insights" ON public.insights FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: subscriptions Users can view their own subscription.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own subscription." ON public.subscriptions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: trade_history Users can view their own trades.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own trades." ON public.trade_history FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: trading_accounts Users can view their own trading_accounts.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own trading_accounts." ON public.trading_accounts FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: broker_connection_fields; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.broker_connection_fields ENABLE ROW LEVEL SECURITY;

--
-- Name: brokers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;

--
-- Name: currency_codes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.currency_codes ENABLE ROW LEVEL SECURITY;

--
-- Name: futures_multipliers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.futures_multipliers ENABLE ROW LEVEL SECURITY;

--
-- Name: imports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.imports ENABLE ROW LEVEL SECURITY;

--
-- Name: insights; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

--
-- Name: positions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: trade_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.trade_history ENABLE ROW LEVEL SECURITY;

--
-- Name: trading_accounts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;
