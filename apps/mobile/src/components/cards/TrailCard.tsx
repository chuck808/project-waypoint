import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { theme } from "../../theme";
import type { Trail, TrailType } from "@waypoint/types";

type TrailCardProps = {
  trail: Trail;
};

const trailTypeGlyphs: Record<TrailType, string> = {
  circular: "⟲",
  linear: "→",
  out_and_back: "⇄",
};

export function TrailCard({ trail }: TrailCardProps) {
  return (
    <Link href={`/trail/${trail.slug}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.hero}>
          <AppText style={styles.heroGlyph}>⛰</AppText>

          <View style={styles.heroBadge}>
            <AppText variant="label" style={styles.heroBadgeText}>
              {trailTypeGlyphs[trail.type]} {trail.type.replace("_", " ")}
            </AppText>
          </View>

          <View style={styles.heroCaption}>
            <AppText variant="heading" style={styles.heroTitle}>
              {trail.name}
            </AppText>
            <AppText style={styles.heroSubtitle}>{trail.region}</AppText>
          </View>
        </View>

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
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.frame,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  hero: {
    height: 140,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "flex-end",
    padding: theme.spacing.md,
  },
  heroGlyph: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.md,
    fontSize: 40,
    opacity: 0.35,
  },
  heroBadge: {
    position: "absolute",
    top: theme.spacing.md,
    left: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
  },
  heroBadgeText: {
    color: theme.colors.primary,
    textTransform: "capitalize",
  },
  heroCaption: {
    gap: theme.spacing.xs,
  },
  heroTitle: {
    color: theme.colors.text,
  },
  heroSubtitle: {
    color: theme.colors.textMuted,
  },
  meta: {
    flexDirection: "row",
    gap: theme.spacing.md,
    flexWrap: "wrap",
    paddingHorizontal: theme.spacing.md,
  },
});
