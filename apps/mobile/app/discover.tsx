import { AppText, PrimaryLink, Screen } from "../src/components";

export default function DiscoverScreen() {
  return (
    <Screen>
      <AppText variant="heading">Discover</AppText>

      <AppText muted>Trail discovery will begin here.</AppText>

      <PrimaryLink href="/">Back home</PrimaryLink>
    </Screen>
  );
}
