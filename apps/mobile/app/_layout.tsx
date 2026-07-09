import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { AuthProvider } from "../src/features/auth/AuthProvider";
import { ActiveWalkProvider } from "../src/features/walks";

// Hold the native splash until fonts are ready: a flash of system-font
// text before Playfair loads is exactly the prototype feel we're
// removing.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    // Font failure still hides the splash -- system fallback beats a
    // hang. fontError is logged by expo-font in dev.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ActiveWalkProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="trail/[slug]" />
          <Stack.Screen name="places/[id]" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="onboarding" />
        </Stack>
      </ActiveWalkProvider>
    </AuthProvider>
  );
}
