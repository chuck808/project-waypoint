import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

const ASSIGNABLE_ROLES = ["walker", "business_user", "moderator", "admin"] as const;

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { authorised } = await parent();

  if (!authorised) return { users: [] };

  const [{ data: profiles }, { data: roles }] = await Promise.all([
    locals.supabase
      .from("profiles")
      .select("user_id, display_name, created_at")
      .order("created_at", { ascending: false }),
    locals.supabase.from("user_roles").select("user_id, role"),
  ]);

  const rolesByUser = new Map<string, string[]>();
  for (const row of roles ?? []) {
    const list = rolesByUser.get(row.user_id) ?? [];
    list.push(row.role);
    rolesByUser.set(row.user_id, list);
  }

  const users = (profiles ?? []).map((profile) => ({
    userId: profile.user_id,
    displayName: profile.display_name,
    createdAt: profile.created_at,
    roles: (rolesByUser.get(profile.user_id) ?? []).sort(),
  }));

  return { users };
};

export const actions: Actions = {
  grantRole: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const userId = String(form.get("userId") ?? "");
    const role = String(form.get("role") ?? "");

    if (!userId || !ASSIGNABLE_ROLES.includes(role as (typeof ASSIGNABLE_ROLES)[number])) {
      return { roleError: "Invalid role grant." };
    }

    const { error } = await locals.supabase.from("user_roles").insert({ user_id: userId, role });

    // 23505 (unique violation) just means they already have this role.
    if (error && error.code !== "23505") return { roleError: error.message };
    return { roleChanged: true };
  },

  revokeRole: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const userId = String(form.get("userId") ?? "");
    const role = String(form.get("role") ?? "");

    if (!userId || !ASSIGNABLE_ROLES.includes(role as (typeof ASSIGNABLE_ROLES)[number])) {
      return { roleError: "Invalid role revoke." };
    }

    // Checked server-side against the caller's own session, not left to
    // RLS alone: an admin must never be able to lock themselves out by
    // revoking their own admin role.
    if (role === "admin" && userId === user.id) {
      return { roleError: "You can't revoke your own admin role." };
    }

    const { error } = await locals.supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", role);

    if (error) return { roleError: error.message };
    return { roleChanged: true };
  },
};
