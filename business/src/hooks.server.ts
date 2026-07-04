import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Handle } from "@sveltejs/kit";
import {
  PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import type { Database } from "@waypoint/database";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient<Database>(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (
          cookies: { name: string; value: string; options: CookieOptions }[],
        ) => {
          for (const { name, value, options } of cookies) {
            event.cookies.set(name, value, { ...options, path: "/" });
          }
        },
      },
    },
  );

  /**
   * getUser() validates the JWT against Supabase on every request;
   * getSession() alone trusts the cookie. Auth decisions use the
   * validated user, never the raw session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { user },
    } = await event.locals.supabase.auth.getUser();

    if (!user) return { session: null, user: null };

    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();

    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders: (name) =>
      name === "content-range" || name === "x-supabase-api-version",
  });
};
