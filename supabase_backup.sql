--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.11 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA public;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: pgsodium; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA pgsodium;


ALTER SCHEMA pgsodium OWNER TO supabase_admin;

--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;


--
-- Name: EXTENSION pgsodium; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: asset_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_type AS ENUM (
    'stock',
    'option',
    'future',
    'forex',
    'crypto'
);


ALTER TYPE public.asset_type OWNER TO postgres;

--
-- Name: broker_field_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.broker_field_type AS ENUM (
    'text',
    'password',
    'api_key'
);


ALTER TYPE public.broker_field_type OWNER TO postgres;

--
-- Name: profit_calc_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.profit_calc_method AS ENUM (
    'FIFO',
    'LIFO'
);


ALTER TYPE public.profit_calc_method OWNER TO postgres;

--
-- Name: subscription_tier; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_tier AS ENUM (
    'free',
    'premium'
);


ALTER TYPE public.subscription_tier OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

    REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

    GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: postgres
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO postgres;

--
-- Name: calculate_base_pnl(public.asset_type, numeric, numeric, numeric, numeric, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_base_pnl(p_asset_type public.asset_type, p_exit_price numeric, p_entry_price numeric, p_quantity numeric, p_multiplier numeric, p_is_short boolean DEFAULT false) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_multiplier numeric;
    v_pnl numeric;
BEGIN
    -- Set default multiplier based on asset type
    v_multiplier := CASE p_asset_type
        WHEN 'option' THEN COALESCE(p_multiplier, 100)
        WHEN 'forex' THEN COALESCE(p_multiplier, 10000)
        ELSE COALESCE(p_multiplier, 1)
    END;

    -- Calculate price difference based on position type
    v_pnl := CASE 
        WHEN p_is_short THEN (p_entry_price - p_exit_price)
        ELSE (p_exit_price - p_entry_price)
    END;

    -- Apply multiplier based on asset type
    RETURN CASE p_asset_type
        WHEN 'stock' THEN v_pnl * p_quantity
        WHEN 'crypto' THEN v_pnl * p_quantity
        ELSE v_pnl * p_quantity * v_multiplier
    END;
END;
$$;


ALTER FUNCTION public.calculate_base_pnl(p_asset_type public.asset_type, p_exit_price numeric, p_entry_price numeric, p_quantity numeric, p_multiplier numeric, p_is_short boolean) OWNER TO postgres;

--
-- Name: calculate_trade_pnl(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_trade_pnl() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_calc_method profit_calc_method;
    v_matching_trade RECORD;
BEGIN
    -- For sell trades, match with buy trades based on FIFO/LIFO
    IF NEW.side = 'sell' THEN
        -- Get calculation method from trading account
        SELECT profit_calculation_method INTO v_calc_method
        FROM trading_accounts
        WHERE id = NEW.trading_account_id;
        
        -- Find matching buy trade
        SELECT * FROM get_matching_trades(
            NEW.trading_account_id, 
            NEW.symbol,
            NEW.quantity,
            v_calc_method
        ) INTO v_matching_trade;
        
        IF v_matching_trade IS NOT NULL THEN
            -- Calculate PnL for matched trade
            NEW.pnl := calculate_base_pnl(
                NEW.asset_type,
                NEW.exit_price,
                v_matching_trade.entry_price,
                LEAST(NEW.quantity, v_matching_trade.quantity),
                NEW.multiplier,
                false
            ) - COALESCE(NEW.fees, 0);
            
            -- Update matching buy trade
            UPDATE trades
            SET exit_price = NEW.exit_price,
                exit_date = NEW.exit_date,
                updated_at = NOW()
            WHERE id = v_matching_trade.id;
        ELSE
            -- Calculate PnL for short position
            NEW.pnl := calculate_base_pnl(
                NEW.asset_type,
                NEW.exit_price,
                NEW.entry_price,
                NEW.quantity,
                NEW.multiplier,
                true
            ) - COALESCE(NEW.fees, 0);
        END IF;
    ELSE
        -- For buy trades
        IF NEW.exit_price IS NOT NULL THEN
            -- Calculate PnL for closed buy trade
            NEW.pnl := calculate_base_pnl(
                NEW.asset_type,
                NEW.exit_price,
                NEW.entry_price,
                NEW.quantity,
                NEW.multiplier,
                false
            ) - COALESCE(NEW.fees, 0);
        ELSE
            -- Open buy position
            NEW.pnl := NULL;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_trade_pnl() OWNER TO postgres;

--
-- Name: check_trading_account_limit(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_trading_account_limit() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    account_count INT;
    user_tier subscription_tier;
    max_accounts INT;
BEGIN
    -- Get user's subscription tier
    SELECT tier INTO user_tier
    FROM public.subscriptions
    WHERE user_id = NEW.user_id;

    -- Set max accounts based on tier
    IF user_tier = 'free' THEN
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
END;
$$;


ALTER FUNCTION public.check_trading_account_limit() OWNER TO postgres;

--
-- Name: get_matching_trades(uuid, character varying, numeric, public.profit_calc_method); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_matching_trades(p_account_id uuid, p_symbol character varying, p_quantity numeric, p_calc_method public.profit_calc_method) RETURNS TABLE(id uuid, quantity numeric, entry_price numeric, entry_date timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.quantity,
        t.entry_price,
        t.entry_date
    FROM trades t
    WHERE t.trading_account_id = p_account_id
        AND t.symbol = p_symbol
        AND t.side = 'buy'
        AND (t.exit_price IS NULL OR t.pnl IS NULL)  -- Only get open positions
    ORDER BY 
        CASE 
            WHEN p_calc_method = 'FIFO' THEN extract(epoch from t.entry_date)  -- Convert to unix timestamp for comparison
            ELSE -extract(epoch from t.entry_date)  -- Negative for LIFO to reverse order
        END
    LIMIT 1;
END;
$$;


ALTER FUNCTION public.get_matching_trades(p_account_id uuid, p_symbol character varying, p_quantity numeric, p_calc_method public.profit_calc_method) OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: handle_new_user_subscription(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user_subscription() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.subscriptions (user_id, tier)
    VALUES (NEW.id, 'free');
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user_subscription() OWNER TO postgres;

--
-- Name: process_new_import(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.process_new_import() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Only process if status is pending
  IF NEW.status = 'pending' THEN
    -- Update status to uploaded to indicate processing should begin
    UPDATE public.imports 
    SET status = 'uploaded',
        updated_at = now()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.process_new_import() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: secrets_encrypt_secret_secret(); Type: FUNCTION; Schema: vault; Owner: supabase_admin
--

CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;


ALTER FUNCTION vault.secrets_encrypt_secret_secret() OWNER TO supabase_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: broker_connection_fields; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.broker_connection_fields OWNER TO postgres;

--
-- Name: brokers; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.brokers OWNER TO postgres;

--
-- Name: available_brokers; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.available_brokers AS
 SELECT DISTINCT b.id,
    b.name,
    b.description,
    b.asset_types,
    b.created_at,
    b.updated_at
   FROM (public.brokers b
     JOIN public.broker_connection_fields bcf ON ((b.id = bcf.broker_id)));


ALTER TABLE public.available_brokers OWNER TO postgres;

--
-- Name: currency_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(3) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.currency_codes OWNER TO postgres;

--
-- Name: futures_multipliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.futures_multipliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    symbol character varying NOT NULL,
    multiplier numeric NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    name character varying
);


ALTER TABLE public.futures_multipliers OWNER TO postgres;

--
-- Name: imports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.imports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    trading_account_id uuid NOT NULL,
    import_type character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    error_message text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    original_filename text,
    file_path text,
    file_size integer,
    file_type text,
    CONSTRAINT imports_import_type_check CHECK (((import_type)::text = ANY ((ARRAY['csv'::character varying, 'excel'::character varying, 'coinbase_sync'::character varying, 'oanda_sync'::character varying, 'schwab_sync'::character varying])::text[]))),
    CONSTRAINT imports_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'uploaded'::character varying, 'processing'::character varying, 'completed'::character varying, 'failed'::character varying])::text[])))
);


ALTER TABLE public.imports OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text,
    full_name text,
    avatar_url text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: service_role_key; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_role_key (
    decrypted_secret text COLLATE pg_catalog."C"
);


ALTER TABLE public.service_role_key OWNER TO postgres;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tier public.subscription_tier DEFAULT 'free'::public.subscription_tier NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: trades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trades (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    trading_account_id uuid NOT NULL,
    import_id uuid,
    symbol character varying(50) NOT NULL,
    side character varying(10) NOT NULL,
    entry_price numeric NOT NULL,
    exit_price numeric,
    quantity numeric NOT NULL,
    entry_date timestamp with time zone NOT NULL,
    exit_date timestamp with time zone,
    pnl numeric,
    fees numeric DEFAULT 0,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    order_type character varying,
    status character varying,
    external_id character varying,
    closing_time timestamp with time zone,
    asset_type public.asset_type DEFAULT 'stock'::public.asset_type,
    multiplier numeric DEFAULT 1,
    leverage numeric DEFAULT '0'::numeric,
    CONSTRAINT trades_leverage_check CHECK ((leverage = ANY (ARRAY[(0)::numeric, (50)::numeric, (100)::numeric, (200)::numeric, (300)::numeric, (400)::numeric, (500)::numeric]))),
    CONSTRAINT trades_side_check CHECK (((side)::text = ANY ((ARRAY['buy'::character varying, 'sell'::character varying])::text[])))
);


ALTER TABLE public.trades OWNER TO postgres;

--
-- Name: trading_accounts; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.trading_accounts OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: decrypted_secrets; Type: VIEW; Schema: vault; Owner: supabase_admin
--

CREATE VIEW vault.decrypted_secrets AS
 SELECT secrets.id,
    secrets.name,
    secrets.description,
    secrets.secret,
        CASE
            WHEN (secrets.secret IS NULL) THEN NULL::text
            ELSE
            CASE
                WHEN (secrets.key_id IS NULL) THEN NULL::text
                ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce), 'utf8'::name)
            END
        END AS decrypted_secret,
    secrets.key_id,
    secrets.nonce,
    secrets.created_at,
    secrets.updated_at
   FROM vault.secrets;


ALTER TABLE vault.decrypted_secrets OWNER TO supabase_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	e74a7a4e-b741-4de5-9b98-61de2c396bf2	{"action":"user_signedup","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-02-11 04:38:29.349013+00	
00000000-0000-0000-0000-000000000000	689fab44-ab9a-4a41-bf54-b3a2c14f6235	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 04:38:29.35407+00	
00000000-0000-0000-0000-000000000000	e2774073-31de-4231-b6f6-55908340cb2c	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 04:38:29.847698+00	
00000000-0000-0000-0000-000000000000	2ba39b50-20f9-4dff-ad37-a1e2ac33f7e2	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 05:24:50.500009+00	
00000000-0000-0000-0000-000000000000	00023959-051a-4717-953d-144ca0c538cd	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 06:51:16.068221+00	
00000000-0000-0000-0000-000000000000	a48e2223-ea3b-49f7-b35d-f47e8705b4e8	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 07:48:00.556151+00	
00000000-0000-0000-0000-000000000000	aaf47ecf-5fe9-49eb-9ef3-5c32f92893ce	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 07:49:56.771826+00	
00000000-0000-0000-0000-000000000000	bae29fce-01c3-4d73-8502-e1a2c3a662d6	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 08:33:39.921866+00	
00000000-0000-0000-0000-000000000000	a7083afd-3301-47b2-b51a-b727f8cfe80a	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 09:19:41.564586+00	
00000000-0000-0000-0000-000000000000	c75cd501-388e-4901-af8c-27e76c38ff1a	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-11 10:18:06.97401+00	
00000000-0000-0000-0000-000000000000	28aec1f3-a328-4787-9cc6-ff6b3ed85b04	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-11 10:18:06.974828+00	
00000000-0000-0000-0000-000000000000	63376579-576b-4b1a-aa1d-4d07be47d3ea	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 10:24:35.676775+00	
00000000-0000-0000-0000-000000000000	b4fb146c-e504-4d5e-8341-c17c85035298	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 10:32:24.487024+00	
00000000-0000-0000-0000-000000000000	718b55af-06a4-45f7-a064-04663d149a81	{"action":"user_signedup","actor_id":"a7f9ac06-708d-4666-afe9-e2e4a30d4d9e","actor_name":"Nathaniel James","actor_username":"nathanieltjames24@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"google"}}	2025-02-11 11:03:32.060598+00	
00000000-0000-0000-0000-000000000000	3f8238dd-5fe6-471c-9ce7-e992ffcaa7d8	{"action":"login","actor_id":"a7f9ac06-708d-4666-afe9-e2e4a30d4d9e","actor_name":"Nathaniel James","actor_username":"nathanieltjames24@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-02-11 11:03:32.661435+00	
00000000-0000-0000-0000-000000000000	04db0531-49b8-4dac-9128-c85b047031ae	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 11:04:35.308019+00	
00000000-0000-0000-0000-000000000000	600b2099-67c5-4533-9309-077efb7826f9	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 11:06:55.977567+00	
00000000-0000-0000-0000-000000000000	ccc11744-69ed-45f5-8e87-1fd5365907d0	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 11:28:20.077274+00	
00000000-0000-0000-0000-000000000000	19dc48eb-a472-4160-afc5-4ce852981b45	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-11 11:32:59.422658+00	
00000000-0000-0000-0000-000000000000	2c2848f1-e628-461f-9f45-1e54de293566	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-11 11:32:59.425064+00	
00000000-0000-0000-0000-000000000000	855fd2e5-9b5f-49a9-bc88-36100efc959b	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-11 12:25:54.784888+00	
00000000-0000-0000-0000-000000000000	6c3e66cb-42d0-49dd-b648-75303d4152fa	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-11 12:31:01.476709+00	
00000000-0000-0000-0000-000000000000	8dcdf83e-e044-46e4-abfa-298c6c8a9afa	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-11 12:31:01.477593+00	
00000000-0000-0000-0000-000000000000	d91958c7-8450-4ef4-ba58-8899c2270cf5	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-11 13:12:54.83509+00	
00000000-0000-0000-0000-000000000000	91269fca-d23f-4cc4-8dc6-77cd0bc4e88f	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-11 13:12:54.838194+00	
00000000-0000-0000-0000-000000000000	14a10b08-2a3b-4c1f-aa22-377cbce09402	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 00:27:17.191646+00	
00000000-0000-0000-0000-000000000000	619ee469-8670-46f8-be22-ac5c00774c32	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 00:27:17.204338+00	
00000000-0000-0000-0000-000000000000	d7f6a16e-8e49-406e-9aa3-c2739a7a7063	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 01:36:51.821367+00	
00000000-0000-0000-0000-000000000000	8be2c44a-ad02-4e52-ad09-a74facf209f9	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 01:36:51.823594+00	
00000000-0000-0000-0000-000000000000	88aae173-392e-44bb-b4c4-65a040d90850	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 02:37:08.964931+00	
00000000-0000-0000-0000-000000000000	08dd9984-5ff3-4c75-95d6-9ea8ec6e92b9	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 02:37:08.970577+00	
00000000-0000-0000-0000-000000000000	d2922be6-a3d1-47a1-8a6a-5ec474461061	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-12 03:17:18.987859+00	
00000000-0000-0000-0000-000000000000	19d0c9f0-2e21-4848-9c67-7699fd36c360	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-12 04:31:41.152867+00	
00000000-0000-0000-0000-000000000000	9aa65469-cdaa-4772-b020-cbb1202e69d4	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 05:19:05.047477+00	
00000000-0000-0000-0000-000000000000	e141fcf9-2b50-4c75-afcd-176bb9f11721	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 05:19:05.049197+00	
00000000-0000-0000-0000-000000000000	2834078d-66f6-4c58-9b43-b8f07ea8aa9f	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-12 05:50:27.772402+00	
00000000-0000-0000-0000-000000000000	8795e62e-d7b5-4800-9c40-fe4a79eadde1	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-12 06:16:03.214877+00	
00000000-0000-0000-0000-000000000000	7fe6fe24-206a-413e-9e80-f6e881c2a8b0	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 06:20:19.053549+00	
00000000-0000-0000-0000-000000000000	c359e939-2c7a-419d-824d-c73219ff69b3	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 06:20:19.055168+00	
00000000-0000-0000-0000-000000000000	2b0b964b-bb65-4828-8527-9fd4e10f56dc	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 06:58:01.412793+00	
00000000-0000-0000-0000-000000000000	8a95fc29-582d-4953-945a-53c4df93e611	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 06:58:01.414953+00	
00000000-0000-0000-0000-000000000000	4ae3d645-cfc4-411e-b7a9-17e1c3fcc9b9	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 07:19:16.768691+00	
00000000-0000-0000-0000-000000000000	ef30432e-ef94-46e1-b4db-b966167d4bc4	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 07:19:16.769595+00	
00000000-0000-0000-0000-000000000000	81878653-4bde-4c43-a31f-7f51a962ec86	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 08:22:03.908983+00	
00000000-0000-0000-0000-000000000000	25c585ce-a934-4f2a-b283-fdd6eb7f1775	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 08:22:03.917709+00	
00000000-0000-0000-0000-000000000000	79c807cf-6726-4eda-9068-c262f06a240d	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 08:43:00.289724+00	
00000000-0000-0000-0000-000000000000	cc6c0e4c-c69b-4ff0-b8fb-ebb4f1b05c47	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 08:43:00.291864+00	
00000000-0000-0000-0000-000000000000	61e205df-1f3a-4d6c-8b65-30ab29c67dda	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 09:22:47.934511+00	
00000000-0000-0000-0000-000000000000	e4b8a25c-775f-424b-890c-52c13ab4963e	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 09:22:47.936721+00	
00000000-0000-0000-0000-000000000000	892e92ed-a176-4dba-a6fe-bd1109da9abb	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 10:23:11.569325+00	
00000000-0000-0000-0000-000000000000	b410c32b-31e9-4f50-aba5-1dc4677cb9a7	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 10:23:11.570955+00	
00000000-0000-0000-0000-000000000000	c2c3fe07-0c68-4b2f-80ea-d54fde1f45ef	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-12 11:51:31.562093+00	
00000000-0000-0000-0000-000000000000	441d17bd-e6d4-49c7-9e60-9db9d1c8aa75	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 12:18:11.387437+00	
00000000-0000-0000-0000-000000000000	4ce23610-a775-4d1a-817c-7dbeee265725	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 12:18:11.390181+00	
00000000-0000-0000-0000-000000000000	6edf77ab-9d1b-46b3-9912-fc46d5438bca	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-12 12:47:01.356569+00	
00000000-0000-0000-0000-000000000000	81252c5c-89d8-47ba-89b1-4b791df3cd7f	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 12:49:32.865173+00	
00000000-0000-0000-0000-000000000000	7b62ef10-3ff7-4239-a326-dc76b73fb797	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 12:49:32.867316+00	
00000000-0000-0000-0000-000000000000	48a9630e-4e1c-469c-8053-01ea3f628da0	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 13:16:47.549492+00	
00000000-0000-0000-0000-000000000000	0bc43ef4-f01b-44b2-8b33-9e60fbe83267	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 13:16:47.551115+00	
00000000-0000-0000-0000-000000000000	4b3e11c0-e1c6-45f6-8a3c-c4f55577a798	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 14:30:59.288442+00	
00000000-0000-0000-0000-000000000000	f343d681-beea-4968-b16c-a4f90ac496ed	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 14:30:59.290968+00	
00000000-0000-0000-0000-000000000000	e7b4b54d-e10d-4963-bb1c-a82328f4f3d6	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 21:11:49.670616+00	
00000000-0000-0000-0000-000000000000	e5dd793e-1387-41b2-a438-3e5ab69b2282	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 21:11:49.674133+00	
00000000-0000-0000-0000-000000000000	28abfd08-cfec-415d-8af0-161cfafaf934	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 22:12:18.107468+00	
00000000-0000-0000-0000-000000000000	f9456b45-5d17-4b84-b28f-bd852a438087	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-12 22:12:18.110003+00	
00000000-0000-0000-0000-000000000000	e631cc28-a844-4477-b913-343c5524aebd	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 00:14:27.152535+00	
00000000-0000-0000-0000-000000000000	095256f7-d64c-481a-9d82-da2666e83a35	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 00:14:27.153998+00	
00000000-0000-0000-0000-000000000000	112503b5-011c-4c0d-86d2-adc5f8b88720	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 02:09:00.002252+00	
00000000-0000-0000-0000-000000000000	ab150f30-e9db-44fa-9422-f4278a6394fd	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 02:09:00.0037+00	
00000000-0000-0000-0000-000000000000	3727d266-1fdd-4aab-b037-2ee9bf372c6c	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 02:52:17.795129+00	
00000000-0000-0000-0000-000000000000	7f39b9f8-8a0e-4735-acd9-d7ba6eadc620	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 02:52:17.796802+00	
00000000-0000-0000-0000-000000000000	b2185e72-21fb-4dd2-b3e9-a929b505dbb7	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 08:58:16.387514+00	
00000000-0000-0000-0000-000000000000	1c150dcf-a16a-4052-8707-5e8047804601	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 08:58:16.405404+00	
00000000-0000-0000-0000-000000000000	bb6d5545-1fcc-45e6-919b-6394d2540f28	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 10:06:07.478777+00	
00000000-0000-0000-0000-000000000000	95696968-8cd6-485b-8cde-ed10a77ab1b4	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 10:06:07.482896+00	
00000000-0000-0000-0000-000000000000	761b5c30-9dd8-4a48-bcc5-fdcb3dedf12f	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 11:17:37.625694+00	
00000000-0000-0000-0000-000000000000	fe876a64-45e3-4af0-96e9-765a24fb9d0d	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-13 11:17:37.628053+00	
00000000-0000-0000-0000-000000000000	aee4fb62-a4b2-40de-afed-d2a99ea917ef	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-14 02:54:38.886229+00	
00000000-0000-0000-0000-000000000000	a0b7908a-d672-49d0-90db-fe7507cf339e	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-14 02:54:38.906459+00	
00000000-0000-0000-0000-000000000000	3c9a674f-82ba-4cb7-bf14-6a40b950dd93	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-14 03:13:19.530206+00	
00000000-0000-0000-0000-000000000000	5d7f70c5-1117-43e8-b6c7-3af750f2b14a	{"action":"login","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-14 03:22:32.347963+00	
00000000-0000-0000-0000-000000000000	96a016fa-8ed4-41f8-8d0e-9181fec22263	{"action":"token_refreshed","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-14 04:26:11.100797+00	
00000000-0000-0000-0000-000000000000	8cfc572d-7187-4663-a59b-a4181c09544b	{"action":"token_revoked","actor_id":"0924cb6b-e3c8-489e-b7e2-8953a759ad91","actor_username":"nathanieltjames24@icloud.com","actor_via_sso":false,"log_type":"token"}	2025-02-14 04:26:11.102782+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
0924cb6b-e3c8-489e-b7e2-8953a759ad91	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{"sub": "0924cb6b-e3c8-489e-b7e2-8953a759ad91", "email": "nathanieltjames24@icloud.com", "email_verified": false, "phone_verified": false}	email	2025-02-11 04:38:29.34527+00	2025-02-11 04:38:29.345321+00	2025-02-11 04:38:29.345321+00	28c9ec6d-ed6a-4ead-ad2a-4133e4c1d331
116080490821741383900	a7f9ac06-708d-4666-afe9-e2e4a30d4d9e	{"iss": "https://accounts.google.com", "sub": "116080490821741383900", "name": "Nathaniel James", "email": "nathanieltjames24@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocL3v0xt27fMBwdrnkM2B1vzlMMY_o_3TKP_2qipD5AU8YlckA=s96-c", "full_name": "Nathaniel James", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocL3v0xt27fMBwdrnkM2B1vzlMMY_o_3TKP_2qipD5AU8YlckA=s96-c", "provider_id": "116080490821741383900", "email_verified": true, "phone_verified": false}	google	2025-02-11 11:03:32.056491+00	2025-02-11 11:03:32.056538+00	2025-02-11 11:03:32.659699+00	a0bdf619-3567-48a9-90f1-f72ee16a97be
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
79ce97ad-4fd6-406d-b5e6-a0104827e0df	2025-02-11 04:38:29.364312+00	2025-02-11 04:38:29.364312+00	password	ca518d15-f481-4c5e-9cac-1b975c4f17db
0d01ebfa-787d-40b1-9e7a-bf1cfa7388ce	2025-02-11 04:38:29.850389+00	2025-02-11 04:38:29.850389+00	password	251f1a40-dfd7-4081-ab00-b17f6a868515
aa208466-9731-48ce-80cc-a15f7d61d497	2025-02-11 05:24:50.510644+00	2025-02-11 05:24:50.510644+00	password	76e90818-c1d9-4779-ad97-805b723d7d8c
d260d736-18d8-4a80-9bd7-27b60d87a800	2025-02-11 06:51:16.080293+00	2025-02-11 06:51:16.080293+00	password	4cc009c8-f246-4e83-8842-8b55b2ce601d
78c3ca23-adc8-4f06-8ec6-bedc3b62344c	2025-02-11 07:48:00.563783+00	2025-02-11 07:48:00.563783+00	password	0c12f88a-4782-4fd1-ae32-c46df7d15f49
bbbaa1dd-ab49-4704-91a2-36c74e57904c	2025-02-11 07:49:56.775834+00	2025-02-11 07:49:56.775834+00	password	1c691758-0b80-4316-9b04-7e57403ab794
3df494a2-1430-4f58-8f89-f509ef7cf09b	2025-02-11 08:33:39.92655+00	2025-02-11 08:33:39.92655+00	password	1828525d-8ed6-4ad1-a03d-edf9622c7ffe
b67c4d74-466f-4eca-980c-c2e551e192f5	2025-02-11 09:19:41.569452+00	2025-02-11 09:19:41.569452+00	password	6ce5af69-bfe3-4b20-a3aa-f2a59de82330
e6db510f-47b9-4a0b-9e27-339fe98d8508	2025-02-11 10:24:35.682916+00	2025-02-11 10:24:35.682916+00	password	1c69cdee-e0da-4a00-b8f0-67e6d03b31b8
b4c5fee6-679c-4013-bdf6-114fc1fd1bce	2025-02-11 10:32:24.493276+00	2025-02-11 10:32:24.493276+00	password	89fb8468-8f78-450d-8f2f-839833ccda81
531926b9-5a59-4753-98ce-93d093d2e348	2025-02-11 11:03:32.069675+00	2025-02-11 11:03:32.069675+00	oauth	96bc4997-426f-4175-a0cb-029d2c154db3
0aa39a56-1f61-4ec8-9c2b-911e41c6f7c3	2025-02-11 11:03:32.663794+00	2025-02-11 11:03:32.663794+00	oauth	dfd0d8aa-3cae-4d9e-9c40-da7046f4a71b
28510cb9-a0a1-486c-b31a-27f3baef3b48	2025-02-11 11:04:35.312617+00	2025-02-11 11:04:35.312617+00	password	c54385da-f2dc-4afc-9ed4-2dc74308499e
40ee9d46-7c13-45ed-808c-eb1ff756f810	2025-02-11 11:06:55.981482+00	2025-02-11 11:06:55.981482+00	password	c079f841-b8e7-40e5-876e-1a5424f5ab47
725860d0-6155-47bc-a94e-b6b3ac884a2a	2025-02-11 11:28:20.081596+00	2025-02-11 11:28:20.081596+00	password	dc16f297-e4d2-4376-85da-fe40d2825173
3a4a1034-ef97-4c04-bc13-5e19d696392e	2025-02-11 12:25:54.795038+00	2025-02-11 12:25:54.795038+00	password	21b5f7a5-c624-4be8-8473-5dcb8200ca75
8dd09073-d183-4a4a-9bda-55c3c3fcf40a	2025-02-12 03:17:18.999088+00	2025-02-12 03:17:18.999088+00	password	6f37b1cd-97f3-447a-a912-21527beafded
5e4431fd-b4ac-4040-81a6-bac7ae2198bb	2025-02-12 04:31:41.164454+00	2025-02-12 04:31:41.164454+00	password	235dac28-13b2-43cb-9ec8-7faca5f3e5e7
06e0f76c-4b21-44ce-9700-e148b5193ffb	2025-02-12 05:50:27.779067+00	2025-02-12 05:50:27.779067+00	password	2baa8cc8-1c32-4a93-8445-28e84bc1d139
ec504949-2144-4742-aaa4-d815c8e325a6	2025-02-12 06:16:03.240269+00	2025-02-12 06:16:03.240269+00	password	56fec76e-e8bb-40c5-b851-78024341ee8c
9bd7d342-4639-47cb-8084-626806e50673	2025-02-12 11:51:31.572811+00	2025-02-12 11:51:31.572811+00	password	0c455a93-6d51-461b-9172-39355a5021e8
963ac747-03ed-4da8-8ae6-1eb38f264c73	2025-02-12 12:47:01.366581+00	2025-02-12 12:47:01.366581+00	password	06b22b93-c850-456b-9996-b3543cb9961e
b4429ece-19ca-476a-96b1-14cfe3e90681	2025-02-14 03:13:19.544385+00	2025-02-14 03:13:19.544385+00	password	7af198d5-5894-4f63-8a37-bd64c0ac9be3
ff07e9d3-a309-46eb-b901-e3a69a80260b	2025-02-14 03:22:32.35684+00	2025-02-14 03:22:32.35684+00	password	9d8eda38-aad2-4200-9048-6e56a9512d55
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	1	qj5enWpYne-wvbqobJCr6g	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-11 04:38:29.358746+00	2025-02-11 04:38:29.358746+00	\N	79ce97ad-4fd6-406d-b5e6-a0104827e0df
00000000-0000-0000-0000-000000000000	2	wWbOR-17qzrbLeiXrmycIw	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-11 04:38:29.849201+00	2025-02-11 04:38:29.849201+00	\N	0d01ebfa-787d-40b1-9e7a-bf1cfa7388ce
00000000-0000-0000-0000-000000000000	3	wQ2lpEFHQo-kzNCV8tq_kQ	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-11 05:24:50.507176+00	2025-02-11 05:24:50.507176+00	\N	aa208466-9731-48ce-80cc-a15f7d61d497
00000000-0000-0000-0000-000000000000	4	DbbQS68IDL092W-Axdqwig	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-11 06:51:16.078445+00	2025-02-11 06:51:16.078445+00	\N	d260d736-18d8-4a80-9bd7-27b60d87a800
00000000-0000-0000-0000-000000000000	6	aghCO2i2YVS0WgEScSqY3w	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-11 07:49:56.773971+00	2025-02-11 07:49:56.773971+00	\N	bbbaa1dd-ab49-4704-91a2-36c74e57904c
00000000-0000-0000-0000-000000000000	7	b7o12uJHWLIW-tg3_kzB8w	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-11 08:33:39.923966+00	2025-02-11 08:33:39.923966+00	\N	3df494a2-1430-4f58-8f89-f509ef7cf09b
00000000-0000-0000-0000-000000000000	8	vW4xX4t4lxp0P8K1G6S5yQ	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-11 09:19:41.566743+00	2025-02-11 10:18:06.975303+00	\N	b67c4d74-466f-4eca-980c-c2e551e192f5
00000000-0000-0000-0000-000000000000	9	NODqM-ghHqcD9ZUTiz0Idg	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-11 10:18:06.978922+00	2025-02-11 10:18:06.978922+00	vW4xX4t4lxp0P8K1G6S5yQ	b67c4d74-466f-4eca-980c-c2e551e192f5
00000000-0000-0000-0000-000000000000	10	8HmMefTb-xlPHbYsnzmIeg	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-11 10:24:35.680396+00	2025-02-11 10:24:35.680396+00	\N	e6db510f-47b9-4a0b-9e27-339fe98d8508
00000000-0000-0000-0000-000000000000	12	vSY1coZiUxL81_kn4V17ig	a7f9ac06-708d-4666-afe9-e2e4a30d4d9e	f	2025-02-11 11:03:32.066479+00	2025-02-11 11:03:32.066479+00	\N	531926b9-5a59-4753-98ce-93d093d2e348
00000000-0000-0000-0000-000000000000	13	cxILUGyzt1mnI_5e9k9_WA	a7f9ac06-708d-4666-afe9-e2e4a30d4d9e	f	2025-02-11 11:03:32.662583+00	2025-02-11 11:03:32.662583+00	\N	0aa39a56-1f61-4ec8-9c2b-911e41c6f7c3
00000000-0000-0000-0000-000000000000	15	7iHzmpWIZYmn1MDcyc142g	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-11 11:06:55.979694+00	2025-02-11 11:06:55.979694+00	\N	40ee9d46-7c13-45ed-808c-eb1ff756f810
00000000-0000-0000-0000-000000000000	16	pjQaTVECwwjNjWnPhfG_CA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-11 11:28:20.079445+00	2025-02-11 11:28:20.079445+00	\N	725860d0-6155-47bc-a94e-b6b3ac884a2a
00000000-0000-0000-0000-000000000000	11	fW5M3sPYt19JSYV8rzDfsA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-11 10:32:24.489872+00	2025-02-11 11:32:59.425536+00	\N	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	18	Z6h5YKqAJMTr4KFV5RpRPQ	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-11 12:25:54.789048+00	2025-02-11 12:25:54.789048+00	\N	3a4a1034-ef97-4c04-bc13-5e19d696392e
00000000-0000-0000-0000-000000000000	17	92dub3n3Dmi2OMuol6M3wA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-11 11:32:59.426097+00	2025-02-11 12:31:01.478118+00	fW5M3sPYt19JSYV8rzDfsA	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	5	5Xx5HHexrVgPvnpDsq3Wyw	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-11 07:48:00.56191+00	2025-02-11 13:12:54.838688+00	\N	78c3ca23-adc8-4f06-8ec6-bedc3b62344c
00000000-0000-0000-0000-000000000000	19	b9HdhUmwtZQ_m_Mip48DxQ	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-11 12:31:01.479288+00	2025-02-12 00:27:17.204838+00	92dub3n3Dmi2OMuol6M3wA	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	21	EgET4_YLZRVNPFSbfhjPXA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 00:27:17.211271+00	2025-02-12 01:36:51.824102+00	b9HdhUmwtZQ_m_Mip48DxQ	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	22	AbnoPwVnkC4R5q1Sejj1fw	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 01:36:51.826138+00	2025-02-12 02:37:08.971916+00	EgET4_YLZRVNPFSbfhjPXA	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	24	4UxvULpkHhxHWtiipzbixg	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-12 03:17:18.994786+00	2025-02-12 03:17:18.994786+00	\N	8dd09073-d183-4a4a-9bda-55c3c3fcf40a
00000000-0000-0000-0000-000000000000	25	Za313UeuRrtYzB5s7frEQw	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-12 04:31:41.160238+00	2025-02-12 04:31:41.160238+00	\N	5e4431fd-b4ac-4040-81a6-bac7ae2198bb
00000000-0000-0000-0000-000000000000	23	ZNHOuy2goXlsINr4UuOj5Q	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 02:37:08.974079+00	2025-02-12 05:19:05.049689+00	AbnoPwVnkC4R5q1Sejj1fw	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	27	PsDB5_WgVzxpXINI-dRzxQ	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-12 05:50:27.776064+00	2025-02-12 05:50:27.776064+00	\N	06e0f76c-4b21-44ce-9700-e148b5193ffb
00000000-0000-0000-0000-000000000000	28	xs2adERnMPSe--Q3YmaNJw	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-12 06:16:03.235407+00	2025-02-12 06:16:03.235407+00	\N	ec504949-2144-4742-aaa4-d815c8e325a6
00000000-0000-0000-0000-000000000000	26	MtAEvEGyZ1cdeoYjrgyDGg	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 05:19:05.050917+00	2025-02-12 06:20:19.05566+00	ZNHOuy2goXlsINr4UuOj5Q	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	20	uOO9MhlM9fExH9PkUhMgAA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-11 13:12:54.839255+00	2025-02-12 06:58:01.41546+00	5Xx5HHexrVgPvnpDsq3Wyw	78c3ca23-adc8-4f06-8ec6-bedc3b62344c
00000000-0000-0000-0000-000000000000	29	kq5Y0I_wf6C683IYTJfpzQ	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 06:20:19.057664+00	2025-02-12 07:19:16.770081+00	MtAEvEGyZ1cdeoYjrgyDGg	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	31	KNvvcAC8ajAOSsi7pZF8_A	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 07:19:16.772044+00	2025-02-12 08:22:03.918273+00	kq5Y0I_wf6C683IYTJfpzQ	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	30	uTVH57iuhkIZxW_eaYTvIQ	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 06:58:01.4174+00	2025-02-12 08:43:00.292329+00	uOO9MhlM9fExH9PkUhMgAA	78c3ca23-adc8-4f06-8ec6-bedc3b62344c
00000000-0000-0000-0000-000000000000	32	j___I3UgRJ2T_MFojbs8yA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 08:22:03.925228+00	2025-02-12 09:22:47.93721+00	KNvvcAC8ajAOSsi7pZF8_A	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	34	U3ZcvwjQkPzWea-6kzSwfA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 09:22:47.94224+00	2025-02-12 10:23:11.571447+00	j___I3UgRJ2T_MFojbs8yA	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	36	NZ9ZaoabPUNej0bqSnFIKg	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-12 11:51:31.568594+00	2025-02-12 11:51:31.568594+00	\N	9bd7d342-4639-47cb-8084-626806e50673
00000000-0000-0000-0000-000000000000	35	97WPK2lcDgimUVquWWOrXg	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 10:23:11.572044+00	2025-02-12 12:18:11.390715+00	U3ZcvwjQkPzWea-6kzSwfA	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	38	Cat3DBcytyXZK9Y-QQpKGA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-12 12:47:01.360881+00	2025-02-12 12:47:01.360881+00	\N	963ac747-03ed-4da8-8ae6-1eb38f264c73
00000000-0000-0000-0000-000000000000	14	kx7BoB6ISxsBzYYrOLK1TQ	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-11 11:04:35.310693+00	2025-02-12 12:49:32.867812+00	\N	28510cb9-a0a1-486c-b31a-27f3baef3b48
00000000-0000-0000-0000-000000000000	39	wc2BeUhM6komYpwHwNRf7Q	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-12 12:49:32.871602+00	2025-02-12 12:49:32.871602+00	kx7BoB6ISxsBzYYrOLK1TQ	28510cb9-a0a1-486c-b31a-27f3baef3b48
00000000-0000-0000-0000-000000000000	37	9Zf3fQlBtxEWXEUJwm_eAw	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 12:18:11.392397+00	2025-02-12 13:16:47.551629+00	97WPK2lcDgimUVquWWOrXg	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	40	n3qvfXPh24tygt1TQANCvg	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 13:16:47.552903+00	2025-02-12 14:30:59.291467+00	9Zf3fQlBtxEWXEUJwm_eAw	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	41	3BinS_4zfnQBi9ss5IqrRw	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 14:30:59.294414+00	2025-02-12 21:11:49.674634+00	n3qvfXPh24tygt1TQANCvg	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	42	RJwbe-RBZpOZcPNNDznJ3A	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 21:11:49.677964+00	2025-02-12 22:12:18.110534+00	3BinS_4zfnQBi9ss5IqrRw	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	43	8NbUYlUFR6qJvFOFVhlP2g	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 22:12:18.1147+00	2025-02-13 00:14:27.154481+00	RJwbe-RBZpOZcPNNDznJ3A	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	44	Z-KKUh50bVXeafu3xC_-bg	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-13 00:14:27.157237+00	2025-02-13 02:09:00.00419+00	8NbUYlUFR6qJvFOFVhlP2g	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	33	dNYeyTJQqrMVRNYHQ7vabA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-12 08:43:00.294819+00	2025-02-13 02:52:17.797283+00	uTVH57iuhkIZxW_eaYTvIQ	78c3ca23-adc8-4f06-8ec6-bedc3b62344c
00000000-0000-0000-0000-000000000000	46	1gv4457ifc0kbxDdGApdWA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-13 02:52:17.800921+00	2025-02-13 02:52:17.800921+00	dNYeyTJQqrMVRNYHQ7vabA	78c3ca23-adc8-4f06-8ec6-bedc3b62344c
00000000-0000-0000-0000-000000000000	45	TfRvb8_gbEtS8H77kx6PPQ	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-13 02:09:00.007154+00	2025-02-13 08:58:16.406009+00	Z-KKUh50bVXeafu3xC_-bg	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	47	Hgt3yldnLsx4GGcXjqbp7A	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-13 08:58:16.411172+00	2025-02-13 10:06:07.483421+00	TfRvb8_gbEtS8H77kx6PPQ	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	48	Pv16HyTeFRbwcNSDTVVgqA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-13 10:06:07.485371+00	2025-02-13 11:17:37.629355+00	Hgt3yldnLsx4GGcXjqbp7A	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	49	S8GWgovul1vGHQBckwgrPw	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-13 11:17:37.631352+00	2025-02-14 02:54:38.908151+00	Pv16HyTeFRbwcNSDTVVgqA	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	50	6vtrgTZkkEjbV4SI6VNFTA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-14 02:54:38.920272+00	2025-02-14 02:54:38.920272+00	S8GWgovul1vGHQBckwgrPw	b4c5fee6-679c-4013-bdf6-114fc1fd1bce
00000000-0000-0000-0000-000000000000	51	mem2PjcKBowkHblWbla5VA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-14 03:13:19.539343+00	2025-02-14 03:13:19.539343+00	\N	b4429ece-19ca-476a-96b1-14cfe3e90681
00000000-0000-0000-0000-000000000000	52	yw8hWhlD7Nki2h7BwnMSUw	0924cb6b-e3c8-489e-b7e2-8953a759ad91	t	2025-02-14 03:22:32.351619+00	2025-02-14 04:26:11.103315+00	\N	ff07e9d3-a309-46eb-b901-e3a69a80260b
00000000-0000-0000-0000-000000000000	53	5nd9VG_z7KmfNmoYD-UoNA	0924cb6b-e3c8-489e-b7e2-8953a759ad91	f	2025-02-14 04:26:11.106472+00	2025-02-14 04:26:11.106472+00	yw8hWhlD7Nki2h7BwnMSUw	ff07e9d3-a309-46eb-b901-e3a69a80260b
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
79ce97ad-4fd6-406d-b5e6-a0104827e0df	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 04:38:29.355277+00	2025-02-11 04:38:29.355277+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
0d01ebfa-787d-40b1-9e7a-bf1cfa7388ce	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 04:38:29.848439+00	2025-02-11 04:38:29.848439+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
aa208466-9731-48ce-80cc-a15f7d61d497	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 05:24:50.505364+00	2025-02-11 05:24:50.505364+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
d260d736-18d8-4a80-9bd7-27b60d87a800	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 06:51:16.07736+00	2025-02-11 06:51:16.07736+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
bbbaa1dd-ab49-4704-91a2-36c74e57904c	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 07:49:56.772822+00	2025-02-11 07:49:56.772822+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
3df494a2-1430-4f58-8f89-f509ef7cf09b	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 08:33:39.922897+00	2025-02-11 08:33:39.922897+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
b67c4d74-466f-4eca-980c-c2e551e192f5	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 09:19:41.565625+00	2025-02-11 10:18:06.981163+00	\N	aal1	\N	2025-02-11 10:18:06.981094	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
e6db510f-47b9-4a0b-9e27-339fe98d8508	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 10:24:35.67862+00	2025-02-11 10:24:35.67862+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
531926b9-5a59-4753-98ce-93d093d2e348	a7f9ac06-708d-4666-afe9-e2e4a30d4d9e	2025-02-11 11:03:32.064843+00	2025-02-11 11:03:32.064843+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36	73.251.19.135	\N
0aa39a56-1f61-4ec8-9c2b-911e41c6f7c3	a7f9ac06-708d-4666-afe9-e2e4a30d4d9e	2025-02-11 11:03:32.661961+00	2025-02-11 11:03:32.661961+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36	73.251.19.135	\N
40ee9d46-7c13-45ed-808c-eb1ff756f810	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 11:06:55.978587+00	2025-02-11 11:06:55.978587+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36	73.251.19.135	\N
725860d0-6155-47bc-a94e-b6b3ac884a2a	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 11:28:20.078318+00	2025-02-11 11:28:20.078318+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
3a4a1034-ef97-4c04-bc13-5e19d696392e	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 12:25:54.786574+00	2025-02-11 12:25:54.786574+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
9bd7d342-4639-47cb-8084-626806e50673	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-12 11:51:31.565264+00	2025-02-12 11:51:31.565264+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
963ac747-03ed-4da8-8ae6-1eb38f264c73	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-12 12:47:01.358715+00	2025-02-12 12:47:01.358715+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
28510cb9-a0a1-486c-b31a-27f3baef3b48	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 11:04:35.308999+00	2025-02-12 12:49:32.874956+00	\N	aal1	\N	2025-02-12 12:49:32.874296	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36	73.251.19.135	\N
8dd09073-d183-4a4a-9bda-55c3c3fcf40a	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-12 03:17:18.989588+00	2025-02-12 03:17:18.989588+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
5e4431fd-b4ac-4040-81a6-bac7ae2198bb	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-12 04:31:41.155902+00	2025-02-12 04:31:41.155902+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
b4c5fee6-679c-4013-bdf6-114fc1fd1bce	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 10:32:24.488945+00	2025-02-14 02:54:38.947454+00	\N	aal1	\N	2025-02-14 02:54:38.946094	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
06e0f76c-4b21-44ce-9700-e148b5193ffb	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-12 05:50:27.773492+00	2025-02-12 05:50:27.773492+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
ec504949-2144-4742-aaa4-d815c8e325a6	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-12 06:16:03.229925+00	2025-02-12 06:16:03.229925+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
b4429ece-19ca-476a-96b1-14cfe3e90681	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-14 03:13:19.534843+00	2025-02-14 03:13:19.534843+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
ff07e9d3-a309-46eb-b901-e3a69a80260b	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-14 03:22:32.349847+00	2025-02-14 04:26:11.109796+00	\N	aal1	\N	2025-02-14 04:26:11.109727	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
78c3ca23-adc8-4f06-8ec6-bedc3b62344c	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 07:48:00.557165+00	2025-02-13 02:52:17.803731+00	\N	aal1	\N	2025-02-13 02:52:17.803662	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15	73.251.19.135	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	a7f9ac06-708d-4666-afe9-e2e4a30d4d9e	authenticated	authenticated	nathanieltjames24@gmail.com	\N	2025-02-11 11:03:32.061774+00	\N		\N		\N			\N	2025-02-11 11:03:32.661898+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "116080490821741383900", "name": "Nathaniel James", "email": "nathanieltjames24@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocL3v0xt27fMBwdrnkM2B1vzlMMY_o_3TKP_2qipD5AU8YlckA=s96-c", "full_name": "Nathaniel James", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocL3v0xt27fMBwdrnkM2B1vzlMMY_o_3TKP_2qipD5AU8YlckA=s96-c", "provider_id": "116080490821741383900", "email_verified": true, "phone_verified": false}	\N	2025-02-11 11:03:32.045614+00	2025-02-11 11:03:32.663515+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	0924cb6b-e3c8-489e-b7e2-8953a759ad91	authenticated	authenticated	nathanieltjames24@icloud.com	$2a$10$9I6uYXG8FEsK/yywZBvuzev2A/TjJ9Ho4RuzVqUvL/lM8gvsC7Jeq	2025-02-11 04:38:29.349793+00	\N		\N		\N			\N	2025-02-14 03:22:32.349768+00	{"provider": "email", "providers": ["email"]}	{"sub": "0924cb6b-e3c8-489e-b7e2-8953a759ad91", "email": "nathanieltjames24@icloud.com", "email_verified": true, "phone_verified": false}	\N	2025-02-11 04:38:29.318024+00	2025-02-14 04:26:11.108052+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: job; Type: TABLE DATA; Schema: cron; Owner: supabase_admin
--

COPY cron.job (jobid, schedule, command, nodename, nodeport, database, username, active, jobname) FROM stdin;
3	0 0 * * *	\n    SELECT net.http_post(\n      url := 'https://ktktwfllgtuwunoutage.supabase.co/functions/v1/process-imports',\n      headers := jsonb_build_object(\n        'Content-Type', 'application/json'\n      ),\n      body := '{}'::jsonb\n    );\n  	localhost	5432	postgres	postgres	t	process-pending-imports
\.


--
-- Data for Name: job_run_details; Type: TABLE DATA; Schema: cron; Owner: supabase_admin
--

COPY cron.job_run_details (jobid, runid, job_pid, database, username, command, status, return_message, start_time, end_time) FROM stdin;
3	1	25001	postgres	postgres	\n    SELECT net.http_post(\n      url := 'https://ktktwfllgtuwunoutage.supabase.co/functions/v1/process-imports',\n      headers := jsonb_build_object(\n        'Content-Type', 'application/json'\n      ),\n      body := '{}'::jsonb\n    );\n  	succeeded	1 row	2025-02-12 00:00:00.191412+00	2025-02-12 00:00:00.215643+00
3	2	47506	postgres	postgres	\n    SELECT net.http_post(\n      url := 'https://ktktwfllgtuwunoutage.supabase.co/functions/v1/process-imports',\n      headers := jsonb_build_object(\n        'Content-Type', 'application/json'\n      ),\n      body := '{}'::jsonb\n    );\n  	succeeded	1 row	2025-02-13 00:00:00.170845+00	2025-02-13 00:00:00.185976+00
3	3	70406	postgres	postgres	\n    SELECT net.http_post(\n      url := 'https://ktktwfllgtuwunoutage.supabase.co/functions/v1/process-imports',\n      headers := jsonb_build_object(\n        'Content-Type', 'application/json'\n      ),\n      body := '{}'::jsonb\n    );\n  	succeeded	1 row	2025-02-14 00:00:00.200788+00	2025-02-14 00:00:00.2676+00
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

COPY pgsodium.key (id, status, created, expires, key_type, key_id, key_context, name, associated_data, raw_key, raw_key_nonce, parent_key, comment, user_data) FROM stdin;
bf0c8589-21e2-4413-985b-4ab529a713b6	valid	2025-02-12 03:04:28.195341+00	\N	aead-det	1	\\x7067736f6469756d	service_role_key		\N	\N	\N	\N	\N
\.


--
-- Data for Name: broker_connection_fields; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.broker_connection_fields (id, field_name, field_type, required, display_name, description, created_at, updated_at, broker_id) FROM stdin;
4e5eb321-e4a1-4de6-9e4d-0d66398316d9	api_key	api_key	t	API Key	Your Coinbase API key	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	476531c2-3207-4766-a796-6e56b7b487b9
167855a6-d3da-472b-8163-e78f94bb222b	api_secret	password	t	API Secret	Your Coinbase API secret	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	476531c2-3207-4766-a796-6e56b7b487b9
7437ce88-5472-42c0-ab64-9c70e1c5295f	username	text	t	Username	Your Webull username	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	5bb66bd8-7f00-4c2c-b807-2cfbba2fb05b
899ad8bb-c5ec-41cf-b58a-39e7d61d00af	password	password	t	Password	Your Webull password	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	5bb66bd8-7f00-4c2c-b807-2cfbba2fb05b
688c99a4-b5d7-41ac-a0aa-9355472be2d6	username	text	t	Username	Your Robinhood username	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	26c4abc3-c30c-4c0e-9f4f-6dff7d5a72c3
c6680fa1-f712-4653-b713-fad38360785b	password	password	t	Password	Your Robinhood password	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	26c4abc3-c30c-4c0e-9f4f-6dff7d5a72c3
9b09e72d-b059-47f3-9bf3-7e3771f8d3ab	api_key	api_key	t	API Key	Your Tradovate API key	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	1ebe9408-1f8e-4973-ab17-befbc7a10585
1d9987f6-0548-4ecd-aa06-32ba2399a6f9	api_secret	password	t	API Secret	Your Tradovate API secret	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	1ebe9408-1f8e-4973-ab17-befbc7a10585
6731eb63-97c1-4f37-b60c-c9430ab5e04e	username	text	t	Username	Your Charles Schwab username	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	5e2bd55f-bc42-46b0-bfac-7f77d91764a9
847011f7-cde7-437d-a2db-9576c6965468	password	password	t	Password	Your Charles Schwab password	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	5e2bd55f-bc42-46b0-bfac-7f77d91764a9
6813daaf-5ae3-43d4-a3de-3d4bf7f5b2c4	api_key	api_key	t	API Key	Your Oanda API key	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	dc3ab23a-b1c9-4ce5-bda8-418f0ced2eb1
74909122-6009-44e1-b6eb-2ffc77b957b2	account_id	text	t	Account ID	Your Oanda Account ID	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	dc3ab23a-b1c9-4ce5-bda8-418f0ced2eb1
bc824d56-5897-4b88-b30a-d62b3d697dca	api_key	api_key	t	API Key	Your Forex.com API key	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	70a56075-64a9-492a-9287-cbcc926bbc3f
fc8fec58-4fc6-46dc-8b76-8823f68ef8ce	api_secret	password	t	API Secret	Your Forex.com API secret	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	70a56075-64a9-492a-9287-cbcc926bbc3f
6e606570-5c99-489d-b48c-1bb55015e470	api_key	api_key	t	API Key	Your TradeStation API key	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	5b18e2b0-dc19-4b6e-83d1-171598c136e1
d4774f28-28e9-498a-b55f-6e14ae63d902	api_secret	password	t	API Secret	Your TradeStation API secret	2025-02-11 06:48:47.700608+00	2025-02-11 06:48:47.700608+00	5b18e2b0-dc19-4b6e-83d1-171598c136e1
327cda3f-7a65-4e8d-8a1d-5a8508028d18	api_key	api_key	t	API Key	Your TradingView API key from the Paper Trading settings	2025-02-11 08:14:40.412041+00	2025-02-11 08:14:40.412041+00	3c210844-1d30-4c83-9068-30ec27619184
723469c3-f3f6-4bb6-bad8-2504eb1f855c	username	text	t	Username	Your TradingView username	2025-02-11 08:14:40.412041+00	2025-02-11 08:14:40.412041+00	3c210844-1d30-4c83-9068-30ec27619184
\.


--
-- Data for Name: brokers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brokers (id, name, description, asset_types, created_at, updated_at, file_upload_enabled, broker_sync_enabled) FROM stdin;
5bb66bd8-7f00-4c2c-b807-2cfbba2fb05b	Webull	Commission-free trading platform	{stocks,options}	2025-02-11 07:22:25.833548+00	2025-02-11 07:22:25.833548+00	t	f
26c4abc3-c30c-4c0e-9f4f-6dff7d5a72c3	Robinhood	Commission-free investing platform	{stocks,options,crypto}	2025-02-11 07:22:25.833548+00	2025-02-11 07:22:25.833548+00	t	f
5e2bd55f-bc42-46b0-bfac-7f77d91764a9	Charles Schwab	Financial services and brokerage	{stocks,options}	2025-02-11 07:22:25.833548+00	2025-02-11 07:22:25.833548+00	t	f
dc3ab23a-b1c9-4ce5-bda8-418f0ced2eb1	Oanda	Forex and CFD trading	{forex}	2025-02-11 07:22:25.833548+00	2025-02-11 07:22:25.833548+00	t	f
70a56075-64a9-492a-9287-cbcc926bbc3f	Forex.com	Foreign exchange trading	{forex}	2025-02-11 07:22:25.833548+00	2025-02-11 07:22:25.833548+00	t	f
5b18e2b0-dc19-4b6e-83d1-171598c136e1	TradeStation	Online securities and futures brokerage	{stocks,options,futures}	2025-02-11 07:22:25.833548+00	2025-02-11 07:22:25.833548+00	t	f
476531c2-3207-4766-a796-6e56b7b487b9	Coinbase	Cryptocurrency exchange platform	{crypto}	2025-02-11 07:22:25.833548+00	2025-02-11 07:22:25.833548+00	t	t
3c210844-1d30-4c83-9068-30ec27619184	TradingView Paper Trading	Paper trading simulation through TradingView platform	{stocks,crypto,forex,futures}	2025-02-11 08:11:14.646779+00	2025-02-11 08:11:14.646779+00	t	f
1ebe9408-1f8e-4973-ab17-befbc7a10585	Tradovate	Futures trading platform	{futures}	2025-02-11 07:22:25.833548+00	2025-02-11 07:22:25.833548+00	t	t
\.


--
-- Data for Name: currency_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_codes (id, code, created_at, updated_at) FROM stdin;
c39da0af-d779-4cb5-828e-c4e70f4ada5d	AED	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
5342d517-dc71-42f0-b0ba-8949a97d1a2a	AFN	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
d459c30f-c29e-4087-849e-14d498b3c1dd	ALL	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
d01d1b04-2e56-412c-99cf-d40adb8d7cc1	AMD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
03286090-9742-4a40-af25-536e94452bbe	ANG	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
83a15668-ecca-4060-8bfa-1354eedc22ac	AOA	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
ddce2374-0ea3-42c3-b1b9-ed09f2c521ec	ARS	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
81dfc8f0-b5c8-42a0-bf9b-eaf3449d001e	AUD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
1be25668-5347-431e-b1cc-0f0026a79b09	AWG	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
00c3889d-dfc9-42c5-92de-f4f547779120	AZN	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
25da67b1-4599-432f-bfbe-31f1200a4936	BAM	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
6729f908-c345-4743-946e-8e5bcc0b6d52	BBD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
893a1cb0-0209-4f4e-9b26-ef6dc619ad86	BDT	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
b7f0735e-58ab-4f00-9f48-59f1a78a9a88	BGN	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
9551b669-5a8b-467f-8586-157915a54939	BHD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
bfc5fb5c-7822-4d15-a381-0b13f23d3038	BIF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
41c9cbe2-1981-49b8-a5a8-c0caede7acff	BMD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
a59577fc-120d-4760-aa25-d56b2aedf7e1	BND	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
c73f7723-a97c-400f-8cc2-810e54dff176	BOB	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
f0827095-c04c-4ae9-9287-c3b01ba89c9b	BRL	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
ed050550-477c-41d6-a994-982cc5a62605	BSD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
566c6e9d-6e71-4c07-98e9-c657d09d59f1	BTN	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
c904e36f-b5a0-497c-adf4-8844fc777c21	BWP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
0b3f5b0b-6d22-4770-a442-36e586eeae08	BYR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
6c7f4434-7c0c-4e85-b5c2-5fd6355f2488	BZD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
2b4f7eaa-5305-46b1-918b-846b0feb565c	CAD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
fa7af0bb-197d-4cb9-a32b-d5c9e86265a5	CDF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
4854feda-089d-477b-a5fa-d711ea838848	CHF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
cbdaf207-f267-40d7-bfe3-c7c0ab81ce01	CLP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
fc6100fb-e073-44c2-813f-825f3ee07361	CNY	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
012c5db5-cb01-4c90-93b7-bfdd2e6825cc	COP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
08f1a59e-d9f7-4be7-aaa6-f4cc739af59d	CRC	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
d75191c7-9bd4-46c1-90fa-4b72885f2b62	CUP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
19fb5df7-a305-4361-b2d2-b1ad84be9255	CVE	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
55cd1b7b-b8b4-4932-b90c-039229b88e2f	CZK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
6d806bd4-e4d8-4beb-9db8-1e27a78b930e	DJF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
2e57e334-7dd7-4ca9-bcaa-7b5b4189cd98	DKK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
f85eb219-4b8e-44ba-b277-860b385ecb7e	DOP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
0af6e899-6103-4395-994a-15c8f3190e9a	DZD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
2db8ec2b-d5c3-4dba-a72f-bff866768cf4	EEK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
565e389d-ff7f-44b8-a510-a782a5ccb957	EGP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
cf86d581-d396-4b4c-97f9-ee218de6087f	ERN	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
4d7b9d11-c250-43b7-a4cc-6abf938c5ab1	ETB	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
41392051-2034-4353-ac08-d88453f8c212	EUR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
48e725a3-0e3b-4d4e-ad26-e08ce6a94cd3	FJD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
2daa3be2-8e0f-4e22-987a-8a99715117b4	FKP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
a95c258e-397d-42cc-98f4-81c50aca4d7b	GBP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
053689db-aa7b-4798-a31d-dc74d382f9ac	GEL	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
cd9959b8-31d7-4943-913b-96d35127b22c	GHS	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
7e20bfd2-406e-4061-b0a8-a51dc6a17a22	GIP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
8c9aef92-2b7d-4f82-a60c-7d6ea298cc92	GMD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
ad718ce4-212a-4662-836f-988642dc04fa	GNF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
9c870d29-a9dd-495c-bf42-57dd58c632ae	GTQ	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
1b9f723b-98a5-465c-a23b-d13269300ba2	GYD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
76d57979-feac-4447-b88f-ec32ccd95846	HKD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
91a0a5c8-253e-45a7-9d34-fd0fbaedfc77	HNL	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
c13aba23-1228-4d66-aa53-5f7356615096	HRK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
3a24f18a-b79d-48c2-b2ed-a0b666212ff0	HTG	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
a11f19c1-9680-4a69-8295-27059c3b2118	HUF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
2e9e772e-57b5-4b9d-ab71-9df1bb5936b7	IDR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
9c2d20fb-8b60-4e95-baa8-30ed36071aac	ILS	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
5659c53d-1937-4286-aeb9-441f45412200	INR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
071a315f-0308-4a69-ad98-6fa75e3e267f	IQD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
5e36aec5-6962-4b08-89e3-d2148d715c65	IRR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
03134677-95f8-49d1-bbcd-e1246fa08d6a	ISK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
339c6d56-e4cc-4575-8ed7-9e89e8fd7703	JMD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
ea4b095c-c1f5-4599-8a0d-5b1f5f438f89	JOD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
d42ba505-964f-4ff5-934d-3fab1cf2906d	JPY	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
ed3ffad8-40e0-4a5b-9bce-4d9ab94d52d4	KES	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
0467d95c-5438-44fc-b104-6f67b014d20b	KGS	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
be8e62bb-5738-4260-ab1b-be601a1925ce	KHR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
e184ac3d-0b31-4706-af8b-627c87604ce1	KMF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
ce06360e-25b7-42b3-85c1-e037060bd399	KPW	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
de423e78-cb2a-48d8-87a2-55819f62b488	KRW	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
57f50ae4-68f4-4ed6-a696-1a4fac7bdab8	KWD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
bff77fbe-a0ce-4021-9d98-60801ddd9452	KYD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
2c863fb6-1c83-4784-b723-0d1593359cc5	KZT	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
d2885d1a-cc19-402f-8080-ce54a491439f	LAK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
dc137fed-ae70-415b-9f02-aab04035c10b	LBP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
73f29d57-0485-4d16-acbd-6ce18c6ba19b	LKR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
a768018f-bfe9-4922-b76c-d9a50f6899e4	LRD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
a588ce96-7875-4e17-91f3-1c2b01cbb432	LSL	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
82c4b7a4-b642-4f65-9d6c-0dc099788819	LTL	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
b26a336e-40b8-4a03-a65a-b07b94a00474	LVL	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
3d3fd25d-31ab-4480-8ba1-e1e395f6d576	LYD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
6aaaa96d-2674-4ee3-8965-c923d9afb83b	MAD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
fefbe420-dbeb-4fea-b1a1-af9df136af57	MDL	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
f15d8854-3652-4bb4-974a-c7835d511622	MGA	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
077f7f08-3426-4fac-9632-54eedfe22434	MKD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
607ea97a-924a-406a-9b4f-803bbbca2f7a	MMK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
6965b798-e9bd-44a1-b494-ef699997103d	MNT	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
7efc35c5-5ad3-4333-91e8-d6354e711a3c	MOP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
8021e377-561f-4dbe-9493-41f1ba1b6ef4	MRO	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
e0677f18-6890-49e5-bb69-12386dde0999	MUR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
ee44ac3a-6a73-4094-8a55-ee6647f5e119	MVR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
2f2b8c05-04b9-4a36-85ff-cb96618d11ea	MWK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
b24b28f9-26ec-4b13-81fd-f8a3ce951fab	MXN	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
9b6ea472-3b6d-42f9-ae5c-f275cd7f73ba	MYR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
d4a4f7dc-5f18-4841-b88e-162c743fcbc9	MZN	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
fe06381c-eba8-425d-a5b0-3b718b6ddc76	NAD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
3c19d9af-3ff0-42ec-8a10-bcac61fcffb7	NGN	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
d5d3ae81-fed6-49f0-ad31-07134536ed1f	NIO	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
7c55e791-912a-46b6-924f-6df0ab105f09	NOK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
4d1cb36b-bd80-47dd-9ca6-113539caca5d	NPR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
55d69825-9e43-4dcc-8b82-625652ff208f	NZD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
a21fe84f-d2f6-4246-bdcb-e34de334ccdc	OMR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
16476845-1d9f-4794-8b66-5119513d947e	PAB	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
010813ca-2bf5-4ddc-9e9b-6bed318af83f	PEN	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
3f874a22-a72b-46a1-bc09-8b4596dc60f8	PGK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
2b7a284a-bcaf-4cc2-9cf6-0e5be7382322	PHP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
76cb8a5f-a518-4f6b-ac53-78edb8ea9b7d	PKR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
0de82447-e5e6-4a95-a237-6d9229c5cb4b	PLN	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
05b3ddda-947f-4885-a1a5-6517edf7ff9c	PYG	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
e90c9d42-9a6b-44ec-bdd9-460c9e015a5a	QAR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
316a9902-b6c2-431d-90d8-9372a633c027	RON	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
9e5ab0df-8682-4e59-aa43-ef4f10d91115	RSD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
a4a3a1b7-d287-45a9-aaff-81b68f4dad67	RUB	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
2bb12450-a803-4d09-88a6-e86cadfeaca9	RWF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
b407b20a-8230-44c3-84f1-08cd80a5575e	SAR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
b8963612-9adf-47c4-b190-4b3b91c479af	SBD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
0a1bd9d2-cae2-4a0b-bfa8-4bf097ae2572	SCR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
135a6390-c672-41a2-8c14-efa64f01b6a2	SDG	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
44583079-315b-4f55-b565-a65c583d8977	SEK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
43a65db3-5cc4-407e-a046-63d40115ad0e	SGD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
24ca85b9-d700-4106-9cd5-90470c00ed33	SHP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
26643778-091a-4e61-a891-24840e2651f5	SLL	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
7ddb1a97-fd0f-426e-8906-07bbb0f46709	SOS	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
af32094e-7287-4358-aaea-747c9c40b1e7	SRD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
b0a6fbcf-e5a4-4682-adf7-bf27961a6bdb	STD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
885d67f6-0ef6-46af-a2bf-b96da9b71560	SVC	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
1df8a63c-0c72-48e4-a66e-737417893544	SYP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
84272422-6e08-4c35-92ee-9a5398ffd16d	SZL	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
a0052fbe-72be-48e0-9cf2-ff73fb89354d	THB	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
2b0a9898-42b9-4eb2-b58b-e222eecbe9bc	TJS	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
8a947d40-60bc-4bbd-8c22-505bf1555d35	TND	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
bfdaf093-b93a-44b8-b786-4dbf01455944	TOP	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
df19bd42-cded-4bdb-8ca3-e0704e9bce83	TRY	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
4565286c-6f2f-4a97-b7e0-d7b7ba65a44e	TTD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
f772ba89-0a08-4240-9a10-9506616512a4	TWD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
de7306ac-650d-487f-a3f3-3a1462aebb39	TZS	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
57c5d521-7b6c-4627-8897-070979244849	UAH	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
0585926a-3a5b-4c78-948e-38df6dc3b200	UGX	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
e2d14ef7-a6c3-47c1-bc56-39b9d3e3c486	USD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
b2c09675-5e10-4cd2-bf88-25f8a0275ae9	UYU	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
863d0698-1f96-4d52-bb34-70f0ec80daf9	UZS	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
fd180df8-be8e-4b04-a06a-da2b1b633f4b	VED	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
665146b0-02b9-44cb-8cbe-50da46434701	VEF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
7ea2af34-b443-4ce3-9dc8-5cd7cbe89e35	VES	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
250259d1-e27a-4a7f-8546-e0e87eefaeb1	VND	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
1235b62b-161e-40ed-b971-68cfb5b638e8	VUV	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
1edc419a-5798-41b6-a76d-b34fd59a1e53	WST	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
dbe44ce5-8220-4bb6-8be4-1d76d6eee7b5	XAF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
03345629-8d23-4917-abdf-8fa6e7637ffe	XCD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
47a0e7b2-cd72-4442-b0d9-dd54e07a1410	XOF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
bef48085-d7ff-4080-93b0-25bdcd492517	XPF	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
d160371e-3c19-4a92-9dc8-e79cbbf19f95	YER	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
af296a8f-26af-4359-87df-80ff7b61dcc4	ZAR	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
7d6cd604-e228-4fab-bcc1-1ee5bf95baf6	ZMK	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
833942ae-acee-413d-b532-a305c66d7507	ZWD	2025-02-13 02:27:17.397326+00	2025-02-13 02:27:17.397326+00
\.


--
-- Data for Name: futures_multipliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.futures_multipliers (id, symbol, multiplier, created_at, updated_at, name) FROM stdin;
0b851857-17fe-4ace-88a5-cdc3b81f786c	MES	5.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro E-mini S&P 500
72b7f839-ce59-49ef-8a25-cad23fe7d337	M2K	5.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro E-mini Russell 2000
8b559707-9124-48ea-9839-ce3624f53a66	MYM	0.50	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro E-mini DOW
a3bccbe1-5e44-4e38-b24e-0c4b1bf3a08d	MNQ	2.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro E-mini Nasdaq-100
33747fdd-ee68-491b-ae9d-1825a39f8342	MGC	10.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro Gold
6f3792bb-4315-4a3d-a260-617e54654ca8	SIL	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro Silver
ef01aa3e-b077-4110-a630-a1aaa9a2633e	MHG	2500.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro Copper
21af0415-c896-48aa-abef-498b1ef5fe87	MNG	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro Natural Gas
caa951e7-e495-4e68-8df5-da7ebf046018	M6E	12500.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro EURUSD
fbe22b81-4976-41f8-aa5d-e91fb5bb1794	M6A	10000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro AUDUSD
cfbfdc1e-4d05-497d-86d8-6e0997c41b63	MCD	10000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro CADUSD
9aa62709-1e76-47d8-99d7-c8d1ac02edb1	M6B	6250.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro GBPUSD
36e57981-83d5-45a0-9584-2795cf9ade1f	MSF	12500.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro CHFUSD
fecc9bad-cea0-452b-8c7d-efb42cb63764	10Y	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro 10 Yr. Yield
37e932fb-3c74-4589-a139-e845c06b4531	MBT	0.10	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	CME Micro Bitcoin
aafee26b-ae69-4f2b-ad51-a84ad3f20cc5	MET	0.10	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	CME Micro Ether
0d2e1353-79c2-4e8e-bde6-768265b4e107	ES	50.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	E-mini S&P 500
8af8ec91-9823-4a1d-95bc-62b37fdc31f1	NQ	20.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	E-mini Nasdaq
bf970a4e-1573-47d7-86dd-a0a5b398268c	RTY	50.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	E-mini Russell 2000
b2bd98f0-9547-4bf5-b031-278a3cf9141f	YM	5.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Mini Dow Jones
299b97ad-adbb-4db4-96f0-8bdf88df55c9	VX	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	CBOE Volatility Index (VIX)
591d2320-24ba-42e0-89c3-0ee7c9c91cc1	VXM	100.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Mini CBOE Volatility Index
526741ee-0737-449d-9162-441e7bc4370e	NKD	5.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Nikkei 225 (CME)
e7a38ce3-665e-4c99-9bb5-2f3e77ed423e	EMD	100.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	E-mini S&P Mid-Cap 400
e30ddf0e-f0f1-4474-b21b-65d4700a5a2a	MME	50.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	MSCI Emerging Markets Index (ICE)1
7ef7ae36-64a4-44ba-bed8-77d542ec3ece	GC	100.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Gold
248a8ff6-6e8b-406b-a723-c3de22f1632a	SI	5000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Silver
8be4fb2a-0c00-4afa-be00-2d880aa6c936	HG	25000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Copper
fa49aced-8692-49a5-ae53-31e069a6518c	CL	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Crude Oil
cb1243ff-e022-43b4-814c-ae80215ce481	MCL	100.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Micro WTI Crude Oil
9173a96e-12cc-4780-afca-59f0d5d7fef4	QM	500.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	E-mini Crude Oil
3da32895-226c-4fe0-8b6a-c202d3ff9bac	BZ	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Brent Crude Oil
fe1a5d9e-d345-4440-bcee-ea9838edef75	NG	10000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Natural Gas
7c8ae08e-6669-4d33-ad53-2c869ba1d6f7	QG	2500.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	E-mini Natural Gas
97ec9ecd-f53b-467d-bf54-22a8f4a81b8a	RB	42000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	RBOB Gasoline
7c6d6b36-e57a-4a96-b061-c1e82e571f36	HO	42000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Heating Oil
7fe8e11c-b52c-4901-96dc-585283abf15e	ZC	50.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Corn
5f9f5fc9-7413-4bc0-bd63-2eac4c29df4e	ZS	50.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Soybean
fc6000f0-1b9d-4f00-b6ca-790faf4d37b1	ZW	50.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Wheat
84a64124-e86a-4917-8284-c9eba578914f	ZM	100.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Soybean Meal
23a1a6ae-c124-4ea6-ada8-2e5b105cf1ee	ZL	600.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Soybean Oil
0f73743a-d048-4103-ad94-4205c09c0aee	KE	50.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	KC Hard Red Winter Wheat
586779cf-bc13-4d77-ba5a-9225c2d367e7	MWE	50.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Minneapolis Wheat
7909240d-0be7-442f-85a2-b1800bb70860	XC	10.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	E-mini Corn
05dc19d3-b38f-4e33-a9b9-98cba25ec597	XK	10.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	E-mini Soybean
6a58a29a-4e31-400c-a344-39195f720219	XW	10.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	E-mini Wheat
2fdb6832-eda2-4c32-91af-ab0d2971cae8	LE	400.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Live Cattle
506228f2-21f7-4fdf-9aeb-43469d450c03	GF	500.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Feeder Cattle
b8b3393e-5b59-449c-8138-0711b61ef097	HE	400.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Lean Hog
d103d6d1-df4c-4d33-bcd5-10a3f3c3dbfc	ZR	2000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Rough Rice
32f04dfa-8395-4ce2-9f40-caf5624a2c8f	ZO	50.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Oats
910035fd-9930-470c-a3a2-70d1653b3a90	DC	2000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Milk
4895b499-6842-4c1d-9e3c-4fcba60e0977	AW	100.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Bloomberg Commodity Index
65467208-5bad-4746-b4d3-947ca0051223	6E	125000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Euro FX
333d2c38-5c02-4545-abd6-fa6ddc02f848	6A	100000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Australian Dollar
7ab31648-fd1f-450f-baa7-43a8aea59b14	6C	100000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Canadian Dollar
14b0c4bf-2e6f-40de-8b93-e4d66770f28b	6B	62500.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	British Pound
f93b1d5e-f1b8-4263-851b-ed4f0c7f85cc	6J	12500000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Japanese Yen
9215d430-335e-405e-93a0-cc2bb005b995	6S	125000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Swiss Franc
f0d9d286-7a99-42d7-8dbd-71dd76b82d90	E7	62500.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	E-mini Euro FX
7353e7b2-0fb4-41a4-af8f-bd148c1348de	J7	6250000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	E-mini Japanese Yen
eaa00f2b-55a8-4a14-b70d-fd9bf6f5b67c	6N	100000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	New Zealand Dollar
cb88aee5-d658-4cd1-a5b0-4fa24f3c6c0f	6M	500000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Mexican Peso
7cb8c5b3-b230-4723-9990-f2c9f2e0d48f	6L	100000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Brazilian Real
811c029f-0f74-4d32-9135-c3d7cc92f2a4	6Z	500000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	South African Rand
a82c377c-4c18-4d35-98ce-5f2bccfe3fe3	DX 	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	U.S. Dollar Index1
edab8fd0-2ee2-42bd-b13a-f57db4223d88	ZB	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	U.S. 30-Year Bond
743ff978-7be3-4de5-ae89-bef23a76fd08	ZN	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	U.S. 10-Year Note
c2e04927-98ae-424f-b5ce-5704e0b3cc0b	ZF	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	U.S. 5-Year Note
0277ec8a-de22-43cc-bf46-ff1b84187ac2	ZT	2000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	U.S. 2-Year Note
bd538219-6cb2-465a-a2f4-43901e231b92	UB	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Ultra Bond
69de942f-290b-4c21-968b-2ebb922b770f	TN	1000.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Ultra 10-Year T-Note
198a352d-9f6f-4780-983a-03867d4b9c3f	ZQ	4167.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Fed Funds
55bae49e-e78d-46e8-b04a-0e17e29e2168	BTC	5.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	CME Bitcoin
e72d3705-f0ea-43b9-9973-708c45c2e7bb	ETH	50.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	CME Ether
3a19ea63-526f-43f3-a3f2-a6950b32768a	CC	10.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Cocoa ICE1
f51da5ea-2881-4863-96f1-130c353fbddc	KC	375.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Coffee ICE1
a738c300-a8e1-4d94-a8b2-49c7f6215de3	CT	500.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Cotton ICE1
1eb524bf-a9d3-4a36-b7c6-8bc179fc80f2	OJ	150.00	2025-02-13 09:42:57.645589+00	2025-02-13 09:42:57.645589+00	Orange Juice ICE1
\.


--
-- Data for Name: imports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.imports (id, user_id, trading_account_id, import_type, status, error_message, created_at, updated_at, original_filename, file_path, file_size, file_type) FROM stdin;
28444aba-5d2d-49f4-8aaa-a1953e01fa7e	0924cb6b-e3c8-489e-b7e2-8953a759ad91	55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	csv	completed	Processed: 0, Skipped: 100, Duplicates: 0	2025-02-14 03:50:03.718058+00	2025-02-14 03:50:05.639+00	paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739505002670-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	10320	text/csv
827e169e-b78e-49f1-b248-d18d135f0972	0924cb6b-e3c8-489e-b7e2-8953a759ad91	55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	csv	completed	Processed: 0, Skipped: 100, Duplicates: 0	2025-02-14 04:11:01.290245+00	2025-02-14 04:11:03.204+00	paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739506260334-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	10320	text/csv
83774c1a-f75f-4af8-ac32-0d0220bd2c7a	0924cb6b-e3c8-489e-b7e2-8953a759ad91	55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	csv	completed	Processed: 35, Skipped: 65, Duplicates: 0	2025-02-13 10:15:54.434189+00	2025-02-13 10:16:14.284+00	paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739441753275-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	10320	text/csv
7046085d-c473-4262-ac57-85679cf5df01	0924cb6b-e3c8-489e-b7e2-8953a759ad91	55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	csv	completed	Processed: 65, Skipped: 35, Duplicates: 0	2025-02-13 11:33:29.710473+00	2025-02-13 11:33:48.723+00	paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739446408697-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	10320	text/csv
3e182740-c205-4e87-8b39-f3c71675abc7	0924cb6b-e3c8-489e-b7e2-8953a759ad91	55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	csv	completed	Processed: 0, Skipped: 100, Duplicates: 0	2025-02-14 03:26:53.100062+00	2025-02-14 03:26:55.226+00	paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739503612270-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	10320	text/csv
b2d709b2-bc0d-407f-893d-1db3c0601f5f	0924cb6b-e3c8-489e-b7e2-8953a759ad91	55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	csv	completed	Processed: 0, Skipped: 100, Duplicates: 0	2025-02-14 03:34:21.50872+00	2025-02-14 03:34:23.424+00	paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739504060729-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	10320	text/csv
143c42aa-a694-449f-8bf3-d8658d23d7f1	0924cb6b-e3c8-489e-b7e2-8953a759ad91	55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	csv	completed	Processed: 0, Skipped: 100, Duplicates: 0	2025-02-14 04:06:14.079587+00	2025-02-14 04:06:16.042+00	paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739505973171-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	10320	text/csv
bd51b2a2-10fe-4e59-bebe-77c544c8ef14	0924cb6b-e3c8-489e-b7e2-8953a759ad91	55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	csv	completed	Processed: 65, Skipped: 35, Duplicates: 0	2025-02-12 22:06:50.820717+00	2025-02-12 22:07:29.794+00	paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739398009695-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	10320	text/csv
4ac13a0f-d86f-476b-b234-7ac22588a574	0924cb6b-e3c8-489e-b7e2-8953a759ad91	55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	csv	completed	Processed: 0, Skipped: 100, Duplicates: 0	2025-02-14 04:26:42.654347+00	2025-02-14 04:26:44.565+00	paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739507201902-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	10320	text/csv
154a3ec4-feb8-4b8f-9f67-ec70816dd637	0924cb6b-e3c8-489e-b7e2-8953a759ad91	55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	csv	completed	Processed: 0, Skipped: 65, Duplicates: 35	2025-02-13 10:59:51.64944+00	2025-02-13 11:00:07.45+00	paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739444390730-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	10320	text/csv
440e2655-250c-4540-8846-42ae67156164	0924cb6b-e3c8-489e-b7e2-8953a759ad91	55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	csv	completed	Processed: 0, Skipped: 100, Duplicates: 0	2025-02-14 03:14:06.782771+00	2025-02-14 03:14:09.367+00	paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739502845600-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	10320	text/csv
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, username, full_name, avatar_url, updated_at, created_at) FROM stdin;
a7f9ac06-708d-4666-afe9-e2e4a30d4d9e	\N	Nathaniel James	https://lh3.googleusercontent.com/a/ACg8ocL3v0xt27fMBwdrnkM2B1vzlMMY_o_3TKP_2qipD5AU8YlckA=s96-c	2025-02-11 11:03:32.035267+00	2025-02-11 11:03:32.035267+00
0924cb6b-e3c8-489e-b7e2-8953a759ad91	nahruskii24	Nathaniel Jame	https://ktktwfllgtuwunoutage.supabase.co/storage/v1/object/public/avatars/0924cb6b-e3c8-489e-b7e2-8953a759ad91-0.9624252166702649.jpg	2025-02-11 04:38:29.317111+00	2025-02-11 04:38:29.317111+00
\.


--
-- Data for Name: service_role_key; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_role_key (decrypted_secret) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, user_id, tier, active, created_at, updated_at) FROM stdin;
17933153-37e5-4958-9c30-de2e2efb34cf	0924cb6b-e3c8-489e-b7e2-8953a759ad91	free	t	2025-02-11 04:38:29.317111+00	2025-02-11 04:38:29.317111+00
2147960b-4040-4898-a94a-bc1cef2a8057	a7f9ac06-708d-4666-afe9-e2e4a30d4d9e	free	t	2025-02-11 11:03:32.035267+00	2025-02-11 11:03:32.035267+00
\.


--
-- Data for Name: trades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trades (id, user_id, trading_account_id, import_id, symbol, side, entry_price, exit_price, quantity, entry_date, exit_date, pnl, fees, notes, created_at, updated_at, order_type, status, external_id, closing_time, asset_type, multiplier, leverage) FROM stdin;
\.


--
-- Data for Name: trading_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trading_accounts (id, user_id, account_name, created_at, updated_at, profit_calculation_method, account_balance, broker_credentials, broker_connected, broker_id) FROM stdin;
55e7f0e7-67ae-4757-a6ea-3ce57e7979c4	0924cb6b-e3c8-489e-b7e2-8953a759ad91	Main 	2025-02-11 05:29:07.098401+00	2025-02-11 05:29:07.098401+00	FIFO	200.00	\N	f	3c210844-1d30-4c83-9068-30ec27619184
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-02-11 02:07:24
20211116045059	2025-02-11 02:07:25
20211116050929	2025-02-11 02:07:26
20211116051442	2025-02-11 02:07:26
20211116212300	2025-02-11 02:07:27
20211116213355	2025-02-11 02:07:28
20211116213934	2025-02-11 02:07:29
20211116214523	2025-02-11 02:07:29
20211122062447	2025-02-11 02:07:30
20211124070109	2025-02-11 02:07:31
20211202204204	2025-02-11 02:07:31
20211202204605	2025-02-11 02:07:32
20211210212804	2025-02-11 02:07:34
20211228014915	2025-02-11 02:07:35
20220107221237	2025-02-11 02:07:35
20220228202821	2025-02-11 02:07:36
20220312004840	2025-02-11 02:07:37
20220603231003	2025-02-11 02:07:38
20220603232444	2025-02-11 02:07:38
20220615214548	2025-02-11 02:07:39
20220712093339	2025-02-11 02:07:40
20220908172859	2025-02-11 02:07:41
20220916233421	2025-02-11 02:07:41
20230119133233	2025-02-11 02:07:42
20230128025114	2025-02-11 02:07:43
20230128025212	2025-02-11 02:07:43
20230227211149	2025-02-11 02:07:44
20230228184745	2025-02-11 02:07:45
20230308225145	2025-02-11 02:07:45
20230328144023	2025-02-11 02:07:46
20231018144023	2025-02-11 02:07:47
20231204144023	2025-02-11 02:07:48
20231204144024	2025-02-11 02:07:48
20231204144025	2025-02-11 02:07:49
20240108234812	2025-02-11 02:07:50
20240109165339	2025-02-11 02:07:50
20240227174441	2025-02-11 02:07:52
20240311171622	2025-02-11 02:07:52
20240321100241	2025-02-11 02:07:54
20240401105812	2025-02-11 02:07:56
20240418121054	2025-02-11 02:07:57
20240523004032	2025-02-11 02:07:59
20240618124746	2025-02-11 02:08:00
20240801235015	2025-02-11 02:08:00
20240805133720	2025-02-11 02:08:01
20240827160934	2025-02-11 02:08:02
20240919163303	2025-02-11 02:08:02
20240919163305	2025-02-11 02:08:03
20241019105805	2025-02-11 02:08:04
20241030150047	2025-02-11 02:08:06
20241108114728	2025-02-11 02:08:07
20241121104152	2025-02-11 02:08:08
20241130184212	2025-02-11 02:08:09
20241220035512	2025-02-11 02:08:09
20241220123912	2025-02-11 02:08:10
20241224161212	2025-02-11 02:08:11
20250107150512	2025-02-11 02:08:11
20250110162412	2025-02-11 02:08:12
20250123174212	2025-02-11 02:08:12
20250128220012	2025-02-11 02:08:13
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
avatars	avatars	\N	2025-02-11 04:14:01.714023+00	2025-02-11 04:14:01.714023+00	t	f	\N	\N	\N
import_files	import_files	\N	2025-02-11 09:27:49.575306+00	2025-02-11 09:27:49.575306+00	f	f	\N	\N	\N
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-02-11 02:07:25.511327
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-02-11 02:07:25.520573
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-02-11 02:07:25.529634
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-02-11 02:07:25.579427
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-02-11 02:07:25.618288
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-02-11 02:07:25.62698
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-02-11 02:07:25.635769
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-02-11 02:07:25.655854
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-02-11 02:07:25.665581
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-02-11 02:07:25.675547
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-02-11 02:07:25.685389
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-02-11 02:07:25.703456
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-02-11 02:07:25.717386
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-02-11 02:07:25.726384
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-02-11 02:07:25.745016
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-02-11 02:07:25.780283
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-02-11 02:07:25.79111
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-02-11 02:07:25.801468
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-02-11 02:07:25.821352
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-02-11 02:07:25.833334
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-02-11 02:07:25.845269
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-02-11 02:07:25.866049
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-02-11 02:07:25.902117
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-02-11 02:07:25.931678
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-02-11 02:07:25.946573
25	custom-metadata	67eb93b7e8d401cafcdc97f9ac779e71a79bfe03	2025-02-11 02:07:25.960328
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
efcafc32-f3cf-4fac-8a99-983fe32410eb	avatars	0924cb6b-e3c8-489e-b7e2-8953a759ad91-0.9624252166702649.jpg	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-11 04:39:43.123696+00	2025-02-11 04:39:43.123696+00	2025-02-11 04:39:43.123696+00	{"eTag": "\\"8ea1edd1706682086b3841162f7077c5\\"", "size": 1973922, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-02-11T04:39:43.000Z", "contentLength": 1973922, "httpStatusCode": 200}	b9aad39d-1b63-433b-aa6e-4a87565b3ea5	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
620e3ea7-a790-4dcc-a7a9-542ca0b15102	import_files	.emptyFolderPlaceholder	\N	2025-02-11 11:27:44.521493+00	2025-02-11 11:27:44.521493+00	2025-02-11 11:27:44.521493+00	{"eTag": "\\"d41d8cd98f00b204e9800998ecf8427e\\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-02-11T11:27:45.000Z", "contentLength": 0, "httpStatusCode": 200}	77bd7321-100a-48e4-aff9-59a9ba5ebc85	\N	{}
194a4fb9-f874-4d16-a797-fe1ebc81c757	import_files	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739398009695-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-12 22:06:50.35859+00	2025-02-12 22:06:50.35859+00	2025-02-12 22:06:50.35859+00	{"eTag": "\\"44d11ae6216720a1d9b7c6fb5717916f\\"", "size": 10320, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-02-12T22:06:51.000Z", "contentLength": 10320, "httpStatusCode": 200}	19e32fea-8f99-44de-b3a3-02688e88fc1f	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
cf6a9acb-fa67-4a0b-857d-fbe38a38d090	import_files	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739441753275-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-13 10:15:54.065936+00	2025-02-13 10:15:54.065936+00	2025-02-13 10:15:54.065936+00	{"eTag": "\\"44d11ae6216720a1d9b7c6fb5717916f\\"", "size": 10320, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-02-13T10:15:54.000Z", "contentLength": 10320, "httpStatusCode": 200}	44a4a033-6ffb-4878-a004-03b7d4e87e0b	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
f6c70f97-adfb-4dfb-890a-cd4086f991cc	import_files	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739444390730-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-13 10:59:51.29061+00	2025-02-13 10:59:51.29061+00	2025-02-13 10:59:51.29061+00	{"eTag": "\\"44d11ae6216720a1d9b7c6fb5717916f\\"", "size": 10320, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-02-13T10:59:52.000Z", "contentLength": 10320, "httpStatusCode": 200}	f3ea5cff-aff5-4905-8f86-dfea97fac39a	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
06ecbab0-419e-4e85-9dac-0f2bb41c55b5	import_files	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739446408697-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-13 11:33:29.312064+00	2025-02-13 11:33:29.312064+00	2025-02-13 11:33:29.312064+00	{"eTag": "\\"44d11ae6216720a1d9b7c6fb5717916f\\"", "size": 10320, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-02-13T11:33:30.000Z", "contentLength": 10320, "httpStatusCode": 200}	d458b6aa-558b-4a3e-9084-bfc3e2e47f46	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
7534d0fa-e049-4924-ba42-d35b3802e809	import_files	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739502845600-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-14 03:14:06.321053+00	2025-02-14 03:14:06.321053+00	2025-02-14 03:14:06.321053+00	{"eTag": "\\"44d11ae6216720a1d9b7c6fb5717916f\\"", "size": 10320, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-02-14T03:14:07.000Z", "contentLength": 10320, "httpStatusCode": 200}	ed89bffc-483b-4e4e-bcd1-c910d5a17755	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
bdd51e87-1f73-404b-8ef8-e2d12149cd2e	import_files	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739503612270-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-14 03:26:52.664833+00	2025-02-14 03:26:52.664833+00	2025-02-14 03:26:52.664833+00	{"eTag": "\\"44d11ae6216720a1d9b7c6fb5717916f\\"", "size": 10320, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-02-14T03:26:53.000Z", "contentLength": 10320, "httpStatusCode": 200}	9b9b5aeb-305d-406b-879c-6e66182e620f	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
38dbe798-0103-434c-b0c6-c403ac90dda0	import_files	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739504060729-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-14 03:34:21.273387+00	2025-02-14 03:34:21.273387+00	2025-02-14 03:34:21.273387+00	{"eTag": "\\"44d11ae6216720a1d9b7c6fb5717916f\\"", "size": 10320, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-02-14T03:34:22.000Z", "contentLength": 10320, "httpStatusCode": 200}	1346a65b-6a0d-4c1a-8419-11b32662a226	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
05dc9fd2-f378-4480-9944-d272b29cf84a	import_files	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739505002670-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-14 03:50:03.216398+00	2025-02-14 03:50:03.216398+00	2025-02-14 03:50:03.216398+00	{"eTag": "\\"44d11ae6216720a1d9b7c6fb5717916f\\"", "size": 10320, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-02-14T03:50:04.000Z", "contentLength": 10320, "httpStatusCode": 200}	962b55b9-3087-4be1-b6c9-e66997dc0c6f	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
dedec234-21ec-4dcc-b77f-5bd8b989ab74	import_files	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739505973171-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-14 04:06:13.525515+00	2025-02-14 04:06:13.525515+00	2025-02-14 04:06:13.525515+00	{"eTag": "\\"44d11ae6216720a1d9b7c6fb5717916f\\"", "size": 10320, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-02-14T04:06:14.000Z", "contentLength": 10320, "httpStatusCode": 200}	fe356f99-a566-4479-afc4-297763d85b4d	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
930716de-4c40-4b37-ab64-f6daa9f7b7db	import_files	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739506260334-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-14 04:11:00.875941+00	2025-02-14 04:11:00.875941+00	2025-02-14 04:11:00.875941+00	{"eTag": "\\"44d11ae6216720a1d9b7c6fb5717916f\\"", "size": 10320, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-02-14T04:11:01.000Z", "contentLength": 10320, "httpStatusCode": 200}	907a6603-94c5-44f9-8e94-ea9d9f7b4a39	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
175f5f97-87c0-4ca9-8ae5-67d11f1d89ab	import_files	0924cb6b-e3c8-489e-b7e2-8953a759ad91/1739507201902-paper-trading-history-all-2025-02-12T09_45_56.449Z.csv	0924cb6b-e3c8-489e-b7e2-8953a759ad91	2025-02-14 04:26:42.430533+00	2025-02-14 04:26:42.430533+00	2025-02-14 04:26:42.430533+00	{"eTag": "\\"44d11ae6216720a1d9b7c6fb5717916f\\"", "size": 10320, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2025-02-14T04:26:43.000Z", "contentLength": 10320, "httpStatusCode": 200}	7b464f65-d35e-4328-8ca9-2455c8f6d5d8	0924cb6b-e3c8-489e-b7e2-8953a759ad91	{}
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
e8436451-47b2-4f42-9231-9bc12f969739	service_role_key		yKZc15jh0W9r/+MiIs9WE7U4nOV09ujDIcgsTbPPxLz3CPwasCoEfl5ervt1a+IQtQn6Wg9e5jeG\ngKjHw2S4y3Y8CdpVRPTkFkkRtfhgxloEyK3BfdyqXEs4ufN0hr2paF+BUae18A+9SvRBb+vnEp/a\ndZZjWDnbQ/yC5zt6+5/AEBZULOYEhQUnHELSjhv7OxEzHWaj+uSXJ2FGRLb/0v7jmdbI4HzhOsq+\nzc/bM0lFuLrS4qrmozY/8lY2hyUWDi33XD95MqagR42OaHZ1cdK6V1ofwfeKZTHjzv3zBtKqERti\nBz6oHlghgtJ5N1Wa3+fxyvL3j5m3cZ4=	bf0c8589-21e2-4413-985b-4ab529a713b6	\\xc561100506588ceecccb3aba31a2b34f	2025-02-12 03:05:19.142695+00	2025-02-12 03:05:19.142695+00
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 53, true);


--
-- Name: jobid_seq; Type: SEQUENCE SET; Schema: cron; Owner: supabase_admin
--

SELECT pg_catalog.setval('cron.jobid_seq', 3, true);


--
-- Name: runid_seq; Type: SEQUENCE SET; Schema: cron; Owner: supabase_admin
--

SELECT pg_catalog.setval('cron.runid_seq', 3, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('pgsodium.key_key_id_seq', 1, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: broker_connection_fields broker_connection_fields_broker_id_field_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.broker_connection_fields
    ADD CONSTRAINT broker_connection_fields_broker_id_field_name_key UNIQUE (broker_id, field_name);


--
-- Name: broker_connection_fields broker_connection_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.broker_connection_fields
    ADD CONSTRAINT broker_connection_fields_pkey PRIMARY KEY (id);


--
-- Name: brokers brokers_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brokers
    ADD CONSTRAINT brokers_name_key UNIQUE (name);


--
-- Name: brokers brokers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brokers
    ADD CONSTRAINT brokers_pkey PRIMARY KEY (id);


--
-- Name: currency_codes currency_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_codes
    ADD CONSTRAINT currency_codes_code_key UNIQUE (code);


--
-- Name: currency_codes currency_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_codes
    ADD CONSTRAINT currency_codes_pkey PRIMARY KEY (id);


--
-- Name: futures_multipliers futures_multipliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.futures_multipliers
    ADD CONSTRAINT futures_multipliers_pkey PRIMARY KEY (id);


--
-- Name: imports imports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT imports_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);


--
-- Name: trades trades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_pkey PRIMARY KEY (id);


--
-- Name: trading_accounts trading_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trading_accounts
    ADD CONSTRAINT trading_accounts_pkey PRIMARY KEY (id);


--
-- Name: trades unique_trade_external_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT unique_trade_external_id UNIQUE (external_id, trading_account_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: futures_multipliers_symbol_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX futures_multipliers_symbol_idx ON public.futures_multipliers USING btree (symbol);


--
-- Name: idx_broker_connection_fields_broker_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_broker_connection_fields_broker_id ON public.broker_connection_fields USING btree (broker_id);


--
-- Name: idx_imports_trading_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_imports_trading_account_id ON public.imports USING btree (trading_account_id);


--
-- Name: idx_imports_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_imports_user_id ON public.imports USING btree (user_id);


--
-- Name: idx_trades_entry_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trades_entry_date ON public.trades USING btree (entry_date);


--
-- Name: idx_trades_external_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trades_external_id ON public.trades USING btree (external_id, trading_account_id);


--
-- Name: idx_trades_import_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trades_import_id ON public.trades USING btree (import_id);


--
-- Name: idx_trades_symbol; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trades_symbol ON public.trades USING btree (symbol);


--
-- Name: idx_trades_trading_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trades_trading_account_id ON public.trades USING btree (trading_account_id);


--
-- Name: idx_trades_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trades_user_id ON public.trades USING btree (user_id);


--
-- Name: trades_user_account_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trades_user_account_idx ON public.trades USING btree (user_id, trading_account_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: users on_auth_user_created_subscription; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created_subscription AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();


--
-- Name: trades calculate_trade_pnl_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER calculate_trade_pnl_trigger BEFORE INSERT OR UPDATE ON public.trades FOR EACH ROW EXECUTE FUNCTION public.calculate_trade_pnl();


--
-- Name: trading_accounts check_trading_account_limit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_trading_account_limit_trigger BEFORE INSERT ON public.trading_accounts FOR EACH ROW EXECUTE FUNCTION public.check_trading_account_limit();


--
-- Name: imports process_import_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER process_import_trigger AFTER INSERT OR UPDATE ON public.imports FOR EACH ROW EXECUTE FUNCTION public.process_new_import();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: broker_connection_fields broker_connection_fields_broker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.broker_connection_fields
    ADD CONSTRAINT broker_connection_fields_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.brokers(id);


--
-- Name: imports fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: trades fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: imports imports_trading_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT imports_trading_account_id_fkey FOREIGN KEY (trading_account_id) REFERENCES public.trading_accounts(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: trades trades_import_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_import_id_fkey FOREIGN KEY (import_id) REFERENCES public.imports(id) ON DELETE SET NULL;


--
-- Name: trades trades_trading_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_trading_account_id_fkey FOREIGN KEY (trading_account_id) REFERENCES public.trading_accounts(id) ON DELETE CASCADE;


--
-- Name: trading_accounts trading_accounts_broker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trading_accounts
    ADD CONSTRAINT trading_accounts_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.brokers(id);


--
-- Name: trading_accounts trading_accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trading_accounts
    ADD CONSTRAINT trading_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: brokers Allow all users to read brokers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow all users to read brokers" ON public.brokers FOR SELECT TO authenticated USING (true);


--
-- Name: broker_connection_fields Allow anyone to read broker fields; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow anyone to read broker fields" ON public.broker_connection_fields FOR SELECT TO authenticated USING (true);


--
-- Name: futures_multipliers Allow read access to authenticated users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow read access to authenticated users" ON public.futures_multipliers FOR SELECT TO authenticated USING (true);


--
-- Name: brokers Allow read access to brokers for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow read access to brokers for all users" ON public.brokers FOR SELECT USING (true);


--
-- Name: profiles Public profiles are viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);


--
-- Name: imports Users can create their own imports; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create their own imports" ON public.imports FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: trading_accounts Users can delete their own trading accounts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own trading accounts" ON public.trading_accounts FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: imports Users can insert their own imports; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own imports" ON public.imports FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: trades Users can insert their own trades; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own trades" ON public.trades FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: trading_accounts Users can insert their own trading accounts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own trading accounts" ON public.trading_accounts FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: trading_accounts Users can read their own trading accounts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can read their own trading accounts" ON public.trading_accounts FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: imports Users can update their own imports; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own imports" ON public.imports FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: trades Users can update their own trades; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own trades" ON public.trades FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: trading_accounts Users can update their own trading accounts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own trading accounts" ON public.trading_accounts FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: imports Users can view their own imports; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own imports" ON public.imports FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: subscriptions Users can view their own subscription; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: trades Users can view their own trades; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own trades" ON public.trades FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: trading_accounts Users can view their own trading accounts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own trading accounts" ON public.trading_accounts FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: broker_connection_fields; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.broker_connection_fields ENABLE ROW LEVEL SECURITY;

--
-- Name: brokers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;

--
-- Name: futures_multipliers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.futures_multipliers ENABLE ROW LEVEL SECURITY;

--
-- Name: imports; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.imports ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: trades; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

--
-- Name: trading_accounts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Allow authenticated reads; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow authenticated reads" ON storage.objects FOR SELECT TO authenticated USING ((bucket_id = 'import_files'::text));


--
-- Name: objects Allow authenticated uploads; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'import_files'::text));


--
-- Name: objects Allow authenticated users to upload files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow authenticated users to upload files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'import_files'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Allow users to read their own files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow users to read their own files" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'import_files'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- Name: objects Allow users to upload their own files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow users to upload their own files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'import_files'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- Name: objects Avatar images are publicly accessible.; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING ((bucket_id = 'avatars'::text));


--
-- Name: objects Enable insert for authenticated users; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Enable insert for authenticated users" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'import_files'::text));


--
-- Name: objects Enable read access for all users; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Enable read access for all users" ON storage.objects FOR SELECT USING ((bucket_id = 'import_files'::text));


--
-- Name: objects Users can delete their own avatars.; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can delete their own avatars." ON storage.objects FOR DELETE USING (((bucket_id = 'avatars'::text) AND (auth.uid() = owner)));


--
-- Name: objects Users can update their own avatars.; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can update their own avatars." ON storage.objects FOR UPDATE USING (((bucket_id = 'avatars'::text) AND (auth.uid() = owner)));


--
-- Name: objects Users can upload avatars.; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can upload avatars." ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'avatars'::text) AND (auth.uid() = owner)));


--
-- Name: objects Users can upload their own import files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can upload their own import files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'import_files'::text) AND ((auth.uid())::text = "substring"(name, 0, POSITION(('/'::text) IN (name))))));


--
-- Name: objects Users can view their own import files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can view their own import files" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'import_files'::text) AND ((auth.uid())::text = "substring"(name, 0, POSITION(('/'::text) IN (name))))));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT ALL ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA cron; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA cron TO postgres WITH GRANT OPTION;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA net; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA net TO supabase_functions_admin;
GRANT USAGE ON SCHEMA net TO postgres;
GRANT USAGE ON SCHEMA net TO anon;
GRANT USAGE ON SCHEMA net TO authenticated;
GRANT USAGE ON SCHEMA net TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT ALL ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION job_cache_invalidate(); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.job_cache_invalidate() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(job_name text, schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(job_name text, schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_id bigint); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_id bigint) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_name text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION algorithm_sign(signables text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sign(payload json, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION try_cast_double(inp text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.try_cast_double(inp text) FROM postgres;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO dashboard_user;


--
-- Name: FUNCTION url_decode(data text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.url_decode(data text) FROM postgres;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO dashboard_user;


--
-- Name: FUNCTION url_encode(data bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.url_encode(data bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION verify(token text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer); Type: ACL; Schema: net; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO postgres;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO anon;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO authenticated;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO service_role;


--
-- Name: FUNCTION http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer); Type: ACL; Schema: net; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO postgres;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO anon;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO authenticated;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: postgres
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_keygen(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_keygen() TO service_role;


--
-- Name: FUNCTION calculate_base_pnl(p_asset_type public.asset_type, p_exit_price numeric, p_entry_price numeric, p_quantity numeric, p_multiplier numeric, p_is_short boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calculate_base_pnl(p_asset_type public.asset_type, p_exit_price numeric, p_entry_price numeric, p_quantity numeric, p_multiplier numeric, p_is_short boolean) TO anon;
GRANT ALL ON FUNCTION public.calculate_base_pnl(p_asset_type public.asset_type, p_exit_price numeric, p_entry_price numeric, p_quantity numeric, p_multiplier numeric, p_is_short boolean) TO authenticated;
GRANT ALL ON FUNCTION public.calculate_base_pnl(p_asset_type public.asset_type, p_exit_price numeric, p_entry_price numeric, p_quantity numeric, p_multiplier numeric, p_is_short boolean) TO service_role;


--
-- Name: FUNCTION calculate_trade_pnl(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calculate_trade_pnl() TO anon;
GRANT ALL ON FUNCTION public.calculate_trade_pnl() TO authenticated;
GRANT ALL ON FUNCTION public.calculate_trade_pnl() TO service_role;


--
-- Name: FUNCTION check_trading_account_limit(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_trading_account_limit() TO anon;
GRANT ALL ON FUNCTION public.check_trading_account_limit() TO authenticated;
GRANT ALL ON FUNCTION public.check_trading_account_limit() TO service_role;


--
-- Name: FUNCTION get_matching_trades(p_account_id uuid, p_symbol character varying, p_quantity numeric, p_calc_method public.profit_calc_method); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_matching_trades(p_account_id uuid, p_symbol character varying, p_quantity numeric, p_calc_method public.profit_calc_method) TO anon;
GRANT ALL ON FUNCTION public.get_matching_trades(p_account_id uuid, p_symbol character varying, p_quantity numeric, p_calc_method public.profit_calc_method) TO authenticated;
GRANT ALL ON FUNCTION public.get_matching_trades(p_account_id uuid, p_symbol character varying, p_quantity numeric, p_calc_method public.profit_calc_method) TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION handle_new_user_subscription(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user_subscription() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user_subscription() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user_subscription() TO service_role;


--
-- Name: FUNCTION process_new_import(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.process_new_import() TO anon;
GRANT ALL ON FUNCTION public.process_new_import() TO authenticated;
GRANT ALL ON FUNCTION public.process_new_import() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.schema_migrations TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.schema_migrations TO postgres;
GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE job; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT SELECT ON TABLE cron.job TO postgres WITH GRANT OPTION;


--
-- Name: TABLE job_run_details; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON TABLE cron.job_run_details TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE decrypted_key; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE pgsodium.decrypted_key TO pgsodium_keyholder;


--
-- Name: TABLE masking_rule; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE pgsodium.masking_rule TO pgsodium_keyholder;


--
-- Name: TABLE mask_columns; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE pgsodium.mask_columns TO pgsodium_keyholder;


--
-- Name: TABLE broker_connection_fields; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.broker_connection_fields TO anon;
GRANT ALL ON TABLE public.broker_connection_fields TO authenticated;
GRANT ALL ON TABLE public.broker_connection_fields TO service_role;


--
-- Name: TABLE brokers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.brokers TO anon;
GRANT ALL ON TABLE public.brokers TO authenticated;
GRANT ALL ON TABLE public.brokers TO service_role;


--
-- Name: TABLE available_brokers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.available_brokers TO anon;
GRANT ALL ON TABLE public.available_brokers TO authenticated;
GRANT ALL ON TABLE public.available_brokers TO service_role;


--
-- Name: TABLE currency_codes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.currency_codes TO anon;
GRANT ALL ON TABLE public.currency_codes TO authenticated;
GRANT ALL ON TABLE public.currency_codes TO service_role;


--
-- Name: TABLE futures_multipliers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.futures_multipliers TO anon;
GRANT ALL ON TABLE public.futures_multipliers TO authenticated;
GRANT ALL ON TABLE public.futures_multipliers TO service_role;


--
-- Name: TABLE imports; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.imports TO anon;
GRANT ALL ON TABLE public.imports TO authenticated;
GRANT ALL ON TABLE public.imports TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE service_role_key; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.service_role_key TO anon;
GRANT ALL ON TABLE public.service_role_key TO authenticated;
GRANT ALL ON TABLE public.service_role_key TO service_role;


--
-- Name: TABLE subscriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.subscriptions TO anon;
GRANT ALL ON TABLE public.subscriptions TO authenticated;
GRANT ALL ON TABLE public.subscriptions TO service_role;


--
-- Name: TABLE trades; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trades TO anon;
GRANT ALL ON TABLE public.trades TO authenticated;
GRANT ALL ON TABLE public.trades TO service_role;


--
-- Name: TABLE trading_accounts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trading_accounts TO anon;
GRANT ALL ON TABLE public.trading_accounts TO authenticated;
GRANT ALL ON TABLE public.trading_accounts TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres;


--
-- Name: TABLE migrations; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.migrations TO anon;
GRANT ALL ON TABLE storage.migrations TO authenticated;
GRANT ALL ON TABLE storage.migrations TO service_role;
GRANT ALL ON TABLE storage.migrations TO postgres;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON SEQUENCES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON FUNCTIONS  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON TABLES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT ALL ON SEQUENCES  TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT ALL ON TABLES  TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON SEQUENCES  TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON FUNCTIONS  TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON TABLES  TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO postgres;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

