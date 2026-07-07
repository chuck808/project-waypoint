import { StyleSheet, View } from "react-native";
import { AppText, Card } from "../../components";
import { theme } from "../../theme";
import { VenueStamp, resolveMark } from "../stamps";
import type { PassportMoment } from "../../services/passport";
import { dayAndTime } from "./formatMoment";

type MomentCardProps = {
  moment: PassportMoment;
};

export function MomentCard({ moment }: MomentCardProps) {
  const mark = resolveMark(moment.businessName, moment.placeCategory);

  return (
    <Card style={styles.card}>
      <View style={styles.mark}>
        <VenueStamp mark={mark} size={56} seed={moment.id} />
      </View>

      <View style={styles.content}>
        {moment.stamp ? (
          <AppText variant="label" muted>
            {moment.stamp.title}
          </AppText>
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
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  mark: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
});
