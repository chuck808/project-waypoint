import { Alert, Platform } from "react-native";

/**
 * react-native-web's Alert.alert() is a no-op stub, so a native-only
 * confirm would make switching silently impossible on web instead of
 * silently automatic -- worse than what it replaced. window.confirm
 * is the web equivalent good enough for a single yes/no gate.
 */
export function confirmSwitchWalk(
  currentTrailName: string,
  nextTrailName: string,
  onConfirm: () => void,
): void {
  const message = `You're currently walking ${currentTrailName}. Switching will end that walk and start ${nextTrailName} instead.`;

  if (Platform.OS === "web") {
    if (window.confirm(`Switch to this walk?\n\n${message}`)) {
      onConfirm();
    }
    return;
  }

  Alert.alert("Switch to this walk?", message, [
    { text: "Cancel", style: "cancel" },
    { text: "Switch to this walk", onPress: onConfirm },
  ]);
}
