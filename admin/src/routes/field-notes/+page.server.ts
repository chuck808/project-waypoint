import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { authorised } = await parent();

  if (!authorised) return { fieldNotes: [] };

  // Admin's "for all" policy (0003/0004) grants this regardless of
  // visibility or resolved_at -- unlike walker-facing reads, nothing is
  // pre-filtered here on purpose.
  const { data, error } = await locals.supabase
    .from("field_notes")
    .select(
      "id, category, severity, message, source, visibility, observed_at, resolved_at, business_locations ( name ), trails ( name )",
    )
    .order("observed_at", { ascending: false })
    .limit(200);

  if (error) return { fieldNotes: [], loadError: error.message };

  return { fieldNotes: data ?? [] };
};

export const actions: Actions = {
  resolve: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const fieldNoteId = String(form.get("fieldNoteId") ?? "");

    if (!fieldNoteId) return { resolveError: "Missing field note." };

    // RLS's admin "for all" policy is the real authority; the layout's
    // is_admin gate is UX only.
    const { error } = await locals.supabase
      .from("field_notes")
      .update({ resolved_at: new Date().toISOString() })
      .eq("id", fieldNoteId);

    if (error) return { resolveError: error.message };

    return { resolveError: null };
  },
};
