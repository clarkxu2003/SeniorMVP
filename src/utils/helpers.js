import * as Speech from "expo-speech";

let speakTimer = null;

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

/**
 * Optional: warm up TTS once (helps iOS not swallow first syllables)
 * You can call this once on app start if you want.
 */
export function warmUpTTS() {
  try {
    Speech.stop();
    Speech.speak(" ", { rate: 1.0, volume: 0.0 });
  } catch (e) {}
}

export function speakSafe(text) {
  try {
    if (speakTimer) clearTimeout(speakTimer);

    // Stop any current speech first
    Speech.stop();

    // Key fix: small delay so iOS audio route wakes up (prevents first letters being cut)
    speakTimer = setTimeout(() => {
      Speech.speak(text, {
        rate: 0.92,
        pitch: 1.0,
        language: "en-US",
      });
    }, 160);
  } catch (e) {}
}

export function stopSpeaking() {
  try {
    if (speakTimer) clearTimeout(speakTimer);
    Speech.stop();
  } catch (e) {}
}
