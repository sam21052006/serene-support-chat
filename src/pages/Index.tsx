import { Link } from "react-router-dom";
import { MessageCircle, BarChart3, Heart, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
const features = [{
  icon: MessageCircle,
  title: "Compassionate Chat",
  description: "Talk to Serene anytime. Get supportive, non-judgmental responses and coping strategies."
}, {
  icon: BarChart3,
  title: "Mood Tracking",
  description: "Track your emotional journey over time. Visualize patterns and gain insights into your wellbeing."
}, {
  icon: Shield,
  title: "Crisis Support",
  description: "Automatic detection of crisis situations with immediate access to professional resources."
}];
export default function Index() {
  const {
    user
  } = useAuth();
  return <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section — Dark cinematic */}
        <section className="relative overflow-hidden gradient-hero min-h-[90vh] flex items-center">
          {/* Decorative orbs */}
          <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary/15 blur-[100px] animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-secondary/10 blur-[120px] animate-float" style={{
          animationDelay: "2s"
        }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm text-primary-foreground/90 text-sm font-medium animate-fade-in animate-glow-pulse">
                <Sparkles className="h-4 w-4 text-secondary" />
                Your Mental Wellness Companion
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in" style={{
              color: 'hsl(0 0% 100%)'
            }}>
                Find Your{" "}
                <span className="text-gradient-gold italic">Inner Peace</span>
              </h1>
              
              <p className="text-lg md:text-xl max-w-2xl mx-auto animate-fade-in leading-relaxed" style={{
              color: 'hsl(220 20% 75%)'
            }}>
                A compassionate AI companion that listens, supports, and helps you navigate life's challenges. 
                Track your mood, get personalized advice, and build healthier mental habits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in pt-4">
                <Link to={user ? "/chat" : "/auth"}>
                  <Button variant="calm" size="xl" className="gap-3 w-full sm:w-auto text-base px-8 shadow-glow">
                    {user ? "Start Chatting" : "Begin Your Journey"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/mood">
                  <Button variant="glass" size="xl" className="gap-3 w-full sm:w-auto px-8 text-xl border-sidebar-foreground border-dotted border rounded-md shadow" style={{
                  color: 'hsl(220 20% 85%)'
                }}>
                    <BarChart3 className="h-5 w-5" />
                    Track Your Mood
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom fade into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Features Section */}
        <section className="py-24 relative gradient-soft">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <p className="text-sm font-semibold tracking-widest uppercase text-secondary">
                Features
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                How Serene Helps You
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Designed with your mental wellbeing in mind
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => <Card key={feature.title} variant="elevated" className="group hover:shadow-glow transition-all duration-500 animate-fade-in border-border/50 hover:-translate-y-1" style={{
              animationDelay: `${index * 0.15}s`
            }}>
                  <CardContent className="p-8 text-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl gradient-calm flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-glow">
                      <feature.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 gradient-soft">
          <div className="container mx-auto px-4">
            <Card variant="gradient" className="max-w-4xl mx-auto overflow-hidden shadow-elevated">
              <div className="gradient-calm p-10 md:p-16 relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(40 80% 55% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(260 60% 55% / 0.2) 0%, transparent 50%)'
              }} />
                
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-5">
                      <Heart className="h-6 w-6 text-primary-foreground" />
                      <span className="text-primary-foreground/80 font-medium tracking-wide uppercase text-sm">
                        You're not alone
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                      Start Your Wellness Journey Today
                    </h3>
                    <p className="text-primary-foreground/75 text-lg leading-relaxed">
                      Take the first step towards better mental health. Serene is here to support you every step of the way.
                    </p>
                  </div>
                  <Link to={user ? "/chat" : "/auth"}>
                    <Button variant="glass" size="xl" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30 text-base px-8">
                      {user ? "Open Chat" : "Sign Up Free"}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-border/50 gradient-soft">
          <div className="container mx-auto px-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Serene is a supportive companion, not a replacement for professional mental health care.</p>
            <p className="text-sm text-muted-foreground">If you're in crisis, please contact a mental health professional or call a crisis helpline.</p>
          </div>
        </footer>
      </main>
    </div>;
}