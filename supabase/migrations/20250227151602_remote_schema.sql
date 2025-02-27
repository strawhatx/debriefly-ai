

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


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";






CREATE TYPE "public"."asset_type" AS ENUM (
    'STOCK',
    'OPTION',
    'FUTURES',
    'FOREX',
    'CRYPTO'
);


ALTER TYPE "public"."asset_type" OWNER TO "postgres";


CREATE TYPE "public"."broker_field_type" AS ENUM (
    'TEXT',
    'PASSWORD',
    'APIKEY'
);


ALTER TYPE "public"."broker_field_type" OWNER TO "postgres";


CREATE TYPE "public"."import_status" AS ENUM (
    'PENDING',
    'UPLOADED',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE "public"."import_status" OWNER TO "postgres";


CREATE TYPE "public"."insight_type" AS ENUM (
    'debrief',
    'pattern',
    'suggestion'
);


ALTER TYPE "public"."insight_type" OWNER TO "postgres";


CREATE TYPE "public"."profit_calc_method" AS ENUM (
    'FIFO',
    'LIFO'
);


ALTER TYPE "public"."profit_calc_method" OWNER TO "postgres";


CREATE TYPE "public"."subscription_tier" AS ENUM (
    'FREE',
    'PREMIUM'
);


ALTER TYPE "public"."subscription_tier" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_trading_account_limit"() RETURNS "trigger"
    LANGUAGE "plpgsql"
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


ALTER FUNCTION "public"."check_trading_account_limit"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user_subscription"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  INSERT INTO public.subscriptions (user_id, tier)
    VALUES (NEW.id, 'FREE');
    RETURN NEW;
end;$$;


ALTER FUNCTION "public"."handle_new_user_subscription"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_new_import"() RETURNS "trigger"
    LANGUAGE "plpgsql"
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


ALTER FUNCTION "public"."process_new_import"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_insights_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_insights_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."billing_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "stripe_invoice_id" "text",
    "amount" numeric,
    "status" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."billing_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."broker_connection_fields" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "field_name" "text" NOT NULL,
    "field_type" "public"."broker_field_type" NOT NULL,
    "required" boolean DEFAULT true NOT NULL,
    "display_name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "broker_id" "uuid" NOT NULL
);


ALTER TABLE "public"."broker_connection_fields" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."brokers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "asset_types" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "file_upload_enabled" boolean DEFAULT true NOT NULL,
    "broker_sync_enabled" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."brokers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."currency_codes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" character varying(3) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."currency_codes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."futures_multipliers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "symbol" character varying NOT NULL,
    "multiplier" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "name" character varying
);


ALTER TABLE "public"."futures_multipliers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."imports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "trading_account_id" "uuid" NOT NULL,
    "import_type" character varying(50) NOT NULL,
    "status" "public"."import_status" DEFAULT 'PENDING'::"public"."import_status" NOT NULL,
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "original_filename" "text",
    "file_path" "text",
    "file_size" integer,
    "file_type" "text",
    CONSTRAINT "imports_import_type_check" CHECK ((("import_type")::"text" = ANY (ARRAY[('csv'::character varying)::"text", ('excel'::character varying)::"text", ('coinbase_sync'::character varying)::"text", ('oanda_sync'::character varying)::"text", ('schwab_sync'::character varying)::"text"])))
);


ALTER TABLE "public"."imports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."insights" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "position_id" "uuid",
    "type" "public"."insight_type" NOT NULL,
    "content" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "session_date" timestamp with time zone
);


ALTER TABLE "public"."insights" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_methods" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "stripe_payment_method_id" "text" NOT NULL,
    "is_default" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."payment_methods" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."positions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "trading_account_id" "uuid" NOT NULL,
    "symbol" "text",
    "asset_type" "public"."asset_type" DEFAULT 'STOCK'::"public"."asset_type",
    "position_type" "text",
    "quantity" double precision,
    "fill_price" double precision,
    "stop_price" double precision,
    "entry_date" timestamp with time zone NOT NULL,
    "closing_date" timestamp with time zone,
    "fees" double precision DEFAULT 0,
    "multiplier" integer DEFAULT 1,
    "pnl" double precision,
    "leverage" double precision,
    "status" "text",
    "entry_trade_id" "uuid" NOT NULL,
    "close_trade_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."positions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tier" "public"."subscription_tier" DEFAULT 'FREE'::"public"."subscription_tier" NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trade_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "trading_account_id" "uuid" NOT NULL,
    "import_id" "uuid",
    "symbol" character varying(50) NOT NULL,
    "order_type" character varying,
    "side" character varying(10) NOT NULL,
    "fill_price" numeric NOT NULL,
    "stop_price" numeric,
    "quantity" numeric NOT NULL,
    "entry_date" timestamp with time zone NOT NULL,
    "closing_date" timestamp with time zone,
    "fees" numeric DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "status" character varying,
    "external_id" character varying,
    "leverage" numeric DEFAULT '0'::numeric,
    CONSTRAINT "trades_leverage_check" CHECK (("leverage" = ANY (ARRAY[(0)::numeric, (50)::numeric, (100)::numeric, (200)::numeric, (300)::numeric, (400)::numeric, (500)::numeric]))),
    CONSTRAINT "trades_side_check" CHECK ((("side")::"text" = ANY (ARRAY[('BUY'::character varying)::"text", ('SELL'::character varying)::"text"])))
);


ALTER TABLE "public"."trade_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trading_accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "account_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "profit_calculation_method" "public"."profit_calc_method" DEFAULT 'FIFO'::"public"."profit_calc_method" NOT NULL,
    "account_balance" numeric(20,2) DEFAULT 0.00 NOT NULL,
    "broker_credentials" "jsonb",
    "broker_connected" boolean DEFAULT false,
    "broker_id" "uuid" NOT NULL
);


ALTER TABLE "public"."trading_accounts" OWNER TO "postgres";


ALTER TABLE ONLY "public"."billing_history"
    ADD CONSTRAINT "billing_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."broker_connection_fields"
    ADD CONSTRAINT "broker_connection_fields_broker_id_field_name_key" UNIQUE ("broker_id", "field_name");



ALTER TABLE ONLY "public"."broker_connection_fields"
    ADD CONSTRAINT "broker_connection_fields_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."brokers"
    ADD CONSTRAINT "brokers_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."brokers"
    ADD CONSTRAINT "brokers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."currency_codes"
    ADD CONSTRAINT "currency_codes_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."currency_codes"
    ADD CONSTRAINT "currency_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."futures_multipliers"
    ADD CONSTRAINT "futures_multipliers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."imports"
    ADD CONSTRAINT "imports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."insights"
    ADD CONSTRAINT "insights_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_methods"
    ADD CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."positions"
    ADD CONSTRAINT "positions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."trade_history"
    ADD CONSTRAINT "trades_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trading_accounts"
    ADD CONSTRAINT "trading_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trade_history"
    ADD CONSTRAINT "unique_trade_external_id" UNIQUE ("external_id", "trading_account_id");



CREATE UNIQUE INDEX "futures_multipliers_symbol_idx" ON "public"."futures_multipliers" USING "btree" ("symbol");



CREATE INDEX "idx_broker_connection_fields_broker_id" ON "public"."broker_connection_fields" USING "btree" ("broker_id");



CREATE INDEX "idx_imports_trading_account_id" ON "public"."imports" USING "btree" ("trading_account_id");



CREATE INDEX "idx_imports_user_id" ON "public"."imports" USING "btree" ("user_id");



CREATE INDEX "idx_trades_entry_date" ON "public"."trade_history" USING "btree" ("entry_date");



CREATE INDEX "idx_trades_external_id" ON "public"."trade_history" USING "btree" ("external_id", "trading_account_id");



CREATE INDEX "idx_trades_import_id" ON "public"."trade_history" USING "btree" ("import_id");



CREATE INDEX "idx_trades_symbol" ON "public"."trade_history" USING "btree" ("symbol");



CREATE INDEX "idx_trades_trading_account_id" ON "public"."trade_history" USING "btree" ("trading_account_id");



CREATE INDEX "idx_trades_user_id" ON "public"."trade_history" USING "btree" ("user_id");



CREATE INDEX "trades_user_account_idx" ON "public"."trade_history" USING "btree" ("user_id", "trading_account_id");



CREATE OR REPLACE TRIGGER "check_trading_account_limit_trigger" BEFORE INSERT ON "public"."trading_accounts" FOR EACH ROW EXECUTE FUNCTION "public"."check_trading_account_limit"();



CREATE OR REPLACE TRIGGER "process_import_trigger" AFTER INSERT OR UPDATE ON "public"."imports" FOR EACH ROW EXECUTE FUNCTION "public"."process_new_import"();



CREATE OR REPLACE TRIGGER "update_insights_updated_at" BEFORE UPDATE ON "public"."insights" FOR EACH ROW EXECUTE FUNCTION "public"."update_insights_updated_at"();



ALTER TABLE ONLY "public"."billing_history"
    ADD CONSTRAINT "billing_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."broker_connection_fields"
    ADD CONSTRAINT "broker_connection_fields_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id");



ALTER TABLE ONLY "public"."imports"
    ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."imports"
    ADD CONSTRAINT "imports_trading_account_id_fkey" FOREIGN KEY ("trading_account_id") REFERENCES "public"."trading_accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."imports"
    ADD CONSTRAINT "imports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."insights"
    ADD CONSTRAINT "insights_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id");



ALTER TABLE ONLY "public"."insights"
    ADD CONSTRAINT "insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."payment_methods"
    ADD CONSTRAINT "payment_methods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."positions"
    ADD CONSTRAINT "positions_entry_trade_id_fkey" FOREIGN KEY ("entry_trade_id") REFERENCES "public"."trade_history"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."positions"
    ADD CONSTRAINT "positions_exit_trade_id_fkey" FOREIGN KEY ("close_trade_id") REFERENCES "public"."trade_history"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."positions"
    ADD CONSTRAINT "positions_trading_account_id_fkey" FOREIGN KEY ("trading_account_id") REFERENCES "public"."trading_accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."positions"
    ADD CONSTRAINT "positions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trade_history"
    ADD CONSTRAINT "trade_history_import_id_fkey" FOREIGN KEY ("import_id") REFERENCES "public"."imports"("id");



ALTER TABLE ONLY "public"."trade_history"
    ADD CONSTRAINT "trade_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trade_history"
    ADD CONSTRAINT "trades_trading_account_id_fkey" FOREIGN KEY ("trading_account_id") REFERENCES "public"."trading_accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trading_accounts"
    ADD CONSTRAINT "trading_accounts_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id");



ALTER TABLE ONLY "public"."trading_accounts"
    ADD CONSTRAINT "trading_accounts_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Allow read access to authenticated users" ON "public"."broker_connection_fields" TO "authenticated" USING (true);



CREATE POLICY "Allow read access to authenticated users" ON "public"."brokers" TO "authenticated" USING (true);



CREATE POLICY "Allow read access to authenticated users" ON "public"."currency_codes" TO "authenticated" USING (true);



CREATE POLICY "Allow read access to authenticated users" ON "public"."futures_multipliers" TO "authenticated" USING (true);



CREATE POLICY "Enable insert for users based on user_id" ON "public"."imports" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable insert for users based on user_id" ON "public"."positions" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable insert for users based on user_id" ON "public"."trade_history" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable insert for users based on user_id" ON "public"."trading_accounts" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable users to view their own data only" ON "public"."imports" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable users to view their own data only" ON "public"."positions" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can delete own trading_accounts." ON "public"."trading_accounts" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can delete their own insights" ON "public"."insights" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own insights" ON "public"."insights" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own imports." ON "public"."imports" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own trades." ON "public"."trade_history" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own trading_accounts." ON "public"."trading_accounts" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update their own insights" ON "public"."insights" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own insights" ON "public"."insights" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own subscription." ON "public"."subscriptions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own trades." ON "public"."trade_history" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own trading_accounts." ON "public"."trading_accounts" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."broker_connection_fields" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."brokers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."currency_codes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."futures_multipliers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."imports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."insights" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."positions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trade_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trading_accounts" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";









































































































































































































































































































GRANT ALL ON FUNCTION "public"."check_trading_account_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_trading_account_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_trading_account_limit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user_subscription"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user_subscription"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user_subscription"() TO "service_role";



GRANT ALL ON FUNCTION "public"."process_new_import"() TO "anon";
GRANT ALL ON FUNCTION "public"."process_new_import"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_new_import"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_insights_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_insights_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_insights_updated_at"() TO "service_role";





















GRANT ALL ON TABLE "public"."billing_history" TO "anon";
GRANT ALL ON TABLE "public"."billing_history" TO "authenticated";
GRANT ALL ON TABLE "public"."billing_history" TO "service_role";



GRANT ALL ON TABLE "public"."broker_connection_fields" TO "anon";
GRANT ALL ON TABLE "public"."broker_connection_fields" TO "authenticated";
GRANT ALL ON TABLE "public"."broker_connection_fields" TO "service_role";



GRANT ALL ON TABLE "public"."brokers" TO "anon";
GRANT ALL ON TABLE "public"."brokers" TO "authenticated";
GRANT ALL ON TABLE "public"."brokers" TO "service_role";



GRANT ALL ON TABLE "public"."currency_codes" TO "anon";
GRANT ALL ON TABLE "public"."currency_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."currency_codes" TO "service_role";



GRANT ALL ON TABLE "public"."futures_multipliers" TO "anon";
GRANT ALL ON TABLE "public"."futures_multipliers" TO "authenticated";
GRANT ALL ON TABLE "public"."futures_multipliers" TO "service_role";



GRANT ALL ON TABLE "public"."imports" TO "anon";
GRANT ALL ON TABLE "public"."imports" TO "authenticated";
GRANT ALL ON TABLE "public"."imports" TO "service_role";



GRANT ALL ON TABLE "public"."insights" TO "anon";
GRANT ALL ON TABLE "public"."insights" TO "authenticated";
GRANT ALL ON TABLE "public"."insights" TO "service_role";



GRANT ALL ON TABLE "public"."payment_methods" TO "anon";
GRANT ALL ON TABLE "public"."payment_methods" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_methods" TO "service_role";



GRANT ALL ON TABLE "public"."positions" TO "anon";
GRANT ALL ON TABLE "public"."positions" TO "authenticated";
GRANT ALL ON TABLE "public"."positions" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."trade_history" TO "anon";
GRANT ALL ON TABLE "public"."trade_history" TO "authenticated";
GRANT ALL ON TABLE "public"."trade_history" TO "service_role";



GRANT ALL ON TABLE "public"."trading_accounts" TO "anon";
GRANT ALL ON TABLE "public"."trading_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."trading_accounts" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
