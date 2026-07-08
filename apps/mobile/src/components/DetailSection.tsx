import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "./AppText";
import { theme } from "../theme";

type DetailSectionProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

export function DetailSection({ title, eyebrow, children }: DetailSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        {eyebrow ? (
          <AppText variant="label" muted>
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant="heading">{title}</AppText>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  heading: {
    gap: theme.spacing.xs,
  },
});
