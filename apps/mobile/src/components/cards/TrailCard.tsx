import { Link } from "expo-router";
import {
  ArrowLeftRight,
  Clock,
  Footprints,
  MoveRight,
  Mountain,
  RotateCw,
  Ruler,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { TopoContours } from "../TopoContours";
import { InfoChip } from "../InfoChip";
import { theme } from "../../theme";
import type { Trail, TrailType } from "@waypoint/types";

type TrailCardProps = {
  trail: Trail;
};

const trailTypeIcons: Record<TrailType, LucideIcon> = {
  circular: RotateCw,
  linear: MoveRight,
  out_and_back: ArrowLeftRight,
};

export function TrailCard({ trail }: TrailCardProps) {
  const TypeIcon = trailTypeIcons[trail.type];

  return (
    <Link href={`/trail/${trail.slug}`} asChild>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.hero}>
          <TopoContours />
          <View style={styles.heroGlyph}>
            <Mountain size={48} color={theme.colors.primary} strokeWidth={1.5} />
          </View>

          <View style={styles.heroBadge}>
            <TypeIcon size={13} color={theme.colors.primary} strokeWidth={2} />
            <AppText variant="label" style={styles.heroBadgeText}>
              {trail.type.replace("_", " ")}
            </AppText>
          </View>

          <View style={styles.heroCaption}>
            <AppText variant="heading" style={styles.heroTitle}>
              {trail.name}
            </AppText>
            <AppText style={styles.heroSubtitle}>{trail.region}</AppText>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.meta}>
            <InfoChip label={trail.distance} icon={Ruler} />
            <InfoChip label={trail.difficulty} icon={Footprints} tone="success" />
            <InfoChip label={trail.duration} icon={Clock} />
          </View>

          <AppText muted>
            Check recent observations before setting off.
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
    boxShadow: "0 3px 8px rgba(47, 51, 40, 0.06)",
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  hero: {
    height: 150,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "flex-end",
    padding: theme.spacing.md,
  },
  heroGlyph: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.md,
    opacity: 0.35,
  },
  heroBadge: {
    position: "absolute",
    top: theme.spacing.md,
    left: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
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
  body: {
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.sm,
  },
});
