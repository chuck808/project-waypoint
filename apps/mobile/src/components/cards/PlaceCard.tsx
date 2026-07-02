import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { theme } from "../../theme";

type PlaceCardProps = {
  place: {
    id: string;
    name: string;
    category: string;
    note: string;
    distance: string;
    welcome: string;
  };
};

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link href={`/places/${place.id}`} style={styles.link}>
      <View style={styles.card}>
        <AppText variant="label" muted>
          {place.category} · {place.distance}
        </AppText>

        <AppText variant="heading">{place.name}</AppText>

        <AppText muted>{place.note}</AppText>

        <View style={styles.badge}>
          <AppText variant="label">{place.welcome}</AppText>
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
    padding: theme.spacing.lg,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: 999,
    backgroundColor: theme.colors.primarySoft,
  },
});