import { Link } from "expo-router";
import { Footprints, MapPin } from "lucide-react-native";
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
  const CategoryIcon = category.icon;

  return (
    <Link href={`/places/${place.id}`} asChild>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={[styles.swatch, { backgroundColor: category.bg }]}>
          <CategoryIcon size={26} color={category.fg} strokeWidth={2} />
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
              <InfoChip label={place.welcome} icon={Footprints} tone="success" />
            ) : null}
            <InfoChip label="Useful stop" icon={MapPin} />
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
    boxShadow: "0 2px 6px rgba(47, 51, 40, 0.05)",
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
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
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
});
