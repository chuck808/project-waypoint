import { StyleSheet, View } from "react-native";
import { AppText, PassportStamp, PrimaryLink, Screen } from "../src/components";
import { passportStamps } from "../src/data/passport";
import { theme } from "../src/theme";

export default function PassportScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="label" muted>
          Passport
        </AppText>

        <AppText variant="title">Your journeys, remembered.</AppText>

        <AppText muted>
          Stamps are not trophies. They are small records of places, trails and
          moments worth keeping.
        </AppText>
      </View>

      <View style={styles.summary}>
        <AppText variant="heading">{passportStamps.length}</AppText>
        <AppText muted>memories added so far</AppText>
      </View>

      <View style={styles.list}>
        {passportStamps.map((stamp) => (
          <PassportStamp key={stamp.id} stamp={stamp} />
        ))}
      </View>

      <PrimaryLink href="/">Back home</PrimaryLink>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  summary: {
    padding: theme.spacing.lg,
    borderRadius: 18,
    backgroundColor: theme.colors.primarySoft,
    marginBottom: theme.spacing.xl,
  },
  list: {
    gap: theme.spacing.md,
  },
});
