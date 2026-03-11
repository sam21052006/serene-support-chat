import { useState } from "react";
import { Plus, MessageSquare, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isToday, isYesterday, isThisWeek } from "date-fns";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function groupConversations(conversations: Conversation[]) {
  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "This Week", items: [] },
    { label: "Older", items: [] },
  ];

  conversations.forEach((conv) => {
    const date = new Date(conv.updated_at);
    if (isToday(date)) groups[0].items.push(conv);
    else if (isYesterday(date)) groups[1].items.push(conv);
    else if (isThisWeek(date)) groups[2].items.push(conv);
    else groups[3].items.push(conv);
  });

  return groups.filter((g) => g.items.length > 0);
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  isOpen,
  onToggle,
}: ConversationSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const startEdit = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const confirmEdit = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  const groups = groupConversations(conversations);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onToggle} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-200",
          "bg-background border-r",
          isOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between p-3 border-b">
          <span className="font-semibold text-sm">Conversations</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-2">
          <Button onClick={onNew} className="w-full justify-start gap-2" size="sm">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-3">
          {conversations.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No conversations yet.
            </div>
          )}

          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-1">
                {group.label}
              </p>
              {group.items.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer text-sm",
                    activeConversationId === conv.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary text-foreground"
                  )}
                  onClick={() => onSelect(conv.id)}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0 opacity-50" />

                  {editingId === conv.id ? (
                    <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-6 text-xs px-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmEdit();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button onClick={confirmEdit} className="text-primary"><Check className="h-3 w-3" /></button>
                      <button onClick={() => setEditingId(null)} className="text-muted-foreground"><X className="h-3 w-3" /></button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 truncate">{conv.title}</span>
                      {(hoveredId === conv.id || activeConversationId === conv.id) && (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => startEdit(conv)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-primary">
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button onClick={() => onDelete(conv.id)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
