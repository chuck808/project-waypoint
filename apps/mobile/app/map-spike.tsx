import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { AppText, Screen } from "../src/components";
import { supabase } from "../src/lib/supabase";
import { theme } from "../src/theme";

/**
 * ─── MAP SPIKE 1 — DISPOSABLE ────────────────────────────────────────
 * Goal: prove MapLibre renders cleanly in the Expo dev-build path with
 * one live marker from Supabase. Not the Discover map. No clustering,
 * no user location, no routes. Delete this file when the real feature
 * begins; carry only the findings.
 *
 * Findings so far (recorded here so they survive the file):
 *  1. PostgREST returns geography columns as WKB hex, not lat/lng.
 *     Resolved by migration 0005: business_location_map_points view
 *     exposes plain longitude/latitude (security_invoker, status
 *     filtered). No client ever parses WKB.
 *  2. Tiles: OpenFreeMap Liberty — OSM-derived, no API key, no billing.
 *  3. @maplibre/maplibre-react-native is native-only. Its top-level
 *     module code (MLRNModule.js) does
 *     `Object.create(NativeModules.MLRNModule)`, which throws
 *     "Object prototype may only be an Object or null: undefined" on
 *     web, since that native module doesn't exist there. A static
 *     top-level `import` is hoisted and evaluated immediately, so it
 *     crashes the whole screen before any Platform check can run.
 *     Fix: require() the package lazily, guarded by Platform.OS, so
 *     web never touches it at all — render a placeholder there instead.
 * ─────────────────────────────────────────────────────────────────────
 */

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

// Mam Tor. MapLibre speaks [longitude, latitude].
const SPIKE_CENTRE: [number, number] = [-1.8096, 53.3496];

type SpikePlace = {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Camera: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let MapView: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PointAnnotation: any;

if (Platform.OS !== "web") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const MapLibreRN = require("@maplibre/maplibre-react-native");
  Camera = MapLibreRN.Camera;
  MapView = MapLibreRN.MapView;
  PointAnnotation = MapLibreRN.PointAnnotation;
}

export default function MapSpikeScreen() {
  const [places, setPlaces] = useState<SpikePlace[]>([]);
  const [note, setNote] = useState("Loading places…");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("business_location_map_points")
        .select("id, name, longitude, latitude");

      if (error) {
        setNote(`Query failed: ${error.message}`);
        return;
      }

      const parsed: SpikePlace[] = (data ?? []).filter(
        (row): row is SpikePlace =>
          typeof row.longitude === "number" && typeof row.latitude === "number",
      );

      setPlaces(parsed);
      setNote(
        parsed.length > 0
          ? `${parsed.length} place(s) from live data`
          : "No places with coordinates found",
      );
    }

    load();
  }, []);

  return (
    <Screen>
      <AppText variant="label" muted>
        Map spike — disposable
      </AppText>

      <View style={styles.mapFrame}>
        {Platform.OS === "web" ? (
          <View style={styles.webFallback}>
            <AppText variant="label" muted>
              MapLibre is native-only — this spike doesn&apos;t render on web.
            </AppText>
          </View>
        ) : (
          <MapView style={styles.map} mapStyle={MAP_STYLE}>
            <Camera
              defaultSettings={{
                centerCoordinate: SPIKE_CENTRE,
                zoomLevel: 12,
              }}
            />

            {places.map((place) => (
              <PointAnnotation
                key={place.id}
                id={place.id}
                coordinate={[place.longitude, place.latitude]}
              >
                <View style={styles.marker}>
                  <AppText variant="label">📍</AppText>
                </View>
              </PointAnnotation>
            ))}
          </MapView>
        )}
      </View>

      <AppText variant="label" muted>
        {note}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapFrame: {
    height: 420,
    borderRadius: 24,
    overflow: "hidden",
    marginVertical: theme.spacing.md,
  },
  map: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    backgroundColor: "#EEE",
  },
  marker: {
    alignItems: "center",
    justifyContent: "center",
  },
});
