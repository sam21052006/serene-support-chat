import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isCrisis?: boolean;
}
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  const sendMessage = async (content: string) => {
    if (!user) return;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    try {
      // Save user message to database
      await supabase.from("chat_messages").insert({
        user_id: user.id,
        role: "user",
        content
      });

      // Get AI response
      const {
        data,
        error
      } = await supabase.functions.invoke("chat", {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      });
      if (error) throw error;
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content,
        isCrisis: data.isCrisis
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to database
      await supabase.from("chat_messages").insert({
        user_id: user.id,
        role: "assistant",
        content: data.content,
        is_crisis_alert: data.isCrisis
      });
      if (data.isCrisis) {
        toast({
          title: "We're here for you",
          description: "If you're in crisis, please reach out to a professional. You're not alone.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (authLoading) {
    return <div className="min-h-screen gradient-soft flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div className="min-h-screen gradient-soft">
      <Navbar />
      
      <main className="pt-20 pb-4 px-4 max-w-3xl mx-auto h-screen flex flex-col">
        <Card variant="glass" className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-border/50">
            <h1 className="text-lg font-semibold text-foreground">Chat with Serene Support Chat</h1>
            <p className="text-sm text-muted-foreground">
              Share how you're feeling. I'm here to listen and support you.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl gradient-calm flex items-center justify-center mb-4">
                  <span className="text-3xl">💙</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Welcome to Your Safe Space
                </h2>
                <p className="text-muted-foreground max-w-sm">
                  I'm Serene Support Chat, your compassionate companion. Share what's on your mind, and I'll do my best to support you.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {["How are you feeling today?", "I need some advice", "Help me calm down"].map(prompt => <button key={prompt} onClick={() => sendMessage(prompt)} className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
                      {prompt}
                    </button>)}
                </div>
              </div>}

            {messages.map(message => <ChatMessage key={message.id} role={message.role} content={message.content} isCrisis={message.isCrisis} />)}

            {isLoading && <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full gradient-calm flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                </div>
                <div className="bg-card rounded-2xl px-4 py-3 shadow-soft">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{
                  animationDelay: "0ms"
                }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{
                  animationDelay: "150ms"
                }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{
                  animationDelay: "300ms"
                }} />
                  </div>
                </div>
              </div>}

            <div ref={messagesEndRef} />
          </div>

          {/* Crisis Alert Banner */}
          {messages.some(m => m.isCrisis) && <div className="mx-4 mb-2 p-3 rounded-lg bg-crisis/10 border border-crisis/30 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-crisis flex-shrink-0" />
              <p className="text-xs text-foreground">
                If you're in crisis, please reach out to a professional. Call 988 (US) for immediate support.
              </p>
            </div>}

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </div>
        </Card>
      </main>
    </div>;
}