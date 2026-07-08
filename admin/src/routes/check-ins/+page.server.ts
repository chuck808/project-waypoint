import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { authorised } = await parent();

  if (!authorised) return { checkIns: [] };

  const { data, error } = await locals.supabase
    .from("check_ins")
    .select(
      "id, checked_in_at, verification_status, business_locations ( name )",
    )
    .order("checked_in_at", { ascending: false })
    .limit(25);

  if (error) return { checkIns: [], loadError: error.message };

  return { checkIns: data ?? [] };
};
