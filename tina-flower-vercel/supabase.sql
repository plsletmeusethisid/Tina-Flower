-- Run in Supabase SQL Editor if using SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
-- Inquiries are inserted only from the Vercel server with the service-role key.
create table if not exists public.floral_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  occasion text not null,
  category text not null,
  product text,
  desired_date text,
  budget text not null,
  instructions text not null,
  locale text not null check (locale in ('en','ko')),
  created_at timestamptz not null default now()
);
alter table public.floral_inquiries enable row level security;
-- No public insert/read policy: the API uses a server-only service-role key.
