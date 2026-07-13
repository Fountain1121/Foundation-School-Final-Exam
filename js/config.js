// ============================================================
// FILL THIS IN before deploying — see README.md, Step 2.
// Get these two values from Supabase: Project Settings → API.
// The "anon public" key is safe to expose in client-side code.
// ============================================================
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

// Simple gate for the marker's dashboard (admin.html).
// Change this to something only you know. This is NOT strong
// security — it only keeps casual visitors out. See README.md
// for how to lock the dashboard down further if you need to.
const ADMIN_PASSCODE = "changeme";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
