import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { theme } from "../../theme";
import type { Trail } from "@waypoint/types";

type TrailCardProps = {
  trail: Trail;
};

export function TrailCard({ trail }: TrailCardProps) {
  return (
    <Link href={`/trail/${trail.id}`} style={styles.link}>
      <View style={styles.card}>
        <AppText variant="heading">{trail.name}</AppText>
        <AppText muted>{trail.region}</AppText>

        <View style={styles.meta}>
          <AppText variant="label" muted>
            {trail.distance}
          </AppText>
          <AppText variant="label" muted>
            {trail.difficulty}
          </AppText>
          <AppText variant="label" muted>
            {trail.duration}
          </AppText>
        </View>

        <AppText variant="label">{trail.type}</AppText>
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
  meta: {
    flexDirection: "row",
    gap: theme.spacing.md,
    flexWrap: "wrap",
    marginTop: theme.spacing.sm,
  },
});
