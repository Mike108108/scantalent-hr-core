-- ScanTalent HR Core — initial schema
-- Run in a fresh Supabase project SQL Editor

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Returns true when the current user owns the company.
create or replace function public.is_company_owner(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.hr_companies c
    where c.id = target_company_id
      and c.owner_user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- hr_companies
-- ---------------------------------------------------------------------------

create table public.hr_companies (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index hr_companies_owner_user_id_idx on public.hr_companies (owner_user_id);

create trigger hr_companies_set_updated_at
before update on public.hr_companies
for each row execute function public.set_updated_at();

alter table public.hr_companies enable row level security;

create policy "Company owners can select own companies"
on public.hr_companies
for select
using (owner_user_id = auth.uid());

create policy "Company owners can insert own companies"
on public.hr_companies
for insert
with check (owner_user_id = auth.uid());

create policy "Company owners can update own companies"
on public.hr_companies
for update
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());

create policy "Company owners can delete own companies"
on public.hr_companies
for delete
using (owner_user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- hr_candidates
-- ---------------------------------------------------------------------------

create table public.hr_candidates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.hr_companies (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  birth_date date,
  birth_time time,
  birth_place text,
  birth_timezone text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index hr_candidates_company_id_idx on public.hr_candidates (company_id);
create index hr_candidates_email_idx on public.hr_candidates (email);

create trigger hr_candidates_set_updated_at
before update on public.hr_candidates
for each row execute function public.set_updated_at();

alter table public.hr_candidates enable row level security;

create policy "Company owners can manage candidates"
on public.hr_candidates
for all
using (public.is_company_owner(company_id))
with check (public.is_company_owner(company_id));

-- ---------------------------------------------------------------------------
-- hr_candidate_charts
-- ---------------------------------------------------------------------------

create table public.hr_candidate_charts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.hr_companies (id) on delete cascade,
  candidate_id uuid not null references public.hr_candidates (id) on delete cascade,
  input_hash text,
  chart_source text,
  raw_chart_data jsonb,
  normalized_chart_data jsonb,
  calculated_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index hr_candidate_charts_company_id_idx on public.hr_candidate_charts (company_id);
create index hr_candidate_charts_candidate_id_idx on public.hr_candidate_charts (candidate_id);
create index hr_candidate_charts_input_hash_idx on public.hr_candidate_charts (input_hash);

create trigger hr_candidate_charts_set_updated_at
before update on public.hr_candidate_charts
for each row execute function public.set_updated_at();

alter table public.hr_candidate_charts enable row level security;

create policy "Company owners can manage candidate charts"
on public.hr_candidate_charts
for all
using (public.is_company_owner(company_id))
with check (public.is_company_owner(company_id));

-- ---------------------------------------------------------------------------
-- hr_candidate_chart_elements
-- ---------------------------------------------------------------------------

create table public.hr_candidate_chart_elements (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.hr_companies (id) on delete cascade,
  candidate_id uuid not null references public.hr_candidates (id) on delete cascade,
  chart_id uuid not null references public.hr_candidate_charts (id) on delete cascade,
  element_kind text not null,
  element_key text not null,
  element_label text,
  element_value text,
  side text,
  planet text,
  gate text,
  line text,
  center text,
  channel text,
  source_path text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index hr_candidate_chart_elements_company_id_idx
  on public.hr_candidate_chart_elements (company_id);
create index hr_candidate_chart_elements_candidate_id_idx
  on public.hr_candidate_chart_elements (candidate_id);
create index hr_candidate_chart_elements_chart_id_idx
  on public.hr_candidate_chart_elements (chart_id);
create index hr_candidate_chart_elements_kind_key_idx
  on public.hr_candidate_chart_elements (element_kind, element_key);

alter table public.hr_candidate_chart_elements enable row level security;

create policy "Company owners can manage chart elements"
on public.hr_candidate_chart_elements
for all
using (public.is_company_owner(company_id))
with check (public.is_company_owner(company_id));

-- ---------------------------------------------------------------------------
-- hd_reference_interpretations
-- ---------------------------------------------------------------------------

create table public.hd_reference_interpretations (
  id uuid primary key default gen_random_uuid(),
  element_kind text not null,
  element_key text not null,
  element_label text,
  language text not null default 'ru',
  version text not null default 'v1',
  classic_markdown text,
  hr_translation_markdown text,
  pro_markdown text,
  talent_hints jsonb not null default '[]'::jsonb,
  risk_hints jsonb not null default '[]'::jsonb,
  management_hints jsonb not null default '[]'::jsonb,
  environment_hints jsonb not null default '[]'::jsonb,
  limitations jsonb not null default '[]'::jsonb,
  source_quality text not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index hd_reference_interpretations_unique_idx
  on public.hd_reference_interpretations (element_kind, element_key, language, version);

create trigger hd_reference_interpretations_set_updated_at
before update on public.hd_reference_interpretations
for each row execute function public.set_updated_at();

alter table public.hd_reference_interpretations enable row level security;

create policy "Authenticated users can read reference interpretations"
on public.hd_reference_interpretations
for select
to authenticated
using (true);

-- ---------------------------------------------------------------------------
-- hr_layer_definitions
-- ---------------------------------------------------------------------------

create table public.hr_layer_definitions (
  id uuid primary key default gen_random_uuid(),
  layer_key text unique not null,
  layer_title text not null,
  description text,
  required_element_kinds jsonb not null default '[]'::jsonb,
  optional_element_kinds jsonb not null default '[]'::jsonb,
  prompt_policy jsonb not null default '{}'::jsonb,
  ui_priority int not null default 100,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger hr_layer_definitions_set_updated_at
before update on public.hr_layer_definitions
for each row execute function public.set_updated_at();

alter table public.hr_layer_definitions enable row level security;

create policy "Authenticated users can read layer definitions"
on public.hr_layer_definitions
for select
to authenticated
using (true);

-- ---------------------------------------------------------------------------
-- hr_candidate_layer_reports
-- ---------------------------------------------------------------------------

create table public.hr_candidate_layer_reports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.hr_companies (id) on delete cascade,
  candidate_id uuid not null references public.hr_candidates (id) on delete cascade,
  chart_id uuid not null references public.hr_candidate_charts (id) on delete cascade,
  layer_key text not null,
  layer_title text,
  status text not null default 'draft',
  input_bundle_json jsonb not null default '{}'::jsonb,
  content_json jsonb not null default '{}'::jsonb,
  base_markdown text,
  pro_markdown text,
  summary_for_synthesis jsonb not null default '{}'::jsonb,
  evidence_json jsonb not null default '{}'::jsonb,
  quality_flags jsonb not null default '[]'::jsonb,
  model text,
  usage_json jsonb not null default '{}'::jsonb,
  estimated_cost_usd numeric,
  generation_error text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index hr_candidate_layer_reports_company_id_idx
  on public.hr_candidate_layer_reports (company_id);
create index hr_candidate_layer_reports_candidate_id_idx
  on public.hr_candidate_layer_reports (candidate_id);
create index hr_candidate_layer_reports_chart_id_idx
  on public.hr_candidate_layer_reports (chart_id);
create index hr_candidate_layer_reports_layer_key_idx
  on public.hr_candidate_layer_reports (layer_key);

create trigger hr_candidate_layer_reports_set_updated_at
before update on public.hr_candidate_layer_reports
for each row execute function public.set_updated_at();

alter table public.hr_candidate_layer_reports enable row level security;

create policy "Company owners can manage layer reports"
on public.hr_candidate_layer_reports
for all
using (public.is_company_owner(company_id))
with check (public.is_company_owner(company_id));

-- ---------------------------------------------------------------------------
-- hr_candidate_talent_maps
-- ---------------------------------------------------------------------------

create table public.hr_candidate_talent_maps (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.hr_companies (id) on delete cascade,
  candidate_id uuid not null references public.hr_candidates (id) on delete cascade,
  chart_id uuid references public.hr_candidate_charts (id) on delete set null,
  status text not null default 'draft',
  content_json jsonb not null default '{}'::jsonb,
  source_layer_report_ids uuid[] not null default '{}',
  model text,
  usage_json jsonb not null default '{}'::jsonb,
  estimated_cost_usd numeric,
  generation_error text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index hr_candidate_talent_maps_company_id_idx
  on public.hr_candidate_talent_maps (company_id);
create index hr_candidate_talent_maps_candidate_id_idx
  on public.hr_candidate_talent_maps (candidate_id);
create index hr_candidate_talent_maps_chart_id_idx
  on public.hr_candidate_talent_maps (chart_id);

create trigger hr_candidate_talent_maps_set_updated_at
before update on public.hr_candidate_talent_maps
for each row execute function public.set_updated_at();

alter table public.hr_candidate_talent_maps enable row level security;

create policy "Company owners can manage talent maps"
on public.hr_candidate_talent_maps
for all
using (public.is_company_owner(company_id))
with check (public.is_company_owner(company_id));
