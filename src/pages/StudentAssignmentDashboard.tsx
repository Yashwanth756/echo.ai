import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  BookOpen, 
  PenTool, 
  MessageSquare, 
  Zap, 
  Trophy,
  CheckCircle,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const backend_url = import.meta.env.VITE_backend_url;

const moduleConfig = {
  speaking: {
    name: "Speaking Practice",
    icon: Mic,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    route: "/speaking"
  },
  vocabulary: {
    name: "Vocabulary",
    icon: BookOpen,
    color: "text-green-600", 
    bgColor: "bg-green-50",
    route: "/vocabulary"
  },
  grammar: {
    name: "Grammar",
    icon: PenTool,
    color: "text-purple-600",
    bgColor: "bg-purple-50", 
    route: "/grammar"
  },
  pronunciation: {
    name: "Pronunciation",
    icon: MessageSquare,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    route: "/pronunciation"
  },
  reflex: {
    name: "Reflex Challenge", 
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    route: "/reflex"
  },
  story: {
    name: "Story Reading",
    icon: BookOpen,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    route: "/story"
  }
};

const StudentAssignmentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getProgressPercentage = (completed: number, target: number) => {
    return Math.min((completed / target) * 100, 100);
  };

  const getStatusBadge = (completed: number, target: number) => {
    if (completed >= target) {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    }
    return <Badge variant="outline">Pending</Badge>;
  };

  const handleStartSession = (moduleType: string) => {
    const config = moduleConfig[moduleType as keyof typeof moduleConfig];
    if (config) {
      navigate(config.route);
    }
  };

  useEffect(() => {
    async function getModuleData() {
      try {
        const usersession = JSON.parse(localStorage.getItem("userSession") || "{}");
        const response = await fetch(
          `${backend_url}/getModuleData?email=${usersession.email}`
        );
        const result = await response.json();
        if (result.status === "sucess" && result.data) {
          setSessionData(result.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getModuleData();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg font-medium text-muted-foreground">Loading your progress...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !sessionData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Card className="p-6">
            <CardContent>
              <p className="text-red-600 font-semibold">Something went wrong. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Totals
  const totalCompleted = Object.values(sessionData).reduce(
    (sum: number, module: any) => sum + module.sessionsCompleted,
    0
  );
  const totalTarget = Object.values(sessionData).reduce(
    (sum: number, module: any) => sum + module.targetSessions,
    0
  );
  // const totalTime = Object.values(sessionData).reduce(
  //   (sum: number, module: any) => sum + module.totalTime,
  //   0
  // );
  const averageScore = Object.values(sessionData).reduce(
      (sum: number, module: any) => sum + module.score,
      0
    ) / Object.keys(sessionData).length;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Session Progress
          </h1>
          <p className="text-muted-foreground">
            Track your learning sessions and assignments
          </p>
        </div>

        {/* Weekly Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Sessions Completed</p>
                  <p className="text-2xl font-bold">{totalCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Target Sessions</p>
                  <p className="text-2xl font-bold">{totalTarget}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Spent</p>
                  <p className="text-2xl font-bold">{Math.floor(totalTime / 60)}h {totalTime % 60}m</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{Math.round(averageScore)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sessions Completed</span>
                <span>{totalCompleted} / {totalTarget}</span>
              </div>
              <Progress 
                value={(totalCompleted / totalTarget) * 100} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Session Targets by Module */}
        <Card>
          <CardHeader>
            <CardTitle>Session Targets by Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(sessionData).map(([moduleType, data]: any) => {
                const config = moduleConfig[moduleType as keyof typeof moduleConfig];
                const Icon = config.icon;
                const progressPercentage = getProgressPercentage(data.sessionsCompleted, data.targetSessions);
                
                return (
                  <Card key={moduleType} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${config.bgColor}`}>
                            <Icon className={`h-4 w-4 ${config.color}`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{config.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {data.sessionsCompleted} / {data.targetSessions} sessions
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(data.sessionsCompleted, data.targetSessions)}
                      </div>
                      
                      <div className="space-y-2">
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {Math.round(progressPercentage)}% complete
                          </span>
                          {data.sessionsCompleted < data.targetSessions && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStartSession(moduleType)}
                              className="text-xs h-7"
                            >
                              Start Session
                            </Button>
                          )}
                          {data.sessionsCompleted >= data.targetSessions && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default StudentAssignmentDashboard;
