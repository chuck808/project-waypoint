import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.kicker}>Project Waypoint</Text>

      <Text style={styles.title}>Every journey deserves its context.</Text>

      <Text style={styles.body}>
        Discover walks, remember places, and preserve the stories that happen
        along the way.
      </Text>

      <Link href="/discover" style={styles.link}>
        Begin exploring
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
  kicker: {
    fontSize: 16,
    marginBottom: 16,
    color: "#5F6F52",
    fontWeight: "600",
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "700",
    color: "#2F3328",
    marginBottom: 20,
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