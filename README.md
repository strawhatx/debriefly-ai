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
- Supabase/Posgres SQL

## How can I deploy this project?

TBD

## Dev Info

Start: supabase start
Stop: supabase stop
Login: supabase login

## Run Edge Functions: 
supabase functions serve --env-file supabase/.env

## Debug Edge Functions: 
- supabase functions serve [folder] --env-file supabase/.env --inspect-mode brk

- supabase functions serve ai-analysis --env-file supabase/.env --inspect-mode brk

## Run Worker-Service
 - in the background: [docker-compose -f docker-compose.dev.yml up -d]
 - with the logs: [docker-compose -f docker-compose.dev.yml logs -f]
 - stop: [docker-compose -f docker-compose.dev.yml down]

## Migrations
 - supabase db diff --use-migra -f [migration name]
 - TODO: we need to script out the tables and base data from the db
