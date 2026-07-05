import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  AppText,
  PrimaryButton,
  PrimaryLink,
  Screen,
  Section,
} from "../../src/components";
import { PageHeader } from "../../src/components/layout/PageHeader";
import { useAuth } from "../../src/features/auth/AuthProvider";
import { countDistinctBy } from "../../src/lib/collections";
import {
  getPassportMoments,
  type PassportMoment,
} from "../../src/services/passport";
import { getMyProfile, type Profile } from "../../src/services/profile";
import { theme } from "../../src/theme";

export default function AccountScreen() {
  const { session, isLoading, signOut } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [moments, setMoments] = useState<PassportMoment[]>([]);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setMoments([]);
      return;
    }

    getMyProfile(session.user.id)
      .then(setProfile)
      .catch(() => setProfile(null));

    getPassportMoments()
      .then(setMoments)
      .catch(() => setMoments([]));
  }, [session]);

  const displayName =
    profile?.displayName || session?.user.email?.split("@")[0] || "Walker";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Screen>
      <PageHeader
        eyebrow="Account"
        title="Your Waypoint."
        description="Manage your profile, session and preferences."
      />

      {isLoading ? <AppText muted>Checking your session…</AppText> : null}

      {!isLoading && session ? (
        <>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <AppText variant="heading" style={styles.avatarInitial}>
                {initial}
              </AppText>
            </View>

            <View style={styles.profileText}>
              <AppText variant="heading">{displayName}</AppText>
              <AppText muted>{session.user.email}</AppText>
              {profile?.bio ? <AppText muted>{profile.bio}</AppText> : null}
            </View>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <AppText variant="heading">{moments.length}</AppText>
              <AppText variant="label" muted>
                Moments
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <AppText variant="heading">
                {countDistinctBy(moments, "trailName")}
              </AppText>
              <AppText variant="label" muted>
                Trails
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <AppText variant="heading">
                {countDistinctBy(moments, "placeName")}
              </AppText>
              <AppText variant="label" muted>
                Places
              </AppText>
            </View>
          </View>

          <Section>
            <PrimaryButton onPress={signOut}>Sign out</PrimaryButton>
          </Section>
        </>
      ) : (
        <Section>
          <AppText muted>
            Sign in to preserve your Passport across devices.
          </AppText>
          <PrimaryLink href="/auth">Sign in</PrimaryLink>
        </Section>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: theme.colors.primary,
  },
  profileText: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.primarySoft,
    marginBottom: theme.spacing.xl,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
  },
});
