import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession();

  if (!user) redirect(303, "/sign-in");

  // RLS scopes every layer: memberships to the caller (0007), businesses,
  // locations and codes to membership (0008). No user_id filter needed --
  // the security model is the query.
  const { data, error } = await locals.supabase
    .from("business_memberships")
    .select(
      `
      role,
      businesses (
        id,
        name,
        category,
        status,
        business_locations (
          id,
          name,
          status,
          qr_codes ( code_value, status )
        )
      )
    `,
    )
    .eq("status", "active");

  if (error) {
    return {
      email: user.email,
      memberships: [],
      footfall: [],
      loadError: error.message,
    };
  }

  // ADR-005 projection: visit events without walker identity. The view
  // gates membership internally -- no filter needed here either.
  // Loosely typed until @waypoint/database is regenerated after 0011.
  type FootfallRow = {
    visit_id: string;
    business_location_name: string;
    checked_in_at: string;
    check_in_method: string;
    invitation_code: string | null;
  };

  const fromView = locals.supabase.from.bind(locals.supabase) as unknown as (
    relation: string,
  ) => {
    select: (columns: string) => {
      order: (
        column: string,
        options: { ascending: boolean },
      ) => {
        limit: (count: number) => PromiseLike<{ data: FootfallRow[] | null }>;
      };
    };
  };

  const { data: footfall } = await fromView("business_location_footfall")
    .select(
      "visit_id, business_location_name, checked_in_at, check_in_method, invitation_code",
    )
    .order("checked_in_at", { ascending: false })
    .limit(15);

  return {
    email: user.email,
    memberships: data ?? [],
    footfall: footfall ?? [],
    loadError: null,
  };
};

export const actions: Actions = {
  signout: async ({ locals }) => {
    await locals.supabase.auth.signOut();
    redirect(303, "/sign-in");
  },

  createInvitation: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const locationId = String(form.get("locationId") ?? "");

    if (!locationId) return { invitationError: "Missing location." };

    // Loosely typed until @waypoint/database is regenerated after 0009;
    // membership and uniqueness are enforced inside the function itself.
    const rpc = locals.supabase.rpc.bind(locals.supabase) as unknown as (
      fn: string,
      args?: Record<string, unknown>,
    ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;

    const { error } = await rpc("create_location_invitation", {
      target_location_id: locationId,
    });

    if (error) return { invitationError: error.message };

    return { invitationError: null };
  },
};
