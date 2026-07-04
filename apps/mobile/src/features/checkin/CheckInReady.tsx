import { StyleSheet, View } from "react-native";
import { AppText, PrimaryButton } from "../../components";
import { theme } from "../../theme";
import type { ReadyResolution } from "./checkInMachine";

type CheckInReadyProps = {
  resolution: ReadyResolution;
  recordError?: string;
  isRecording: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

export function CheckInReady({
  resolution,
  recordError,
  isRecording,
  onConfirm,
  onDismiss,
}: CheckInReadyProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="label" muted>
          Welcome to
        </AppText>

        <AppText variant="title">{resolution.placeName}</AppText>

        {resolution.businessName !== resolution.placeName ? (
          <AppText muted>{resolution.businessName}</AppText>
        ) : null}
      </View>

      {resolution.welcomeMessage ? (
        <View style={styles.welcome}>
          <AppText>“{resolution.welcomeMessage}”</AppText>
        </View>
      ) : null}

      {resolution.stamp ? (
        <View style={styles.stampCard}>
          <View style={styles.stampMark}>
            <AppText variant="label">✓</AppText>
          </View>

          <View style={styles.stampContent}>
            <AppText variant="label" muted>
              You'll earn
            </AppText>
            <AppText variant="heading">{resolution.stamp.title}</AppText>
          </View>
        </View>
      ) : null}

      {recordError ? (
        <AppText variant="label" muted>
          {recordError} Please try again.
        </AppText>
      ) : null}

      <PrimaryButton onPress={onConfirm}>
        {isRecording ? "Adding to your Passport…" : "Add to my Passport"}
      </PrimaryButton>

      {!isRecording ? (
        <PrimaryButton onPress={onDismiss}>Not now</PrimaryButton>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.sm,
  },
  welcome: {
    padding: theme.spacing.lg,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stampCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: 18,
    backgroundColor: theme.colors.primarySoft,
  },
  stampMark: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  stampContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
});
