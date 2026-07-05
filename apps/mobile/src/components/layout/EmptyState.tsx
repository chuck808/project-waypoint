import { View } from "react-native";
import { AppText } from "../AppText";
import { theme } from "../../theme";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <AppText variant="heading">{title}</AppText>
      {description ? <AppText muted>{description}</AppText> : null}
    </View>
  );
}
