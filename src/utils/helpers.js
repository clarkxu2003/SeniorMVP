import * as Speech from "expo-speech";

// =========================
// Speech
// =========================
export const speakSafe = (text) => {
  if (!text) return;

  try {
    Speech.stop();

    // Slight pause to reduce first-word clipping
    setTimeout(() => {
      Speech.speak(text, {
        language: "en",
        pitch: 1.0,
        rate: 0.95,
      });
    }, 220);
  } catch (err) {
    console.log("Speech error:", err);
  }
};

// =========================
// Text helpers
// =========================
export const normalizeText = (text) => {
  return (text || "").trim().replace(/\s+/g, " ");
};

export const lowerText = (text) => normalizeText(text).toLowerCase();

export const containsAny = (text, keywords = []) => {
  const t = lowerText(text);
  return keywords.some((k) => t.includes(k));
};

// =========================
// Intent detection
// =========================
export const detectIntent = (text) => {
  const t = lowerText(text);

  if (
    containsAny(t, [
      "remind me",
      "reminder",
      "set a reminder",
      "help me remember",
      "create reminder",
      "add reminder",
      "to do",
      "todo",
      "task",
    ])
  ) {
    return "reminder";
  }

  if (
    containsAny(t, [
      "what are my tasks",
      "show my tasks",
      "show reminders",
      "my reminders",
      "my tasks",
      "what do i need to do",
      "check my list",
      "checklist",
    ])
  ) {
    return "review_tasks";
  }

  if (
    containsAny(t, [
      "call",
      "phone",
      "contact",
      "call my daughter",
      "call my son",
      "help me call",
    ])
  ) {
    return "call";
  }

  if (
    containsAny(t, [
      "write this down",
      "take a note",
      "note this",
      "save this note",
      "note",
      "memo",
    ])
  ) {
    return "note";
  }

  if (
    containsAny(t, [
      "translate",
      "translation",
      "in chinese",
      "in english",
      "in french",
      "in spanish",
    ])
  ) {
    return "translation";
  }

  if (
    containsAny(t, [
      "order food",
      "ubereats",
      "uber eats",
      "food delivery",
      "delivery",
      "i'm hungry",
      "im hungry",
      "get food",
      "buy food",
      "restaurant",
      "takeout",
      "take out",
      "guide me to order food",
      "help me order food",
    ])
  ) {
    return "food_order";
  }

  if (
    containsAny(t, [
      "hello",
      "hi",
      "how are you",
      "talk to me",
      "check in",
      "i feel lonely",
      "can we talk",
      "chat",
    ])
  ) {
    return "friendly";
  }

  return "general";
};

// =========================
// Reminder parsing helpers
// =========================
export const extractReminderTask = (text) => {
  const raw = normalizeText(text);
  const lower = raw.toLowerCase();

  const patterns = [
    /remind me to (.+)/i,
    /set a reminder to (.+)/i,
    /help me remember to (.+)/i,
    /add reminder to (.+)/i,
    /i need a reminder to (.+)/i,
    /write down (.+)/i,
  ];

  for (const p of patterns) {
    const match = raw.match(p);
    if (match && match[1]) {
      return cleanTaskText(match[1]);
    }
  }

  if (lower.includes("reminder")) return "";
  return cleanTaskText(raw);
};

const cleanTaskText = (text) => {
  return normalizeText(
    text
      .replace(/\b(at|on|every|tomorrow|today|tonight)\b.*$/i, "")
      .replace(/[.?!]$/, "")
  );
};

export const extractTimeText = (text) => {
  const raw = normalizeText(text);

  const timePatterns = [
    /\b\d{1,2}:\d{2}\s?(am|pm)\b/i,
    /\b\d{1,2}\s?(am|pm)\b/i,
    /\bthis morning\b/i,
    /\bthis afternoon\b/i,
    /\bthis evening\b/i,
    /\btonight\b/i,
    /\btomorrow morning\b/i,
    /\btomorrow afternoon\b/i,
    /\btomorrow evening\b/i,
    /\btomorrow\b/i,
    /\btoday\b/i,
  ];

  for (const p of timePatterns) {
    const match = raw.match(p);
    if (match) return match[0];
  }

  return "";
};

export const extractRepeatText = (text) => {
  const raw = lowerText(text);

  if (raw.includes("every day") || raw.includes("daily")) return "daily";
  if (raw.includes("every week") || raw.includes("weekly")) return "weekly";
  if (raw.includes("every month") || raw.includes("monthly")) return "monthly";
  if (raw.includes("no repeat") || raw.includes("once")) return "once";
  return "";
};

// =========================
// Guided conversation engine
// =========================
export const initialGuidedState = {
  mode: null, // reminder | call | note | translation | friendly
  step: null,
  data: {},
};

export const buildTodoLabel = ({ task, time, repeat }) => {
  let label = task || "Untitled reminder";
  if (time) label += ` — ${time}`;
  if (repeat && repeat !== "once") label += ` — repeats ${repeat}`;
  return label;
};

export const getFriendlyReply = (text) => {
  const t = lowerText(text);

  if (t.includes("lonely")) {
    return "I’m here with you. We can talk, review your reminders, or do one small task together.";
  }

  if (t.includes("how are you")) {
    return "I’m doing well, and I’m happy to help. Would you like to make a reminder, check your task list, or just talk for a moment?";
  }

  return "Of course. I’m here to help. We can make a reminder, review your tasks, write a note, or just have a short conversation.";
};

export const startGuidedFlow = (intent, userText, todos = []) => {
  switch (intent) {
    case "reminder": {
      const task = extractReminderTask(userText);
      const time = extractTimeText(userText);
      const repeat = extractRepeatText(userText);

      if (!task) {
        return {
          reply:
            "Sure. I can help you create a reminder. What would you like me to remind you about?",
          nextState: {
            mode: "reminder",
            step: "ask_task",
            data: {},
          },
          action: null,
        };
      }

      if (!time) {
        return {
          reply: `Okay. I’ll remind you to ${task}. When would you like the reminder?`,
          nextState: {
            mode: "reminder",
            step: "ask_time",
            data: { task },
          },
          action: null,
        };
      }

      if (!repeat) {
        return {
          reply: `Got it. I’ll remind you to ${task} at ${time}. Should this repeat every day, every week, or just once?`,
          nextState: {
            mode: "reminder",
            step: "ask_repeat",
            data: { task, time },
          },
          action: null,
        };
      }

      return {
        reply: `I’m ready to save this reminder: ${task}, ${time}, ${repeat}. Would you like me to save it now?`,
        nextState: {
          mode: "reminder",
          step: "confirm_save",
          data: { task, time, repeat },
        },
        action: null,
      };
    }

    case "review_tasks": {
      if (!todos.length) {
        return {
          reply:
            "Your list is empty right now. Would you like me to help you create a new reminder?",
          nextState: {
            mode: "reminder",
            step: "ask_task",
            data: {},
          },
          action: null,
        };
      }

      const preview = todos
        .slice(0, 3)
        .map((t, i) => `${i + 1}. ${t.text}`)
        .join(" ");

      return {
        reply: `Here are your current tasks. ${preview} Would you like to add another reminder or open the checklist page?`,
        nextState: {
          mode: "review_tasks",
          step: "after_review",
          data: {},
        },
        action: null,
      };
    }

    case "call": {
      return {
        reply:
          "I can help guide you through making a call. Who would you like to call?",
        nextState: {
          mode: "call",
          step: "ask_contact",
          data: {},
        },
        action: null,
      };
    }

    case "note": {
      const cleaned = normalizeText(
        userText
          .replace(/write this down/i, "")
          .replace(/take a note/i, "")
          .replace(/note this/i, "")
          .replace(/save this note/i, "")
      );

      if (cleaned) {
        return {
          reply: `Okay. I wrote this down: "${cleaned}". Would you like to add more details?`,
          nextState: {
            mode: "note",
            step: "ask_more_note",
            data: { note: cleaned },
          },
          action: null,
        };
      }

      return {
        reply: "Sure. What would you like me to write down?",
        nextState: {
          mode: "note",
          step: "ask_note_content",
          data: {},
        },
        action: null,
      };
    }

    case "translation": {
      return {
        reply:
          "I can help with translation guidance. Please tell me what sentence you want translated and which language you need.",
        nextState: {
          mode: "translation",
          step: "ask_translation_content",
          data: {},
        },
        action: null,
      };
    }

    case "friendly": {
      return {
        reply: getFriendlyReply(userText),
        nextState: {
          mode: "friendly",
          step: "offer_help",
          data: {},
        },
        action: null,
      };
    }
    case "food_order": {
      return {
        reply:
          "Of course. I can help you order food step by step. I’ll open the food ordering assistant now.",
        nextState: {
          mode: "food_order",
          step: "open_food_order",
          data: {},
        },
        action: {
          type: "open_food_order",
        },
      };
    }

    default:
      return {
        reply:
          "I can help you create a reminder, check your tasks, write a note, or guide you through a simple action. What would you like to do?",
        nextState: {
          mode: "friendly",
          step: "offer_help",
          data: {},
        },
        action: null,
      };
  }
};

export const continueGuidedFlow = (guidedState, userText, todos = []) => {
  const t = lowerText(userText);
  const yes = /^(yes|yeah|yep|ok|okay|sure|please do|save it|confirm)/i.test(t);
  const no = /^(no|nope|not now|cancel|stop)/i.test(t);

  if (!guidedState?.mode || !guidedState?.step) {
    return startGuidedFlow(detectIntent(userText), userText, todos);
  }

  // Global redirect: user changes topic mid-flow
  const newIntent = detectIntent(userText);
  if (
    newIntent !== "general" &&
    !(guidedState.mode === "reminder" && newIntent === "reminder")
  ) {
    return startGuidedFlow(newIntent, userText, todos);
  }

  if (guidedState.mode === "reminder") {
    const current = guidedState.data || {};

    if (guidedState.step === "ask_task") {
      const task = extractReminderTask(userText) || normalizeText(userText);
      return {
        reply: `Okay. I’ll remind you to ${task}. When would you like the reminder?`,
        nextState: {
          mode: "reminder",
          step: "ask_time",
          data: { ...current, task },
        },
        action: null,
      };
    }

    if (guidedState.step === "ask_time") {
      const time = extractTimeText(userText) || normalizeText(userText);
      return {
        reply: `Thanks. Should this reminder repeat every day, every week, or just once?`,
        nextState: {
          mode: "reminder",
          step: "ask_repeat",
          data: { ...current, time },
        },
        action: null,
      };
    }

    if (guidedState.step === "ask_repeat") {
      const repeat = extractRepeatText(userText) || "once";
      const summary = buildTodoLabel({
        task: current.task,
        time: current.time,
        repeat,
      });

      return {
        reply: `I’m ready to save this reminder: ${summary}. Would you like me to save it now?`,
        nextState: {
          mode: "reminder",
          step: "confirm_save",
          data: { ...current, repeat },
        },
        action: null,
      };
    }

    if (guidedState.step === "confirm_save") {
      if (yes) {
        const text = buildTodoLabel(guidedState.data);

        return {
          reply: `Done. I saved your reminder: ${text}. I can also help you add another one or review your checklist.`,
          nextState: {
            mode: "friendly",
            step: "offer_help",
            data: {},
          },
          action: {
            type: "add_todo",
            payload: {
              text,
              completed: false,
            },
          },
        };
      }

      if (no) {
        return {
          reply:
            "Okay, I did not save it. Would you like to change the reminder details instead?",
          nextState: {
            mode: "reminder",
            step: "ask_task",
            data: {},
          },
          action: null,
        };
      }

      return {
        reply: "Please say yes to save it, or no if you want to change it.",
        nextState: guidedState,
        action: null,
      };
    }
  }

  if (guidedState.mode === "review_tasks") {
    if (t.includes("open") || t.includes("checklist") || t.includes("show")) {
      return {
        reply: "Okay. Opening your checklist.",
        nextState: initialGuidedState,
        action: { type: "open_checklist" },
      };
    }

    if (t.includes("add") || t.includes("new")) {
      return {
        reply: "Of course. What would you like me to remind you about?",
        nextState: {
          mode: "reminder",
          step: "ask_task",
          data: {},
        },
        action: null,
      };
    }

    return {
      reply:
        "You can ask me to add a reminder or open the checklist page.",
      nextState: guidedState,
      action: null,
    };
  }

  if (guidedState.mode === "call") {
    if (guidedState.step === "ask_contact") {
      const contact = normalizeText(userText);
      return {
        reply: `Okay. You want to call ${contact}. In a full version, I would open the calling screen or contact list for you. Would you like help with another task?`,
        nextState: {
          mode: "friendly",
          step: "offer_help",
          data: {},
        },
        action: null,
      };
    }
  }

  if (guidedState.mode === "note") {
    if (guidedState.step === "ask_note_content") {
      const note = normalizeText(userText);
      return {
        reply: `Got it. I wrote this down: "${note}". Would you like to add more details?`,
        nextState: {
          mode: "note",
          step: "ask_more_note",
          data: { note },
        },
        action: null,
      };
    }

    if (guidedState.step === "ask_more_note") {
      if (yes || t.includes("no")) {
        return {
          reply:
            "Okay. Your note has been captured in this conversation. What would you like help with next?",
          nextState: {
            mode: "friendly",
            step: "offer_help",
            data: {},
          },
          action: null,
        };
      }

      const more = normalizeText(userText);
      const combined = `${guidedState.data.note} ${more}`.trim();

      return {
        reply: `Understood. I updated the note to: "${combined}". Anything else you would like to add?`,
        nextState: {
          mode: "note",
          step: "ask_more_note",
          data: { note: combined },
        },
        action: null,
      };
    }
  }

  if (guidedState.mode === "translation") {
    if (guidedState.step === "ask_translation_content") {
      return {
        reply:
          "Thank you. In the next version, this is where live translation will appear. Right now, I can guide the conversation flow, but translation is still a prototype placeholder.",
        nextState: {
          mode: "friendly",
          step: "offer_help",
          data: {},
        },
        action: null,
      };
    }
  }

  if (guidedState.mode === "friendly") {
    return {
      reply:
        "I’m here with you. I can help create a reminder, review your tasks, write a note, or guide you step by step. What would you like to do next?",
      nextState: guidedState,
      action: null,
    };
  }
  
  if (guidedState.mode === "food_order") {
    return {
      reply:
        "I’m opening the food ordering assistant so I can guide you more clearly.",
      nextState: initialGuidedState,
      action: { type: "open_food_order" },
    };
  }

  return {
    reply:
      "I’m not sure I understood that, but I can still help step by step. Would you like to make a reminder, check your tasks, or write a note?",
    nextState: {
      mode: "friendly",
      step: "offer_help",
      data: {},
    },
    action: null,
  };
};