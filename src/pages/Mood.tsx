import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { MoodSelector, getMoodEmoji, getMoodLabel } from "@/components/mood/MoodSelector";
import { MoodChart } from "@/components/mood/MoodChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type MoodType = "very_sad" | "sad" | "neutral" | "happy" | "very_happy";

interface MoodEntry {
  id: string;
  mood: MoodType;
  notes: string | null;
  created_at: string;
}

const POSITIVE_PHRASES: Record<string, string[]> = {
  very_happy: [
    "You're radiating joy! Keep spreading that positivity! ✨",
    "What an amazing mood — you're on top of the world! 🌟",
    "Your happiness is contagious! Keep shining! 🌈",
    "Life is beautiful and so are you! 💛",
    "You're thriving — celebrate this moment! 🎉",
    "Pure sunshine energy! Keep this vibe going! ☀️",
  ],
  happy: [
    "Great to see you're feeling good! Keep it up! 😊",
    "Your positive energy is wonderful! 🌻",
    "Happiness looks good on you! 💚",
    "You're doing great — be proud of yourself! 🙌",
    "What a lovely mood — savor this feeling! 🌸",
    "Keep smiling — the world needs your light! 💫",
  ],
};

function getRandomPhrase(mood: string): string | null {
  const phrases = POSITIVE_PHRASES[mood];
  if (!phrases) return null;
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export default function Mood() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodType | undefined>();
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      setEntries((data as MoodEntry[]) || []);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMood = async () => {
    if (!user || !selectedMood) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from("mood_entries").insert({
        user_id: user.id, mood: selectedMood, notes: notes || null,
      });
      if (error) throw error;
      toast({ title: "Mood logged!", description: "Keep tracking to see patterns." });
      setSelectedMood(undefined);
      setNotes("");
      setShowForm(false);
      fetchEntries();
    } catch (error) {
      console.error("Error saving mood:", error);
      toast({ title: "Couldn't save mood", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const todayEntry = entries.find(
    (e) => format(new Date(e.created_at), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4 max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold">Mood Tracker</h1>
            <p className="text-sm text-muted-foreground">Track your emotions over time</p>
          </div>

          {/* Log Mood */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                    Today's Check-in
                  </CardTitle>
                  <CardDescription>
                    {todayEntry
                      ? `You logged feeling ${getMoodLabel(todayEntry.mood as MoodType).toLowerCase()} today`
                      : "How are you feeling today?"}
                  </CardDescription>
                </div>
                {todayEntry && !showForm && (
                  <div className="text-3xl">{getMoodEmoji(todayEntry.mood as MoodType)}</div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {showForm || !todayEntry ? (
                <div className="space-y-4">
                  <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />
                  {selectedMood && (
                    <div className="space-y-3 animate-fade-in">
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="What's contributing to this feeling? (optional)"
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button onClick={saveMood} disabled={isSaving} className="flex-1">
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                          Save Mood
                        </Button>
                        {showForm && (
                          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowForm(true)} className="w-full">
                  Log Another Mood
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-4 w-4 text-primary" />
                Mood Graph
              </CardTitle>
              <CardDescription>Your emotional patterns over 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <MoodChart entries={entries} />
            </CardContent>
          </Card>

          {/* Recent Entries */}
          {entries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {entries.slice(0, 7).map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 p-2 rounded-md bg-secondary/50">
                      <span className="text-xl">{getMoodEmoji(entry.mood as MoodType)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{getMoodLabel(entry.mood as MoodType)}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(entry.created_at), "MMM d, h:mm a")}
                          </span>
                        </div>
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
