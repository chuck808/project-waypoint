import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

const BUSINESS_DECISIONS = ["approved", "suspended"] as const;

export const load: PageServerLoad = async ({ locals, parent, params }) => {
  const { authorised } = await parent();

  if (!authorised) return {};

  const [businessResult, locationsResult, membershipsResult] =
    await Promise.all([
      locals.supabase
        .from("businesses")
        .select("id, name, category, status, description, created_at")
        .eq("id", params.id)
        .maybeSingle(),
      locals.supabase
        .from("business_locations")
        .select(
          "id, name, address, status, walker_characteristics, facilities, welcome_message, steward_notice, seasonal_information, walking_context, place_story, accessibility_notes, best_seasons",
        )
        .eq("business_id", params.id)
        .order("name"),
      locals.supabase
        .from("business_memberships")
        .select("id, user_id, role, status, created_at")
        .eq("business_id", params.id)
        .order("created_at"),
    ]);

  if (!businessResult.data) {
    error(404, "Business not found.");
  }

  return {
    business: businessResult.data,
    locations: locationsResult.data ?? [],
    memberships: membershipsResult.data ?? [],
  };
};

export const actions: Actions = {
  decide: async ({ request, locals, params }) => {
    const { user } = await locals.safeGetSession();

    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const decision = String(form.get("decision") ?? "");

    if (
      !BUSINESS_DECISIONS.includes(decision as (typeof BUSINESS_DECISIONS)[number])
    ) {
      return { decisionError: "Invalid decision." };
    }

    // RLS is the real authority here, same as the businesses list action.
    const { error: updateError } = await locals.supabase
      .from("businesses")
      .update({ status: decision })
      .eq("id", params.id);

    if (updateError) return { decisionError: updateError.message };

    return { decisionError: null };
  },
};
