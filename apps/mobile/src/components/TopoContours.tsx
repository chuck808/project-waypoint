import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { theme } from "../theme";

type TopoContoursProps = {
  /** Contour line colour. Defaults to the brand primary. */
  color?: string;
  /** Overall layer opacity. Kept low so text stays readable over it. */
  opacity?: number;
};

/**
 * Hand-drawn-feel elevation contours, echoing the design library's
 * topographic pattern. Absolutely fills its parent (which must be
 * position:relative or a plain View) and sits behind content, so
 * heroes stop being flat colour blocks without needing photography.
 *
 * The paths are nested irregular rings around two "summits", drawn
 * once at 400x160 and scaled by the viewBox -- crisp at any size.
 */
export function TopoContours({
  color = theme.colors.primary,
  opacity = 0.12,
}: TopoContoursProps) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity }]}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 160"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Summit one: upper left */}
        <Path
          d="M96 44 C82 36 60 40 52 52 C44 64 50 78 66 82 C84 87 106 80 112 66 C117 54 108 46 96 44 Z"
          stroke={color}
          strokeWidth={1.4}
          fill="none"
        />
        <Path
          d="M104 28 C78 16 40 26 28 48 C17 70 32 94 62 100 C94 106 132 92 140 68 C147 46 130 32 104 28 Z"
          stroke={color}
          strokeWidth={1.4}
          fill="none"
        />
        <Path
          d="M112 10 C74 -6 18 10 2 42 C-12 72 10 108 56 118 C104 128 158 108 168 72 C176 42 152 20 112 10 Z"
          stroke={color}
          strokeWidth={1.4}
          fill="none"
        />
        {/* Summit two: lower right */}
        <Path
          d="M308 118 C298 110 282 112 276 122 C270 132 276 142 290 144 C304 146 318 140 320 130 C322 122 316 118 308 118 Z"
          stroke={color}
          strokeWidth={1.4}
          fill="none"
        />
        <Path
          d="M316 100 C294 88 260 94 250 114 C242 132 256 150 284 154 C312 158 342 146 346 126 C349 110 336 100 316 100 Z"
          stroke={color}
          strokeWidth={1.4}
          fill="none"
        />
        <Path
          d="M326 80 C292 62 238 72 224 102 C212 128 234 156 278 162 C324 168 372 150 378 120 C383 96 360 82 326 80 Z"
          stroke={color}
          strokeWidth={1.4}
          fill="none"
        />
        {/* Connecting slope lines */}
        <Path
          d="M150 130 C180 118 214 116 240 126"
          stroke={color}
          strokeWidth={1.2}
          fill="none"
        />
        <Path
          d="M160 148 C196 132 236 130 268 142"
          stroke={color}
          strokeWidth={1.2}
          fill="none"
        />
        <Path
          d="M196 22 C232 12 274 14 304 28"
          stroke={color}
          strokeWidth={1.2}
          fill="none"
        />
        <Path
          d="M210 42 C240 34 272 36 296 46"
          stroke={color}
          strokeWidth={1.2}
          fill="none"
        />
      </Svg>
    </View>
  );
}
