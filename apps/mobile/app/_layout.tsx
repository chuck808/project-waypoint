import { Stack } from "expo-router";
import { AuthProvider } from "../src/features/auth/AuthProvider";
import { ActiveWalkProvider } from "../src/features/walks";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ActiveWalkProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="trail/[slug]" />
          <Stack.Screen name="places/[id]" />
          <Stack.Screen name="auth" />
        </Stack>
      </ActiveWalkProvider>
    </AuthProvider>
  );
}
