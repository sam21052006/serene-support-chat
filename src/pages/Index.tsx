import { Link } from "react-router-dom";
import { MessageCircle, BarChart3, Heart, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: MessageCircle,
    title: "Compassionate Chat",
    description: "Talk to MindfulAI anytime. Get supportive, non-judgmental responses and coping strategies.",
  },
  {
    icon: BarChart3,
    title: "Mood Tracking",
    description: "Track your emotional journey over time. Visualize patterns and gain insights into your wellbeing.",
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
    <div className="min-h-screen gradient-soft">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-calm opacity-10" />
          <div className="container mx-auto px-4 py-20 md:py-32 relative">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium animate-fade-in">
                <Sparkles className="h-4 w-4" />
                Your Mental Wellness Companion
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight animate-fade-in">
                Find Peace with{" "}
                <span className="text-gradient">MindfulAI</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
                A compassionate AI companion that listens, supports, and helps you navigate life's challenges. 
                Track your mood, get personalized advice, and build healthier mental habits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <Link to={user ? "/chat" : "/auth"}>
                  <Button variant="calm" size="xl" className="gap-2 w-full sm:w-auto">
                    {user ? "Start Chatting" : "Get Started"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/mood">
                  <Button variant="glass" size="xl" className="gap-2 w-full sm:w-auto">
                    <BarChart3 className="h-5 w-5" />
                    Track Your Mood
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl animate-float" />
          <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How MindfulAI Helps You
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Designed with your mental wellbeing in mind
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  variant="elevated"
                  className="group hover:shadow-glow transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl gradient-calm flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card variant="gradient" className="max-w-4xl mx-auto overflow-hidden">
              <div className="gradient-calm p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <Heart className="h-6 w-6 text-primary-foreground" />
                      <span className="text-primary-foreground/80 font-medium">
                        You're not alone
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                      Start Your Wellness Journey Today
                    </h3>
                    <p className="text-primary-foreground/80">
                      Take the first step towards better mental health. MindfulAI is here to support you every step of the way.
                    </p>
                  </div>
                  <Link to={user ? "/chat" : "/auth"}>
                    <Button
                      variant="glass"
                      size="xl"
                      className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30"
                    >
                      {user ? "Open Chat" : "Sign Up Free"}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>MindfulAI is a supportive companion, not a replacement for professional mental health care.</p>
            <p className="mt-2">If you're in crisis, please contact a mental health professional or call a crisis helpline.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
