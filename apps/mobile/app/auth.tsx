import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  AppText,
  FormField,
  PrimaryButton,
  PrimaryLink,
  Screen,
  Section,
} from "../src/components";
import { notify } from "../src/lib/notify";
import { supabase } from "../src/lib/supabase";
import { theme } from "../src/theme";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      notify("Sign in failed", error.message);
      return;
    }

    router.replace("/");
  }

  async function register() {
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      notify("Registration failed", error.message);
      return;
    }

    notify(
      "Account created",
      "You may need to confirm your email before signing in.",
    );
  }

  return (
    <Screen centered>
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
          autoCorrect={false}
          keyboardType="email-address"
        />

        <FormField
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
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
