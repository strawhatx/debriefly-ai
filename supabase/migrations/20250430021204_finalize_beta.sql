create type "public"."trade_status" as enum ('DRAFT', 'PUBLISHED');

drop trigger if exists "update_insights_updated_at" on "public"."insights";

drop policy "Allow read access to authenticated users" on "public"."currency_codes";

drop policy "Enable read access for all users" on "public"."emotional_tags";

drop policy "Users can delete their own insights" on "public"."insights";

drop policy "Users can insert their own insights" on "public"."insights";

drop policy "Users can update their own insights" on "public"."insights";

drop policy "Users can view their own insights" on "public"."insights";

drop policy "Users can update own imports." on "public"."imports";

drop policy "Users can update own trades." on "public"."trade_history";

revoke delete on table "public"."currency_codes" from "anon";

revoke insert on table "public"."currency_codes" from "anon";

revoke references on table "public"."currency_codes" from "anon";

revoke select on table "public"."currency_codes" from "anon";

revoke trigger on table "public"."currency_codes" from "anon";

revoke truncate on table "public"."currency_codes" from "anon";

revoke update on table "public"."currency_codes" from "anon";

revoke delete on table "public"."currency_codes" from "authenticated";

revoke insert on table "public"."currency_codes" from "authenticated";

revoke references on table "public"."currency_codes" from "authenticated";

revoke select on table "public"."currency_codes" from "authenticated";

revoke trigger on table "public"."currency_codes" from "authenticated";

revoke truncate on table "public"."currency_codes" from "authenticated";

revoke update on table "public"."currency_codes" from "authenticated";

revoke delete on table "public"."currency_codes" from "service_role";

revoke insert on table "public"."currency_codes" from "service_role";

revoke references on table "public"."currency_codes" from "service_role";

revoke select on table "public"."currency_codes" from "service_role";

revoke trigger on table "public"."currency_codes" from "service_role";

revoke truncate on table "public"."currency_codes" from "service_role";

revoke update on table "public"."currency_codes" from "service_role";

revoke delete on table "public"."emotional_tags" from "anon";

revoke insert on table "public"."emotional_tags" from "anon";

revoke references on table "public"."emotional_tags" from "anon";

revoke select on table "public"."emotional_tags" from "anon";

revoke trigger on table "public"."emotional_tags" from "anon";

revoke truncate on table "public"."emotional_tags" from "anon";

revoke update on table "public"."emotional_tags" from "anon";

revoke delete on table "public"."emotional_tags" from "authenticated";

revoke insert on table "public"."emotional_tags" from "authenticated";

revoke references on table "public"."emotional_tags" from "authenticated";

revoke select on table "public"."emotional_tags" from "authenticated";

revoke trigger on table "public"."emotional_tags" from "authenticated";

revoke truncate on table "public"."emotional_tags" from "authenticated";

revoke update on table "public"."emotional_tags" from "authenticated";

revoke delete on table "public"."emotional_tags" from "service_role";

revoke insert on table "public"."emotional_tags" from "service_role";

revoke references on table "public"."emotional_tags" from "service_role";

revoke select on table "public"."emotional_tags" from "service_role";

revoke trigger on table "public"."emotional_tags" from "service_role";

revoke truncate on table "public"."emotional_tags" from "service_role";

revoke update on table "public"."emotional_tags" from "service_role";

revoke delete on table "public"."insights" from "anon";

revoke insert on table "public"."insights" from "anon";

revoke references on table "public"."insights" from "anon";

revoke select on table "public"."insights" from "anon";

revoke trigger on table "public"."insights" from "anon";

revoke truncate on table "public"."insights" from "anon";

revoke update on table "public"."insights" from "anon";

revoke delete on table "public"."insights" from "authenticated";

revoke insert on table "public"."insights" from "authenticated";

revoke references on table "public"."insights" from "authenticated";

revoke select on table "public"."insights" from "authenticated";

revoke trigger on table "public"."insights" from "authenticated";

revoke truncate on table "public"."insights" from "authenticated";

revoke update on table "public"."insights" from "authenticated";

revoke delete on table "public"."insights" from "service_role";

revoke insert on table "public"."insights" from "service_role";

revoke references on table "public"."insights" from "service_role";

revoke select on table "public"."insights" from "service_role";

revoke trigger on table "public"."insights" from "service_role";

revoke truncate on table "public"."insights" from "service_role";

revoke update on table "public"."insights" from "service_role";

alter table "public"."currency_codes" drop constraint "currency_codes_code_key";

alter table "public"."emotional_tags" drop constraint "emotional_tags_position_id_fkey";

alter table "public"."emotional_tags" drop constraint "unique_position";

alter table "public"."insights" drop constraint "insights_position_id_fkey";

alter table "public"."insights" drop constraint "insights_user_id_fkey";

drop function if exists "public"."get_unanalyzed_positions"(user_id_param uuid);

alter table "public"."currency_codes" drop constraint "currency_codes_pkey";

alter table "public"."emotional_tags" drop constraint "emotional_tags_pkey";

alter table "public"."insights" drop constraint "insights_pkey";

drop index if exists "public"."currency_codes_code_key";

drop index if exists "public"."currency_codes_pkey";

drop index if exists "public"."emotional_tags_pkey";

drop index if exists "public"."insights_pkey";

drop index if exists "public"."unique_position";

drop table "public"."currency_codes";

drop table "public"."emotional_tags";

drop table "public"."insights";

create table "public"."forex_rates" (
    "id" uuid not null default gen_random_uuid(),
    "base_currency" text,
    "quote_currency" text,
    "rate_date" date,
    "rate" numeric
);


alter table "public"."futures_multipliers" disable row level security;

alter table "public"."journal_entries" drop column "behavioral_score";

alter table "public"."journal_entries" drop column "reward";

alter table "public"."journal_entries" drop column "risk";

alter table "public"."journal_entries" drop column "strategy";

alter table "public"."positions" add column "reward" real;

alter table "public"."positions" add column "risk" smallint default '1'::smallint;

alter table "public"."positions" add column "score" real;

alter table "public"."positions" add column "state" trade_status default 'DRAFT'::trade_status;

alter table "public"."positions" add column "strategy" text;

alter table "public"."positions" add column "tags" jsonb default '[]'::jsonb;

alter table "public"."positions" alter column "closing_date" set not null;

alter table "public"."positions" alter column "fill_price" set not null;

alter table "public"."positions" alter column "pnl" set not null;

alter table "public"."positions" alter column "position_type" set not null;

alter table "public"."positions" alter column "quantity" set not null;

alter table "public"."positions" alter column "stop_price" set not null;

alter table "public"."positions" alter column "symbol" set not null;

alter table "public"."trade_analysis" add column "trading_account_id" uuid;

CREATE UNIQUE INDEX forex_rates_base_currency_quote_currency_rate_date_key ON public.forex_rates USING btree (base_currency, quote_currency, rate_date);

CREATE UNIQUE INDEX forex_rates_pkey ON public.forex_rates USING btree (id);

alter table "public"."forex_rates" add constraint "forex_rates_pkey" PRIMARY KEY using index "forex_rates_pkey";

alter table "public"."forex_rates" add constraint "forex_rates_base_currency_quote_currency_rate_date_key" UNIQUE using index "forex_rates_base_currency_quote_currency_rate_date_key";

alter table "public"."trade_analysis" add constraint "trade_analysis_trading_account_id_fkey" FOREIGN KEY (trading_account_id) REFERENCES trading_accounts(id) ON UPDATE CASCADE not valid;

alter table "public"."trade_analysis" validate constraint "trade_analysis_trading_account_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_unanalyzed_positions(user_id_param uuid, trading_acccount_id_param uuid)
 RETURNS TABLE(trade_data jsonb)
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN QUERY
  SELECT jsonb_build_object(
    'trade_day', DATE_TRUNC('day', p.entry_date),
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
  )
  FROM positions p
  LEFT JOIN trade_analysis a 
    ON a.session_date = DATE_TRUNC('day', p.entry_date)
    AND (trading_acccount_id_param IS NULL OR a.trading_account_id = trading_acccount_id_param)
  WHERE p.user_id = user_id_param
    AND (trading_acccount_id_param IS NULL OR p.trading_account_id = trading_acccount_id_param)
    AND a.session_date IS NULL
  GROUP BY DATE_TRUNC('day', p.entry_date)
  ORDER BY DATE_TRUNC('day', p.entry_date) DESC
  LIMIT 50;
END;$function$
;

CREATE OR REPLACE FUNCTION public.check_trading_account_limit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

grant delete on table "public"."forex_rates" to "anon";

grant insert on table "public"."forex_rates" to "anon";

grant references on table "public"."forex_rates" to "anon";

grant select on table "public"."forex_rates" to "anon";

grant trigger on table "public"."forex_rates" to "anon";

grant truncate on table "public"."forex_rates" to "anon";

grant update on table "public"."forex_rates" to "anon";

grant delete on table "public"."forex_rates" to "authenticated";

grant insert on table "public"."forex_rates" to "authenticated";

grant references on table "public"."forex_rates" to "authenticated";

grant select on table "public"."forex_rates" to "authenticated";

grant trigger on table "public"."forex_rates" to "authenticated";

grant truncate on table "public"."forex_rates" to "authenticated";

grant update on table "public"."forex_rates" to "authenticated";

grant delete on table "public"."forex_rates" to "service_role";

grant insert on table "public"."forex_rates" to "service_role";

grant references on table "public"."forex_rates" to "service_role";

grant select on table "public"."forex_rates" to "service_role";

grant trigger on table "public"."forex_rates" to "service_role";

grant truncate on table "public"."forex_rates" to "service_role";

grant update on table "public"."forex_rates" to "service_role";

create policy "Enable update for users based on user id"
on "public"."positions"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can update own imports."
on "public"."imports"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can update own trades."
on "public"."trade_history"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));



