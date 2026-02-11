import React, { useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { normalizeText } from "../utils/helpers";
import { COLORS, RADII, SHADOW } from "../utils/theme";

export default function RemindersScreen({ todos, setTodos }) {
  const [newItem, setNewItem] = useState("");
  const remaining = useMemo(() => todos.filter((t) => !t.done).length, [todos]);

  const addManual = () => {
    const t = normalizeText(newItem);
    if (!t) return;
    setTodos((prev) => [{ id: `t_${Date.now()}`, text: t, done: false }, ...prev]);
    setNewItem("");
  };

  const toggle = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  return (
    <LinearGradient colors={[COLORS.bgTop, COLORS.bgBottom]} style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: 44, paddingHorizontal: 18 }}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Checklist</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{remaining} left</Text>
          </View>
        </View>
        <Text style={styles.subTitle}>Tap the circle to mark complete.</Text>

        {/* Add new */}
        <View style={styles.addRow}>
          <TextInput
            value={newItem}
            onChangeText={setNewItem}
            placeholder="Add New Task…"
            placeholderTextColor={COLORS.muted}
            style={styles.addInput}
            returnKeyType="done"
            onSubmitEditing={addManual}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addManual}>
            <MaterialCommunityIcons name="plus" size={18} color={COLORS.bgBottom} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 14, paddingBottom: 26 }}
          renderItem={({ item }) => (
            <View style={[styles.taskRow, SHADOW.glow]}>
              <TouchableOpacity onPress={() => toggle(item.id)} style={styles.checkCircle}>
                {item.done ? (
                  <MaterialCommunityIcons name="check" size={18} color={COLORS.bgBottom} />
                ) : null}
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.taskText,
                    item.done && { color: COLORS.muted, textDecorationLine: "line-through" },
                  ]}
                >
                  {item.text}
                </Text>
              </View>

              <TouchableOpacity onPress={() => remove(item.id)} style={styles.rightIcon}>
                <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.gold} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <Text style={{ color: COLORS.muted, fontWeight: "700" }}>No tasks yet.</Text>
            </View>
          }
        />
      </View>
    </LinearGradient>
  );
}

const styles = {
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: COLORS.gold2,
    fontSize: 26,
    fontWeight: "900",
  },
  subTitle: {
    color: COLORS.subText,
    marginTop: 6,
    fontWeight: "650",
  },
  badge: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(14,26,51,0.55)",
  },
  badgeText: {
    color: COLORS.gold2,
    fontWeight: "900",
    fontSize: 12,
  },
  addRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  addInput: {
    flex: 1,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.gold,
    backgroundColor: "rgba(14,26,51,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: COLORS.text,
    fontWeight: "650",
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: COLORS.gold2,
    alignItems: "center",
    justifyContent: "center",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.gold,
    backgroundColor: "rgba(14,26,51,0.6)",
    marginBottom: 12,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.gold2,
    backgroundColor: COLORS.gold2,
    alignItems: "center",
    justifyContent: "center",
  },
  taskText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },
  rightIcon: {
    paddingLeft: 6,
  },
};
