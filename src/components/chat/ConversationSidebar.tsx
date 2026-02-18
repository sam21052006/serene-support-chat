import { useState } from "react";
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";

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
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out",
          "bg-sidebar border-r border-sidebar-border",
          isOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <span className="font-semibold text-sidebar-foreground text-sm tracking-wide uppercase">
            Conversations
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onToggle}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={onNew}
            className="w-full justify-start gap-2 gradient-calm text-primary-foreground hover:opacity-90 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-4">
          {conversations.length === 0 && (
            <div className="text-center py-8 text-sidebar-foreground/50 text-sm">
              No conversations yet.
              <br />Start a new chat!
            </div>
          )}

          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-medium text-sidebar-foreground/40 uppercase tracking-wider px-2 mb-1">
                {group.label}
              </p>
              {group.items.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150",
                    activeConversationId === conv.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                  )}
                  onClick={() => onSelect(conv.id)}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0 opacity-60" />

                  {editingId === conv.id ? (
                    <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-6 text-xs px-1 bg-background"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmEdit();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button onClick={confirmEdit} className="text-primary hover:text-primary/80">
                        <Check className="h-3 w-3" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-sm truncate">{conv.title}</span>
                      {(hoveredId === conv.id || activeConversationId === conv.id) && (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => startEdit(conv)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-background/50 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-all"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => onDelete(conv.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 text-sidebar-foreground/60 hover:text-destructive transition-all"
                          >
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
