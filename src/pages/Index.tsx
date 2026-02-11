import { Link } from "react-router-dom";
import { MessageCircle, BarChart3, Heart, Shield, Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: MessageCircle,
    title: "Compassionate Chat",
    description: "Talk to Serene anytime. Get supportive, non-judgmental responses and evidence-based coping strategies.",
    accent: "from-primary to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Smart Mood Tracking",
    description: "AI-powered mood detection from your conversations. Visualize patterns and gain insights automatically.",
    accent: "from-accent to-orange-400",
  },
  {
    icon: Shield,
    title: "Crisis Support",
    description: "Automatic detection of crisis situations with immediate access to professional resources and helplines.",
    accent: "from-success to-emerald-400",
  },
];

const stats = [
  { value: "24/7", label: "Always Available" },
  { value: "100%", label: "Private & Secure" },
  { value: "AI", label: "Powered Insights" },
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section — Dark immersive */}
        <section className="relative overflow-hidden gradient-hero">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          {/* Glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/8 blur-[100px]" />
          
          <div className="container mx-auto px-4 py-24 md:py-36 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-sm font-medium animate-fade-in">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-white/80">AI-Powered Mental Wellness</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight animate-fade-in">
                Your Mind Deserves{" "}
                <span className="text-gradient">Serene</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed animate-fade-in">
                A compassionate AI companion that listens, supports, and helps you navigate 
                life's challenges — with intelligent mood tracking built right in.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <Link to={user ? "/chat" : "/auth"}>
                  <Button variant="calm" size="xl" className="gap-2 w-full sm:w-auto text-base font-semibold shadow-glow animate-glow-pulse">
                    {user ? "Start Chatting" : "Get Started Free"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/mood">
                  <Button variant="glass" size="xl" className="gap-2 w-full sm:w-auto text-base font-semibold bg-white/5 text-white border-white/10 hover:bg-white/10">
                    <BarChart3 className="h-5 w-5" />
                    Track Your Mood
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-12 pt-8 animate-fade-in">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</div>
                    <div className="text-xs md:text-sm text-white/40 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative gradient-soft">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Zap className="h-3 w-3" />
                Features
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
                How Serene Helps You
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Designed with your mental wellbeing in mind
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  variant="elevated"
                  className="group hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-in border-border/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 space-y-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden gradient-hero relative">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/15 blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent/10 blur-[60px]" />
              
              <div className="relative p-10 md:p-16">
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <Heart className="h-5 w-5 text-accent" />
                      <span className="text-white/60 font-medium text-sm uppercase tracking-wider">
                        You're not alone
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                      Start Your Wellness Journey
                    </h3>
                    <p className="text-white/50 text-lg">
                      Take the first step towards better mental health. Serene is here to support you every step of the way.
                    </p>
                  </div>
                  <Link to={user ? "/chat" : "/auth"}>
                    <Button
                      variant="calm"
                      size="xl"
                      className="text-base font-semibold shadow-glow whitespace-nowrap"
                    >
                      {user ? "Open Chat" : "Sign Up Free"}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-border/50">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Serene is a supportive companion, not a replacement for professional mental health care.</p>
            <p>If you're in crisis, please contact a mental health professional or call a crisis helpline.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
