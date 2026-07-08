import { redirect } from "@sveltejs/kit";
import { facilityKeys, walkerCharacteristicKeys } from "@waypoint/ui";
import type { Actions, PageServerLoad } from "./$types";

function flagsFromForm(form: FormData, keys: readonly string[]) {
  return Object.fromEntries(keys.map((key) => [key, form.get(key) === "on"]));
}

function asText(form: FormData, key: string, max = 500) {
  return String(form.get(key) ?? "").trim().slice(0, max) || null;
}

async function updateLocation(
  locals: App.Locals,
  locationId: string,
  values: Record<string, unknown>,
) {
  const update = locals.supabase.from("business_locations")
    .update as unknown as (v: Record<string, unknown>) => {
    eq: (
      c: string,
      v: string,
    ) => {
      select: (c: string) => PromiseLike<{
        data: { id: string }[] | null;
        error: { message: string } | null;
      }>;
    };
  };

  const { data, error } = await update(values).eq("id", locationId).select("id");

  if (error) return { error };

  // RLS silently filters rows it denies rather than erroring: a
  // tampered or stale locationId returns 0 rows here, not an error.
  if (!data || data.length === 0) {
    return { error: { message: "That location could not be updated." } };
  }

  return { error: null };
}

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession();

  if (!user) redirect(303, "/sign-in");

  const { data, error } = await locals.supabase
    .from("business_memberships")
    .select(
      `
      role,
      businesses (
        id,
        name,
        category,
        status,
        description,
        business_locations (
          id,
          name,
          address,
          opening_hours,
          status,
          welcome_message,
          steward_notice,
          seasonal_information,
          website_url,
          phone,
          email,
          hero_image_url,
          walker_characteristics,
          facilities,
          accessibility_notes,
          qr_codes ( code_value, status )
        )
      )
    `,
    )
    .eq("status", "active");

  if (error) {
    return {
      email: user.email,
      memberships: [],
      footfall: [],
      footfallByLocation: {} as Record<string, number>,
      loadError: error.message,
    };
  }

  type FootfallRow = {
    visit_id: string;
    business_location_name: string;
    checked_in_at: string;
    check_in_method: string;
    invitation_code: string | null;
  };

  const fromView = locals.supabase.from.bind(locals.supabase) as unknown as (
    relation: string,
  ) => {
    select: (columns: string) => {
      order: (
        column: string,
        options: { ascending: boolean },
      ) => {
        limit: (count: number) => PromiseLike<{ data: FootfallRow[] | null }>;
      };
    };
  };

  const { data: footfall } = await fromView("business_location_footfall")
    .select(
      "visit_id, business_location_name, checked_in_at, check_in_method, invitation_code",
    )
    .order("checked_in_at", { ascending: false })
    .limit(30);

  const footfallByLocation: Record<string, number> = {};
  for (const visit of footfall ?? []) {
    footfallByLocation[visit.business_location_name] =
      (footfallByLocation[visit.business_location_name] ?? 0) + 1;
  }

  return {
    email: user.email,
    memberships: data ?? [],
    footfall: footfall ?? [],
    footfallByLocation,
    loadError: null,
  };
};

export const actions: Actions = {
  signout: async ({ locals }) => {
    await locals.supabase.auth.signOut();
    redirect(303, "/sign-in");
  },

  saveLocationDetails: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const locationId = String(form.get("locationId") ?? "");
    if (!locationId) return { locationError: "Missing location." };

    const { error } = await updateLocation(locals, locationId, {
      name: asText(form, "name", 120),
      address: asText(form, "address", 240),
      website_url: asText(form, "websiteUrl", 240),
      phone: asText(form, "phone", 80),
      email: asText(form, "email", 160),
      hero_image_url: asText(form, "heroImageUrl", 500),
    });

    if (error) return { locationError: error.message };
    return { locationSaved: true };
  },

  saveWalkerInfo: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const locationId = String(form.get("locationId") ?? "");
    if (!locationId) return { walkerInfoError: "Missing location." };

    const walker_characteristics = flagsFromForm(form, walkerCharacteristicKeys);
    const facilities = flagsFromForm(form, facilityKeys);

    const { error } = await updateLocation(locals, locationId, {
      walker_characteristics,
      facilities,
      accessibility_notes: asText(form, "accessibilityNotes", 1000),
    });

    if (error) return { walkerInfoError: error.message };
    return { walkerInfoSaved: true };
  },

  saveStewardNotice: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const locationId = String(form.get("locationId") ?? "");
    if (!locationId) return { noticeError: "Missing location." };

    const { error } = await updateLocation(locals, locationId, {
      welcome_message: asText(form, "welcomeMessage", 280),
      steward_notice: asText(form, "stewardNotice", 500),
      seasonal_information: asText(form, "seasonalInformation", 800),
    });

    if (error) return { noticeError: error.message };
    return { noticeSaved: true };
  },

  createInvitation: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    if (!user) redirect(303, "/sign-in");

    const form = await request.formData();
    const locationId = String(form.get("locationId") ?? "");
    if (!locationId) return { invitationError: "Missing location." };

    const rpc = locals.supabase.rpc.bind(locals.supabase) as unknown as (
      fn: string,
      args?: Record<string, unknown>,
    ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;

    const { error } = await rpc("create_location_invitation", {
      target_location_id: locationId,
    });

    if (error) return { invitationError: error.message };
    return { invitationCreated: true };
  },
};
