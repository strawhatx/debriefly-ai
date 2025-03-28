drop policy "Enable delete for users based on user_id" on "public"."payment_methods";

drop policy "Enable insert for users based on user_id" on "public"."payment_methods";

drop policy "Enable users to view their own data only" on "public"."payment_methods";

drop policy "Users can update own trading_accounts." on "public"."trading_accounts";

revoke delete on table "public"."billing_history" from "anon";

revoke insert on table "public"."billing_history" from "anon";

revoke references on table "public"."billing_history" from "anon";

revoke select on table "public"."billing_history" from "anon";

revoke trigger on table "public"."billing_history" from "anon";

revoke truncate on table "public"."billing_history" from "anon";

revoke update on table "public"."billing_history" from "anon";

revoke delete on table "public"."billing_history" from "authenticated";

revoke insert on table "public"."billing_history" from "authenticated";

revoke references on table "public"."billing_history" from "authenticated";

revoke select on table "public"."billing_history" from "authenticated";

revoke trigger on table "public"."billing_history" from "authenticated";

revoke truncate on table "public"."billing_history" from "authenticated";

revoke update on table "public"."billing_history" from "authenticated";

revoke delete on table "public"."billing_history" from "service_role";

revoke insert on table "public"."billing_history" from "service_role";

revoke references on table "public"."billing_history" from "service_role";

revoke select on table "public"."billing_history" from "service_role";

revoke trigger on table "public"."billing_history" from "service_role";

revoke truncate on table "public"."billing_history" from "service_role";

revoke update on table "public"."billing_history" from "service_role";

revoke delete on table "public"."payment_methods" from "anon";

revoke insert on table "public"."payment_methods" from "anon";

revoke references on table "public"."payment_methods" from "anon";

revoke select on table "public"."payment_methods" from "anon";

revoke trigger on table "public"."payment_methods" from "anon";

revoke truncate on table "public"."payment_methods" from "anon";

revoke update on table "public"."payment_methods" from "anon";

revoke delete on table "public"."payment_methods" from "authenticated";

revoke insert on table "public"."payment_methods" from "authenticated";

revoke references on table "public"."payment_methods" from "authenticated";

revoke select on table "public"."payment_methods" from "authenticated";

revoke trigger on table "public"."payment_methods" from "authenticated";

revoke truncate on table "public"."payment_methods" from "authenticated";

revoke update on table "public"."payment_methods" from "authenticated";

revoke delete on table "public"."payment_methods" from "service_role";

revoke insert on table "public"."payment_methods" from "service_role";

revoke references on table "public"."payment_methods" from "service_role";

revoke select on table "public"."payment_methods" from "service_role";

revoke trigger on table "public"."payment_methods" from "service_role";

revoke truncate on table "public"."payment_methods" from "service_role";

revoke update on table "public"."payment_methods" from "service_role";

revoke delete on table "public"."subscription_plans" from "anon";

revoke insert on table "public"."subscription_plans" from "anon";

revoke references on table "public"."subscription_plans" from "anon";

revoke select on table "public"."subscription_plans" from "anon";

revoke trigger on table "public"."subscription_plans" from "anon";

revoke truncate on table "public"."subscription_plans" from "anon";

revoke update on table "public"."subscription_plans" from "anon";

revoke delete on table "public"."subscription_plans" from "authenticated";

revoke insert on table "public"."subscription_plans" from "authenticated";

revoke references on table "public"."subscription_plans" from "authenticated";

revoke select on table "public"."subscription_plans" from "authenticated";

revoke trigger on table "public"."subscription_plans" from "authenticated";

revoke truncate on table "public"."subscription_plans" from "authenticated";

revoke update on table "public"."subscription_plans" from "authenticated";

revoke delete on table "public"."subscription_plans" from "service_role";

revoke insert on table "public"."subscription_plans" from "service_role";

revoke references on table "public"."subscription_plans" from "service_role";

revoke select on table "public"."subscription_plans" from "service_role";

revoke trigger on table "public"."subscription_plans" from "service_role";

revoke truncate on table "public"."subscription_plans" from "service_role";

revoke update on table "public"."subscription_plans" from "service_role";

alter table "public"."billing_history" drop constraint "billing_history_user_id_fkey";

alter table "public"."payment_methods" drop constraint "payment_methods_user_id_fkey";

alter table "public"."subscription_plans" drop constraint "subscription_plans_stripe_price_id_key";

alter table "public"."trade_history" drop constraint "trades_side_check";

alter table "public"."billing_history" drop constraint "billing_history_pkey";

alter table "public"."payment_methods" drop constraint "payment_methods_pkey";

alter table "public"."subscription_plans" drop constraint "subscription_plans_pkey";

drop index if exists "public"."billing_history_pkey";

drop index if exists "public"."payment_methods_pkey";

drop index if exists "public"."subscription_plans_pkey";

drop index if exists "public"."subscription_plans_stripe_price_id_key";

drop table "public"."billing_history";

drop table "public"."payment_methods";

drop table "public"."subscription_plans";

create table "public"."emotional_tags" (
    "id" uuid not null default gen_random_uuid(),
    "position_id" uuid,
    "tags" jsonb default '[]'::jsonb
);


alter table "public"."emotional_tags" enable row level security;

create table "public"."journal_entries" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "position_id" uuid,
    "entry_text" text not null,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "strategy" text,
    "risk" smallint default '1'::smallint,
    "reward" real default '1'::real,
    "behavioral_score" smallint
);


alter table "public"."journal_entries" enable row level security;

create table "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "stripe_subscription_id" text not null,
    "stripe_price_id" text not null,
    "status" text not null,
    "current_period_end" timestamp without time zone,
    "created_at" timestamp without time zone default now()
);


alter table "public"."subscriptions" enable row level security;

create table "public"."trade_analysis" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "session_date" date not null,
    "analysis" json,
    "created_at" timestamp without time zone not null,
    "model" text
);


alter table "public"."futures_multipliers" drop column "multiplier";

alter table "public"."futures_multipliers" add column "point_value" numeric not null;

alter table "public"."futures_multipliers" add column "tick_size" double precision;

alter table "public"."futures_multipliers" add column "tick_value" numeric;

alter table "public"."positions" drop column "multiplier";

alter table "public"."profiles" add column "roles" text not null default '''trader''::text'::text;

alter table "public"."trade_history" alter column "external_id" set data type text using "external_id"::text;

alter table "public"."trade_history" alter column "order_type" set data type text using "order_type"::text;

alter table "public"."trade_history" alter column "side" set data type text using "side"::text;

alter table "public"."trade_history" alter column "status" set data type text using "status"::text;

alter table "public"."trade_history" alter column "symbol" set data type text using "symbol"::text;

alter table "public"."trading_accounts" drop column "profit_calculation_method";

alter table "public"."trading_accounts" add column "market" text;

drop sequence if exists "public"."subscription_plans_id_seq";

CREATE UNIQUE INDEX emotional_tags_pkey ON public.emotional_tags USING btree (id);

CREATE UNIQUE INDEX journal_entries_pkey ON public.journal_entries USING btree (id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX subscriptions_stripe_subscription_id_key ON public.subscriptions USING btree (stripe_subscription_id);

CREATE UNIQUE INDEX trade_behavior_analysis_pkey ON public.trade_analysis USING btree (id);

CREATE UNIQUE INDEX unique_position ON public.emotional_tags USING btree (position_id);

CREATE UNIQUE INDEX unique_position_id ON public.journal_entries USING btree (position_id);

alter table "public"."emotional_tags" add constraint "emotional_tags_pkey" PRIMARY KEY using index "emotional_tags_pkey";

alter table "public"."journal_entries" add constraint "journal_entries_pkey" PRIMARY KEY using index "journal_entries_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."trade_analysis" add constraint "trade_behavior_analysis_pkey" PRIMARY KEY using index "trade_behavior_analysis_pkey";

alter table "public"."emotional_tags" add constraint "emotional_tags_position_id_fkey" FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE not valid;

alter table "public"."emotional_tags" validate constraint "emotional_tags_position_id_fkey";

alter table "public"."emotional_tags" add constraint "unique_position" UNIQUE using index "unique_position";

alter table "public"."journal_entries" add constraint "journal_entries_position_id_fkey" FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE not valid;

alter table "public"."journal_entries" validate constraint "journal_entries_position_id_fkey";

alter table "public"."journal_entries" add constraint "journal_entries_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."journal_entries" validate constraint "journal_entries_user_id_fkey";

alter table "public"."journal_entries" add constraint "unique_position_id" UNIQUE using index "unique_position_id";

alter table "public"."subscriptions" add constraint "subscriptions_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'canceled'::text, 'past_due'::text]))) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_status_check";

alter table "public"."subscriptions" add constraint "subscriptions_stripe_subscription_id_key" UNIQUE using index "subscriptions_stripe_subscription_id_key";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."trade_analysis" add constraint "trade_behavior_analysis_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."trade_analysis" validate constraint "trade_behavior_analysis_user_id_fkey";

alter table "public"."trade_history" add constraint "trades_side_check" CHECK ((side = ANY (ARRAY[('BUY'::character varying)::text, ('SELL'::character varying)::text]))) not valid;

alter table "public"."trade_history" validate constraint "trades_side_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_position_history(pos_id uuid)
 RETURNS TABLE(account_name text, symbol text, order_type text, side text, fill_price numeric, stop_price numeric, quantity numeric, entry_date timestamp with time zone, closing_date timestamp with time zone, fees numeric, status text, order_id text, leverage numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_unanalyzed_positions(user_id_param uuid)
 RETURNS SETOF jsonb
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT jsonb_build_object(
    'trade_day', trade_day,
    'trades', trades
  )
  FROM (
    SELECT 
      DATE_TRUNC('day', p.entry_date) AS trade_day,
      array_agg(
        json_build_object(
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
          'strategy', je.strategy,
          'risk_reward', (je.risk || ':' || je.reward),
          'emotional_tags', et.tags
        )
      ) AS trades
    FROM positions p
    LEFT JOIN trade_analysis a ON DATE_TRUNC('day', p.entry_date) = a.session_date
    LEFT JOIN journal_entries je ON p.id = je.position_id
    LEFT JOIN emotional_tags et ON p.id = et.position_id
    WHERE 
      p.user_id = user_id_param 
      AND a.session_date IS NULL
    GROUP BY trade_day
    ORDER BY trade_day DESC
    LIMIT 50
  ) sub;
END;
$function$
;

grant delete on table "public"."emotional_tags" to "anon";

grant insert on table "public"."emotional_tags" to "anon";

grant references on table "public"."emotional_tags" to "anon";

grant select on table "public"."emotional_tags" to "anon";

grant trigger on table "public"."emotional_tags" to "anon";

grant truncate on table "public"."emotional_tags" to "anon";

grant update on table "public"."emotional_tags" to "anon";

grant delete on table "public"."emotional_tags" to "authenticated";

grant insert on table "public"."emotional_tags" to "authenticated";

grant references on table "public"."emotional_tags" to "authenticated";

grant select on table "public"."emotional_tags" to "authenticated";

grant trigger on table "public"."emotional_tags" to "authenticated";

grant truncate on table "public"."emotional_tags" to "authenticated";

grant update on table "public"."emotional_tags" to "authenticated";

grant delete on table "public"."emotional_tags" to "service_role";

grant insert on table "public"."emotional_tags" to "service_role";

grant references on table "public"."emotional_tags" to "service_role";

grant select on table "public"."emotional_tags" to "service_role";

grant trigger on table "public"."emotional_tags" to "service_role";

grant truncate on table "public"."emotional_tags" to "service_role";

grant update on table "public"."emotional_tags" to "service_role";

grant delete on table "public"."journal_entries" to "anon";

grant insert on table "public"."journal_entries" to "anon";

grant references on table "public"."journal_entries" to "anon";

grant select on table "public"."journal_entries" to "anon";

grant trigger on table "public"."journal_entries" to "anon";

grant truncate on table "public"."journal_entries" to "anon";

grant update on table "public"."journal_entries" to "anon";

grant delete on table "public"."journal_entries" to "authenticated";

grant insert on table "public"."journal_entries" to "authenticated";

grant references on table "public"."journal_entries" to "authenticated";

grant select on table "public"."journal_entries" to "authenticated";

grant trigger on table "public"."journal_entries" to "authenticated";

grant truncate on table "public"."journal_entries" to "authenticated";

grant update on table "public"."journal_entries" to "authenticated";

grant delete on table "public"."journal_entries" to "service_role";

grant insert on table "public"."journal_entries" to "service_role";

grant references on table "public"."journal_entries" to "service_role";

grant select on table "public"."journal_entries" to "service_role";

grant trigger on table "public"."journal_entries" to "service_role";

grant truncate on table "public"."journal_entries" to "service_role";

grant update on table "public"."journal_entries" to "service_role";

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

grant delete on table "public"."trade_analysis" to "anon";

grant insert on table "public"."trade_analysis" to "anon";

grant references on table "public"."trade_analysis" to "anon";

grant select on table "public"."trade_analysis" to "anon";

grant trigger on table "public"."trade_analysis" to "anon";

grant truncate on table "public"."trade_analysis" to "anon";

grant update on table "public"."trade_analysis" to "anon";

grant delete on table "public"."trade_analysis" to "authenticated";

grant insert on table "public"."trade_analysis" to "authenticated";

grant references on table "public"."trade_analysis" to "authenticated";

grant select on table "public"."trade_analysis" to "authenticated";

grant trigger on table "public"."trade_analysis" to "authenticated";

grant truncate on table "public"."trade_analysis" to "authenticated";

grant update on table "public"."trade_analysis" to "authenticated";

grant delete on table "public"."trade_analysis" to "service_role";

grant insert on table "public"."trade_analysis" to "service_role";

grant references on table "public"."trade_analysis" to "service_role";

grant select on table "public"."trade_analysis" to "service_role";

grant trigger on table "public"."trade_analysis" to "service_role";

grant truncate on table "public"."trade_analysis" to "service_role";

grant update on table "public"."trade_analysis" to "service_role";

create policy "Enable read access for all users"
on "public"."emotional_tags"
as permissive
for all
to authenticated
using (true);


create policy "Enable users to view their own data only"
on "public"."journal_entries"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can insert their own journal entry."
on "public"."journal_entries"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can update own journal entry."
on "public"."journal_entries"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."subscriptions"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can insert their own subscription."
on "public"."subscriptions"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can update own subscription."
on "public"."subscriptions"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can update own trading_accounts."
on "public"."trading_accounts"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));



