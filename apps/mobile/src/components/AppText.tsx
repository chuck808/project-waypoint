import { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import { theme } from "../theme";

type AppTextProps = {
  children: ReactNode;
  variant?: "title" | "heading" | "body" | "label";
  muted?: boolean;
};

export function AppText({
  children,
  variant = "body",
  muted = false,
}: AppTextProps) {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        muted ? styles.muted : undefined,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: theme.colors.text,
  },
  title: theme.typography.title,
  heading: theme.typography.heading,
  body: theme.typography.body,
  label: theme.typography.label,
  muted: {
    color: theme.colors.textMuted,
  },
});
