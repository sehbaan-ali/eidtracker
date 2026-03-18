-- Create orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number integer not null,
  customer_name text not null,
  phone_number text not null,

  full_mutton_savan integer default 0,
  half_mutton_savan integer default 0,
  full_chicken_savan integer default 0,
  half_chicken_savan integer default 0,
  extra_chicken numeric(10,1) default 0,
  extra_wattalpam numeric(10,1) default 0,

  -- Custom extras stored as JSONB array
  custom_extras jsonb default '[]'::jsonb,
  -- Example: [{"id": "uuid", "name": "Mutton Rolls", "quantity": 15, "unitPrice": 2.5, "subtotal": 37.5}]

  extra_notes text,
  total_amount numeric(10,2) not null,
  payment_status text not null check (payment_status in ('paid', 'pay-later')),
  amount_paid numeric(10,2) default 0,
  amount_remaining numeric(10,2) default 0,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  user_id uuid references auth.users(id) on delete cascade
);

-- Create indexes for fast search
create index if not exists orders_order_number_idx on orders(order_number);
create index if not exists orders_customer_name_idx on orders(customer_name);
create index if not exists orders_phone_number_idx on orders(phone_number);
create index if not exists orders_payment_status_idx on orders(payment_status);
create index if not exists orders_user_id_idx on orders(user_id);

-- Enable Row Level Security
alter table orders enable row level security;

-- Create RLS policies
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own orders"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own orders"
  on orders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own orders"
  on orders for delete
  using (auth.uid() = user_id);

-- Create settings table
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  pricing jsonb not null default '{"fullSavan": 89, "halfSavan": 48, "extraChicken": 16, "extraWattalpam": 16}'::jsonb,
  current_year integer not null default 2025,
  user_id uuid references auth.users(id) on delete cascade,
  updated_at timestamp with time zone default now(),

  unique(user_id)
);

-- Enable Row Level Security for settings
alter table settings enable row level security;

-- Create RLS policies for settings
create policy "Users can view their own settings"
  on settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on settings for update
  using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Create triggers for updated_at
create trigger update_orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at_column();

create trigger update_settings_updated_at
  before update on settings
  for each row
  execute function update_updated_at_column();
