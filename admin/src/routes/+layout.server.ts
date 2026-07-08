import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

type LooseRpc = (
  fn: string,
  args?: Record<string, unknown>,
) => PromiseLike<{ data: unknown; error: { message: string } | null }>;

/**
 * Single is_admin gate for every route in the app, replacing the
 * per-page duplication the single-page dashboard used to have. RLS
 * remains the real authority (see each route's own comments where it
 * writes); this only decides what chrome to show.
 */
export const load: LayoutServerLoad = async ({ locals, url }) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    if (url.pathname === "/sign-in") {
      return { authorised: false as const, email: null };
    }
    redirect(303, "/sign-in");
  }

  const rpc = locals.supabase.rpc.bind(locals.supabase) as unknown as LooseRpc;
  const { data: isAdmin } = await rpc("is_admin");

  return { authorised: isAdmin === true, email: user.email ?? null };
};
