import { cn } from "@/lib/utils";

type MoodType = "very_sad" | "sad" | "neutral" | "happy" | "very_happy";

interface MoodSelectorProps {
  selected?: MoodType;
  onSelect: (mood: MoodType) => void;
}

const moods: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: "very_sad", emoji: "😢", label: "Very Sad", color: "bg-destructive/20 border-destructive/40" },
  { type: "sad", emoji: "😔", label: "Sad", color: "bg-crisis/20 border-crisis/40" },
  { type: "neutral", emoji: "😐", label: "Neutral", color: "bg-muted border-border" },
  { type: "happy", emoji: "😊", label: "Happy", color: "bg-accent border-accent-foreground/20" },
  { type: "very_happy", emoji: "😄", label: "Very Happy", color: "bg-success/20 border-success/40" },
];

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {moods.map((mood) => (
        <button
          key={mood.type}
          onClick={() => onSelect(mood.type)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105",
            mood.color,
            selected === mood.type
              ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
              : "opacity-70 hover:opacity-100"
          )}
        >
          <span className="text-4xl">{mood.emoji}</span>
          <span className="text-xs font-medium text-foreground">{mood.label}</span>
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
