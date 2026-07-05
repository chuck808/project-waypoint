import { StyleSheet, View } from "react-native";
import { Screen } from "../../src/components";
import { PageHeader } from "../../src/components/layout/PageHeader";
import { ActiveWalkBanner } from "../../src/features/walks";
import { WalkingMap } from "../../src/features/map";
import { theme } from "../../src/theme";

export default function MapScreen() {
  return (
    <Screen>
      <PageHeader eyebrow="Map" title="See the walk around you." />

      <ActiveWalkBanner />

      <View style={styles.mapFrame}>
        <WalkingMap />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapFrame: {
    flex: 1,
    borderRadius: theme.radius.frame,
    overflow: "hidden",
    marginTop: theme.spacing.md,
  },
});
