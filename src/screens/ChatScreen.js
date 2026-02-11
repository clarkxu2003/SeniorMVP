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
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  extractTodoText,
  looksLikeTodo,
  normalizeText,
  speakSafe,
  stopSpeaking,
  showVoiceInputInfo,
} from "../utils/helpers";
import { COLORS, RADII, SHADOW } from "../utils/theme";

export default function ChatScreen({ navigation, todos, setTodos }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "m0",
      role: "ai",
      text: "Hello, dear. What would you like to do?",
    },
  ]);

  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    speakSafe("Hello, dear. What would you like to do?");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
  }, [messages.length]);

  const onSend = () => {
    const text = normalizeText(input);
    if (!text) return;

    setMessages((prev) => [...prev, { id: `u_${Date.now()}`, role: "user", text }]);
    setInput("");

    if (looksLikeTodo(text)) {
      const todoText = extractTodoText(text);
      setTodos((prev) => [{ id: `t_${Date.now()}`, text: todoText, done: false }, ...prev]);

      const reply = `No problem. I will remind you: “${todoText}”. Anything else?`;
      setMessages((prev) => [...prev, { id: `a_${Date.now()}`, role: "ai", text: reply }]);
      speakSafe(reply);

      setTimeout(() => navigation.navigate("Checklist"), 650);
      return;
    }

    const reply = "If it’s a task, you can say “Remind me to …” and I’ll add it to your checklist.";
    setMessages((prev) => [...prev, { id: `a_${Date.now()}`, role: "ai", text: reply }]);
    speakSafe(reply);
  };

  const onMicPress = () => {
    // Expo Go fallback: show info + focus input (use system keyboard mic dictation)
    showVoiceInputInfo();
    setTimeout(() => inputRef.current?.focus?.(), 250);
  };

  return (
    <LinearGradient colors={[COLORS.bgTop, COLORS.bgBottom]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.brand}>UBICA</Text>
          <TouchableOpacity onPress={stopSpeaking} style={styles.iconBtn}>
            <MaterialCommunityIcons name="volume-off" size={18} color={COLORS.gold2} />
            <Text style={styles.iconBtnText}>Mute</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 14, paddingBottom: 10 }}
          renderItem={({ item }) => {
            const isUser = item.role === "user";
            return (
              <View style={{ marginBottom: 10, alignItems: isUser ? "flex-end" : "flex-start" }}>
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble, SHADOW.glow]}>
                  <Text style={[styles.bubbleText, { color: isUser ? COLORS.bgBottom : COLORS.text }]}>
                    {item.text}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* Input */}
        <View style={styles.inputWrap}>
          <View style={styles.inputCard}>
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              placeholder="Tap to type…"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              returnKeyType="send"
              onSubmitEditing={onSend}
            />

            <TouchableOpacity onPress={onMicPress} style={styles.micBtn}>
              <MaterialCommunityIcons name="microphone" size={20} color={COLORS.bgBottom} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onSend} style={styles.sendBtn}>
              <MaterialCommunityIcons name="send" size={18} color={COLORS.bgBottom} />
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            Tip: Use keyboard mic for dictation in Expo Go.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = {
  topBar: {
    paddingTop: 44,
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: COLORS.gold2,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },
  iconBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "rgba(14,26,51,0.5)",
  },
  iconBtnText: {
    color: COLORS.gold2,
    fontWeight: "800",
    fontSize: 12,
  },
  bubble: {
    maxWidth: "86%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  userBubble: {
    backgroundColor: COLORS.gold2,
  },
  aiBubble: {
    backgroundColor: "rgba(14,26,51,0.75)",
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "650",
  },
  inputWrap: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.gold,
    backgroundColor: "rgba(14,26,51,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "650",
    paddingVertical: 6,
  },
  micBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: COLORS.gold2,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    marginTop: 8,
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },
};
