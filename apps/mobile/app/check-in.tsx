import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { AppText, PrimaryButton, PrimaryLink, Screen } from "../src/components";
import { performCheckIn, resolveCheckIn } from "../src/services/checkin";
import type { CheckInResolution } from "../src/services/checkin";
import { theme } from "../src/theme";

export default function CheckInScreen() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<CheckInResolution | null>(null);
  const [error, setError] = useState("");
  const [checkInRef, setCheckInRef] = useState<string | null>(null);
  const [recordMessage, setRecordMessage] = useState("");

  async function recordVisit() {
    if (!checkInRef) return;

    const result = await performCheckIn(checkInRef);

    if (result.outcome === "recorded") {
      setRecordMessage(result.message);
    } else {
      setRecordMessage(result.reason);
    }
  }

  return (
    <Screen>
      <AppText variant="label" muted>
        Developer
      </AppText>

      <AppText variant="title">Test QR Check-in</AppText>

      <AppText muted>
        Paste a QR code value below to prove that lookup works. No passport
        updates yet.
      </AppText>

      <View style={styles.field}>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="demo-old-barn-cafe-static-token"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Button
        title="Validate"
        onPress={async () => {
          setError("");
          setResult(null);

          try {
            const resolution = await resolveCheckIn(code);
            setResult(resolution);

            if (resolution.outcome === "ready") {
              setCheckInRef(resolution.checkInRef);
            }
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Unable to validate code.",
            );
          }
        }}
      />

      <View style={styles.result}>
        {error ? <AppText muted>{error}</AppText> : null}

        {result?.outcome === "ready" ? (
          <>
            <AppText variant="heading">{result.placeName}</AppText>

            {result.businessName !== result.placeName ? (
              <AppText muted>{result.businessName}</AppText>
            ) : null}

            {result.welcomeMessage ? (
              <AppText muted>{result.welcomeMessage}</AppText>
            ) : null}
          </>
        ) : null}

        {result?.outcome === "not_recognised" ? (
          <AppText muted>That Waypoint code was not recognised.</AppText>
        ) : null}

        {result?.outcome === "ready" ? (
          <PrimaryButton onPress={recordVisit}>Add to Passport</PrimaryButton>
        ) : null}

        {recordMessage ? <AppText muted>{recordMessage}</AppText> : null}
      </View>

      <PrimaryLink href="/">Back home</PrimaryLink>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.textMuted,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  result: {
    marginTop: theme.spacing.lg,
  },
});
