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

export const allTagObjects = [
  { label: "CALM", value: "CALM" },
  { label: "CONFIDENT", value: "CONFIDENT" },
  { label: "DISCIPLINED", value: "DISCIPLINED" },
  { label: "PATIENT", value: "PATIENT" },
  { label: "HESITANT", value: "HESITANT" },
  { label: "ANXIOUS", value: "ANXIOUS" },
  { label: "FEARFUL", value: "FEARFUL" },
  { label: "DOUBTFUL", value: "DOUBTFUL" },
  { label: "FOMO", value: "FOMO" },
  { label: "GREEDY", value: "GREEDY" },
  { label: "EXCITED", value: "EXCITED" },
  { label: "OVERCONFIDENT", value: "OVERCONFIDENT" },
  { label: "REVENGE", value: "REVENGE" },
  { label: "ANGRY", value: "ANGRY" },
  { label: "FRUSTRATED", value: "FRUSTRATED" },
  { label: "IMPULSIVE", value: "IMPULSIVE" }
];

// Emotion colors and icons dictionary using Tailwind classes
export const emotionAttributes: Record<string, {
  type: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  colorClass: string;
  icon: string
}> = {
  // Good emotions (emerald)
  CALM: { type: "POSITIVE", colorClass: "text-emerald-400 bg-emerald-900/50 border border-emerald-500/50 hover:bg-emerald-900/70", icon: "🧘" },
  CONFIDENT: { type: "POSITIVE", colorClass: "text-emerald-400 bg-emerald-900/50 border border-emerald-500/50 hover:bg-emerald-900/70", icon: "💪" },
  DISCIPLINED: { type: "POSITIVE", colorClass: "text-emerald-400 bg-emerald-900/50 border border-emerald-500/50 hover:bg-emerald-900/70", icon: "📏" },
  PATIENT: { type: "POSITIVE", colorClass: "text-emerald-400 bg-emerald-900/50 border border-emerald-500/50 hover:bg-emerald-900/70", icon: "⏳" },

  // Unsure emotions (amber)
  HESITANT: { type: "NEUTRAL", colorClass: "text-amber-400 bg-amber-900/50 border border-amber-500/50 hover:bg-amber-900/70", icon: "🤔" },
  DOUBTFUL: { type: "NEUTRAL", colorClass: "text-amber-400 bg-amber-900/50 border border-amber-500/50 hover:bg-amber-900/70", icon: "🤷" },
  EXCITED: { type: "NEUTRAL", colorClass: "text-amber-400 bg-amber-900/50 border border-amber-500/50 hover:bg-amber-900/70", icon: "🤩" },
  OVERCONFIDENT: { type: "NEUTRAL", colorClass: "text-amber-400 bg-amber-900/50 border border-amber-500/50 hover:bg-amber-900/70", icon: "😎" },

  // Bad emotions (red)
  ANXIOUS: {type: "NEGATIVE", colorClass: "text-red-400 bg-red-900/50 border border-red-500/50 hover:bg-red-900/70", icon: "😟" },
  FEARFUL: {type: "NEGATIVE", colorClass: "text-red-400 bg-red-900/50 border border-red-500/50 hover:bg-red-900/70", icon: "😨" },
  FOMO: {type: "NEGATIVE", colorClass: "text-red-400 bg-red-900/50 border border-red-500/50 hover:bg-red-900/70", icon: "🚀" },
  GREEDY: {type: "NEGATIVE", colorClass: "text-red-400 bg-red-900/50 border border-red-500/50 hover:bg-red-900/70", icon: "💰" },
  REVENGE: {type: "NEGATIVE", colorClass: "text-red-400 bg-red-900/50 border border-red-500/50 hover:bg-red-900/70", icon: "😡" },
  ANGRY: {type: "NEGATIVE", colorClass: "text-red-400 bg-red-900/50 border border-red-500/50 hover:bg-red-900/70", icon: "😠" },
  FRUSTRATED: {type: "NEGATIVE", colorClass: "text-red-400 bg-red-900/50 border border-red-500/50 hover:bg-red-900/70", icon: "😤" },
  IMPULSIVE: {type: "NEGATIVE", colorClass: "text-red-400 bg-red-900/50 border border-red-500/50 hover:bg-red-900/70", icon: "🤯" },
};