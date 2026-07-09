import { Leaf } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { AppText, Card, DetailSection, InfoChip, KeyValueRow } from "../../components";
import { theme } from "../../theme";

type ExtendedPlaceContent = {
  walkingContext?: string | null;
  placeStory?: string | null;
  accessibilityNotes?: string | null;
  bestSeasons?: string[] | null;
};

type PlaceContentSectionsProps = {
  content: ExtendedPlaceContent;
};

export function PlaceContentSections({ content }: PlaceContentSectionsProps) {
  const hasStory = Boolean(content.walkingContext || content.placeStory);
  const hasPlanning = Boolean(content.accessibilityNotes || content.bestSeasons?.length);

  if (!hasStory && !hasPlanning) return null;

  return (
    <>
      {hasStory ? (
        <DetailSection title="Why it matters" eyebrow="Place context">
          <Card style={styles.card}>
            {content.walkingContext ? (
              <AppText>{content.walkingContext}</AppText>
            ) : null}
            {content.placeStory ? (
              <AppText muted>{content.placeStory}</AppText>
            ) : null}
          </Card>
        </DetailSection>
      ) : null}

      {hasPlanning ? (
        <DetailSection title="Planning notes" eyebrow="Useful before you go">
          <Card style={styles.card}>
            {content.accessibilityNotes ? (
              <KeyValueRow label="Accessibility" value={content.accessibilityNotes} />
            ) : null}
            {content.bestSeasons?.length ? (
              <View style={styles.chips}>
                {content.bestSeasons.map((season) => (
                  <InfoChip key={season} icon={Leaf} label={season} />
                ))}
              </View>
            ) : null}
          </Card>
        </DetailSection>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
});
