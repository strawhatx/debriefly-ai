export const allStrategies = [
  "BREAKOUT",
  "PULLBACK",
  "REVERSALS",
  "TREND FOLLOWING",
  "RANGE TRADING",
  "SCALPING",
  "MOMENTUM",
  "SWING TRADING",
  "ORDER BLOCK",
  "FVG",
];

export const allTags = [
  "CALM",
  "CONFIDENT",
  "DISCIPLINED",
  "PATIENT",
  "HESITANT",
  "ANXIOUS",
  "FEARFUL",
  "DOUBTFUL",
  "FOMO",
  "GREEDY",
  "EXCITED",
  "OVERCONFIDENT",
  "REVENGE",
  "ANGRY",
  "FRUSTRATED",
  "IMPULSIVE",
];

// Emotion colors and icons dictionary using Tailwind classes
export const emotionAttributes: Record<
  string,
  { colorClass: string; icon: string }
> = {
  // Good emotions (emerald)
  CALM: { colorClass: "text-emerald-400 bg-emerald-900/50 border border-emerald-500/50", icon: "🧘" },
  CONFIDENT: { colorClass: "text-emerald-400 bg-emerald-900/50 border border-emerald-500/50", icon: "💪" },
  DISCIPLINED: { colorClass: "text-emerald-400 bg-emerald-900/50 border border-emerald-500/50", icon: "📏" },
  PATIENT: { colorClass: "text-emerald-400 bg-emerald-900/50 border border-emerald-500/50", icon: "⏳" },

  // Unsure emotions (amber)
  HESITANT: { colorClass: "text-amber-400 bg-amber-900/50 border border-amber-500/50", icon: "🤔" },
  DOUBTFUL: { colorClass: "text-amber-400 bg-amber-900/50 border border-amber-500/50", icon: "🤷" },
  EXCITED: { colorClass: "text-amber-400 bg-amber-900/50 border border-amber-500/50", icon: "🤩" },
  OVERCONFIDENT: { colorClass: "text-amber-400 bg-amber-900/50 border border-amber-500/50", icon: "😎" },

  // Bad emotions (red)
  ANXIOUS: { colorClass: "text-red-400 bg-red-900/50 border border-red-500/50", icon: "😟" },
  FEARFUL: { colorClass: "text-red-400 bg-red-900/50", icon: "😨" },
  FOMO: { colorClass: "text-red-400 bg-red-900/50", icon: "🚀" },
  GREEDY: { colorClass: "text-red-400 bg-red-900/50", icon: "💰" },
  REVENGE: { colorClass: "text-red-400 bg-red-900/50", icon: "😡" },
  ANGRY: { colorClass: "text-red-400 bg-red-900/50", icon: "😠" },
  FRUSTRATED: { colorClass: "text-red-400 bg-red-900/50", icon: "😤" },
  IMPULSIVE: { colorClass: "text-red-400 bg-red-900/50", icon: "🤯" },
};