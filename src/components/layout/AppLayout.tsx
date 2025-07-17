
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

// Updated the star object interface to include className
interface Star {
  id: number;
  style: React.CSSProperties;
  className: string;
}

// Create starry background effect
const StarsBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    // Create random stars
    const generateStars = () => {
      const newStars = [];
      const starCount = 100; // Number of stars to generate
      
      for (let i = 0; i < starCount; i++) {
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Random size
        const size = Math.random() < 0.6 ? "small" : Math.random() < 0.9 ? "medium" : "large";
        
        // Random animation delay
        const animationDelay = `${Math.random() * 5}s`;
        
        // Randomly choose between twinkle and float animations
        const animationType = Math.random() < 0.7 ? "twinkle" : "float";
        
        // Occasional shooting star
        const isShootingStar = Math.random() < 0.05;
        
        let animationClass = animationType;
        if (isShootingStar) {
          animationClass = "shooting-star";
        }
        
        newStars.push({
          id: i,
          style: {
            left: `${left}%`,
            top: `${top}%`,
            animationDelay,
            opacity: Math.random() * 0.7 + 0.3,
          },
          className: `star ${size} ${animationClass}`
        });
      }
      
      return newStars;
    };
    
    setStars(generateStars());
  }, []);
  
  return (
    <div className="stars-container">
      {stars.map((star) => (
        <div 
          key={star.id} 
          className={star.className}
          style={star.style}
        />
      ))}
    </div>
  );
};

export function AppLayout({ children, showBackButton = false }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.classList.add('bg-gradient-animation');
    setMounted(true);
    return () => {
      body.classList.remove('bg-gradient-animation');
    };
  }, []);

  // Get user info from localStorage
  const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
  const userName = userSession.name || 'User';
  const userEmail = userSession.email || 'user@echo.ai';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-background to-muted/30 transition-all duration-500 ease-in-out">
        {mounted && <StarsBackground />}
        
        {/* Desktop Sidebar */}
        {!isMobile && <AppSidebar />}
        
        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-72 z-50">
              <AppSidebar />
            </div>
          </>
        )}
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <DashboardHeader 
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            userName={userName}
            userEmail={userEmail}
          />
          
          {/* Content */}
          <main className="flex-1 overflow-auto relative">
            <div className="animate-fade-in relative z-10 pb-20 md:pb-4">
              {children}
            </div>
            
            {/* Footer Brand (Desktop only) */}
            <div className="hidden md:block fixed bottom-5 right-5 opacity-70 text-xs text-muted-foreground">
              <span className="bg-background/50 px-2 py-1 rounded-md backdrop-blur-sm border border-border/30">
                Echo.ai English Tutor
              </span>
            </div>
          </main>
          
          {/* Mobile Bottom Navigation */}
          {isMobile && <MobileBottomNav />}
        </div>
      </div>
    </SidebarProvider>
  );
}
