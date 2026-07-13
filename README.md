# Foundation School Examination — Website

A self-contained exam site for Love Country Church's Foundation School
paper ("Our Identity in Christ and Scripture Memorization"). Plain
HTML/CSS/JS — no build step, no framework. Deploys to Render as a
Static Site. Answers are stored in Supabase.

## What it does

- **Login by index number.** Students type their index number; it's
  checked against a list you control (`allowed_students` table). An
  index number that isn't on the list, or has already submitted,
  can't get in.
- **Autosave.** Every keystroke is saved to the browser's
  `localStorage`. If a student refreshes or their browser crashes
  mid-exam, their answers are still there when they reopen the page
  on the same device/browser.
- **2-hour countdown timer**, tied to when the student first opened
  the exam (survives refresh too) — auto-submits when time runs out.
- **Section C essay picker** — students tick any 4 of the 6 essay
  questions; only those show answer boxes, matching "answer any four
  (4) questions only."
- **Submission storage** — on submit, everything goes to a
  `submissions` table in Supabase, tagged by index number, and that
  index number is locked from re-entering.
- **Marker dashboard** (`admin.html`) — a simple passcode-gated page
  where you can see every submission, read each answer against the
  original question, and type in a mark + notes per student.

## Step 1 — Create your Supabase project

1. Go to [supabase.com](https://supabase.com), create a free account
   and a new project.
2. Open **SQL Editor** → **New query**, paste in the entire contents
   of `supabase-setup.sql` (included in this folder), and run it.
   This creates the two tables, the auto-lock trigger, and the access
   policies.
3. At the bottom of that SQL file there's an `insert into
   allowed_students` block with two example rows — replace those
   with your real list of index numbers (and names, optional), or
   just add more rows the same way any time from the SQL Editor or
   the **Table Editor** UI.

## Step 2 — Connect the site to Supabase

1. In Supabase: **Project Settings → API**. Copy the **Project URL**
   and the **anon public** key.
2. Open `js/config.js` in this folder and paste them in:
   ```js
   const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJ...";
   ```
3. While you're there, set `ADMIN_PASSCODE` to something only you
   know — this is what protects `admin.html`.

## Step 3 — Deploy to Render

1. Push this folder to a GitHub repo (or upload it — Render also
   accepts a public Git repo URL).
2. In Render: **New → Static Site**.
3. Point it at your repo. Leave **Build Command** blank and set
   **Publish Directory** to the root of this folder (`.`).
4. Deploy. Render gives you a URL like
   `https://your-exam.onrender.com` — that's what you share with
   students. The marker dashboard is at
   `https://your-exam.onrender.com/admin.html`.

That's it — no server, no environment variables needed on Render,
since the Supabase keys are already in `js/config.js`.

## Using it on exam day

- Share the site link with students; they enter their index number
  and start.
- Watch submissions arrive live in `admin.html`.
- To mark a script: click a row, read through each answer (it's
  shown right under the original question so nothing needs a second
  tab), type a mark and any notes, click **Save Marks**.
- If a student's browser dies mid-exam, they can reopen the same
  link on the same device/browser and their answers will still be
  there, timer included. (Autosave is per-device — it won't follow
  them to a different computer.)

## Adding or changing students later

Re-run an `insert into allowed_students (student_id, full_name)
values (...) on conflict (student_id) do nothing;` block in the SQL
Editor any time, or add rows directly in **Table Editor**. To let a
student retake the exam, set their `has_submitted` back to `false`
in that table.

## A note on security

`admin.html` is gated by a passcode typed into the browser, not a
real login — anyone who knows the passcode (or opens the browser's
dev tools) can read submissions. For an internal church exam that
you're marking yourself, this is a reasonable trade-off for
simplicity. If you'd rather have proper server-side security later,
the cleanest upgrade path is to move admin reads behind a small
serverless function using Supabase's `service_role` key (never
exposed to the browser) instead of the public anon key — happy to
build that out if you decide you need it.
