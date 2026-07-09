import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRef } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { AppText, PrimaryButton } from "../../components";
import { theme } from "../../theme";

type CheckInScanProps = {
  onCode: (code: string) => void;
};

/**
 * The scanner is one producer of onCode; manual entry is the other.
 * The journey machine is the authoritative guard against duplicate
 * submissions — hasSubmittedRef only prevents multiple service calls
 * firing in the frames before React processes the state transition.
 */
export function CheckInScan({ onCode }: CheckInScanProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const hasSubmittedRef = useRef(false);

  function handleBarcode({ data }: { data: string }) {
    if (hasSubmittedRef.current || !data) return;

    hasSubmittedRef.current = true;

    // The tactile "got it" — lands as the journey enters resolving.
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    onCode(data.trim());
  }

  // Permission state still loading.
  if (!permission) {
    return <View style={styles.frame} />;
  }

  // Undetermined: ask contextually, with the reason on screen.
  if (!permission.granted && permission.canAskAgain) {
    return (
      <View style={styles.permissionCard}>
        <AppText>
          Waypoint uses your camera to read the code on the sign at each place.
        </AppText>

        <PrimaryButton onPress={requestPermission}>Allow camera</PrimaryButton>
      </View>
    );
  }

  // Denied: no dead end — explain, offer Settings; manual entry is one
  // tap away via the link the parent renders beneath this component.
  if (!permission.granted) {
    return (
      <View style={styles.permissionCard}>
        <AppText>
          Camera access is turned off for Waypoint. You can enable it in
          Settings, or enter the code from the sign instead.
        </AppText>

        <PrimaryButton onPress={() => Linking.openSettings()}>
          Open Settings
        </PrimaryButton>
      </View>
    );
  }

  return (
    <View style={styles.frame}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcode}
      />

      <View style={[styles.aimFrame, { pointerEvents: "none" }]} />

      <View style={[styles.hint, { pointerEvents: "none" }]}>
        <AppText variant="label" muted>
          Point your camera at the Waypoint sign
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: 320,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: theme.colors.text,
    justifyContent: "flex-end",
  },
  aimFrame: {
    position: "absolute",
    alignSelf: "center",
    top: 70,
    width: 180,
    height: 180,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    opacity: 0.8,
  },
  hint: {
    alignItems: "center",
    padding: theme.spacing.md,
  },
  permissionCard: {
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
