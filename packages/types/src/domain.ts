export type TrailDifficulty = "easy" | "moderate" | "hard" | "expert";

export type TrailType = "circular" | "linear" | "out_and_back";

export type PlaceCategory =
  | "cafe"
  | "pub"
  | "farm_shop"
  | "water"
  | "viewpoint"
  | "honesty_box"
  | "shelter"
  | "other";

export type Trail = {
  id: string;
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
