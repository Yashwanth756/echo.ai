import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";


// If you didn’t export it from another file, define it locally:
import {
  LayoutDashboard,
  Mic,
  MessageSquare,
  Award, 
  Play,
  Headphones,
  Book,
  Trophy,
  BarChart,
  Settings,
} from "lucide-react";

let navItems = [
  { title: "Dashboard", route: "/", icon: LayoutDashboard },
  { title: "Speaking Practice", route: "/speaking", icon: Mic },
  { title: "Conversation AI", route: "/conversation", icon: MessageSquare },
  { title: "Word Puzzles", route: "/word-puzzle", icon: Play },
  { title: "Pronunciation Mirror", route: "/pronunciation", icon: Headphones },
  { title: "Story Builder", route: "/story", icon: Book },
  { title: "Vocabulary Trainer", route: "/vocabulary", icon: Book },
  { title: "Grammar Clinic", route: "/grammar", icon: Book },
  { title: "Quick Quiz", route: "/quick-quiz", icon: Trophy },
  { title: "Alphabet Practice", route: "/alphabet-practice", icon: Award },
  { title: "Story Speaking Practice", route: "/story-speaking-practice", icon: Book },
  // Nursery & Kindergarten Dashboard before Progress Report
  { title: "Nursery & Kindergarten", route: "/nursery-kindergarten-dashboard", icon: Award },
  { title: "Progress Report", route: "/progress", icon: BarChart },
  { title: "Settings", route: "/settings", icon: Settings },
];

interface AppLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

interface Star {
  id: number;
  style: React.CSSProperties;
  className: string;
}

const StarsBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      const starCount = 100;

      for (let i = 0; i < starCount; i++) {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() < 0.6 ? "small" : Math.random() < 0.9 ? "medium" : "large";
        const animationDelay = `${Math.random() * 5}s`;
        const animationType = Math.random() < 0.7 ? "twinkle" : "float";
        const isShootingStar = Math.random() < 0.05;
        let animationClass = isShootingStar ? "shooting-star" : animationType;

        newStars.push({
          id: i,
          style: {
            left: `${left}%`,
            top: `${top}%`,
            animationDelay,
            opacity: Math.random() * 0.7 + 0.3,
          },
          className: `star ${size} ${animationClass}`,
        });
      }

      return newStars;
    };

    setStars(generateStars());
  }, []);

  return (
    <div className="stars-container absolute inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <div key={star.id} className={star.className} style={star.style} />
      ))}
    </div>
  );
};

export function AppLayout({ children, showBackButton = false }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const currentPath = window.location.pathname;
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add('bg-gradient-animation');
    setMounted(true);
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');

    if(userSession.role === 'teacher'){
      if(navItems[0].title != 'Student Progress')
      navItems = [{ title: "Student Progress", route: "/teacher/enhanced-dashboard", icon: BarChart },...navItems]
    }
    return () => {
      document.body.classList.remove('bg-gradient-animation');
    };
  }, []);

  const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
  const userName = userSession.name || 'User';
  const userEmail = userSession.email || 'user@echo.ai';
  

  return (
    <SidebarProvider>
      <div className="relative flex flex-col sm:flex-row min-h-screen w-full overflow-hidden bg-gradient-to-br from-background to-muted/30 transition-all duration-500 ease-in-out">
        {mounted && <StarsBackground />}

        {/* Desktop Sidebar */}
        {!isMobile && <AppSidebar />}

        {/* Mobile Sidebar Overlay & Menu */}
       {isMobile && isSidebarOpen && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      onClick={() => setIsSidebarOpen(false)}
    />

    {/* Sidebar */}
    <div className="fixed left-0 top-0 bottom-0 w-72 bg-background shadow-lg overflow-y-auto z-50">
      <div className="p-4 space-y-4">
        <div className="font-playfair text-xl text-primary flex items-center gap-2">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
            Echo.ai
          </span>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => (
            <div key={item.title}>
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  navigate(item.route) // or use navigate() if using react-router
                }}
                
                onMouseEnter={() => setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full text-left flex items-center gap-3 text-base py-2 px-3 rounded-lg transition-all duration-300
                  ${hoveredItem === item.title ? 'scale-105' : ''}
                  ${currentPath === item.route ? 'bg-primary text-white shadow-lg animate-pulse' : 'hover:bg-primary/10'}
                `}
              >
               
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)}



        {/* Main Content */}
        <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
          {/* Header with Menu Button */}
          <DashboardHeader
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            userName={userName}
            userEmail={userEmail}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-auto px-3 sm:px-6 py-4 relative">
            <div className="animate-fade-in relative z-10 pb-24 md:pb-6">
              {children}
            </div>

            {/* Desktop Brand Footer */}
            <div className="hidden md:block fixed bottom-5 right-5 opacity-70 text-xs text-muted-foreground">
              <span className="bg-background/50 px-2 py-1 rounded-md backdrop-blur-sm border border-border/30">
                Echo.ai English Tutor
              </span>
            </div>
          </main>

          {/* Bottom Navigation (Mobile only) */}
          {isMobile && <MobileBottomNav />}
        </div>
      </div>
    </SidebarProvider>
  );
}
