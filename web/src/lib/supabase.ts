import type { Database } from "@waypoint/database";
import { createClient } from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";

/**
 * Anonymous client only. The Public Front Door reads exclusively what
 * RLS already makes public: active codes, active locations, approved
 * businesses. No auth, no sessions, no cookies.
 */
export const supabase = createClient<Database>(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false } },
);
