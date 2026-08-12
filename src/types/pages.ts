// Kanae returns `data: null` for an empty page (e.g. a brand-new member's
// first dashboard load), so it could be both T[] or undefined
export interface KanaePage<T> {
  data: T[] | undefined;
  total: number;
}
