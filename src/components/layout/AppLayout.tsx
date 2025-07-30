import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

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

  useEffect(() => {
    document.body.classList.add('bg-gradient-animation');
    setMounted(true);
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
            {/* Dark transparent backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Slide-out sidebar */}
            <div className="fixed left-0 top-0 bottom-0 w-72 bg-background shadow-lg overflow-y-auto">
              <AppSidebar />
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
