
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Mic, 
  MessageSquare, 
  Play,
  BarChart 
} from "lucide-react";

const navItems = [
  { title: "Dashboard", route: "/", icon: LayoutDashboard },
  { title: "Speaking", route: "/speaking", icon: Mic },
  { title: "Chat", route: "/conversation", icon: MessageSquare },
  { title: "Puzzles", route: "/word-puzzle", icon: Play },
  { title: "Progress", route: "/progress", icon: BarChart },
];

export function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/40 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.route;
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
