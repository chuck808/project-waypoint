import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>

      <Text style={styles.body}>
        Trail discovery will begin here.
      </Text>

      <Link href="/" style={styles.link}>
        Back home
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    justifyContent: "center",
    backgroundColor: "#F7F3EA",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#2F3328",
    marginBottom: 16,
  },
  body: {
    fontSize: 18,
    lineHeight: 28,
    color: "#4F5648",
    marginBottom: 32,
  },
  link: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3C5F46",
  },
});