create type "public"."asset_type" as enum ('STOCK', 'OPTION', 'FUTURES', 'FOREX', 'CRYPTO');

create type "public"."broker_field_type" as enum ('TEXT', 'PASSWORD', 'APIKEY');

create type "public"."import_status" as enum ('PENDING', 'UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');

create type "public"."profit_calc_method" as enum ('FIFO', 'LIFO');

create type "public"."subscription_tier" as enum ('FREE', 'PREMIUM');

create table "public"."broker_connection_fields" (
    "id" uuid not null default gen_random_uuid(),
    "field_name" text not null,
    "field_type" broker_field_type not null,
    "required" boolean not null default true,
    "display_name" text not null,
    "description" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "broker_id" uuid not null
);


alter table "public"."broker_connection_fields" enable row level security;

create table "public"."brokers" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "asset_types" text[] not null default '{}'::text[],
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "file_upload_enabled" boolean not null default true,
    "broker_sync_enabled" boolean not null default false
);


alter table "public"."brokers" enable row level security;

create table "public"."currency_codes" (
    "id" uuid not null default gen_random_uuid(),
    "code" character varying(3) not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."currency_codes" enable row level security;

create table "public"."futures_multipliers" (
    "id" uuid not null default gen_random_uuid(),
    "symbol" character varying not null,
    "multiplier" numeric not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "name" character varying
);


alter table "public"."futures_multipliers" enable row level security;

create table "public"."imports" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "trading_account_id" uuid not null,
    "import_type" character varying(50) not null,
    "status" import_status not null default 'PENDING'::import_status,
    "error_message" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "original_filename" text,
    "file_path" text,
    "file_size" integer,
    "file_type" text
);


alter table "public"."imports" enable row level security;

create table "public"."positions" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "trading_account_id" uuid not null,
    "symbol" text,
    "asset_type" asset_type default 'STOCK'::asset_type,
    "position_type" text,
    "quantity" double precision,
    "fill_price" double precision,
    "stop_price" double precision,
    "entry_date" timestamp with time zone not null,
    "closing_date" timestamp with time zone,
    "fees" double precision default 0,
    "multiplier" integer default 1,
    "pnl" double precision,
    "leverage" double precision,
    "status" text,
    "entry_trade_id" uuid not null,
    "close_trade_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."positions" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "username" text,
    "full_name" text,
    "avatar_url" text,
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."profiles" enable row level security;

create table "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "tier" subscription_tier not null default 'FREE'::subscription_tier,
    "active" boolean not null default true,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."subscriptions" enable row level security;

create table "public"."trade_history" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "trading_account_id" uuid not null,
    "import_id" uuid,
    "symbol" character varying(50) not null,
    "order_type" character varying,
    "side" character varying(10) not null,
    "fill_price" numeric not null,
    "stop_price" numeric,
    "quantity" numeric not null,
    "entry_date" timestamp with time zone not null,
    "closing_date" timestamp with time zone,
    "fees" numeric default 0,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "status" character varying,
    "external_id" character varying,
    "leverage" numeric default '0'::numeric
);


alter table "public"."trade_history" enable row level security;

create table "public"."trading_accounts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "account_name" text not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "profit_calculation_method" profit_calc_method not null default 'FIFO'::profit_calc_method,
    "account_balance" numeric(20,2) not null default 0.00,
    "broker_credentials" jsonb,
    "broker_connected" boolean default false,
    "broker_id" uuid not null
);


alter table "public"."trading_accounts" enable row level security;

CREATE UNIQUE INDEX broker_connection_fields_broker_id_field_name_key ON public.broker_connection_fields USING btree (broker_id, field_name);

CREATE UNIQUE INDEX broker_connection_fields_pkey ON public.broker_connection_fields USING btree (id);

CREATE UNIQUE INDEX brokers_name_key ON public.brokers USING btree (name);

CREATE UNIQUE INDEX brokers_pkey ON public.brokers USING btree (id);

CREATE UNIQUE INDEX currency_codes_code_key ON public.currency_codes USING btree (code);

CREATE UNIQUE INDEX currency_codes_pkey ON public.currency_codes USING btree (id);

CREATE UNIQUE INDEX futures_multipliers_pkey ON public.futures_multipliers USING btree (id);

CREATE UNIQUE INDEX futures_multipliers_symbol_idx ON public.futures_multipliers USING btree (symbol);

CREATE INDEX idx_broker_connection_fields_broker_id ON public.broker_connection_fields USING btree (broker_id);

CREATE INDEX idx_imports_trading_account_id ON public.imports USING btree (trading_account_id);

CREATE INDEX idx_imports_user_id ON public.imports USING btree (user_id);

CREATE INDEX idx_trades_entry_date ON public.trade_history USING btree (entry_date);

CREATE INDEX idx_trades_external_id ON public.trade_history USING btree (external_id, trading_account_id);

CREATE INDEX idx_trades_import_id ON public.trade_history USING btree (import_id);

CREATE INDEX idx_trades_symbol ON public.trade_history USING btree (symbol);

CREATE INDEX idx_trades_trading_account_id ON public.trade_history USING btree (trading_account_id);

CREATE INDEX idx_trades_user_id ON public.trade_history USING btree (user_id);

CREATE UNIQUE INDEX imports_pkey ON public.imports USING btree (id);

CREATE UNIQUE INDEX positions_pkey ON public.positions USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX subscriptions_user_id_key ON public.subscriptions USING btree (user_id);

CREATE UNIQUE INDEX trades_pkey ON public.trade_history USING btree (id);

CREATE INDEX trades_user_account_idx ON public.trade_history USING btree (user_id, trading_account_id);

CREATE UNIQUE INDEX trading_accounts_pkey ON public.trading_accounts USING btree (id);

CREATE UNIQUE INDEX unique_trade_external_id ON public.trade_history USING btree (external_id, trading_account_id);

alter table "public"."broker_connection_fields" add constraint "broker_connection_fields_pkey" PRIMARY KEY using index "broker_connection_fields_pkey";

alter table "public"."brokers" add constraint "brokers_pkey" PRIMARY KEY using index "brokers_pkey";

alter table "public"."currency_codes" add constraint "currency_codes_pkey" PRIMARY KEY using index "currency_codes_pkey";

alter table "public"."futures_multipliers" add constraint "futures_multipliers_pkey" PRIMARY KEY using index "futures_multipliers_pkey";

alter table "public"."imports" add constraint "imports_pkey" PRIMARY KEY using index "imports_pkey";

alter table "public"."positions" add constraint "positions_pkey" PRIMARY KEY using index "positions_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."trade_history" add constraint "trades_pkey" PRIMARY KEY using index "trades_pkey";

alter table "public"."trading_accounts" add constraint "trading_accounts_pkey" PRIMARY KEY using index "trading_accounts_pkey";

alter table "public"."broker_connection_fields" add constraint "broker_connection_fields_broker_id_field_name_key" UNIQUE using index "broker_connection_fields_broker_id_field_name_key";

alter table "public"."broker_connection_fields" add constraint "broker_connection_fields_broker_id_fkey" FOREIGN KEY (broker_id) REFERENCES brokers(id) not valid;

alter table "public"."broker_connection_fields" validate constraint "broker_connection_fields_broker_id_fkey";

alter table "public"."brokers" add constraint "brokers_name_key" UNIQUE using index "brokers_name_key";

alter table "public"."currency_codes" add constraint "currency_codes_code_key" UNIQUE using index "currency_codes_code_key";

alter table "public"."imports" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."imports" validate constraint "fk_user";

alter table "public"."imports" add constraint "imports_import_type_check" CHECK (((import_type)::text = ANY (ARRAY[('csv'::character varying)::text, ('excel'::character varying)::text, ('coinbase_sync'::character varying)::text, ('oanda_sync'::character varying)::text, ('schwab_sync'::character varying)::text]))) not valid;

alter table "public"."imports" validate constraint "imports_import_type_check";

alter table "public"."imports" add constraint "imports_trading_account_id_fkey" FOREIGN KEY (trading_account_id) REFERENCES trading_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."imports" validate constraint "imports_trading_account_id_fkey";

alter table "public"."imports" add constraint "imports_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."imports" validate constraint "imports_user_id_fkey";

alter table "public"."positions" add constraint "positions_entry_trade_id_fkey" FOREIGN KEY (entry_trade_id) REFERENCES trade_history(id) ON DELETE CASCADE not valid;

alter table "public"."positions" validate constraint "positions_entry_trade_id_fkey";

alter table "public"."positions" add constraint "positions_exit_trade_id_fkey" FOREIGN KEY (close_trade_id) REFERENCES trade_history(id) ON DELETE CASCADE not valid;

alter table "public"."positions" validate constraint "positions_exit_trade_id_fkey";

alter table "public"."positions" add constraint "positions_trading_account_id_fkey" FOREIGN KEY (trading_account_id) REFERENCES trading_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."positions" validate constraint "positions_trading_account_id_fkey";

alter table "public"."positions" add constraint "positions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."positions" validate constraint "positions_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey1";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_key" UNIQUE using index "subscriptions_user_id_key";

alter table "public"."trade_history" add constraint "trade_history_import_id_fkey" FOREIGN KEY (import_id) REFERENCES imports(id) not valid;

alter table "public"."trade_history" validate constraint "trade_history_import_id_fkey";

alter table "public"."trade_history" add constraint "trade_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."trade_history" validate constraint "trade_history_user_id_fkey";

alter table "public"."trade_history" add constraint "trades_leverage_check" CHECK ((leverage = ANY (ARRAY[(0)::numeric, (50)::numeric, (100)::numeric, (200)::numeric, (300)::numeric, (400)::numeric, (500)::numeric]))) not valid;

alter table "public"."trade_history" validate constraint "trades_leverage_check";

alter table "public"."trade_history" add constraint "trades_side_check" CHECK (((side)::text = ANY (ARRAY[('BUY'::character varying)::text, ('SELL'::character varying)::text]))) not valid;

alter table "public"."trade_history" validate constraint "trades_side_check";

alter table "public"."trade_history" add constraint "trades_trading_account_id_fkey" FOREIGN KEY (trading_account_id) REFERENCES trading_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."trade_history" validate constraint "trades_trading_account_id_fkey";

alter table "public"."trade_history" add constraint "unique_trade_external_id" UNIQUE using index "unique_trade_external_id";

alter table "public"."trading_accounts" add constraint "trading_accounts_broker_id_fkey" FOREIGN KEY (broker_id) REFERENCES brokers(id) not valid;

alter table "public"."trading_accounts" validate constraint "trading_accounts_broker_id_fkey";

alter table "public"."trading_accounts" add constraint "trading_accounts_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."trading_accounts" validate constraint "trading_accounts_user_id_fkey1";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_trading_account_limit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  INSERT INTO public.subscriptions (user_id, tier)
    VALUES (NEW.id, 'FREE');
    RETURN NEW;
end;$function$
;

CREATE OR REPLACE FUNCTION public.process_new_import()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Only process if status is pending
  IF NEW.status = 'PENDING' THEN
    -- Update status to uploaded to indicate processing should begin
    UPDATE public.imports 
    SET status = 'UPLOADED',
        updated_at = now()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;$function$
;

grant delete on table "public"."broker_connection_fields" to "anon";

grant insert on table "public"."broker_connection_fields" to "anon";

grant references on table "public"."broker_connection_fields" to "anon";

grant select on table "public"."broker_connection_fields" to "anon";

grant trigger on table "public"."broker_connection_fields" to "anon";

grant truncate on table "public"."broker_connection_fields" to "anon";

grant update on table "public"."broker_connection_fields" to "anon";

grant delete on table "public"."broker_connection_fields" to "authenticated";

grant insert on table "public"."broker_connection_fields" to "authenticated";

grant references on table "public"."broker_connection_fields" to "authenticated";

grant select on table "public"."broker_connection_fields" to "authenticated";

grant trigger on table "public"."broker_connection_fields" to "authenticated";

grant truncate on table "public"."broker_connection_fields" to "authenticated";

grant update on table "public"."broker_connection_fields" to "authenticated";

grant delete on table "public"."broker_connection_fields" to "service_role";

grant insert on table "public"."broker_connection_fields" to "service_role";

grant references on table "public"."broker_connection_fields" to "service_role";

grant select on table "public"."broker_connection_fields" to "service_role";

grant trigger on table "public"."broker_connection_fields" to "service_role";

grant truncate on table "public"."broker_connection_fields" to "service_role";

grant update on table "public"."broker_connection_fields" to "service_role";

grant delete on table "public"."brokers" to "anon";

grant insert on table "public"."brokers" to "anon";

grant references on table "public"."brokers" to "anon";

grant select on table "public"."brokers" to "anon";

grant trigger on table "public"."brokers" to "anon";

grant truncate on table "public"."brokers" to "anon";

grant update on table "public"."brokers" to "anon";

grant delete on table "public"."brokers" to "authenticated";

grant insert on table "public"."brokers" to "authenticated";

grant references on table "public"."brokers" to "authenticated";

grant select on table "public"."brokers" to "authenticated";

grant trigger on table "public"."brokers" to "authenticated";

grant truncate on table "public"."brokers" to "authenticated";

grant update on table "public"."brokers" to "authenticated";

grant delete on table "public"."brokers" to "service_role";

grant insert on table "public"."brokers" to "service_role";

grant references on table "public"."brokers" to "service_role";

grant select on table "public"."brokers" to "service_role";

grant trigger on table "public"."brokers" to "service_role";

grant truncate on table "public"."brokers" to "service_role";

grant update on table "public"."brokers" to "service_role";

grant delete on table "public"."currency_codes" to "anon";

grant insert on table "public"."currency_codes" to "anon";

grant references on table "public"."currency_codes" to "anon";

grant select on table "public"."currency_codes" to "anon";

grant trigger on table "public"."currency_codes" to "anon";

grant truncate on table "public"."currency_codes" to "anon";

grant update on table "public"."currency_codes" to "anon";

grant delete on table "public"."currency_codes" to "authenticated";

grant insert on table "public"."currency_codes" to "authenticated";

grant references on table "public"."currency_codes" to "authenticated";

grant select on table "public"."currency_codes" to "authenticated";

grant trigger on table "public"."currency_codes" to "authenticated";

grant truncate on table "public"."currency_codes" to "authenticated";

grant update on table "public"."currency_codes" to "authenticated";

grant delete on table "public"."currency_codes" to "service_role";

grant insert on table "public"."currency_codes" to "service_role";

grant references on table "public"."currency_codes" to "service_role";

grant select on table "public"."currency_codes" to "service_role";

grant trigger on table "public"."currency_codes" to "service_role";

grant truncate on table "public"."currency_codes" to "service_role";

grant update on table "public"."currency_codes" to "service_role";

grant delete on table "public"."futures_multipliers" to "anon";

grant insert on table "public"."futures_multipliers" to "anon";

grant references on table "public"."futures_multipliers" to "anon";

grant select on table "public"."futures_multipliers" to "anon";

grant trigger on table "public"."futures_multipliers" to "anon";

grant truncate on table "public"."futures_multipliers" to "anon";

grant update on table "public"."futures_multipliers" to "anon";

grant delete on table "public"."futures_multipliers" to "authenticated";

grant insert on table "public"."futures_multipliers" to "authenticated";

grant references on table "public"."futures_multipliers" to "authenticated";

grant select on table "public"."futures_multipliers" to "authenticated";

grant trigger on table "public"."futures_multipliers" to "authenticated";

grant truncate on table "public"."futures_multipliers" to "authenticated";

grant update on table "public"."futures_multipliers" to "authenticated";

grant delete on table "public"."futures_multipliers" to "service_role";

grant insert on table "public"."futures_multipliers" to "service_role";

grant references on table "public"."futures_multipliers" to "service_role";

grant select on table "public"."futures_multipliers" to "service_role";

grant trigger on table "public"."futures_multipliers" to "service_role";

grant truncate on table "public"."futures_multipliers" to "service_role";

grant update on table "public"."futures_multipliers" to "service_role";

grant delete on table "public"."imports" to "anon";

grant insert on table "public"."imports" to "anon";

grant references on table "public"."imports" to "anon";

grant select on table "public"."imports" to "anon";

grant trigger on table "public"."imports" to "anon";

grant truncate on table "public"."imports" to "anon";

grant update on table "public"."imports" to "anon";

grant delete on table "public"."imports" to "authenticated";

grant insert on table "public"."imports" to "authenticated";

grant references on table "public"."imports" to "authenticated";

grant select on table "public"."imports" to "authenticated";

grant trigger on table "public"."imports" to "authenticated";

grant truncate on table "public"."imports" to "authenticated";

grant update on table "public"."imports" to "authenticated";

grant delete on table "public"."imports" to "service_role";

grant insert on table "public"."imports" to "service_role";

grant references on table "public"."imports" to "service_role";

grant select on table "public"."imports" to "service_role";

grant trigger on table "public"."imports" to "service_role";

grant truncate on table "public"."imports" to "service_role";

grant update on table "public"."imports" to "service_role";

grant delete on table "public"."positions" to "anon";

grant insert on table "public"."positions" to "anon";

grant references on table "public"."positions" to "anon";

grant select on table "public"."positions" to "anon";

grant trigger on table "public"."positions" to "anon";

grant truncate on table "public"."positions" to "anon";

grant update on table "public"."positions" to "anon";

grant delete on table "public"."positions" to "authenticated";

grant insert on table "public"."positions" to "authenticated";

grant references on table "public"."positions" to "authenticated";

grant select on table "public"."positions" to "authenticated";

grant trigger on table "public"."positions" to "authenticated";

grant truncate on table "public"."positions" to "authenticated";

grant update on table "public"."positions" to "authenticated";

grant delete on table "public"."positions" to "service_role";

grant insert on table "public"."positions" to "service_role";

grant references on table "public"."positions" to "service_role";

grant select on table "public"."positions" to "service_role";

grant trigger on table "public"."positions" to "service_role";

grant truncate on table "public"."positions" to "service_role";

grant update on table "public"."positions" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

grant delete on table "public"."trade_history" to "anon";

grant insert on table "public"."trade_history" to "anon";

grant references on table "public"."trade_history" to "anon";

grant select on table "public"."trade_history" to "anon";

grant trigger on table "public"."trade_history" to "anon";

grant truncate on table "public"."trade_history" to "anon";

grant update on table "public"."trade_history" to "anon";

grant delete on table "public"."trade_history" to "authenticated";

grant insert on table "public"."trade_history" to "authenticated";

grant references on table "public"."trade_history" to "authenticated";

grant select on table "public"."trade_history" to "authenticated";

grant trigger on table "public"."trade_history" to "authenticated";

grant truncate on table "public"."trade_history" to "authenticated";

grant update on table "public"."trade_history" to "authenticated";

grant delete on table "public"."trade_history" to "service_role";

grant insert on table "public"."trade_history" to "service_role";

grant references on table "public"."trade_history" to "service_role";

grant select on table "public"."trade_history" to "service_role";

grant trigger on table "public"."trade_history" to "service_role";

grant truncate on table "public"."trade_history" to "service_role";

grant update on table "public"."trade_history" to "service_role";

grant delete on table "public"."trading_accounts" to "anon";

grant insert on table "public"."trading_accounts" to "anon";

grant references on table "public"."trading_accounts" to "anon";

grant select on table "public"."trading_accounts" to "anon";

grant trigger on table "public"."trading_accounts" to "anon";

grant truncate on table "public"."trading_accounts" to "anon";

grant update on table "public"."trading_accounts" to "anon";

grant delete on table "public"."trading_accounts" to "authenticated";

grant insert on table "public"."trading_accounts" to "authenticated";

grant references on table "public"."trading_accounts" to "authenticated";

grant select on table "public"."trading_accounts" to "authenticated";

grant trigger on table "public"."trading_accounts" to "authenticated";

grant truncate on table "public"."trading_accounts" to "authenticated";

grant update on table "public"."trading_accounts" to "authenticated";

grant delete on table "public"."trading_accounts" to "service_role";

grant insert on table "public"."trading_accounts" to "service_role";

grant references on table "public"."trading_accounts" to "service_role";

grant select on table "public"."trading_accounts" to "service_role";

grant trigger on table "public"."trading_accounts" to "service_role";

grant truncate on table "public"."trading_accounts" to "service_role";

grant update on table "public"."trading_accounts" to "service_role";

create policy "Allow read access to authenticated users"
on "public"."broker_connection_fields"
as permissive
for all
to authenticated
using (true);


create policy "Allow read access to authenticated users"
on "public"."brokers"
as permissive
for all
to authenticated
using (true);


create policy "Allow read access to authenticated users"
on "public"."currency_codes"
as permissive
for all
to authenticated
using (true);


create policy "Allow read access to authenticated users"
on "public"."futures_multipliers"
as permissive
for all
to authenticated
using (true);


create policy "Enable insert for users based on user_id"
on "public"."imports"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."imports"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can update own imports."
on "public"."imports"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Enable insert for users based on user_id"
on "public"."positions"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."positions"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Users can view their own subscription."
on "public"."subscriptions"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Enable insert for users based on user_id"
on "public"."trade_history"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can update own trades."
on "public"."trade_history"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Users can view their own trades."
on "public"."trade_history"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Enable insert for users based on user_id"
on "public"."trading_accounts"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can delete own trading_accounts."
on "public"."trading_accounts"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Users can update own trading_accounts."
on "public"."trading_accounts"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Users can view their own trading_accounts."
on "public"."trading_accounts"
as permissive
for select
to public
using ((auth.uid() = user_id));


CREATE TRIGGER process_import_trigger AFTER INSERT OR UPDATE ON public.imports FOR EACH ROW EXECUTE FUNCTION process_new_import();

CREATE TRIGGER check_trading_account_limit_trigger BEFORE INSERT ON public.trading_accounts FOR EACH ROW EXECUTE FUNCTION check_trading_account_limit();


