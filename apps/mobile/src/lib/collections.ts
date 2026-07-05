/** Count of distinct, truthy values of one field across a list. */
export function countDistinctBy<T>(items: T[], key: keyof T): number {
  return new Set(items.map((item) => item[key]).filter(Boolean)).size;
}
