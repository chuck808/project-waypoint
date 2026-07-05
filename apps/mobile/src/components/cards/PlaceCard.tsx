import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { theme } from "../../theme";
import { getCategoryStyle } from "../../theme/categoryStyles";
import type { Place } from "@waypoint/types";

type PlaceCardProps = {
  place: Place;
};

export function PlaceCard({ place }: PlaceCardProps) {
  const category = getCategoryStyle(place.category);

  return (
    <Link href={`/places/${place.id}`} style={styles.link}>
      <View style={styles.card}>
        <View style={[styles.swatch, { backgroundColor: category.bg }]}>
          <AppText variant="heading">{category.icon}</AppText>
        </View>

        <View style={styles.content}>
          <AppText variant="heading">{place.name}</AppText>

          <AppText variant="label" muted>
            {place.displayCategory} · {place.distance}
          </AppText>

          {place.welcome ? (
            <View style={styles.badge}>
              <AppText variant="label" style={{ color: category.fg }}>
                {place.welcome}
              </AppText>
            </View>
          ) : null}
        </View>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: "none",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.card,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
  },
});
