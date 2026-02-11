import * as Speech from "expo-speech";

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

  return (
    todoKeywords.some((k) => t.includes(k)) ||
    t.startsWith("remind") ||
    t.startsWith("add ")
  );
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
    Speech.speak(text, {
      rate: 0.92,
      pitch: 1.0,
      language: "en-US",
    });
  } catch (e) {
    // ignore for MVP
  }
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch (e) {}
}
