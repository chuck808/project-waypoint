export function toPointWkt(lat: number, lon: number): string {
  return `SRID=4326;POINT(${lon} ${lat})`;
}
