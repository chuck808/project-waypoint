import { StyleSheet, View } from "react-native";
import { AppText, PrimaryLink, Screen } from "../../src/components";
import { theme } from "../../src/theme";

export default function ScanScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="label" muted>
          Waypoint QR
        </AppText>

        <AppText variant="title">Record a visit.</AppText>

        <AppText muted>
          Scan a Waypoint QR code at a participating place to add it to your
          journey.
        </AppText>
      </View>

      <View style={styles.scanner}>
        <AppText variant="label" muted>
          Camera preview placeholder
        </AppText>
      </View>

      <PrimaryLink href="/scan/success">Simulate scan</PrimaryLink>
      <PrimaryLink href="/discover">Back to discover</PrimaryLink>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  scanner: {
    height: 260,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
});
