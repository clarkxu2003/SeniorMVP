import React, { useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { normalizeText } from "../utils/helpers";

export default function RemindersScreen({ todos, setTodos }) {
  const [newItem, setNewItem] = useState("");

  const remaining = useMemo(
    () => todos.filter((t) => !t.done).length,
    [todos]
  );

  const addManual = () => {
    const t = normalizeText(newItem);
    if (!t) return;
    setTodos((prev) => [{ id: `t_${Date.now()}`, text: t, done: false }, ...prev]);
    setNewItem("");
  };

  const toggle = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const remove = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.h2}>Reminders</Text>
      <Text style={styles.subtitleSmall}>{remaining} left • Tap to check off</Text>

      <View style={styles.addRow}>
        <TextInput
          value={newItem}
          onChangeText={setNewItem}
          placeholder="Add a reminder…"
          placeholderTextColor="#8A93A6"
          style={styles.addInput}
          returnKeyType="done"
          onSubmitEditing={addManual}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addManual}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggle(item.id)} style={styles.todoRow}>
            <View style={[styles.check, item.done ? styles.checkDone : styles.checkOpen]}>
              <Text style={{ color: "#0B0F1A", fontWeight: "900" }}>
                {item.done ? "✓" : ""}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.todoText,
                  item.done && {
                    textDecorationLine: "line-through",
                    color: "#8A93A6",
                  },
                ]}
              >
                {item.text}
              </Text>
            </View>

            <TouchableOpacity onPress={() => remove(item.id)} style={styles.delBtn}>
              <Text style={styles.delBtnText}>Del</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ paddingTop: 40, alignItems: "center" }}>
            <Text style={{ color: "#8A93A6" }}>No reminders yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  h2: {
    color: "#EAF0FF",
    fontSize: 26,
    fontWeight: "800",
  },
  subtitleSmall: {
    color: "#B8C0D6",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 10,
  },
  addRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  addInput: {
    flex: 1,
    backgroundColor: "#141B2E",
    borderWidth: 1,
    borderColor: "#2A3350",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#EAF0FF",
    fontSize: 14,
    fontWeight: "600",
  },
  addBtn: {
    backgroundColor: "#5B8CFF",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  addBtnText: {
    color: "#0B0F1A",
    fontWeight: "900",
  },
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#141B2E",
    borderWidth: 1,
    borderColor: "#2A3350",
    marginBottom: 10,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkOpen: {
    backgroundColor: "#BFE4FF",
    opacity: 0.65,
  },
  checkDone: {
    backgroundColor: "#BFE4FF",
    opacity: 1,
  },
  todoText: {
    color: "#EAF0FF",
    fontSize: 15,
    fontWeight: "700",
  },
  delBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#0B0F1A",
    borderWidth: 1,
    borderColor: "#2A3350",
  },
  delBtnText: {
    color: "#B8C0D6",
    fontSize: 12,
    fontWeight: "800",
  },
};
