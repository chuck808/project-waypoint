import { StyleSheet, View } from "react-native";
import { AppText, Card } from "../../components";
import { theme } from "../../theme";
import type { PassportMoment } from "../../services/passport";
import { dayAndTime } from "./formatMoment";

type MomentCardProps = {
  moment: PassportMoment;
};

export function MomentCard({ moment }: MomentCardProps) {
  return (
    <Card>
      {moment.stamp ? (
        <View style={styles.stampRow}>
          <View style={styles.stampMark}>
            <AppText variant="label">✓</AppText>
          </View>
          <AppText variant="label" muted>
            {moment.stamp.title}
          </AppText>
        </View>
      ) : null}

      <AppText variant="heading">{moment.placeName}</AppText>

      {moment.businessName !== moment.placeName ? (
        <AppText muted>{moment.businessName}</AppText>
      ) : null}

      {moment.trailName ? (
        <AppText muted>Visited after {moment.trailName}</AppText>
      ) : null}

      <AppText variant="label" muted>
        {dayAndTime(moment.occurredAt)}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  stampRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  stampMark: {
    width: 26,
    height: 26,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primarySoft,
  },
});
