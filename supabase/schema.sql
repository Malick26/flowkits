-- Maillots Store (Supabase) schema
-- Run in Supabase SQL Editor.

create extension if not exists "pgcrypto";

-- Profiles for admin role
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents int not null,
  images jsonb not null default '[]'::jsonb,
  sizes text[] not null default array['S','M','L','XL'],
  active boolean not null default true
);

-- Neighborhoods (10 options with fees)
create table if not exists public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  fee_cents int not null
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_first_name text not null,
  customer_last_name text not null,
  phone text not null,
  neighborhood_id uuid not null references public.neighborhoods(id),
  neighborhood_name text not null,
  delivery_fee_cents int not null,
  subtotal_cents int not null,
  total_cents int not null,
  status text not null default 'new',
  payment_method text not null default 'cod'
);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null,
  product_name text not null,
  size text not null,
  qty int not null,
  unit_price_cents int not null,
  line_total_cents int not null
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.neighborhoods enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public read access to products & neighborhoods
drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
for select
to anon, authenticated
using (active = true);

drop policy if exists "public read neighborhoods" on public.neighborhoods;
create policy "public read neighborhoods" on public.neighborhoods
for select
to anon, authenticated
using (true);

-- Public insert orders (COD) + items
drop policy if exists "public create orders" on public.orders;
create policy "public create orders" on public.orders
for insert
to anon, authenticated
with check (true);

drop policy if exists "public create order_items" on public.order_items;
create policy "public create order_items" on public.order_items
for insert
to anon, authenticated
with check (true);

-- Admin read everything (either via profiles.role='admin')
drop policy if exists "admin read orders" on public.orders;
create policy "admin read orders" on public.orders
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "admin read order_items" on public.order_items;
create policy "admin read order_items" on public.order_items
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Profiles: user can read their own profile; admin can read all
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
for select
to authenticated
using (id = auth.uid() or role = 'admin');

-- Seed neighborhoods (example). Replace names/fees as needed.
insert into public.neighborhoods (name, fee_cents)
values
  ('Plateau', 150000),
  ('Médina', 200000),
  ('Point E', 250000),
  ('Almadies', 350000),
  ('Yoff', 300000),
  ('Sacré-Cœur', 250000),
  ('Ouakam', 300000),
  ('Parcelles', 350000),
  ('Pikine', 400000),
  ('Guédiawaye', 450000)
on conflict (name) do nothing;

