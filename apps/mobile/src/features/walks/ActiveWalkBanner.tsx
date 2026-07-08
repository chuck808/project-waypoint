import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Card, PrimaryButton } from "../../components";
import { theme } from "../../theme";
import { useActiveWalk } from "./ActiveWalkContext";

/** Nothing to show once no walk is active -- the banner earns its
 *  place only while there is something to finish. */
export function ActiveWalkBanner() {
  const { activeWalk } = useActiveWalk();

  if (!activeWalk) return null;

  return (
    <Card style={styles.banner}>
      <View style={styles.text}>
        <AppText variant="label" muted>
          Currently walking
        </AppText>
        <AppText variant="heading">{activeWalk.trailName}</AppText>
      </View>

      <PrimaryButton onPress={() => router.push("/walk/finish")}>Finish walk</PrimaryButton>
    </Card>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  text: {
    flexShrink: 1,
    gap: theme.spacing.xs,
  },
});
