import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, BarChart3, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
export function Navbar() {
  const location = useLocation();
  const {
    user,
    signOut
  } = useAuth();
  const navItems = [{
    path: "/",
    label: "Home",
    icon: Home
  }, {
    path: "/chat",
    label: "Chat",
    icon: MessageCircle
  }, {
    path: "/mood",
    label: "Mood",
    icon: BarChart3
  }];
  const isActive = (path: string) => location.pathname === path;
  return <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl gradient-calm flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
              <span className="text-lg">​🧠</span>
            </div>
            <span className="font-serif font-bold text-lg text-foreground tracking-tight">Serene</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map(item => <Link key={item.path} to={item.path}>
                <Button variant="ghost" size="sm" className={cn("gap-2 transition-all duration-300 rounded-xl", isActive(item.path) && "bg-primary/10 text-primary font-semibold")}>
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>)}
          </div>

          <div className="flex items-center gap-2">
            {user ? <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-7 h-7 rounded-full gradient-calm flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <span className="max-w-[120px] truncate font-medium">{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={signOut} className="rounded-xl">
                  <LogOut className="h-4 w-4" />
                </Button>
              </> : <Link to="/auth">
                <Button variant="calm" size="sm" className="rounded-xl shadow-glow">
                  Sign In
                </Button>
              </Link>}
          </div>
        </div>
      </div>
    </nav>;
}