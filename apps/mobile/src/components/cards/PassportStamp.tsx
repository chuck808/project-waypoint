import { StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { theme } from "../../theme";

type PassportStampProps = {
  stamp: {
    id: string;
    title: string;
    date: string;
    source: string;
    description: string;
  };
};

export function PassportStamp({ stamp }: PassportStampProps) {
  return (
    <View style={styles.card}>
      <View style={styles.mark}>
        <AppText variant="label">✓</AppText>
      </View>

      <View style={styles.content}>
        <AppText variant="heading">{stamp.title}</AppText>
        <AppText variant="label" muted>
          {stamp.source} · {stamp.date}
        </AppText>
        <AppText muted>{stamp.description}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mark: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primarySoft,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
});
