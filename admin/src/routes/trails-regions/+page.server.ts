import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { authorised } = await parent();

  if (!authorised) return { trails: [], regions: [] };

  const [trails, regions] = await Promise.all([
    locals.supabase.from("trails").select("id, name, status").order("name"),
    locals.supabase.from("regions").select("id, name, status").order("name"),
  ]);

  return {
    trails: trails.data ?? [],
    regions: regions.data ?? [],
  };
};
