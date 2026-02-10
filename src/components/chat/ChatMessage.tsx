import { cn } from "@/lib/utils";
import { AlertTriangle, Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isCrisis?: boolean;
}

export function ChatMessage({ role, content, isCrisis }: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-soft",
            isCrisis ? "bg-crisis/20" : "gradient-calm"
          )}
        >
          {isCrisis ? (
            <AlertTriangle className="h-4 w-4 text-crisis" />
          ) : (
            <Bot className="h-4 w-4 text-primary-foreground" />
          )}
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-5 py-3.5",
          isAssistant
            ? isCrisis
              ? "bg-crisis/10 border border-crisis/30 text-foreground shadow-soft"
              : "bg-card text-card-foreground shadow-soft border border-border/30"
            : "gradient-calm text-primary-foreground shadow-glow"
        )}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {content.split("**").map((part, index) =>
            index % 2 === 0 ? (
              <span key={index}>{part}</span>
            ) : (
              <strong key={index} className="font-semibold">
                {part}
              </strong>
            )
          )}
        </div>
      </div>

      {!isAssistant && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full gradient-gold flex items-center justify-center shadow-soft">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}