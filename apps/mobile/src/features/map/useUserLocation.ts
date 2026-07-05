import { useEffect, useState } from "react";
import * as Location from "expo-location";

export type UserLocationState =
  | { status: "loading" }
  | { status: "granted"; longitude: number; latitude: number }
  | { status: "denied" }
  | { status: "unavailable" };

/** One-shot foreground location: enough to show "you are here" on the
 *  map. Live tracking while walking is a later increment. */
export function useUserLocation(): UserLocationState {
  const [state, setState] = useState<UserLocationState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          if (!cancelled) setState({ status: "denied" });
          return;
        }

        const position = await Location.getCurrentPositionAsync({});

        if (!cancelled) {
          setState({
            status: "granted",
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        }
      } catch {
        if (!cancelled) setState({ status: "unavailable" });
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
