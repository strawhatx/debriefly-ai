create sequence "public"."subscription_plans_id_seq";

drop policy "Users can view their own subscription." on "public"."subscriptions";

drop policy "Users can view their own trades." on "public"."trade_history";

revoke delete on table "public"."subscriptions" from "anon";

revoke insert on table "public"."subscriptions" from "anon";

revoke references on table "public"."subscriptions" from "anon";

revoke select on table "public"."subscriptions" from "anon";

revoke trigger on table "public"."subscriptions" from "anon";

revoke truncate on table "public"."subscriptions" from "anon";

revoke update on table "public"."subscriptions" from "anon";

revoke delete on table "public"."subscriptions" from "authenticated";

revoke insert on table "public"."subscriptions" from "authenticated";

revoke references on table "public"."subscriptions" from "authenticated";

revoke select on table "public"."subscriptions" from "authenticated";

revoke trigger on table "public"."subscriptions" from "authenticated";

revoke truncate on table "public"."subscriptions" from "authenticated";

revoke update on table "public"."subscriptions" from "authenticated";

revoke delete on table "public"."subscriptions" from "service_role";

revoke insert on table "public"."subscriptions" from "service_role";

revoke references on table "public"."subscriptions" from "service_role";

revoke select on table "public"."subscriptions" from "service_role";

revoke trigger on table "public"."subscriptions" from "service_role";

revoke truncate on table "public"."subscriptions" from "service_role";

revoke update on table "public"."subscriptions" from "service_role";

alter table "public"."subscriptions" drop constraint "subscriptions_user_id_fkey1";

alter table "public"."subscriptions" drop constraint "subscriptions_user_id_key";

drop function if exists "public"."handle_new_user_subscription"();

alter table "public"."subscriptions" drop constraint "subscriptions_pkey";

drop index if exists "public"."subscriptions_pkey";

drop index if exists "public"."subscriptions_user_id_key";

drop table "public"."subscriptions";

create table "public"."subscription_plans" (
    "id" integer not null default nextval('subscription_plans_id_seq'::regclass),
    "name" text not null,
    "stripe_price_id" text not null,
    "monthly_price" integer not null
);


alter table "public"."payment_methods" add column "brand" text;

alter table "public"."payment_methods" add column "exp_month" smallint;

alter table "public"."payment_methods" add column "exp_year" smallint;

alter table "public"."payment_methods" add column "last_4" integer;

alter table "public"."payment_methods" enable row level security;

alter table "public"."positions" alter column "leverage" set default '0'::double precision;

alter table "public"."profiles" add column "stripe_customer_id" text;

alter sequence "public"."subscription_plans_id_seq" owned by "public"."subscription_plans"."id";

CREATE UNIQUE INDEX subscription_plans_pkey ON public.subscription_plans USING btree (id);

CREATE UNIQUE INDEX subscription_plans_stripe_price_id_key ON public.subscription_plans USING btree (stripe_price_id);

alter table "public"."subscription_plans" add constraint "subscription_plans_pkey" PRIMARY KEY using index "subscription_plans_pkey";

alter table "public"."subscription_plans" add constraint "subscription_plans_stripe_price_id_key" UNIQUE using index "subscription_plans_stripe_price_id_key";

grant delete on table "public"."subscription_plans" to "anon";

grant insert on table "public"."subscription_plans" to "anon";

grant references on table "public"."subscription_plans" to "anon";

grant select on table "public"."subscription_plans" to "anon";

grant trigger on table "public"."subscription_plans" to "anon";

grant truncate on table "public"."subscription_plans" to "anon";

grant update on table "public"."subscription_plans" to "anon";

grant delete on table "public"."subscription_plans" to "authenticated";

grant insert on table "public"."subscription_plans" to "authenticated";

grant references on table "public"."subscription_plans" to "authenticated";

grant select on table "public"."subscription_plans" to "authenticated";

grant trigger on table "public"."subscription_plans" to "authenticated";

grant truncate on table "public"."subscription_plans" to "authenticated";

grant update on table "public"."subscription_plans" to "authenticated";

grant delete on table "public"."subscription_plans" to "service_role";

grant insert on table "public"."subscription_plans" to "service_role";

grant references on table "public"."subscription_plans" to "service_role";

grant select on table "public"."subscription_plans" to "service_role";

grant trigger on table "public"."subscription_plans" to "service_role";

grant truncate on table "public"."subscription_plans" to "service_role";

grant update on table "public"."subscription_plans" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."payment_methods"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."payment_methods"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."payment_methods"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."trade_history"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



