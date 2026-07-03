import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { AppText, PrimaryLink, Screen } from "../src/components";
import { validateQrCode } from "../src/services/checkin";
import { theme } from "../src/theme";

export default function CheckInScreen() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

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
            const qr = await validateQrCode(code);
            setResult(qr);
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Unable to validate code.",
            );
          }
        }}
      />

      <View style={styles.result}>
        {error ? (
          <AppText muted>{error}</AppText>
        ) : result ? (
          <AppText>{result.business_locations.businesses.name}</AppText>
        ) : null}
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
