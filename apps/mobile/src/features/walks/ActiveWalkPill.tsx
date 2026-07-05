import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../../components";
import { theme } from "../../theme";
import { useActiveWalk } from "./ActiveWalkContext";

/** Compact status chip for screens that just need to say "you're on a
 *  walk" without the full banner + Finish button (see ActiveWalkBanner).
 *  "Change" hands off to Discover, where starting a different trail
 *  goes through the same explicit switch-confirmation as everywhere else. */
export function ActiveWalkPill() {
  const { activeWalk } = useActiveWalk();

  if (!activeWalk) return null;

  return (
    <View style={styles.pill}>
      <AppText variant="label" style={styles.text}>
        🚶 Walking {activeWalk.trailName}
      </AppText>

      <Pressable onPress={() => router.push("/discover")}>
        <AppText variant="label" style={styles.change}>
          Change
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
  },
  text: {
    color: theme.colors.primary,
    flexShrink: 1,
  },
  change: {
    color: theme.colors.accent,
  },
});
