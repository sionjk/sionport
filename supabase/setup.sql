-- Run once in your project's Supabase SQL Editor. Safe to run again.
begin;
create table if not exists public.plot_points (
  id uuid primary key,
  visitor_id uuid not null,
  x double precision not null check (x >= 0 and x <= 1),
  y double precision not null check (y >= 0 and y <= 1),
  created_at timestamptz not null default now()
);
create index if not exists plot_points_visitor_time on public.plot_points(visitor_id, created_at desc);
create table if not exists public.plot_cells (
  x integer not null check (x between 0 and 55),
  y integer not null check (y between 0 and 27),
  n bigint not null default 1 check (n > 0),
  primary key (x,y)
);
alter table public.plot_points enable row level security;
alter table public.plot_cells enable row level security;
revoke all on public.plot_points from anon, authenticated;
revoke all on public.plot_cells from anon, authenticated;
grant select on public.plot_cells to anon, authenticated;
drop policy if exists "Anyone can view the distribution" on public.plot_cells;
create policy "Anyone can view the distribution" on public.plot_cells for select to anon, authenticated using (true);

-- Only this function can write: validate, serialize per visitor, rate limit,
-- and atomically store the point + increment its public cell. Idempotent retries.
create or replace function public.leave_point(p_id uuid, p_x double precision, p_y double precision)
returns void language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_x integer; v_y integer;
begin
  if v_uid is null then raise exception 'A visitor session is required'; end if;
  if p_id is null or p_x is null or p_y is null or not (p_x >= 0 and p_x <= 1 and p_y >= 0 and p_y <= 1) then
    raise exception 'Invalid point coordinates';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_uid::text, 0));
  if exists (select 1 from public.plot_points where id = p_id and visitor_id = v_uid) then return; end if;
  if exists (select 1 from public.plot_points where visitor_id = v_uid and created_at > pg_catalog.clock_timestamp() - interval '2 seconds') then
    raise exception 'Please wait a moment before leaving another point';
  end if;
  v_x := least(55, floor(p_x * 56)::integer);
  v_y := least(27, floor(p_y * 28)::integer);
  insert into public.plot_points(id,visitor_id,x,y,created_at) values(p_id,v_uid,p_x,p_y,pg_catalog.clock_timestamp());
  insert into public.plot_cells(x,y,n) values(v_x,v_y,1)
    on conflict(x,y) do update set n = public.plot_cells.n + 1;
end;
$$;
revoke all on function public.leave_point(uuid,double precision,double precision) from public, anon;
grant execute on function public.leave_point(uuid,double precision,double precision) to authenticated;
do $$ begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='plot_cells') then
    alter publication supabase_realtime add table public.plot_cells;
  end if;
end $$;
commit;
