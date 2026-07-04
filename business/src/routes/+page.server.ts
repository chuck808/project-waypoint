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
    return { email: user.email, memberships: [], loadError: error.message };
  }

  return { email: user.email, memberships: data ?? [], loadError: null };
};

export const actions: Actions = {
  signout: async ({ locals }) => {
    await locals.supabase.auth.signOut();
    redirect(303, "/sign-in");
  },
};
