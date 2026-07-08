import { Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { theme } from "../theme";

type FilterChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : undefined]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <AppText
        variant="label"
        style={active ? styles.labelActive : styles.label}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  label: {
    color: theme.colors.textMuted,
    textTransform: "capitalize",
  },
  labelActive: {
    color: theme.colors.surface,
    textTransform: "capitalize",
  },
});
