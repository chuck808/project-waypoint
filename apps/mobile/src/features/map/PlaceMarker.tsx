import { StyleSheet, View } from "react-native";
import { getCategoryStyle } from "../../theme/categoryStyles";
import type { PlaceMapPoint } from "../../services/places";

type PlaceMarkerProps = {
  place: PlaceMapPoint;
};

export function PlaceMarker({ place }: PlaceMarkerProps) {
  const category = getCategoryStyle(place.category);
  const CategoryIcon = category.icon;

  return (
    <View
      style={[
        styles.marker,
        { backgroundColor: category.bg, borderColor: category.fg },
      ]}
    >
      <CategoryIcon size={16} color={category.fg} strokeWidth={2.25} />
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
