import { StyleSheet, View } from "react-native";
import { AppText, PrimaryLink, Screen, TrailCard } from "../src/components";
import { trails } from "../src/data/trails";
import { theme } from "../src/theme";

export default function DiscoverScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="label" muted>
          Discover
        </AppText>
        <AppText variant="title">Where would you like to walk today?</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="label" muted>
          Popular nearby
        </AppText>

        <TrailCard trail={trails[0]} />
      </View>

      <PrimaryLink href="/">Back home</PrimaryLink>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  section: {
    gap: theme.spacing.md,
  },
});
