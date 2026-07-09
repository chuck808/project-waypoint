import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
  parseGpx,
  computeStats,
  thinPoints,
  toLineStringWkt,
  inferTrailType,
  type GpxPoint,
  type GpxWaypoint,
} from "$lib/gpx";
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { authorised } = await parent();

  if (!authorised) return { trails: [] };

  const { data } = await locals.supabase
    .from("trails")
    .select("id, name")
    .order("name");

  return { trails: data ?? [] };
};

export const actions: Actions = {
  preview: async ({ request }) => {
    const form = await request.formData();
    const file = form.get("gpxFile");

    if (!(file instanceof File) || file.size === 0) {
      return fail(400, { previewError: "Choose a .gpx file to upload." });
    }

    const text = await file.text();
    const parsed = parseGpx(text);

    if (!parsed || parsed.points.length < 2) {
      return fail(400, {
        previewError: "Couldn't find a track with at least two points in that file.",
      });
    }

    const stats = computeStats(parsed.points);
    const thinned = thinPoints(parsed.points);
    const trailType = inferTrailType(parsed.points);
    const fallbackName = file.name.replace(/\.gpx$/i, "");

    return {
      preview: {
        name: parsed.name ?? fallbackName,
        description: parsed.description,
        distanceKm: stats.distanceKm,
        elevationGainM: stats.elevationGainM,
        pointCount: stats.pointCount,
        trailType,
        pointsJson: JSON.stringify(thinned),
        waypoints: parsed.waypoints,
        waypointsJson: JSON.stringify(parsed.waypoints),
      },
    };
  },

  confirm: async ({ request, locals }) => {
    const form = await request.formData();
    const pointsJson = String(form.get("pointsJson") ?? "");
    const target = String(form.get("target") ?? "new");

    let points: GpxPoint[];
    try {
      points = JSON.parse(pointsJson);
      if (!Array.isArray(points) || points.length < 2) throw new Error("empty");
    } catch {
      return fail(400, { confirmError: "Route data was lost -- please re-upload the file." });
    }

    const route = toLineStringWkt(points);
    let trailId: string;

    if (target === "new") {
      const name = String(form.get("name") ?? "").trim();
      if (!name) return fail(400, { confirmError: "Name is required." });

      const distanceKm = Number(form.get("distanceKm"));
      const elevationGainM = Number(form.get("elevationGainM"));
      const trailType = String(form.get("trailType") ?? "circular");

      const { data, error } = await locals.supabase
        .from("trails")
        .insert({
          name,
          slug: slugify(name),
          description: String(form.get("description") ?? "").trim() || null,
          status: "draft",
          difficulty: "moderate",
          trail_type: trailType === "out_and_back" ? "out_and_back" : "circular",
          distance_km: Number.isFinite(distanceKm) ? distanceKm : null,
          elevation_gain_m: Number.isFinite(elevationGainM) ? Math.round(elevationGainM) : null,
          route,
        })
        .select("id")
        .single();

      if (error || !data) return fail(400, { confirmError: error?.message ?? "Could not create trail." });
      trailId = data.id;
    } else {
      const { error } = await locals.supabase.from("trails").update({ route }).eq("id", target);
      if (error) return fail(400, { confirmError: error.message });
      trailId = target;
    }

    const waypointsJson = String(form.get("waypointsJson") ?? "[]");
    let waypoints: GpxWaypoint[];
    try {
      waypoints = JSON.parse(waypointsJson);
      if (!Array.isArray(waypoints)) waypoints = [];
    } catch {
      waypoints = [];
    }

    const poisToInsert = waypoints
      .map((wp, i) => {
        const selected = form.get(`poi-${i}-selected`) === "on";
        if (!selected) return null;

        const category = String(form.get(`poi-${i}-category`) ?? "landmark");
        return {
          trail_id: trailId,
          name: wp.name,
          description: wp.description,
          category: POI_CATEGORIES.includes(category as (typeof POI_CATEGORIES)[number])
            ? category
            : "landmark",
          location: toPointWkt(wp.lat, wp.lon),
          status: "draft",
          source: "gpx_import",
        };
      })
      .filter((poi): poi is NonNullable<typeof poi> => poi !== null);

    if (poisToInsert.length > 0) {
      const { error: poiError } = await locals.supabase.from("points_of_interest").insert(poisToInsert);
      if (poiError) return fail(400, { confirmError: poiError.message });
    }

    return { imported: true };
  },
};
