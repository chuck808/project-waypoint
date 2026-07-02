import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { theme } from "../theme";

type PrimaryLinkProps = {
  href: string;
  children: string;
};

export function PrimaryLink({ href, children }: PrimaryLinkProps) {
  return (
    <Link href={href} style={styles.link}>
      {children}
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.primary,
    marginTop: theme.spacing.lg,
  },
});
