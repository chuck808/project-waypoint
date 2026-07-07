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
      welcomeByLocation: {} as Record<string, string>,
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

  // welcome_message postdates the generated types (regen after 0013).
  type WelcomeRow = { id: string; welcome_message: string | null };

  const { data: welcomes } = await (fromView("business_locations") as unknown as {
    select: (c: string) => PromiseLike<{ data: WelcomeRow[] | null }>;
  }).select("id, welcome_message");

  const welcomeByLocation: Record<string, string> = {};

  for (const row of welcomes ?? []) {
    if (row.welcome_message) welcomeByLocation[row.id] = row.welcome_message;
  }

  return {
    email: user.email,
    memberships: data ?? [],
    footfall: footfall ?? [],
    welcomeByLocation,
    loadError: null,
  };
};

export const actions: Actions = {
  signout: async ({ locals }) => {
    await locals.supabase.auth.signOut();
    redirect(303, "/sign-in");
  },

  saveWelcome: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const locationId = String(form.get("locationId") ?? "");
    const message = String(form.get("message") ?? "").trim().slice(0, 280);

    if (!locationId) return { welcomeError: "Missing location." };

    // Column grant (0013) means only welcome_message is writable; RLS
    // means only for the caller's own business. Both enforced in the
    // database -- this action is just a form.
    const update = locals.supabase.from("business_locations")
      .update as unknown as (v: Record<string, string | null>) => {
      eq: (c: string, v: string) => PromiseLike<{ error: { message: string } | null }>;
    };

    const { error } = await update({ welcome_message: message || null }).eq(
      "id",
      locationId,
    );

    if (error) return { welcomeError: error.message };

    return { welcomeError: null };
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
