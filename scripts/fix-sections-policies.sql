create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  content jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.sections enable row level security;

drop trigger if exists trg_sections_updated_at on public.sections;
create trigger trg_sections_updated_at
before update on public.sections
for each row execute function public.set_updated_at();

create index if not exists idx_sections_slug on public.sections(slug);

drop policy if exists "Authenticated users can read sections" on public.sections;
drop policy if exists "Authenticated users can insert sections" on public.sections;
drop policy if exists "Authenticated users can update sections" on public.sections;
drop policy if exists "Authenticated users can delete sections" on public.sections;
drop policy if exists "Admins select sections" on public.sections;
drop policy if exists "Admins insert sections" on public.sections;
drop policy if exists "Admins update sections" on public.sections;
drop policy if exists "Admins delete sections" on public.sections;

drop policy if exists "Allow public read sections" on public.sections;
create policy "Allow public read sections"
on public.sections
for select
using (true);

drop policy if exists "Admin can manage sections" on public.sections;
create policy "Admin can manage sections"
on public.sections
for all
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

