import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

const SEVEN_DAYS_AGO = () =>
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { authorised } = await parent();

  if (!authorised) return {};

  const [
    businesses,
    activeLocations,
    checkInsLast7Days,
    fieldNotesPublic,
    fieldNotesUnresolved,
    publishedTrails,
    activeRegions,
  ] = await Promise.all([
    locals.supabase.from("businesses").select("status"),
    locals.supabase
      .from("business_locations")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    locals.supabase
      .from("check_ins")
      .select("*", { count: "exact", head: true })
      .gte("checked_in_at", SEVEN_DAYS_AGO()),
    locals.supabase
      .from("field_notes")
      .select("*", { count: "exact", head: true })
      .eq("visibility", "public")
      .is("resolved_at", null),
    locals.supabase
      .from("field_notes")
      .select("*", { count: "exact", head: true })
      .is("resolved_at", null),
    locals.supabase
      .from("trails")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    locals.supabase
      .from("regions")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
  ]);

  const businessesByStatus: Record<string, number> = {};
  for (const row of businesses.data ?? []) {
    businessesByStatus[row.status] = (businessesByStatus[row.status] ?? 0) + 1;
  }

  return {
    kpis: {
      businessesByStatus,
      activeLocations: activeLocations.count ?? 0,
      checkInsLast7Days: checkInsLast7Days.count ?? 0,
      fieldNotesPublic: fieldNotesPublic.count ?? 0,
      fieldNotesUnresolved: fieldNotesUnresolved.count ?? 0,
      publishedTrails: publishedTrails.count ?? 0,
      activeRegions: activeRegions.count ?? 0,
    },
  };
};

export const actions: Actions = {
  signout: async ({ locals }) => {
    await locals.supabase.auth.signOut();
    redirect(303, "/sign-in");
  },
};
