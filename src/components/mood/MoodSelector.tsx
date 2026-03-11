import { cn } from "@/lib/utils";

type MoodType = "very_sad" | "sad" | "neutral" | "happy" | "very_happy";

interface MoodSelectorProps {
  selected?: MoodType;
  onSelect: (mood: MoodType) => void;
}

const moods: { type: MoodType; emoji: string; label: string }[] = [
  { type: "very_sad", emoji: "😢", label: "Very Sad" },
  { type: "sad", emoji: "😔", label: "Sad" },
  { type: "neutral", emoji: "😐", label: "Neutral" },
  { type: "happy", emoji: "😊", label: "Happy" },
  { type: "very_happy", emoji: "😄", label: "Very Happy" },
];

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {moods.map((mood) => (
        <button
          key={mood.type}
          onClick={() => onSelect(mood.type)}
          className={cn(
            "flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all hover:scale-105",
            selected === mood.type
              ? "border-primary bg-primary/10 scale-105"
              : "border-border bg-card opacity-70 hover:opacity-100"
          )}
        >
          <span className="text-3xl">{mood.emoji}</span>
          <span className="text-xs font-medium">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}

export function getMoodEmoji(mood: MoodType): string {
  return moods.find((m) => m.type === mood)?.emoji || "😐";
}

export function getMoodLabel(mood: MoodType): string {
  return moods.find((m) => m.type === mood)?.label || "Neutral";
}
