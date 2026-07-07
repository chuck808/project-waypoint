import { View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Path,
  Rect,
  Text as SvgText,
  TextPath,
} from "react-native-svg";
import { stampRotation, type StampMark } from "./marks";

type VenueStampProps = {
  mark: StampMark;
  size?: number;
  /** Deterministic jitter source -- usually the moment id. */
  seed?: string;
  /** Pressed into the rim when present, e.g. "5 JUL 2026". */
  dateText?: string;
};

/** Ink on paper: stroke-only, no fills, no backgrounds. */
export function VenueStamp({
  mark,
  size = 56,
  seed,
  dateText,
}: VenueStampProps) {
  const rotation = seed ? stampRotation(seed) : 0;
  const bottom = dateText ?? mark.bottomText;

  return (
    <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        {mark.frame === "round" ? (
          <>
            <Circle cx={32} cy={32} r={29} stroke={mark.ink} strokeWidth={2.4} fill="none" />
            <Circle cx={32} cy={32} r={23.5} stroke={mark.ink} strokeWidth={1} strokeDasharray="2 2.4" fill="none" />
            <Defs>
              <Path id="arcTop" d="M 12 32 A 20 20 0 0 1 52 32" />
              <Path id="arcBottom" d="M 14 36 A 19.5 19.5 0 0 0 50 36" />
            </Defs>
            <SvgText fill={mark.ink} fontSize={6.4} fontWeight="500" letterSpacing={0.9}>
              <TextPath href="#arcTop" startOffset="50%" textAnchor="middle">
                {mark.topText}
              </TextPath>
            </SvgText>
            {bottom ? (
              <SvgText fill={mark.ink} fontSize={6} letterSpacing={1}>
                <TextPath href="#arcBottom" startOffset="50%" textAnchor="middle">
                  {bottom}
                </TextPath>
              </SvgText>
            ) : null}
          </>
        ) : (
          <>
            <Rect x={5} y={5} width={54} height={54} rx={8} stroke={mark.ink} strokeWidth={2.4} fill="none" />
            <Rect x={10} y={10} width={44} height={44} rx={5} stroke={mark.ink} strokeWidth={1} strokeDasharray="2 2.4" fill="none" />
            <SvgText x={32} y={20.5} textAnchor="middle" fill={mark.ink} fontSize={6.4} fontWeight="500" letterSpacing={1}>
              {mark.topText}
            </SvgText>
            {bottom ? (
              <SvgText x={32} y={50} textAnchor="middle" fill={mark.ink} fontSize={6} letterSpacing={1}>
                {bottom}
              </SvgText>
            ) : null}
          </>
        )}

        {mark.motif === "ridge" ? (
          <>
            <Path
              d="M22 38 l6-9 4 5 3-4 7 8 z"
              stroke={mark.ink}
              strokeWidth={1.7}
              strokeLinejoin="round"
              fill="none"
            />
            <Circle cx={32} cy={20.5} r={1.4} fill={mark.ink} />
          </>
        ) : null}

        {mark.motif === "barn" ? (
          <>
            <Path
              d="M20 40 v-9 l12-8 12 8 v9 z"
              stroke={mark.ink}
              strokeWidth={1.7}
              strokeLinejoin="round"
              fill="none"
            />
            <Path d="M27 40 v-6 h5 v6" stroke={mark.ink} strokeWidth={1.4} fill="none" />
            <Path
              d="M38 27 c0-2.5 3-2.5 3-5"
              stroke={mark.ink}
              strokeWidth={1.2}
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : null}

        {mark.motif === "monogram" ? (
          <SvgText
            x={32}
            y={38}
            textAnchor="middle"
            fill={mark.ink}
            fontSize={17}
            fontWeight="500"
          >
            {mark.monogram ?? "W"}
          </SvgText>
        ) : null}
      </Svg>
    </View>
  );
}
