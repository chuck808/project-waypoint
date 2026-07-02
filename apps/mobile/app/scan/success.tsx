import { StyleSheet, View } from "react-native";
import { AppText, PrimaryLink, Screen } from "../../src/components";
import { theme } from "../../src/theme";

export default function ScanSuccessScreen() {
  return (
    <Screen>
      <View style={styles.mark}>
        <AppText variant="heading">✓</AppText>
      </View>

      <View style={styles.header}>
        <AppText variant="label" muted>
          Visit remembered
        </AppText>

        <AppText variant="title">
          Your visit has been added to your journey.
        </AppText>

        <AppText muted>
          The Old Barn Café is now part of your Passport. Enjoy the rest of your
          walk.
        </AppText>
      </View>

      <PrimaryLink href="/passport">View passport</PrimaryLink>
      <PrimaryLink href="/discover">Continue exploring</PrimaryLink>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mark: {
    width: 72,
    height: 72,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primarySoft,
    marginBottom: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
