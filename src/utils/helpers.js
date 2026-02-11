import * as Speech from "expo-speech";
import { Alert, Platform } from "react-native";

export function normalizeText(s) {
  return (s || "").trim();
}

export function looksLikeTodo(text) {
  const t = (text || "").toLowerCase();
  const todoKeywords = [
    "remind me",
    "reminder",
    "todo",
    "to do",
    "i need to",
    "i have to",
    "please add",
    "add to my list",
    "add a task",
    "don't forget",
    "dont forget",
  ];
  return todoKeywords.some((k) => t.includes(k)) || t.startsWith("remind") || t.startsWith("add ");
}

export function extractTodoText(raw) {
  let t = normalizeText(raw);
  t = t.replace(/^remind me to\s+/i, "");
  t = t.replace(/^remind me\s+/i, "");
  t = t.replace(/^remind\s+/i, "");
  t = t.replace(/^add\s+/i, "");
  t = t.replace(/^please add\s+/i, "");
  return t.trim() || normalizeText(raw);
}

export function speakSafe(text) {
  try {
    Speech.stop();
    Speech.speak(text, { rate: 0.92, pitch: 1.0, language: "en-US" });
  } catch (e) {}
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch (e) {}
}

/**
 * Expo Go 里一般无法做“真语音识别”。先给一个友好提示。
 * 你后面做 Dev Build 时，我会把这里替换为真正 STT start/stop。
 */
export function showVoiceInputInfo() {
  Alert.alert(
    "Voice input",
    Platform.select({
      ios: "Expo Go usually can’t do speech-to-text. For now, tap the keyboard mic for dictation.\n\nIf you want real voice input, we’ll create an Expo Dev Build (EAS).",
      android:
        "Expo Go usually can’t do speech-to-text. For now, use the keyboard mic for dictation.\n\nIf you want real voice input, we’ll create an Expo Dev Build (EAS).",
      default:
        "Voice input needs a Dev Build. For now, use keyboard dictation.",
    })
  );
}
