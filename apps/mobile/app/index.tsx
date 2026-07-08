import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { AppText, Screen } from "../src/components";
import { hasCompletedOnboarding } from "../src/services/onboarding";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    hasCompletedOnboarding()
      .catch(() => {
        // Storage read failed (corruption, low storage, first-run native
        // hiccup). Fail open rather than stranding the user on this
        // screen forever: treat it as already onboarded.
        return true;
      })
      .then((complete) => {
        if (mounted) {
          setOnboardingComplete(complete);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading || onboardingComplete === null) {
    return (
      <Screen>
        <AppText muted>Preparing Waypoint…</AppText>
      </Screen>
    );
  }

  return <Redirect href={onboardingComplete ? "/discover" : "/onboarding"} />;
}
