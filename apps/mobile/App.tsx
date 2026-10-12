import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tally Mobile</Text>
      <Text style={styles.subtitle}>Your list is coming to your phone soon.</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
    backgroundColor: "#1E2A3B",
  },
  title: { color: "#FFFFFF", fontSize: 34, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { color: "#A9B4C4", fontSize: 17, textAlign: "center" },
});
