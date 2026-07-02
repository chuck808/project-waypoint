import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "../theme";

type SectionProps = {
  children: ReactNode;
};

export function Section({ children }: SectionProps) {
  return <View style={styles.section}>{children}</View>;
}

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.section,
  },
});
