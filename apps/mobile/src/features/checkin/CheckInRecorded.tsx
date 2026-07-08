import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { AppText, PrimaryButton, PrimaryLink } from "../../components";
import { FieldNotePrompt } from "../field_notes";
import { VenueStamp, resolveMark } from "../stamps";
import { theme } from "../../theme";

type CheckInRecordedProps = {
  placeName: string;
  businessName: string;
  stampTitle?: string;
  checkInId: string;
  businessLocationId: string;
  trailId?: string;
  onDismiss: () => void;
};

export function CheckInRecorded({
  placeName,
  businessName,
  stampTitle,
  checkInId,
  businessLocationId,
  trailId,
  onDismiss,
}: CheckInRecordedProps) {
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.stampMark, { opacity, transform: [{ scale }] }]}
      >
        <VenueStamp
          mark={resolveMark(businessName)}
          size={132}
          seed={placeName}
          dateText={new Date()
            .toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
            .toUpperCase()}
        />
      </Animated.View>

      <View style={styles.header}>
        <AppText variant="title">Visit remembered.</AppText>

        <AppText muted>
          {businessName !== placeName
            ? `${placeName} · ${businessName}`
            : placeName}
        </AppText>
      </View>

      {stampTitle ? (
        <View style={styles.stampCard}>
          <AppText variant="label" muted>
            Added to your Passport
          </AppText>
          <AppText variant="heading">{stampTitle}</AppText>
        </View>
      ) : null}

      <FieldNotePrompt
        checkInId={checkInId}
        businessLocationId={businessLocationId}
        trailId={trailId}
        onSkip={onDismiss}
      />

      <PrimaryLink href="/passport">View my Passport</PrimaryLink>

      <PrimaryButton onPress={onDismiss}>Done</PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
    alignItems: "stretch",
  },
  stampMark: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.sm,
    alignItems: "center",
  },
  stampCard: {
    gap: theme.spacing.xs,
    padding: theme.spacing.lg,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
});
