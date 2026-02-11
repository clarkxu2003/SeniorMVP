import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADII, SHADOW } from "../utils/theme";

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient colors={[COLORS.bgTop, COLORS.bgBottom]} style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 18, paddingTop: 44 }}>
        {/* Top brand */}
        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <Text style={styles.brand}>UBICA</Text>
          <Text style={styles.brandSub}>Ubiquitous Care</Text>
        </View>

        <Text style={styles.greeting}>Good morning, David.</Text>
        <Text style={styles.greetingSub}>How can I help you today?</Text>

        {/* Main mic card */}
        <View style={[styles.heroCard, SHADOW.glow]}>
          <View style={styles.heroIconWrap}>
            <MaterialCommunityIcons name="microphone" size={34} color={COLORS.gold} />
          </View>
          <Text style={styles.heroText}>Just speak naturally</Text>
          <Text style={styles.heroSub}>
            to get help with your tasks.
          </Text>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Chat")}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="chat-processing-outline" size={22} color={COLORS.gold} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Speak to UBICA</Text>
              <Text style={styles.actionSub}>Ask by voice or text</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={28} color={COLORS.gold} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Checklist")}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="calendar-plus" size={22} color={COLORS.gold} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Add Reminder</Text>
              <Text style={styles.actionSub}>Appointments, meds, and more</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={28} color={COLORS.gold} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Checklist")}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="format-list-checks" size={22} color={COLORS.gold} />
            </View>
            <View>
              <Text style={styles.actionTitle}>View Checklist</Text>
              <Text style={styles.actionSub}>Your tasks at a glance</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={28} color={COLORS.gold} />
        </TouchableOpacity>

        <Text style={styles.tip}>
          Tip: You can use the keyboard mic to talk on mobile.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = {
  brand: {
    color: COLORS.gold2,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 3,
  },
  brandSub: {
    color: COLORS.subText,
    marginTop: 4,
    fontWeight: "700",
  },
  greeting: {
    color: COLORS.gold2,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 8,
  },
  greetingSub: {
    color: COLORS.subText,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 14,
  },
  heroCard: {
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.gold,
    backgroundColor: "rgba(14,26,51,0.85)",
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  heroIconWrap: {
    width: 78,
    height: 78,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "rgba(7,11,20,0.55)",
  },
  heroText: {
    color: COLORS.gold2,
    fontSize: 18,
    fontWeight: "900",
  },
  heroSub: {
    color: COLORS.subText,
    marginTop: 6,
    fontWeight: "600",
  },
  actionCard: {
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.gold,
    backgroundColor: "rgba(14,26,51,0.65)",
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(7,11,20,0.35)",
  },
  actionTitle: {
    color: COLORS.gold2,
    fontSize: 16,
    fontWeight: "900",
  },
  actionSub: {
    color: COLORS.subText,
    marginTop: 3,
    fontWeight: "600",
    fontSize: 12,
  },
  tip: {
    color: COLORS.muted,
    marginTop: 10,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
};
