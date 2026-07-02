import { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { theme } from "../theme";

type PrimaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
};

export function PrimaryButton({ children, onPress }: PrimaryButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <AppText variant="label">{children}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 999,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
});
