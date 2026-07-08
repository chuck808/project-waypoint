import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { InfoChip } from "../InfoChip";
import { theme } from "../../theme";
import { getCategoryStyle } from "../../theme/categoryStyles";
import type { Place } from "@waypoint/types";

type PlaceCardProps = {
  place: Place;
};

export function PlaceCard({ place }: PlaceCardProps) {
  const category = getCategoryStyle(place.category);

  return (
    <Link href={`/places/${place.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={[styles.swatch, { backgroundColor: category.bg }]}>
          <AppText variant="heading">{category.icon}</AppText>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <AppText variant="heading" style={styles.title}>{place.name}</AppText>
            <AppText variant="label" muted>{place.distance}</AppText>
          </View>

          <AppText variant="label" muted>
            {place.displayCategory}
          </AppText>

          <View style={styles.chips}>
            {place.welcome ? (
              <InfoChip label={place.welcome} icon="🥾" tone="success" />
            ) : null}
            <InfoChip label="Useful stop" icon="📍" />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  swatch: {
    width: 58,
    height: 58,
    borderRadius: theme.radius.card,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  title: {
    flex: 1,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
});
