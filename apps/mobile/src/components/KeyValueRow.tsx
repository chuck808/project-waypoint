import { StyleSheet, View } from "react-native";
import { AppText } from "./AppText";
import { theme } from "../theme";

type KeyValueRowProps = {
  label: string;
  value: string;
};

export function KeyValueRow({ label, value }: KeyValueRowProps) {
  return (
    <View style={styles.row}>
      <AppText muted>{label}</AppText>
      <AppText variant="label" style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  value: {
    flexShrink: 0,
    color: theme.colors.text,
  },
});
