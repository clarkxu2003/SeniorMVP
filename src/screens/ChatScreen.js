import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  extractTodoText,
  looksLikeTodo,
  normalizeText,
  speakSafe,
  stopSpeaking,
} from "../utils/helpers";

export default function ChatScreen({ navigation, todos, setTodos }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "m0",
      role: "ai",
      text: "Hi! Tell me what you need. If it’s a task, I’ll add it to your reminders.",
    },
  ]);

  const listRef = useRef(null);

  useEffect(() => {
    speakSafe(
      "Hi! Tell me what you need. If it’s a task, I’ll add it to your reminders."
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToEnd?.({ animated: true });
    }, 50);
  }, [messages.length]);

  const onSend = () => {
    const text = normalizeText(input);
    if (!text) return;

    const userMsg = { id: `u_${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (looksLikeTodo(text)) {
      const todoText = extractTodoText(text);

      const newTodo = {
        id: `t_${Date.now()}`,
        text: todoText,
        done: false,
      };
      setTodos((prev) => [newTodo, ...prev]);

      const reply = `Got it. I added “${todoText}” to your reminders.`;
      setMessages((prev) => [
        ...prev,
        { id: `a_${Date.now()}`, role: "ai", text: reply },
      ]);
      speakSafe(reply);

      setTimeout(() => navigation.navigate("Reminders"), 700);
      return;
    }

    const reply =
      "Okay. If you want, you can say “Remind me to …” and I’ll add it to your reminders.";
    setMessages((prev) => [
      ...prev,
      { id: `a_${Date.now()}`, role: "ai", text: reply },
    ]);
    speakSafe(reply);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0B0F1A" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.chatTopBar}>
        <Text style={styles.chatTitle}>AI Chat</Text>
        <TouchableOpacity onPress={stopSpeaking} style={styles.stopBtn}>
          <Text style={styles.stopBtnText}>Stop Voice</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14, paddingBottom: 10 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubbleWrap,
              item.role === "user"
                ? { alignItems: "flex-end" }
                : { alignItems: "flex-start" },
            ]}
          >
            <View
              style={[
                styles.bubble,
                item.role === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  item.role === "user"
                    ? { color: "#0B0F1A" }
                    : { color: "#EAF0FF" },
                ]}
              >
                {item.text}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type… (e.g., Remind me to take meds at 8pm)"
          placeholderTextColor="#8A93A6"
          style={styles.input}
          returnKeyType="send"
          onSubmitEditing={onSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickHintRow}>
        <Text style={styles.quickHint}>
          Try: <Text style={{ color: "#EAF0FF" }}>“Remind me to call mom.”</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  chatTopBar: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1D2742",
  },
  chatTitle: {
    color: "#EAF0FF",
    fontSize: 18,
    fontWeight: "900",
  },
  stopBtn: {
    backgroundColor: "#141B2E",
    borderWidth: 1,
    borderColor: "#2A3350",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  stopBtnText: {
    color: "#B8C0D6",
    fontSize: 12,
    fontWeight: "800",
  },
  bubbleWrap: {
    marginBottom: 10,
  },
  bubble: {
    maxWidth: "86%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#BFE4FF",
  },
  aiBubble: {
    backgroundColor: "#141B2E",
    borderWidth: 1,
    borderColor: "#2A3350",
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#1D2742",
    alignItems: "center",
    backgroundColor: "#0B0F1A",
  },
  input: {
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
  sendBtn: {
    backgroundColor: "#5B8CFF",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  sendBtnText: {
    color: "#0B0F1A",
    fontWeight: "900",
  },
  quickHintRow: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  quickHint: {
    color: "#8A93A6",
    fontSize: 12,
  },
};
