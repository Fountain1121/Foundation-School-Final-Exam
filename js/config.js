// ============================================================
// FILL THIS IN before deploying — see README.md, Step 2.
// Get these two values from Supabase: Project Settings → API.
// The "anon public" key is safe to expose in client-side code.
// ============================================================
const SUPABASE_URL = "https://qmbcqtxlpuakkhtdgagm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYmNxdHhscHVha2todGRnYWdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzk1NzA3NiwiZXhwIjoyMDk5NTMzMDc2fQ.6N6wDJ4Ob7-K4QyGK7mK1GyBvog1uOnO4IXrhvQlXkw";

// Simple gate for the marker's dashboard (admin.html).
// Change this to something only you know. This is NOT strong
// security — it only keeps casual visitors out. See README.md
// for how to lock the dashboard down further if you need to.
const ADMIN_PASSCODE = "changeme";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
