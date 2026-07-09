import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../theme";

type ScreenProps = {
  children: ReactNode;
  /**
   * Vertically centre the content. For sparse, single-purpose screens
   * (auth, the pre-redirect loading state). Content screens read from
   * the top like every other app.
   */
  centered?: boolean;
};

export function Screen({ children, centered = false }: ScreenProps) {
  // The old justifyContent:center hid the fact that Screen never
  // respected the status bar; top-aligned content exposed it. Insets
  // are additive so web (where they're 0) keeps the plain padding.
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: theme.spacing.lg + insets.top },
        centered && styles.centered,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  centered: {
    justifyContent: "center",
  },
});
