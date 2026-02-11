import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, BarChart3, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Navbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/mood", label: "Mood", icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isHeroPage = location.pathname === "/";

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300",
      isHeroPage
        ? "glass-dark border-white/5"
        : "glass border-border/50"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-calm flex items-center justify-center shadow-lg">
              <span className="text-lg">🧠</span>
            </div>
            <span className={cn(
              "font-bold text-lg tracking-tight",
              isHeroPage ? "text-white" : "text-foreground"
            )}>Serene</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2 transition-all duration-200 font-medium",
                    isHeroPage && "text-white/70 hover:text-white hover:bg-white/10",
                    isActive(item.path) && (isHeroPage
                      ? "bg-white/10 text-white"
                      : "bg-primary/10 text-primary")
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className={cn(
                  "hidden sm:flex items-center gap-2 text-sm",
                  isHeroPage ? "text-white/50" : "text-muted-foreground"
                )}>
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className={cn(isHeroPage && "text-white/60 hover:text-white hover:bg-white/10")}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="calm" size="sm" className="font-semibold shadow-lg">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
