import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

const BUSINESS_DECISIONS = ["approved", "suspended"] as const;

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { authorised } = await parent();

  if (!authorised) return { businesses: [] };

  const { data, error } = await locals.supabase
    .from("businesses")
    .select("id, name, category, status, created_at")
    .order("created_at", { ascending: false });

  if (error) return { businesses: [], loadError: error.message };

  return { businesses: data ?? [] };
};

export const actions: Actions = {
  decide: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const businessId = String(form.get("businessId") ?? "");
    const decision = String(form.get("decision") ?? "");

    if (
      !businessId ||
      !BUSINESS_DECISIONS.includes(decision as (typeof BUSINESS_DECISIONS)[number])
    ) {
      return { decisionError: "Invalid decision." };
    }

    // RLS is the real authority: a non-admin's update matches zero
    // rows. The layout's is_admin gate above is UX, not security.
    const { error } = await locals.supabase
      .from("businesses")
      .update({ status: decision })
      .eq("id", businessId);

    if (error) return { decisionError: error.message };

    return { decisionError: null };
  },
};
