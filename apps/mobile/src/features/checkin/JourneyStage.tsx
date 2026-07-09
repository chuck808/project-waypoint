import { useEffect, useRef } from "react";
import { Animated, Platform } from "react-native";

type JourneyStageProps = {
  stageKey: string;
  children: React.ReactNode;
};

/**
 * Fades and settles each stage of the journey into place when the
 * machine changes state. Stages sharing a key (ready/recording) don't
 * re-animate — a button relabelling itself is not a scene change.
 */
export function JourneyStage({ stageKey, children }: JourneyStageProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(8);

    // The web runtime has no native animation driver, so JS-driven
    // animation is used there to avoid the unsupported-driver warning.
    const useNativeDriver = Platform.OS !== "web";

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver,
      }),
    ]).start();
  }, [stageKey, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}
