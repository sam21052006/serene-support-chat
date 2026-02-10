import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { getMoodEmoji, getMoodLabel } from "@/components/mood/MoodSelector";
import { MoodChart } from "@/components/mood/MoodChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
type MoodType = "very_sad" | "sad" | "neutral" | "happy" | "very_happy";
interface MoodEntry {
  id: string;
  mood: MoodType;
  notes: string | null;
  created_at: string;
}
export default function Mood() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);
  const fetchEntries = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from("mood_entries").select("*").eq("user_id", user.id).order("created_at", {
        ascending: false
      }).limit(30);
      if (error) throw error;
      setEntries(data as MoodEntry[] || []);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (authLoading || isLoading) {
    return <div className="min-h-screen gradient-soft flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  const todayEntry = entries.find(e => format(new Date(e.created_at), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"));
  return <div className="min-h-screen gradient-soft">
      <Navbar />
      
      <main className="pt-20 pb-8 px-4 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Mood Tracker</h1>
            <p className="text-muted-foreground">
              Understanding your emotions is the first step to wellness
            </p>
          </div>

          {/* Today's Mood from Chat */}
          {todayEntry && <Card variant="elevated" className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Today's Mood
                  </CardTitle>
                  <CardDescription>
                    Auto-detected from your chat: feeling {getMoodLabel(todayEntry.mood as MoodType).toLowerCase()}
                  </CardDescription>
                </div>
                <div className="text-4xl">{getMoodEmoji(todayEntry.mood as MoodType)}</div>
              </div>
            </CardHeader>
          </Card>}

          {!todayEntry && <Card variant="elevated" className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Mood
              </CardTitle>
              <CardDescription>
                Start a chat to automatically detect your mood
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="calm" onClick={() => navigate("/chat")} className="w-full">
                Start Chatting
              </Button>
            </CardContent>
          </Card>}

          {/* Mood Chart */}
          <Card variant="elevated" className="animate-fade-in" style={{
          animationDelay: "0.1s"
        }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Your Mood Graph 
              </CardTitle>
              <CardDescription>
                Track your emotional patterns over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MoodChart entries={entries} />
            </CardContent>
          </Card>

          {/* Recent Entries */}
          {entries.length > 0 && <Card variant="flat" className="animate-fade-in" style={{
          animationDelay: "0.2s"
        }}>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entries.slice(0, 7).map(entry => <div key={entry.id} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                      <span className="text-2xl">{getMoodEmoji(entry.mood as MoodType)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {getMoodLabel(entry.mood as MoodType)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(entry.created_at), "MMM d, h:mm a")}
                          </span>
                        </div>
                        {entry.notes && <p className="text-sm text-muted-foreground mt-1 truncate">
                            {entry.notes}
                          </p>}
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>}
        </div>
      </main>
    </div>;
}