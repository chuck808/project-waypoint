import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { authorised } = await parent();

  if (!authorised) return { claims: [] };

  const { data } = await locals.supabase
    .from("business_claim_requests")
    .select(
      "id, business_id, requester_user_id, message, status, created_at, decided_at, businesses ( name )",
    )
    .order("created_at", { ascending: false });

  return { claims: data ?? [] };
};

export const actions: Actions = {
  approve: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const claimId = String(form.get("claimId") ?? "");
    const businessId = String(form.get("businessId") ?? "");
    const requesterUserId = String(form.get("requesterUserId") ?? "");

    if (!claimId || !businessId || !requesterUserId) {
      return { claimError: "Missing claim details." };
    }

    // Plain insert, not upsert: postgrest-js's .upsert(onConflict: ...)
    // for this table hit a live-tested RLS false-negative against the
    // real dev project even with matching is_admin() insert/update
    // policies in place -- plain insert avoids whatever that interaction
    // was. A 23505 unique-violation here just means the requester is
    // already a member of this business; treat that as success so a
    // stray re-approval doesn't block the claim update below.
    const { error: membershipError } = await locals.supabase
      .from("business_memberships")
      .insert({ business_id: businessId, user_id: requesterUserId, role: "owner", status: "active" });

    if (membershipError && membershipError.code !== "23505") {
      return { claimError: membershipError.message };
    }

    const { error: claimUpdateError } = await locals.supabase
      .from("business_claim_requests")
      .update({ status: "approved", decided_at: new Date().toISOString() })
      .eq("id", claimId);

    if (claimUpdateError) return { claimError: claimUpdateError.message };
    return { claimDecided: true };
  },

  reject: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const claimId = String(form.get("claimId") ?? "");
    if (!claimId) return { claimError: "Missing claim." };

    const { error } = await locals.supabase
      .from("business_claim_requests")
      .update({ status: "rejected", decided_at: new Date().toISOString() })
      .eq("id", claimId);

    if (error) return { claimError: error.message };
    return { claimDecided: true };
  },
};
