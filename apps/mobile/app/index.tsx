import { StatusBar } from "expo-status-bar";
import { AppText, PrimaryLink, Screen } from "../src/components";

export default function HomeScreen() {
  return (
    <Screen>
      <StatusBar style="dark" />

      <AppText variant="label" muted>
        Project Waypoint
      </AppText>

      <AppText variant="title">Every journey deserves its context.</AppText>

      <AppText muted>
        Discover walks, remember places, and preserve the stories that happen
        along the way.
      </AppText>

      <PrimaryLink href="/discover">Find a walk</PrimaryLink>
    </Screen>
  );
}
