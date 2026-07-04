import { StyleSheet, View } from "react-native";
import { AppText, PrimaryButton, PrimaryLink } from "../../components";
import { theme } from "../../theme";
import { formatVisitTime } from "./formatVisitTime";

type CheckInAlreadyVisitedProps = {
  placeName: string;
  businessName: string;
  lastVisitedAt: string;
  onDismiss: () => void;
};

export function CheckInAlreadyVisited({
  placeName,
  businessName,
  lastVisitedAt,
  onDismiss,
}: CheckInAlreadyVisitedProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="label" muted>
          Welcome back
        </AppText>

        <AppText variant="title">{placeName}</AppText>

        {businessName !== placeName ? (
          <AppText muted>{businessName}</AppText>
        ) : null}
      </View>

      <View style={styles.card}>
        <AppText>You already checked in here today.</AppText>

        <AppText variant="label" muted>
          Last visit: {formatVisitTime(lastVisitedAt)}
        </AppText>
      </View>

      <PrimaryLink href="/passport">View my Passport</PrimaryLink>

      <PrimaryButton onPress={onDismiss}>Done</PrimaryButton>
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
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
