import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppText, Card, PrimaryButton, Screen } from "../../components";
import { completeOnboarding } from "../../services/onboarding";
import { theme } from "../../theme";

type OnboardingStep = {
  eyebrow: string;
  title: string;
  body: string;
  illustration: string;
  points: string[];
};

const steps: OnboardingStep[] = [
  {
    eyebrow: "Welcome to Waypoint",
    title: "Make every walk worth remembering.",
    body:
      "Waypoint helps you discover meaningful walks, check in along the way, and keep the moments that made the day special.",
    illustration: "🥾",
    points: ["Discover walks and places", "Check in with QR waypoints", "Build a walking Passport"],
  },
  {
    eyebrow: "Discover",
    title: "Find walks with places built in.",
    body:
      "Routes, cafés, viewpoints, heritage spots and practical stops all support the walk rather than distract from it.",
    illustration: "🗺️",
    points: ["Browse trails", "Find walker-friendly places", "See what is useful nearby"],
  },
  {
    eyebrow: "Remember",
    title: "Your Passport grows as you explore.",
    body:
      "Check-ins become a timeline of walks, visits and memories you can return to long after the mud has dried.",
    illustration: "📖",
    points: ["Record visits", "Keep moments", "Reconnect with favourite walks"],
  },
  {
    eyebrow: "Share useful knowledge",
    title: "Leave the next walker better informed.",
    body:
      "A quick Field Note can warn someone about a boggy stretch, a wobbly bridge, or a café that welcomes muddy boots.",
    illustration: "🌿",
    points: ["Report current conditions", "Share factual tips", "Help places and walkers"],
  },
];

export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  const progressLabel = useMemo(
    () => `${index + 1} of ${steps.length}`,
    [index],
  );

  async function finish() {
    try {
      await completeOnboarding();
    } catch {
      // Best-effort persistence: if the write fails, the walker still
      // gets into the app. Onboarding may simply show again next launch.
    }

    router.replace("/discover");
  }

  function next() {
    if (isLast) {
      void finish();
      return;
    }

    setIndex((current) => current + 1);
  }

  function back() {
    setIndex((current) => Math.max(0, current - 1));
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <AppText variant="label" muted>
            {progressLabel}
          </AppText>

          <Pressable onPress={finish} accessibilityRole="button">
            <AppText variant="label" muted>
              Skip
            </AppText>
          </Pressable>
        </View>

        <Card style={styles.card}>
          <View style={styles.illustrationWrap}>
            <AppText style={styles.illustration}>{step.illustration}</AppText>
          </View>

          <AppText variant="label" muted style={styles.eyebrow}>
            {step.eyebrow}
          </AppText>

          <AppText variant="title" style={styles.title}>
            {step.title}
          </AppText>

          <AppText muted style={styles.body}>
            {step.body}
          </AppText>

          <View style={styles.pointList}>
            {step.points.map((point) => (
              <View key={point} style={styles.pointRow}>
                <View style={styles.pointDot} />
                <AppText>{point}</AppText>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.dots} accessibilityLabel={progressLabel}>
          {steps.map((item, dotIndex) => (
            <View
              key={item.eyebrow}
              style={[styles.dot, dotIndex === index ? styles.dotActive : undefined]}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <PrimaryButton onPress={next}>
            {isLast ? "Start walking" : "Continue"}
          </PrimaryButton>

          {index > 0 ? (
            <Pressable onPress={back} style={styles.secondaryAction} accessibilityRole="button">
              <AppText variant="label" muted>
                Back
              </AppText>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: theme.spacing.lg,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    gap: theme.spacing.md,
  },
  illustrationWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  illustration: {
    fontSize: 40,
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  body: {
    lineHeight: 22,
  },
  pointList: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  pointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
  actions: {
    gap: theme.spacing.sm,
  },
  secondaryAction: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
});
