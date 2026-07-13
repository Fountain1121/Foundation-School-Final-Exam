-- ============================================================
-- Foundation School Examination — Supabase setup
-- Run this once in your Supabase project: SQL Editor → New query
-- → paste all of this → Run.
-- ============================================================

-- 1. Table of allowed index numbers. You fill this in yourself.
create table if not exists allowed_students (
  student_id text primary key,
  full_name text,
  has_submitted boolean not null default false
);

-- 2. Table where finished exams land.
create table if not exists submissions (
  id bigint generated always as identity primary key,
  student_id text not null references allowed_students(student_id),
  full_name text,
  section_a jsonb not null default '{}'::jsonb,
  section_b jsonb not null default '{}'::jsonb,
  essay_choices jsonb not null default '[]'::jsonb,
  section_c jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  submitted_at timestamptz not null default now(),
  marks_awarded numeric,
  marker_notes text,
  graded boolean not null default false
);

-- 3. When a submission comes in, automatically lock that index number
--    so it can't be used to take the exam again.
create or replace function mark_student_submitted()
returns trigger as $$
begin
  update allowed_students
  set has_submitted = true
  where student_id = new.student_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_mark_submitted on submissions;
create trigger trg_mark_submitted
  after insert on submissions
  for each row execute function mark_student_submitted();

-- 4. Row Level Security.
alter table allowed_students enable row level security;
alter table submissions enable row level security;

-- Students (using the public anon key) need to:
--   - look up their own ID to log in
--   - insert their own submission once
-- The marker dashboard also uses the anon key to read submissions,
-- gated only by the ADMIN_PASSCODE in js/config.js. If you want
-- real server-side security for the marker view instead of a
-- passcode, see the README's "Locking down the admin view" note.

drop policy if exists "anyone can check an index number" on allowed_students;
create policy "anyone can check an index number"
  on allowed_students for select
  using (true);

drop policy if exists "anyone can insert a submission" on submissions;
create policy "anyone can insert a submission"
  on submissions for insert
  with check (true);

drop policy if exists "anyone can read submissions" on submissions;
create policy "anyone can read submissions"
  on submissions for select
  using (true);

drop policy if exists "anyone can update marks" on submissions;
create policy "anyone can update marks"
  on submissions for update
  using (true);

-- ============================================================
-- 5. Load your students. Edit and run this block with your real
--    list (add as many rows as you need). Do this any time —
--    you can re-run it later to add more students.
-- ============================================================
insert into allowed_students (student_id, full_name) values
  ('FS-2026-001', 'Example Student One'),
  ('FS-2026-002', 'Example Student Two')
on conflict (student_id) do nothing;
