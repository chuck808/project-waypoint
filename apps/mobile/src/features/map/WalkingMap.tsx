import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { AppText } from "../../components";
import { theme } from "../../theme";
import { getPlaceMapPoints, type PlaceMapPoint } from "../../services/places";
import { PlaceMarker } from "./PlaceMarker";
import { useUserLocation } from "./useUserLocation";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

/**
 * Mam Tor -- the one published trail today, hardcoded until trails
 * carry their own coordinates. No trail-to-place link exists in the
 * schema either, so this is a viewport default, not a trail marker.
 * Promote once a second trail (or real trail geometry) exists (BP022).
 */
const DEFAULT_CENTRE: [number, number] = [-1.8096, 53.3496];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Camera: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let MapView: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PointAnnotation: any;

if (Platform.OS !== "web") {
  // @maplibre/maplibre-react-native is native-only; a static top-level
  // import crashes web immediately, so it's require()'d lazily here,
  // guarded by Platform, per the map-spike's findings.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const MapLibreRN = require("@maplibre/maplibre-react-native");
  Camera = MapLibreRN.Camera;
  MapView = MapLibreRN.MapView;
  PointAnnotation = MapLibreRN.PointAnnotation;
}

export function WalkingMap() {
  const [places, setPlaces] = useState<PlaceMapPoint[]>([]);
  const location = useUserLocation();

  useEffect(() => {
    getPlaceMapPoints()
      .then(setPlaces)
      .catch(() => setPlaces([]));
  }, []);

  if (Platform.OS === "web") {
    return (
      <View style={styles.webFallback}>
        <AppText variant="label" muted>
          The map needs the Waypoint app on your phone — MapLibre doesn&apos;t
          render in a browser.
        </AppText>
      </View>
    );
  }

  return (
    <MapView style={styles.map} mapStyle={MAP_STYLE}>
      <Camera
        defaultSettings={{
          centerCoordinate: DEFAULT_CENTRE,
          zoomLevel: 12,
        }}
      />

      {places.map((place) => (
        <PointAnnotation
          key={place.id}
          id={place.id}
          coordinate={[place.longitude, place.latitude]}
        >
          <PlaceMarker place={place} />
        </PointAnnotation>
      ))}

      {location.status === "granted" ? (
        <PointAnnotation
          id="user-location"
          coordinate={[location.longitude, location.latitude]}
        >
          <View style={styles.youAreHere} />
        </PointAnnotation>
      ) : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.frame,
  },
  youAreHere: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
});
