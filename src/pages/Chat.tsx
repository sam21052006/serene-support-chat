import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isCrisis?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when switching conversations
  useEffect(() => {
    if (activeConversationId) {
      loadConversationMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  const fetchConversations = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setConversations(data);
      // Auto-select the most recent conversation
      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id);
      }
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    setIsLoadingHistory(true);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(
        data.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          isCrisis: m.is_crisis_alert ?? false,
        }))
      );
    }
    setIsLoadingHistory(false);
  };

  const createNewConversation = async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title: "New Conversation" })
      .select()
      .single();

    if (error || !data) return null;
    setConversations((prev) => [data, ...prev]);
    return data.id;
  };

  const handleNewChat = async () => {
    const id = await createNewConversation();
    if (id) {
      setActiveConversationId(id);
      setMessages([]);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    // Close sidebar on mobile after selecting
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleDeleteConversation = async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
    toast({ title: "Conversation deleted" });
  };

  const handleRenameConversation = async (id: string, title: string) => {
    await supabase.from("conversations").update({ title }).eq("id", id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  };

  // Auto-generate a title from the first user message
  const autoTitleConversation = async (conversationId: string, firstMessage: string) => {
    const title = firstMessage.length > 50
      ? firstMessage.substring(0, 50) + "..."
      : firstMessage;
    await supabase.from("conversations").update({ title }).eq("id", conversationId);
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, title } : c))
    );
  };

  const sendMessage = async (content: string) => {
    if (!user) return;

    let conversationId = activeConversationId;

    // Auto-create a conversation if none is active
    if (!conversationId) {
      conversationId = await createNewConversation();
      if (!conversationId) return;
      setActiveConversationId(conversationId);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Auto-title on first message in this conversation
    const isFirstMessage = messages.length === 0;

    try {
      // Save user message
      await supabase.from("chat_messages").insert({
        user_id: user.id,
        role: "user",
        content,
        conversation_id: conversationId,
      });

      if (isFirstMessage) {
        await autoTitleConversation(conversationId, content);
      }

      // Update conversation updated_at via ordering
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === conversationId ? { ...c, updated_at: new Date().toISOString() } : c
        );
        return updated.sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });

      // Call AI
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content,
        isCrisis: data.isCrisis,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message
      await supabase.from("chat_messages").insert({
        user_id: user.id,
        role: "assistant",
        content: data.content,
        is_crisis_alert: data.isCrisis,
        conversation_id: conversationId,
      });

      // Auto-log mood
      if (data.detectedMood) {
        await supabase.from("mood_entries").insert({
          user_id: user.id,
          mood: data.detectedMood,
          notes: `Auto-detected from chat: "${content.substring(0, 80)}${content.length > 80 ? "..." : ""}"`,
        });
      }

      if (data.isCrisis) {
        toast({
          title: "We're here for you",
          description: "If you're in crisis, please reach out to a professional. You're not alone.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-soft flex">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
        onRename={handleRenameConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? "lg:pl-72" : ""
        }`}
      >
        <Navbar />

        <main className="pt-20 pb-4 px-4 flex-1 flex flex-col max-w-3xl mx-auto w-full">
          <Card variant="glass" className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-border/50 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hidden lg:flex"
                onClick={() => setSidebarOpen((v) => !v)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  {activeConversationId
                    ? conversations.find((c) => c.id === activeConversationId)?.title || "Chat"
                    : "Serene Support Chat"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Share how you're feeling. I'm here to listen.
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingHistory ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl gradient-calm flex items-center justify-center mb-4">
                    <span className="text-3xl">💙</span>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Welcome to Your Safe Space
                  </h2>
                  <p className="max-w-sm text-muted-foreground">
                    I'm Serene, your compassionate companion. Share what's on your mind.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {["How are you feeling today?", "I need some advice", "Help me calm down"].map(
                      (prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          className="px-4 py-2 rounded-full text-primary-foreground text-sm font-medium transition-all duration-200 gradient-calm hover:shadow-glow hover:scale-105"
                        >
                          {prompt}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    isCrisis={message.isCrisis}
                  />
                ))
              )}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full gradient-calm flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                  </div>
                  <div className="bg-card rounded-2xl px-4 py-3 shadow-soft">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Crisis Banner */}
            {messages.some((m) => m.isCrisis) && (
              <div className="mx-4 mb-2 p-3 rounded-lg bg-crisis/10 border border-crisis/30 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-crisis flex-shrink-0" />
                <p className="text-xs text-foreground">
                  If you're in crisis, please reach out to a professional. Call 988 (US) for immediate support.
                </p>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border/50">
              <ChatInput onSend={sendMessage} disabled={isLoading} />
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
