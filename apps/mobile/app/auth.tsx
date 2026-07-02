import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  AppText,
  FormField,
  PrimaryButton,
  PrimaryLink,
  Screen,
  Section,
} from "../src/components";
import { supabase } from "../src/lib/supabase";
import { theme } from "../src/theme";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert("Sign in failed", error.message);
    else Alert.alert("Signed in", "Welcome back.");
  }

  async function register() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert("Registration failed", error.message);
    else
      Alert.alert(
        "Account created",
        "Check your email if confirmation is enabled.",
      );
  }

  return (
    <Screen>
      <Section>
        <AppText variant="label" muted>
          Waypoint account
        </AppText>

        <AppText variant="title">Keep your journeys safe.</AppText>

        <AppText muted>
          Create an account when you are ready to preserve your Passport across
          devices.
        </AppText>
      </Section>

      <View style={styles.form}>
        <FormField
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <FormField
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
      </View>

      <PrimaryButton onPress={signIn}>Sign in</PrimaryButton>

      <PrimaryButton onPress={register}>Create account</PrimaryButton>

      <PrimaryLink href="/">Back home</PrimaryLink>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
});
