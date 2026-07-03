import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppText } from "../../components";
import { theme } from "../../theme";
import { CheckInAlreadyVisited } from "./CheckInAlreadyVisited";
import { CheckInEntry } from "./CheckInEntry";
import { CheckInNotRecognised } from "./CheckInNotRecognised";
import { CheckInReady } from "./CheckInReady";
import { CheckInRecorded } from "./CheckInRecorded";
import { useCheckInJourney } from "./useCheckInJourney";

/**
 * One component owns the journey; each state owns one screen. When the
 * scanner arrives it becomes another way of producing submitCode(code) —
 * nothing below the idle state changes.
 */
export function CheckInResolver() {
  const { state, submitCode, confirmVisit, reset } = useCheckInJourney();

  switch (state.status) {
    case "idle":
      return <CheckInEntry onSubmit={submitCode} />;

    case "resolving":
      return (
        <View style={styles.resolving}>
          <ActivityIndicator color={theme.colors.primary} />
          <AppText variant="label" muted>
            Resolving location…
          </AppText>
        </View>
      );

    case "ready":
    case "recording":
      return (
        <CheckInReady
          resolution={state.resolution}
          recordError={state.status === "ready" ? state.recordError : undefined}
          isRecording={state.status === "recording"}
          onConfirm={confirmVisit}
          onDismiss={reset}
        />
      );

    case "already_visited":
      return (
        <CheckInAlreadyVisited
          placeName={state.placeName}
          businessName={state.businessName}
          lastVisitedAt={state.lastVisitedAt}
          onDismiss={reset}
        />
      );

    case "recorded":
      return (
        <CheckInRecorded
          placeName={state.placeName}
          businessName={state.businessName}
          stampTitle={state.stampTitle}
          onDismiss={reset}
        />
      );

    case "not_recognised":
      return <CheckInNotRecognised reason={state.reason} onRetry={reset} />;
  }
}

const styles = StyleSheet.create({
  resolving: {
    gap: theme.spacing.md,
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
});
