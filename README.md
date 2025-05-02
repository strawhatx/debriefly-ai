# Welcome Debreifly.app

## Project info

TBD

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Netlify](https://app.netlify.com) and click on Share -> Publish.

## Dev Info

Start: supabase start
Stop: supabase stop
Login: supabase login

## Run Edge Functions: 
supabase functions serve --env-file supabase/.env

## Debug Edge Functions: 
- supabase functions serve stripe-subscriptions-webhook --env-file supabase/.env --inspect-mode brk
- supabase functions serve ai-analysis --env-file supabase/.env --inspect-mode brk
- supabase functions serve payments --env-file supabase/.env --inspect-mode brk

## Migrations
 - supabase db diff --use-migra -f [migration name]