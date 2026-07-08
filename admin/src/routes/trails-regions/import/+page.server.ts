import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
  parseGpx,
  computeStats,
  thinPoints,
  toLineStringWkt,
  inferTrailType,
  type GpxPoint,
} from "$lib/gpx";

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

    if (target === "new") {
      const name = String(form.get("name") ?? "").trim();
      if (!name) return fail(400, { confirmError: "Name is required." });

      const distanceKm = Number(form.get("distanceKm"));
      const elevationGainM = Number(form.get("elevationGainM"));
      const trailType = String(form.get("trailType") ?? "circular");

      const { error } = await locals.supabase.from("trails").insert({
        name,
        slug: slugify(name),
        description: String(form.get("description") ?? "").trim() || null,
        status: "draft",
        difficulty: "moderate",
        trail_type: trailType === "out_and_back" ? "out_and_back" : "circular",
        distance_km: Number.isFinite(distanceKm) ? distanceKm : null,
        elevation_gain_m: Number.isFinite(elevationGainM) ? Math.round(elevationGainM) : null,
        route,
      });

      if (error) return fail(400, { confirmError: error.message });
      return { imported: true };
    }

    const { error } = await locals.supabase
      .from("trails")
      .update({ route })
      .eq("id", target);

    if (error) return fail(400, { confirmError: error.message });
    return { imported: true };
  },
};
