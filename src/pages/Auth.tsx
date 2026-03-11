import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Mail, Lock, User, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const emailSchema = z.string().trim().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const displayNameSchema = z.string().trim().max(100, "Display name must be under 100 characters").optional();

type AuthMode = "login" | "signup" | "forgot";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; displayName?: string }>({});

  const { signIn, signUp, resetPassword, user, isReady } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && user) navigate("/");
  }, [user, isReady, navigate]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    if (mode !== "forgot") {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    }
    if (mode === "signup" && displayName) {
      const nameResult = displayNameSchema.safeParse(displayName);
      if (!nameResult.success) newErrors.displayName = nameResult.error.errors[0].message;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (mode === "forgot") {
        const { error } = await resetPassword(email.trim());
        if (error) {
          toast({ title: "Reset failed", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Check your email", description: "We've sent you a password reset link." });
          setMode("login");
        }
      } else if (mode === "login") {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message === "Invalid login credentials"
              ? "Invalid email or password."
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "Welcome back!" });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email.trim(), password, displayName.trim());
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message.includes("already registered")
              ? "This email is already registered."
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "Account created!", description: "Welcome to PsyBot." });
          navigate("/");
        }
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<AuthMode, { title: string; desc: string }> = {
    login: { title: "Welcome Back", desc: "Sign in to continue" },
    signup: { title: "Create Account", desc: "Start your wellness journey" },
    forgot: { title: "Reset Password", desc: "We'll send you a reset link" },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="p-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-3">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg mx-auto" />
            <div>
              <CardTitle>{titles[mode].title}</CardTitle>
              <CardDescription className="mt-1">{titles[mode].desc}</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => { setDisplayName(e.target.value); setErrors((p) => ({ ...p, displayName: undefined })); }}
                      placeholder="Your name"
                      className="pl-10"
                      maxLength={100}
                    />
                  </div>
                  {errors.displayName && <p className="text-xs text-destructive">{errors.displayName}</p>}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                    placeholder="you@example.com"
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>
              )}

              {mode === "login" && (
                <button type="button" onClick={() => { setMode("forgot"); setErrors({}); }} className="text-sm text-muted-foreground hover:text-primary">
                  Forgot password?
                </button>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              {mode === "forgot" ? (
                <button type="button" onClick={() => { setMode("login"); setErrors({}); }} className="text-sm text-muted-foreground hover:text-primary">
                  Back to sign in
                </button>
              ) : (
                <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErrors({}); }} className="text-sm text-muted-foreground hover:text-primary">
                  {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
