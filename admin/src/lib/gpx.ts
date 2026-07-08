import GPX from "gpx-parser-builder";

export interface GpxPoint {
  lat: number;
  lon: number;
  ele: number | null;
}

export interface ParsedGpx {
  name: string | null;
  description: string | null;
  points: GpxPoint[];
}

const EARTH_RADIUS_KM = 6371;
const MAX_ROUTE_POINTS = 2000;

export function parseGpx(gpxText: string): ParsedGpx | null {
  const gpx = GPX.parse(gpxText);
  if (!gpx) return null;

  const track = gpx.trk?.[0];
  const points: GpxPoint[] = [];

  for (const segment of track?.trkseg ?? []) {
    for (const pt of segment.trkpt ?? []) {
      const lat = Number(pt.$.lat);
      const lon = Number(pt.$.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
      points.push({
        lat,
        lon,
        ele: typeof pt.ele === "number" && Number.isFinite(pt.ele) ? pt.ele : null,
      });
    }
  }

  return {
    name: track?.name ?? gpx.metadata?.name ?? null,
    description: track?.desc ?? gpx.metadata?.desc ?? null,
    points,
  };
}

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

export function haversineKm(a: GpxPoint, b: GpxPoint) {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export interface GpxStats {
  distanceKm: number;
  elevationGainM: number;
  pointCount: number;
}

export function computeStats(points: GpxPoint[]): GpxStats {
  let distanceKm = 0;
  let elevationGainM = 0;

  for (let i = 1; i < points.length; i++) {
    distanceKm += haversineKm(points[i - 1], points[i]);

    const prevEle = points[i - 1].ele;
    const ele = points[i].ele;
    if (prevEle !== null && ele !== null && ele > prevEle) {
      elevationGainM += ele - prevEle;
    }
  }

  return {
    distanceKm: Math.round(distanceKm * 100) / 100,
    elevationGainM: Math.round(elevationGainM),
    pointCount: points.length,
  };
}

// Evenly thins a dense track down to MAX_ROUTE_POINTS so the stored
// LineString and the hidden form field carrying it between the preview
// and confirm steps stay a sane size. Stats above are computed from the
// full point set first, so thinning here only affects line density, not
// distance/elevation accuracy.
export function thinPoints(points: GpxPoint[], max = MAX_ROUTE_POINTS): GpxPoint[] {
  if (points.length <= max) return points;

  const step = points.length / max;
  const thinned: GpxPoint[] = [];
  for (let i = 0; i < max; i++) {
    thinned.push(points[Math.floor(i * step)]);
  }
  thinned.push(points[points.length - 1]);
  return thinned;
}

export function toLineStringWkt(points: GpxPoint[]): string {
  const coords = points.map((p) => `${p.lon} ${p.lat}`).join(", ");
  return `SRID=4326;LINESTRING(${coords})`;
}

const CIRCULAR_CLOSE_KM = 0.2;

// A track whose start and end are close together reads as a loop; a
// track that ends somewhere else reads as a one-way or out-and-back walk.
// Best-effort default the admin can still change on the trail's edit form.
export function inferTrailType(points: GpxPoint[]): "circular" | "out_and_back" {
  if (points.length < 2) return "out_and_back";
  const start = points[0];
  const end = points[points.length - 1];
  return haversineKm(start, end) <= CIRCULAR_CLOSE_KM ? "circular" : "out_and_back";
}
