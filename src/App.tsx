// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
// import { AssignmentProvider } from "./contexts/AssignmentContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Speaking from "./pages/Speaking";
import Pronunciation from "./pages/Pronunciation";
import Story from "./pages/Story";
import Conversation from "./pages/Conversation";
import Grammar from "./pages/Grammar";
import Vocabulary from "./pages/Vocabulary";
import Reflex from "./pages/Reflex";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import WordPuzzle from "./pages/WordPuzzle";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MirrorPractice from "./pages/MirrorPractice";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherRegister from "./pages/TeacherRegister";
// import TeacherDashboard from "./pages/TeacherDashboard";
// import StudentDashboard from "./pages/StudentDashboard";
import QuickQuiz from "./pages/QuickQuiz";
import { getData } from "./data/progressData";
import Roadmap from "./pages/roadmapTree";
import RoadmapGraph from "./pages/roadmapGraph";
import EnhancedTeacherDashboard from "./pages/EnhancedTeacherDashboard";
import StudentAssignmentDashboard from "./pages/StudentAssignmentDashboard";
import AlphabetPractice from "./pages/AlphabetPractise";
import StorySpeakingPractice from "./pages/StorySpeakingPractise";
const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const authToken = localStorage.getItem("authToken");
      const userSession = localStorage.getItem("userSession");

      const isLoggedIn = !!(authToken || userSession);
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn) {
        try {
          await getData();
        } catch (error) {
          console.error("Error fetching progress data", error);
        }
      }

      setDataFetched(true);
    };

    checkAuthAndFetch();
  }, []);

  if (isAuthenticated === null || !dataFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        {/* <AssignmentProvider> */}
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/teacher/login" element={<TeacherLogin />} />
              <Route path="/teacher/register" element={<TeacherRegister />} />
              <Route path='/roadmap' element={
                <ProtectedRoute>
                  <Roadmap />
                </ProtectedRoute>
              }/>
              <Route path="/alphabet-practice" element={
                  <ProtectedRoute>
                    <AlphabetPractice />
                  </ProtectedRoute>
                } />
                <Route path="/story-speaking-practice" element={
                  <ProtectedRoute>
                    <StorySpeakingPractice />
                  </ProtectedRoute>
                } />
               <Route path="/teacher/enhanced-dashboard" element={
                <ProtectedRoute>
                  <EnhancedTeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path='/roadmapGraph' element={
                <ProtectedRoute>
                  <RoadmapGraph />
                </ProtectedRoute>
              }/>
              <Route path="/student/dashboard" element={
                <ProtectedRoute>
                  <StudentAssignmentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/speaking" element={
                <ProtectedRoute>
                  <Speaking />
                </ProtectedRoute>
              } />
              <Route path="/pronunciation" element={
                <ProtectedRoute>
                  <Pronunciation />
                </ProtectedRoute>
              } />
              <Route path="/story" element={
                <ProtectedRoute>
                  <Story />
                </ProtectedRoute>
              } />
              <Route path="/conversation" element={
                <ProtectedRoute>
                  <Conversation />
                </ProtectedRoute>
              } />
              <Route path="/grammar" element={
                <ProtectedRoute>
                  <Grammar />
                </ProtectedRoute>
              } />
              <Route path="/vocabulary" element={
                <ProtectedRoute>
                  <Vocabulary />
                </ProtectedRoute>
              } />
              <Route path="/reflex" element={
                <ProtectedRoute>
                  <Reflex />
                </ProtectedRoute>
              } />
              <Route path="/progress" element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/word-puzzle" element={
                <ProtectedRoute>
                  <WordPuzzle />
                </ProtectedRoute>
              } />
              <Route path="/mirror-practice" element={
                <ProtectedRoute>
                  <MirrorPractice />
                </ProtectedRoute>
              } />
              <Route path="/quick-quiz" element={
                <ProtectedRoute>
                  <QuickQuiz />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        {/* </AssignmentProvider> */}
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
