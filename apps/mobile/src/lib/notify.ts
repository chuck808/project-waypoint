import { Alert, Platform } from "react-native";

/**
 * react-native-web's Alert.alert() is a no-op stub, so a native-only
 * notice would silently vanish on web. window.alert is the web
 * equivalent for a single-button, dismiss-only message.
 */
export function notify(title: string, message?: string): void {
  if (Platform.OS === "web") {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }

  Alert.alert(title, message);
}
