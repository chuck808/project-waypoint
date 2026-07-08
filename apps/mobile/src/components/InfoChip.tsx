import { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { AppText } from "./AppText";
import { theme } from "../theme";

type InfoChipTone = "neutral" | "success" | "warning" | "accent" | "error";

type InfoChipProps = {
  label: string;
  icon?: ReactNode;
  tone?: InfoChipTone;
};

const toneStyles: Record<InfoChipTone, ViewStyle> = {
  neutral: { backgroundColor: theme.colors.surface },
  success: { backgroundColor: theme.colors.primarySoft },
  warning: { backgroundColor: theme.colors.warningSoft },
  accent: { backgroundColor: theme.colors.accentSoft },
  error: { backgroundColor: theme.colors.errorSoft },
};

export function InfoChip({ label, icon, tone = "neutral" }: InfoChipProps) {
  return (
    <View style={[styles.chip, toneStyles[tone]]}>
      {icon ? <AppText variant="label">{icon}</AppText> : null}
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    alignSelf: "flex-start",
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    color: theme.colors.text,
  },
});
