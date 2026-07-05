export type TrailDifficulty = "easy" | "moderate" | "hard" | "expert";

export type TrailType = "circular" | "linear" | "out_and_back";

/** Matches businesses_category_check in the database exactly. */
export type PlaceCategory =
  | "cafe"
  | "pub"
  | "farm_shop"
  | "campsite"
  | "outdoor_shop"
  | "attraction"
  | "other";

export type Trail = {
  /** The trail's identity: the database uuid, as written to check_ins.trail_id. */
  id: string;
  /** The trail's address: the URL-friendly handle used in routes. */
  slug: string;
  name: string;
  region: string;
  distance: string;
  difficulty: TrailDifficulty;
  duration: string;
  type: TrailType;
  description: string;
};

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  displayCategory: string;
  description: string;
  note: string;
  distance: string;
  facilities: string[];
  welcome: string;
  openingHours: string;
};

export type PassportStamp = {
  id: string;
  title: string;
  date: string;
  source: string;
  description: string;
};
