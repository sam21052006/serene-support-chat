import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Sparkles, Lock, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const { updatePassword, isReady, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for recovery session
  const [hasRecovery, setHasRecovery] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setHasRecovery(true);
    }
  }, []);

  useEffect(() => {
    if (isReady && session) {
      setHasRecovery(true);
    }
  }, [isReady, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      newErrors.password = result.error.errors[0].message;
    }
    if (password !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        setSuccess(true);
        toast({ title: "Password updated!", description: "You can now sign in with your new password." });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasRecovery) {
    return (
      <div className="min-h-screen gradient-soft flex flex-col items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">Invalid or expired reset link.</p>
            <Link to="/auth">
              <Button variant="calm">Go to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-primary mx-auto" />
            <p className="text-foreground font-medium">Password updated successfully!</p>
            <p className="text-sm text-muted-foreground">Redirecting you now...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-soft flex flex-col">
      <div className="p-4">
        <Link to="/auth">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-md animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl gradient-calm flex items-center justify-center mx-auto shadow-glow">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">Set New Password</CardTitle>
              <CardDescription className="mt-2">Enter your new password below</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New Password</label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirm: undefined })); }}
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
                {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
              </div>

              <Button type="submit" variant="calm" size="lg" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
