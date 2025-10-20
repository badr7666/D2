
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sku text unique,
  category text,
  quantity integer not null default 0 check (quantity >= 0),
  min_threshold integer not null default 0 check (min_threshold >= 0),
  price numeric(12,2) not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists trg_items_updated_at on public.items;
create trigger trg_items_updated_at before update on public.items for each row execute procedure public.set_updated_at();
