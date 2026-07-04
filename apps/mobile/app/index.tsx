import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  AppText,
  PrimaryButton,
  PrimaryLink,
  Screen,
  Section,
} from "../src/components";
import { useAuth } from "../src/features/auth/AuthProvider";

export default function HomeScreen() {
  const { session, isLoading, signOut } = useAuth();

  return (
    <Screen>
      <StatusBar style="dark" />

      <Section>
        <AppText variant="label" muted>
          Project Waypoint
        </AppText>

        <AppText variant="title">Every journey deserves its context.</AppText>

        <AppText muted>
          Discover walks, remember places, and preserve the stories that happen
          along the way.
        </AppText>
      </Section>

      {!isLoading && session ? (
        <Section>
          <AppText variant="label" muted>
            Signed in
          </AppText>

          <AppText muted>{session.user.email}</AppText>

          <PrimaryButton onPress={signOut}>Sign out</PrimaryButton>
        </Section>
      ) : (
        <PrimaryLink href="/auth">Keep your journeys safe</PrimaryLink>
      )}

      <PrimaryLink href="/discover">Find a walk</PrimaryLink>
      <PrimaryLink href="/passport">View passport</PrimaryLink>

      <Section>
        <AppText variant="label" muted>
          Developer
        </AppText>

        <PrimaryLink href="/check-in">Test QR Check-in</PrimaryLink>
        <PrimaryLink href="/map-spike">Map spike</PrimaryLink>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    justifyContent: "center",
    backgroundColor: "#F7F3EA",
  },
  kicker: {
    fontSize: 16,
    marginBottom: 16,
    color: "#5F6F52",
    fontWeight: "600",
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "700",
    color: "#2F3328",
    marginBottom: 20,
  },
  body: {
    fontSize: 18,
    lineHeight: 28,
    color: "#4F5648",
    marginBottom: 32,
  },
  link: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3C5F46",
  },
});
