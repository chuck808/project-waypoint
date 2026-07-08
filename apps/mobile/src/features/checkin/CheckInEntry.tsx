import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, FormField, PrimaryButton } from "../../components";
import { theme } from "../../theme";
import type { CheckInMethod } from "../../services/checkin";
import { ActiveWalkPill } from "../walks";
import { CheckInScan } from "./CheckInScan";

type CheckInEntryProps = {
  onSubmit: (code: string, method: CheckInMethod) => void;
};

/**
 * Scanning is the front door; manual entry is the permanent side door
 * for glare, damaged signs, denied permissions and cold wet hands.
 * Both produce the same onSubmit(code) — the journey never knows which.
 */
export function CheckInEntry({ onSubmit }: CheckInEntryProps) {
  const [mode, setMode] = useState<"scan" | "manual">("scan");
  const [code, setCode] = useState("");

  const trimmed = code.trim();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="label" muted>
          Check in
        </AppText>

        <AppText variant="title">Record a visit.</AppText>
      </View>

      <ActiveWalkPill />

      {mode === "scan" ? (
        <>
          <CheckInScan onCode={(code) => onSubmit(code, "qr")} />

          <Pressable
            onPress={() => setMode("manual")}
            style={styles.switch}
            accessibilityRole="button"
          >
            <AppText variant="label" muted>
              Can't scan? Enter the code instead
            </AppText>
          </Pressable>
        </>
      ) : (
        <>
          <AppText muted>
            Enter the code shown on the Waypoint sign at this place.
          </AppText>

          <FormField
            value={code}
            onChangeText={setCode}
            placeholder="Waypoint code"
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={() => trimmed && onSubmit(trimmed, "manual")}
            returnKeyType="go"
          />

          {trimmed ? (
            <PrimaryButton onPress={() => onSubmit(trimmed, "manual")}>
              Find this place
            </PrimaryButton>
          ) : null}

          <Pressable
            onPress={() => setMode("scan")}
            style={styles.switch}
            accessibilityRole="button"
          >
            <AppText variant="label" muted>
              Scan the code instead
            </AppText>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.sm,
  },
  switch: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
});
