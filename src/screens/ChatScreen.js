import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  normalizeText,
  speakSafe,
  detectIntent,
  startGuidedFlow,
  continueGuidedFlow,
  initialGuidedState,
} from "../utils/helpers";
import { COLORS, RADII, SHADOW } from "../utils/theme";

export default function ChatScreen({ navigation, todos = [], setTodos = () => {} }) {
  const welcomeText =
    "Hello, dear. I’m here to help. You can ask me to make a reminder, review your tasks, write a note, or guide you step by step.";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "m0",
      role: "ai",
      text: welcomeText,
    },
  ]);
  const [guidedState, setGuidedState] = useState(initialGuidedState);

  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    speakSafe(welcomeText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToEnd?.({ animated: true });
    }, 60);
  }, [messages.length]);

  const pushMessage = (role, text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        role,
        text,
      },
    ]);
  };

const handleAction = (action) => {
  if (!action) return;

  if (action.type === "add_todo") {
    const newTodo = {
      id: `t_${Date.now()}`,
      text: action.payload.text,
      done: false,
    };

    setTodos((prev) => [newTodo, ...prev]);

    setTimeout(() => {
      navigation.navigate("Checklist");
    }, 500);
  }

  if (action.type === "open_checklist") {
    navigation.navigate("Checklist");
  }

  if (action.type === "open_food_order") {
    navigation.navigate("FoodOrder");
  }
};

  const onSend = () => {
    const text = normalizeText(input);
    if (!text) return;

    pushMessage("user", text);
    setInput("");

    let result;

    if (guidedState?.mode && guidedState?.step) {
      result = continueGuidedFlow(guidedState, text, todos);
    } else {
      const intent = detectIntent(text);
      result = startGuidedFlow(intent, text, todos);
    }

    setTimeout(() => {
      pushMessage("ai", result.reply);
      speakSafe(result.reply);
      setGuidedState(result.nextState || initialGuidedState);
      handleAction(result.action);
    }, 220);
  };

  const onMicPress = () => {
    Alert.alert(
      "Voice Input",
      "For this prototype, please use your phone keyboard microphone for speech-to-text input."
    );

    setTimeout(() => {
      inputRef.current?.focus?.();
    }, 250);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={{
          marginBottom: 10,
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.aiBubble,
            SHADOW.glow,
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              { color: isUser ? COLORS.bgBottom : COLORS.text },
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={[COLORS.bgTop, COLORS.bgBottom]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.topBar}>
          <Text style={styles.brand}>UBICA</Text>

          <TouchableOpacity
            onPress={() => {
              setGuidedState(initialGuidedState);
              const text =
                "Okay. I cleared the current conversation guidance. What would you like help with now?";
              pushMessage("ai", text);
              speakSafe(text);
            }}
            style={styles.iconBtn}
          >
            <MaterialCommunityIcons
              name="refresh"
              size={18}
              color={COLORS.gold2}
            />
            <Text style={styles.iconBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 14, paddingBottom: 10 }}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd?.({ animated: true })
          }
          onLayout={() => listRef.current?.scrollToEnd?.({ animated: true })}
        />

        <View style={styles.quickActionsWrap}>
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => setInput("I need a reminder")}
          >
            <Text style={styles.quickBtnText}>Reminder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => setInput("What are my tasks")}
          >
            <Text style={styles.quickBtnText}>My Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => setInput("Write this down")}
          >
            <Text style={styles.quickBtnText}>Note</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => setInput("Talk to me")}
          >
            <Text style={styles.quickBtnText}>Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => setInput("I want to order food")}
          >
          <Text style={styles.quickBtnText}>Food</Text>
          </TouchableOpacity>
          
        </View>

        <View style={styles.inputWrap}>
          <View style={styles.inputCard}>
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              placeholder="Type or use keyboard voice input..."
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              returnKeyType="send"
              onSubmitEditing={onSend}
            />

            <TouchableOpacity onPress={onMicPress} style={styles.micBtn}>
              <MaterialCommunityIcons
                name="microphone"
                size={20}
                color={COLORS.bgBottom}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={onSend} style={styles.sendBtn}>
              <MaterialCommunityIcons
                name="send"
                size={18}
                color={COLORS.bgBottom}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            Tip: Try saying “I need a reminder” or “What are my tasks?”
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
    backgroundColor: "rgba(14,26,51,0.78)",
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "650",
  },
  quickActionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  quickBtn: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    backgroundColor: "rgba(14,26,51,0.45)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  quickBtnText: {
    color: COLORS.gold2,
    fontSize: 12,
    fontWeight: "700",
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