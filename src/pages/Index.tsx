import { Link } from "react-router-dom";
import { MessageCircle, BarChart3, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: MessageCircle,
    title: "Compassionate Chat",
    description: "Talk to our AI anytime. Get supportive, non-judgmental responses and coping strategies.",
  },
  {
    icon: BarChart3,
    title: "Mood Tracking",
    description: "AI detects your mood from conversations and tracks it over time so you can see patterns.",
  },
  {
    icon: Shield,
    title: "Crisis Support",
    description: "Automatic detection of crisis situations with immediate access to professional resources.",
  },
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Your Mental Wellness Companion
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A compassionate AI that listens, supports, and helps you navigate
              life's challenges — with mood tracking built in.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={user ? "/chat" : "/auth"}>
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  {user ? "Start Chatting" : "Get Started"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/mood">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <BarChart3 className="h-4 w-4" />
                  Track Your Mood
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-foreground mb-10">
              How It Helps You
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardContent className="p-6 space-y-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Start Your Wellness Journey
                </h3>
                <p className="text-muted-foreground">
                  Take the first step towards better mental health. We're here to support you.
                </p>
                <Link to={user ? "/chat" : "/auth"}>
                  <Button size="lg" className="gap-2">
                    {user ? "Open Chat" : "Sign Up Free"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t">
          <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground space-y-1">
            <p>This is a supportive companion, not a replacement for professional mental health care.</p>
            <p>If you're in crisis, please contact a mental health professional or call a crisis helpline.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
