import { View } from "react-native";
import { AppText } from "../AppText";
import { PrimaryButton } from "../PrimaryButton";
import { theme } from "../../theme";
import { waypointEmptyStates, type EmptyStateKey } from "../../content/waypointCopy";

type WaypointEmptyStateProps = {
  state: EmptyStateKey;
  onAction?: () => void;
};

export function WaypointEmptyState({ state, onAction }: WaypointEmptyStateProps) {
  const copy = waypointEmptyStates[state];

  return (
    <View style={{ gap: theme.spacing.md, paddingVertical: theme.spacing.lg }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: theme.colors.primarySoft,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppText variant="heading">⌁</AppText>
      </View>
      <View style={{ gap: theme.spacing.xs }}>
        <AppText variant="heading">{copy.title}</AppText>
        <AppText muted>{copy.body}</AppText>
      </View>
      {copy.action && onAction ? <PrimaryButton label={copy.action} onPress={onAction} /> : null}
    </View>
  );
}
