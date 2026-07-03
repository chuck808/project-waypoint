import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { AppText, PrimaryButton, PrimaryLink } from "../../components";
import { theme } from "../../theme";

type CheckInRecordedProps = {
  placeName: string;
  businessName: string;
  stampTitle?: string;
  onDismiss: () => void;
};

export function CheckInRecorded({
  placeName,
  businessName,
  stampTitle,
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
        <AppText variant="title">✓</AppText>
      </Animated.View>

      <View style={styles.header}>
        <AppText variant="title">Visit remembered.</AppText>

        <AppText muted>
          {placeName} · {businessName}
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
    width: 88,
    height: 88,
    borderRadius: 999,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primarySoft,
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
