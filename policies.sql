
alter table public.items enable row level security;
drop policy if exists "select own items" on public.items;
create policy "select own items" on public.items for select using (auth.uid() = user_id);
drop policy if exists "insert own items" on public.items;
create policy "insert own items" on public.items for insert with check (auth.uid() = user_id);
drop policy if exists "update own items" on public.items;
create policy "update own items" on public.items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "delete own items" on public.items;
create policy "delete own items" on public.items for delete using (auth.uid() = user_id);
