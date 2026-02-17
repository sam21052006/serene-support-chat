import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}
export function ChatInput({
  onSend,
  disabled
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1 relative">
        <Textarea value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Share how you're feeling..." disabled={disabled} className="min-h-[52px] max-h-[200px] resize-none pr-12 bg-card border-border/50 focus:border-primary" rows={1} />
      </div>
      <Button type="submit" variant="calm" size="icon" disabled={!message.trim() || disabled} className="h-[52px] w-[52px] rounded-xl">
        <ArrowUp className="h-5 w-5" />
      </Button>
    </form>;
}