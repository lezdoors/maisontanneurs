-- Perle de l'Atlas -- Supabase Schema
-- Run this SQL in the Supabase dashboard SQL editor
-- Project: unsenfjlqqqjibbnbpur (atlas akal)

-- Craftsmen
create table if not exists craftsmen (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text default 'Marrakech',
  specialty text,
  bio text,
  contact_info jsonb default '{}',
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  price integer not null,
  images text[] default '{}',
  category text not null,
  dimensions jsonb default '{}',
  weight_lbs decimal,
  materials text[] default '{}',
  craftsman_id uuid references craftsmen(id),
  available_quantity integer default 1,
  status text default 'available' check (status in ('available', 'sold', 'reserved')),
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_status on products(status);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  sales_channel text default 'direct' check (sales_channel in ('direct', 'etsy')),
  stripe_session_id text,
  etsy_order_id text,
  customer_email text not null,
  customer_name text not null,
  shipping_address jsonb default '{}',
  items jsonb not null default '[]',
  subtotal integer not null default 0,
  shipping_cost integer not null default 0,
  total integer not null default 0,
  status text default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered')),
  tracking_number text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Admin users
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  role text default 'admin' check (role in ('admin', 'viewer')),
  created_at timestamptz default now()
);

-- RLS policies
alter table products enable row level security;
alter table orders enable row level security;
alter table craftsmen enable row level security;
alter table admin_users enable row level security;

-- Public read for products and craftsmen
create policy "Products are publicly readable" on products for select using (true);
create policy "Craftsmen are publicly readable" on craftsmen for select using (true);

-- Orders and admin_users are not publicly readable (admin uses service role)
create policy "Orders not publicly readable" on orders for select using (false);
create policy "Admin users not publicly readable" on admin_users for select using (false);
