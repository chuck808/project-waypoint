import { View } from "react-native";
import { AppText } from "../AppText";
import { theme } from "../../theme";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <View style={{ gap: theme.spacing.md, marginBottom: theme.spacing.xl }}>
      {eyebrow ? (
        <AppText variant="label" muted>
          {eyebrow}
        </AppText>
      ) : null}
      <AppText variant="title">{title}</AppText>
      {description ? <AppText muted>{description}</AppText> : null}
    </View>
  );
}
