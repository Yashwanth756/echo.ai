import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie, 
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock,
  Target,
  Award,
  Users
} from "lucide-react";

interface StudentData {
  id: string;
  fullName: string;
  class: string;
  section: string;
  modules: {
    [key: string]: {
      score: number;
      sessionsCompleted: number;
      targetSessions: number;
      totalTime: number;
    };
  };
  overall: number;
}

interface StudentModuleTrackerProps {
  students: StudentData[];
  selectedModule: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

export const StudentModuleTracker: React.FC<StudentModuleTrackerProps> = ({
  students,
  selectedModule
}) => {
  // Prepare chart data for module comparison
  const moduleComparisonData = ['speaking', 'vocabulary', 'grammar', 'pronunciation', 'reflex', 'story'].map(module => {
    const moduleScores = students.map(s => s.modules[module]?.score || 0);
    const avgScore = moduleScores.reduce((sum, score) => sum + score, 0) / moduleScores.length;
    const completed = students.reduce((sum, s) => sum + (s.modules[module]?.sessionsCompleted || 0), 0);
    const target = students.reduce((sum, s) => sum + (s.modules[module]?.targetSessions || 0), 0);
    
    return {
      module: module.charAt(0).toUpperCase() + module.slice(1),
      avgScore: Math.round(avgScore),
      completion: target > 0 ? Math.round((completed / target) * 100) : 0,
      totalSessions: completed
    };
  });

  // Prepare pie chart data for session distribution
  const sessionDistributionData = moduleComparisonData.map((data, index) => ({
    name: data.module,
    value: data.totalSessions,
    color: COLORS[index % COLORS.length]
  }));

  // Get top and bottom performers
  const getModulePerformers = (module: string) => {
    const studentsWithModule = students.filter(s => s.modules[module]);
    const sorted = studentsWithModule.sort((a, b) => b.modules[module].score - a.modules[module].score);
    return {
      top: sorted.slice(0, 3),
      bottom: sorted.slice(-3).reverse()
    };
  };

  const getTrendIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Calculate module-specific stats
  const calculateModuleStats = () => {
    if (selectedModule === 'all') {
      return {
        avgScore: Math.round(students.reduce((sum, s) => sum + s.overall, 0) / students.length || 0),
        totalSessions: students.reduce((sum, s) => sum + Object.values(s.modules).reduce((moduleSum, m) => moduleSum + m.sessionsCompleted, 0), 0),
        totalTime: students.reduce((sum, s) => sum + Object.values(s.modules).reduce((moduleSum, m) => moduleSum + m.totalTime, 0), 0),
        avgCompletion: Math.round(moduleComparisonData.reduce((sum, m) => sum + m.completion, 0) / moduleComparisonData.length)
      };
    } else {
      const moduleData = students.map(s => s.modules[selectedModule]).filter(Boolean);
      return {
        avgScore: Math.round(moduleData.reduce((sum, m) => sum + m.score, 0) / moduleData.length || 0),
        totalSessions: moduleData.reduce((sum, m) => sum + m.sessionsCompleted, 0),
        totalTime: moduleData.reduce((sum, m) => sum + m.totalTime, 0),
        avgCompletion: Math.round(moduleData.reduce((sum, m) => sum + ((m.sessionsCompleted / m.targetSessions) * 100), 0) / moduleData.length || 0)
      };
    }
  };

  const moduleStats = calculateModuleStats();

  return (
    <div className="space-y-6">
      {/* Module Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Award className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{moduleStats.avgScore}%</p>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Target className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{moduleStats.totalSessions}</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{moduleStats.totalTime}m</p>
              <p className="text-sm text-muted-foreground">Total Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{moduleStats.avgCompletion}%</p>
              <p className="text-sm text-muted-foreground">Avg Completion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Performance Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Module Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moduleComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="module" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#8884d8" name="Average Score %" />
                <Bar dataKey="completion" fill="#82ca9d" name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Session Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Session Distribution by Module</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sessionDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sessionDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top and Bottom Performers */}
      {selectedModule !== 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(() => {
            const performers = getModulePerformers(selectedModule);
            return (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <Award className="h-5 w-5" />
                      Top Performers - {selectedModule.charAt(0).toUpperCase() + selectedModule.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {performers.top.map((student, index) => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              #{index + 1}
                            </Badge>
                            <div>
                              <p className="font-medium">{student.fullName}</p>
                              <p className="text-sm text-muted-foreground">
                                {student.class} - {student.section}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-600">
                              {student.modules[selectedModule].score / (student.modules[selectedModule].sessionsCompleted===0?1:student.modules[selectedModule].sessionsCompleted)}%
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {student.modules[selectedModule].sessionsCompleted} sessions
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <TrendingDown className="h-5 w-5" />
                      Needs Attention - {selectedModule.charAt(0).toUpperCase() + selectedModule.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {performers.bottom.map((student, index) => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              #{performers.bottom.length - index}
                            </Badge>
                            <div>
                              <p className="font-medium">{student.fullName}</p>
                              <p className="text-sm text-muted-foreground">
                                {student.class} - {student.section}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              {student.modules[selectedModule].score}%
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {student.modules[selectedModule].sessionsCompleted} sessions
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            );
          })()}
        </div>
      )}

      {/* Detailed Student Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Detailed Performance Analysis - {selectedModule === 'all' ? 'All Modules' : selectedModule.charAt(0).toUpperCase() + selectedModule.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Sessions Progress</TableHead>
                  <TableHead>Time Spent</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  let score, sessions, target, time;
                  // console.log(student)
                  if (selectedModule === 'all') {
                    score = student.overall;
                    sessions = Object.values(student.modules).reduce((sum, m) => sum + m.sessionsCompleted, 0);
                    target = Object.values(student.modules).reduce((sum, m) => sum + m.targetSessions, 0);
                    time = Object.values(student.modules).reduce((sum, m) => sum + m.totalTime, 0);
                  } else {
                    const moduleData = student.modules[selectedModule];
                    if (!moduleData) return null;
                    score = moduleData.score / (moduleData.targetSessions ===0?1:moduleData.targetSessions);
                    sessions = moduleData.sessionsCompleted;
                    target = moduleData.targetSessions;
                    time = moduleData.totalTime;
                  }
                  
                  const progress = target > 0 ? (sessions / target) * 100 : 0;
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.class} - {student.section}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getScoreColor(score)}>
                          {score}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{sessions}/{target}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{time}m</span>
                        </div>
                      </TableCell>
                      <TableCell>{getTrendIcon(score)}</TableCell>
                      <TableCell>
                        <Badge variant={progress >= 100 ? "default" : progress >= 75 ? "secondary" : "destructive"}>
                          {progress >= 100 ? "Complete" : progress >= 75 ? "On Track" : "Behind"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};