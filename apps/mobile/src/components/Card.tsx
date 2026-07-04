import { StyleSheet, View, type ViewProps } from "react-native";
import { theme } from "../theme";

/**
 * The house card: surface background, hairline border, comfortable
 * padding. Extracted after the same recipe appeared in three check-in
 * screens; the Passport timeline is its first native consumer.
 */
export function Card({ style, ...rest }: ViewProps) {
  return <View style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
