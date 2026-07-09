/**
 * Waypoint type scale.
 *
 * Playfair Display carries headings (the "field journal" voice from the
 * design library); Inter carries body and UI text. Weight lives in the
 * font family name, not fontWeight -- mixing the two makes Android fall
 * back to a synthetic bold of the wrong file.
 */
export const typography = {
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 34,
    lineHeight: 42,
  },
  heading: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 26,
    lineHeight: 34,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 17,
    lineHeight: 26,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    lineHeight: 22,
  },
};
