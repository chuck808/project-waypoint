import type { Actions, PageServerLoad } from "./$types";

const TRAIL_STATUSES = ["draft", "published", "archived"] as const;
const TRAIL_DIFFICULTIES = ["easy", "moderate", "hard", "expert"] as const;
const TRAIL_TYPES = ["circular", "linear", "out_and_back"] as const;
const REGION_STATUSES = ["draft", "published", "archived"] as const;
const REGION_TYPES = ["national_park", "county", "area", "custom"] as const;

function asText(form: FormData, key: string, max = 2000) {
  return String(form.get(key) ?? "").trim().slice(0, max) || null;
}

function asNumber(form: FormData, key: string) {
  const raw = form.get(key);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { authorised } = await parent();

  if (!authorised) return { trails: [], regions: [], trailRegionLinks: [] };

  const [trails, regions, trailRegionLinks] = await Promise.all([
    locals.supabase
      .from("trails")
      .select(
        "id, name, slug, description, status, difficulty, trail_type, distance_km, elevation_gain_m, estimated_duration_minutes",
      )
      .order("name"),
    locals.supabase
      .from("regions")
      .select("id, name, slug, description, status, region_type")
      .order("name"),
    locals.supabase.from("trail_regions").select("trail_id, region_id"),
  ]);

  return {
    trails: trails.data ?? [],
    regions: regions.data ?? [],
    trailRegionLinks: trailRegionLinks.data ?? [],
  };
};

export const actions: Actions = {
  createRegion: async ({ request, locals }) => {
    const form = await request.formData();
    const name = asText(form, "name", 120);
    const regionType = String(form.get("regionType") ?? "area");
    const status = String(form.get("status") ?? "draft");

    if (!name) return { regionError: "Name is required." };
    if (!REGION_TYPES.includes(regionType as (typeof REGION_TYPES)[number])) {
      return { regionError: "Invalid region type." };
    }
    if (!REGION_STATUSES.includes(status as (typeof REGION_STATUSES)[number])) {
      return { regionError: "Invalid status." };
    }

    const { error } = await locals.supabase.from("regions").insert({
      name,
      slug: slugify(name),
      description: asText(form, "description", 1000),
      region_type: regionType,
      status,
    });

    if (error) return { regionError: error.message };
    return { regionSaved: true };
  },

  updateRegion: async ({ request, locals }) => {
    const form = await request.formData();
    const id = String(form.get("id") ?? "");
    const name = asText(form, "name", 120);
    const regionType = String(form.get("regionType") ?? "area");
    const status = String(form.get("status") ?? "draft");

    if (!id || !name) return { regionError: "Missing id or name." };
    if (!REGION_TYPES.includes(regionType as (typeof REGION_TYPES)[number])) {
      return { regionError: "Invalid region type." };
    }
    if (!REGION_STATUSES.includes(status as (typeof REGION_STATUSES)[number])) {
      return { regionError: "Invalid status." };
    }

    const { error } = await locals.supabase
      .from("regions")
      .update({
        name,
        description: asText(form, "description", 1000),
        region_type: regionType,
        status,
      })
      .eq("id", id);

    if (error) return { regionError: error.message };
    return { regionSaved: true };
  },

  createTrail: async ({ request, locals }) => {
    const form = await request.formData();
    const name = asText(form, "name", 120);
    const difficulty = String(form.get("difficulty") ?? "moderate");
    const trailType = String(form.get("trailType") ?? "circular");
    const status = String(form.get("status") ?? "draft");

    if (!name) return { trailError: "Name is required." };
    if (!TRAIL_DIFFICULTIES.includes(difficulty as (typeof TRAIL_DIFFICULTIES)[number])) {
      return { trailError: "Invalid difficulty." };
    }
    if (!TRAIL_TYPES.includes(trailType as (typeof TRAIL_TYPES)[number])) {
      return { trailError: "Invalid trail type." };
    }
    if (!TRAIL_STATUSES.includes(status as (typeof TRAIL_STATUSES)[number])) {
      return { trailError: "Invalid status." };
    }

    const { data, error } = await locals.supabase
      .from("trails")
      .insert({
        name,
        slug: slugify(name),
        description: asText(form, "description", 2000),
        difficulty,
        trail_type: trailType,
        status,
        distance_km: asNumber(form, "distanceKm"),
        elevation_gain_m: asNumber(form, "elevationGainM"),
        estimated_duration_minutes: asNumber(form, "estimatedDurationMinutes"),
      })
      .select("id")
      .single();

    if (error) return { trailError: error.message };

    const regionId = String(form.get("regionId") ?? "");
    if (regionId && data) {
      await locals.supabase
        .from("trail_regions")
        .insert({ trail_id: data.id, region_id: regionId });
    }

    return { trailSaved: true };
  },

  updateTrail: async ({ request, locals }) => {
    const form = await request.formData();
    const id = String(form.get("id") ?? "");
    const name = asText(form, "name", 120);
    const difficulty = String(form.get("difficulty") ?? "moderate");
    const trailType = String(form.get("trailType") ?? "circular");
    const status = String(form.get("status") ?? "draft");

    if (!id || !name) return { trailError: "Missing id or name." };
    if (!TRAIL_DIFFICULTIES.includes(difficulty as (typeof TRAIL_DIFFICULTIES)[number])) {
      return { trailError: "Invalid difficulty." };
    }
    if (!TRAIL_TYPES.includes(trailType as (typeof TRAIL_TYPES)[number])) {
      return { trailError: "Invalid trail type." };
    }
    if (!TRAIL_STATUSES.includes(status as (typeof TRAIL_STATUSES)[number])) {
      return { trailError: "Invalid status." };
    }

    const { error } = await locals.supabase
      .from("trails")
      .update({
        name,
        description: asText(form, "description", 2000),
        difficulty,
        trail_type: trailType,
        status,
        distance_km: asNumber(form, "distanceKm"),
        elevation_gain_m: asNumber(form, "elevationGainM"),
        estimated_duration_minutes: asNumber(form, "estimatedDurationMinutes"),
      })
      .eq("id", id);

    if (error) return { trailError: error.message };

    const regionId = String(form.get("regionId") ?? "");
    // Simple sync: this trail's region assignment is replaced wholesale.
    // Fine at this volume; a trail belonging to many regions at once
    // isn't a workflow this UI supports yet.
    await locals.supabase.from("trail_regions").delete().eq("trail_id", id);
    if (regionId) {
      await locals.supabase
        .from("trail_regions")
        .insert({ trail_id: id, region_id: regionId });
    }

    return { trailSaved: true };
  },

  deleteTrail: async ({ request, locals }) => {
    const form = await request.formData();
    const id = String(form.get("id") ?? "");
    if (!id) return { trailError: "Missing trail." };

    const { error } = await locals.supabase.from("trails").delete().eq("id", id);
    if (error) return { trailError: error.message };
    return { trailSaved: true };
  },

  deleteRegion: async ({ request, locals }) => {
    const form = await request.formData();
    const id = String(form.get("id") ?? "");
    if (!id) return { regionError: "Missing region." };

    const { error } = await locals.supabase.from("regions").delete().eq("id", id);
    if (error) return { regionError: error.message };
    return { regionSaved: true };
  },
};
