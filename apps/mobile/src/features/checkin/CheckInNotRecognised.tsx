import { StyleSheet, View } from "react-native";
import { AppText, PrimaryButton } from "../../components";
import { theme } from "../../theme";
import type { CheckInState } from "./checkInMachine";

type NotRecognisedReason = Extract<
  CheckInState,
  { status: "not_recognised" }
>["reason"];

/**
 * The service reports reasons; the UI owns the words. Tone, phrasing and
 * (one day) translation all live here, never in the service layer.
 */
const reasonCopy: Record<NotRecognisedReason, string> = {
  unknown_code:
    "We couldn't find a place for that code. Check the sign and try again.",
  expired: "That code is no longer in use. The sign may need replacing.",
  revoked: "That code is no longer in use. The sign may need replacing.",
  place_unavailable: "This place isn't accepting check-ins at the moment.",
};

type CheckInNotRecognisedProps = {
  reason: NotRecognisedReason;
  onRetry: () => void;
};

export function CheckInNotRecognised({
  reason,
  onRetry,
}: CheckInNotRecognisedProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="label" muted>
          Check in
        </AppText>

        <AppText variant="title">Hmm, that didn't work.</AppText>
      </View>

      <View style={styles.card}>
        <AppText muted>{reasonCopy[reason]}</AppText>
      </View>

      <PrimaryButton onPress={onRetry}>Try another code</PrimaryButton>
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
  card: {
    padding: theme.spacing.lg,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
