import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@waypoint/database";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      safeGetSession: () => Promise<{
        session: Session | null;
        user: User | null;
      }>;
    }
  }
}

export {};
