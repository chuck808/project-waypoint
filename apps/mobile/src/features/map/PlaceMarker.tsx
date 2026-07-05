import { StyleSheet, View } from "react-native";
import { AppText } from "../../components";
import { getCategoryStyle } from "../../theme/categoryStyles";
import type { PlaceMapPoint } from "../../services/places";

type PlaceMarkerProps = {
  place: PlaceMapPoint;
};

export function PlaceMarker({ place }: PlaceMarkerProps) {
  const category = getCategoryStyle(place.category);

  return (
    <View
      style={[
        styles.marker,
        { backgroundColor: category.bg, borderColor: category.fg },
      ]}
    >
      <AppText variant="label">{category.icon}</AppText>
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
