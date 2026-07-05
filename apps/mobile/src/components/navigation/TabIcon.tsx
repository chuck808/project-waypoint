import { Text, type ColorValue } from "react-native";

type TabIconName = "discover" | "map" | "check-in" | "passport" | "account";

type TabIconProps = {
  name: TabIconName;
  color: ColorValue;
};

const icons: Record<TabIconName, string> = {
  discover: "⌕",
  map: "⌖",
  "check-in": "✓",
  passport: "◉",
  account: "◎",
};

export function TabIcon({ name, color }: TabIconProps) {
  return <Text style={{ color, fontSize: 22, lineHeight: 24 }}>{icons[name]}</Text>;
}
