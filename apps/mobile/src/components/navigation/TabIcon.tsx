import {
  BookMarked,
  CircleUserRound,
  Compass,
  Map as MapIcon,
  ScanLine,
  type LucideIcon,
} from "lucide-react-native";
import type { ColorValue } from "react-native";

type TabIconName = "discover" | "map" | "check-in" | "passport" | "account";

type TabIconProps = {
  name: TabIconName;
  color: ColorValue;
};

const icons: Record<TabIconName, LucideIcon> = {
  discover: Compass,
  map: MapIcon,
  "check-in": ScanLine,
  passport: BookMarked,
  account: CircleUserRound,
};

export function TabIcon({ name, color }: TabIconProps) {
  const Icon = icons[name];
  return <Icon size={24} color={color as string} strokeWidth={2} />;
}
