import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <View style={{ marginTop: 28 }}>
        <Text style={styles.h1}>SeniorMVP</Text>
        <Text style={styles.subtitle}>Talk it out. We’ll keep it simple.</Text>
      </View>

      <View style={{ flex: 1, justifyContent: "center", width: "100%" }}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("Chat")}
        >
          <Text style={styles.primaryBtnText}>AI Chat</Text>
          <Text style={styles.primaryBtnHint}>Voice-friendly, low effort</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("Reminders")}
        >
          <Text style={styles.secondaryBtnText}>Reminders</Text>
          <Text style={styles.secondaryBtnHint}>Checklist + quick edits</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingBottom: 18 }}>
        <Text style={styles.footerNote}>MVP v1 • local-only • simple flow</Text>
      </View>
    </View>
  );
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    paddingHorizontal: 18,
  },
  h1: {
    color: "#EAF0FF",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  subtitle: {
    color: "#B8C0D6",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
  },
  footerNote: {
    color: "#6E7891",
    textAlign: "center",
    fontSize: 12,
  },
  primaryBtn: {
    backgroundColor: "#5B8CFF",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  primaryBtnText: {
    color: "#0B0F1A",
    fontSize: 18,
    fontWeight: "900",
  },
  primaryBtnHint: {
    color: "#0B0F1A",
    opacity: 0.8,
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  secondaryBtn: {
    backgroundColor: "#141B2E",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#2A3350",
  },
  secondaryBtnText: {
    color: "#EAF0FF",
    fontSize: 18,
    fontWeight: "900",
  },
  secondaryBtnHint: {
    color: "#B8C0D6",
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },
};
