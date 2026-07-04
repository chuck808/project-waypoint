import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

type LooseRpc = (
  fn: string,
  args?: Record<string, unknown>,
) => PromiseLike<{ data: unknown; error: { message: string } | null }>;

const BUSINESS_DECISIONS = ["approved", "suspended"] as const;

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession();

  if (!user) redirect(303, "/sign-in");

  // The gate. RLS would silently show a non-admin only public rows, but
  // an explicit check gives an honest "not authorised" instead of a
  // mysteriously thin dashboard.
  const rpc = locals.supabase.rpc.bind(locals.supabase) as unknown as LooseRpc;
  const { data: isAdmin } = await rpc("is_admin");

  if (isAdmin !== true) {
    return { authorised: false as const, email: user.email };
  }

  const [businesses, trails, regions, checkIns] = await Promise.all([
    locals.supabase
      .from("businesses")
      .select("id, name, category, status, created_at")
      .order("created_at", { ascending: false }),
    locals.supabase
      .from("trails")
      .select("id, name, status")
      .order("name"),
    locals.supabase
      .from("regions")
      .select("id, name, status")
      .order("name"),
    locals.supabase
      .from("check_ins")
      .select(
        "id, checked_in_at, verification_status, business_locations ( name )",
      )
      .order("checked_in_at", { ascending: false })
      .limit(25),
  ]);

  return {
    authorised: true as const,
    email: user.email,
    businesses: businesses.data ?? [],
    trails: trails.data ?? [],
    regions: regions.data ?? [],
    checkIns: checkIns.data ?? [],
  };
};

export const actions: Actions = {
  signout: async ({ locals }) => {
    await locals.supabase.auth.signOut();
    redirect(303, "/sign-in");
  },

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

    // RLS (0010) is the real authority: a non-admin's update matches
    // zero rows. The is_admin gate above is UX, not security.
    const { error } = await locals.supabase
      .from("businesses")
      .update({ status: decision })
      .eq("id", businessId);

    if (error) return { decisionError: error.message };

    return { decisionError: null };
  },
};
