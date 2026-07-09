import type { Actions, PageServerLoad } from "./$types";
import { toPointWkt } from "$lib/geo";

const POI_CATEGORIES = [
  "viewpoint",
  "waterfall",
  "historical_site",
  "honesty_box",
  "picnic_spot",
  "landmark",
  "other",
] as const;
const POI_STATUSES = ["draft", "published", "archived"] as const;

function asText(form: FormData, key: string, max = 2000) {
  return String(form.get(key) ?? "").trim().slice(0, max) || null;
}

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { authorised } = await parent();

  if (!authorised) return { pois: [], trails: [] };

  const [{ data: pois }, { data: trails }] = await Promise.all([
    locals.supabase
      .from("points_of_interest_map_points")
      .select("id, trail_id, name, description, category, status, source, created_at, latitude, longitude")
      .order("created_at", { ascending: false }),
    locals.supabase.from("trails").select("id, name").order("name"),
  ]);

  // The view's generated types mark every column nullable (a codegen
  // artifact of selecting through a view, not real nullability -- id,
  // name, category, status, latitude and longitude are all `not null`
  // on the base table). Narrow once here rather than scattering `??`
  // fallbacks through the template.
  const narrowedPois = (pois ?? [])
    .filter((p) => p.id !== null)
    .map((p) => ({
      id: p.id as string,
      trailId: p.trail_id,
      name: p.name ?? "",
      description: p.description,
      category: p.category ?? "landmark",
      status: p.status ?? "draft",
      source: p.source ?? "manual",
      latitude: p.latitude ?? 0,
      longitude: p.longitude ?? 0,
    }));

  return { pois: narrowedPois, trails: trails ?? [] };
};

export const actions: Actions = {
  createPoi: async ({ request, locals }) => {
    const form = await request.formData();
    const name = asText(form, "name", 120);
    const category = String(form.get("category") ?? "landmark");
    const status = String(form.get("status") ?? "draft");
    const lat = Number(form.get("lat"));
    const lon = Number(form.get("lon"));
    const trailId = String(form.get("trailId") ?? "") || null;

    if (!name) return { poiError: "Name is required." };
    if (!POI_CATEGORIES.includes(category as (typeof POI_CATEGORIES)[number])) {
      return { poiError: "Invalid category." };
    }
    if (!POI_STATUSES.includes(status as (typeof POI_STATUSES)[number])) {
      return { poiError: "Invalid status." };
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return { poiError: "Latitude and longitude are required." };
    }

    const { error } = await locals.supabase.from("points_of_interest").insert({
      name,
      description: asText(form, "description", 1000),
      category,
      status,
      trail_id: trailId,
      location: toPointWkt(lat, lon),
      source: "manual",
    });

    if (error) return { poiError: error.message };
    return { poiSaved: true };
  },

  updatePoi: async ({ request, locals }) => {
    const form = await request.formData();
    const id = String(form.get("id") ?? "");
    const name = asText(form, "name", 120);
    const category = String(form.get("category") ?? "landmark");
    const status = String(form.get("status") ?? "draft");
    const lat = Number(form.get("lat"));
    const lon = Number(form.get("lon"));
    const trailId = String(form.get("trailId") ?? "") || null;

    if (!id || !name) return { poiError: "Missing id or name." };
    if (!POI_CATEGORIES.includes(category as (typeof POI_CATEGORIES)[number])) {
      return { poiError: "Invalid category." };
    }
    if (!POI_STATUSES.includes(status as (typeof POI_STATUSES)[number])) {
      return { poiError: "Invalid status." };
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return { poiError: "Latitude and longitude are required." };
    }

    const { error } = await locals.supabase
      .from("points_of_interest")
      .update({
        name,
        description: asText(form, "description", 1000),
        category,
        status,
        trail_id: trailId,
        location: toPointWkt(lat, lon),
      })
      .eq("id", id);

    if (error) return { poiError: error.message };
    return { poiSaved: true };
  },
};
