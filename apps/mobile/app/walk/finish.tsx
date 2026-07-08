import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AppText, PrimaryLink, Screen } from "../../src/components";
import { FinishWalkSummary, useActiveWalk } from "../../src/features/walks";
import {
  getActiveWalkJournal,
  type WalkJournalEntry,
} from "../../src/services/walks";

export default function FinishWalkScreen() {
  const { activeWalk, finish, isLoading } = useActiveWalk();
  const [entries, setEntries] = useState<WalkJournalEntry[]>([]);

  useEffect(() => {
    if (!activeWalk) return;
    getActiveWalkJournal().then(setEntries);
  }, [activeWalk]);

  async function handleFinish() {
    await finish();
    router.replace("/passport");
  }

  if (isLoading) {
    return (
      <Screen>
        <AppText>Preparing your walk summary...</AppText>
      </Screen>
    );
  }

  if (!activeWalk) {
    return (
      <Screen>
        <AppText variant="title">No active walk.</AppText>
        <AppText muted>Start a walk from a trail page when you're ready.</AppText>
        <PrimaryLink href="/discover">Back to Discover</PrimaryLink>
      </Screen>
    );
  }

  return (
    <Screen>
      <FinishWalkSummary
        activeWalk={activeWalk}
        entries={entries}
        onFinish={handleFinish}
      />
    </Screen>
  );
}
