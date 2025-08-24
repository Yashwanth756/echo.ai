import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  BookOpen, 
  Mic, 
  Volume2, 
  GraduationCap, 
  Zap, 
  FileText,
  Target,
  TrendingUp,
  Clock,
  Eye,
  Filter
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { StudentModuleTracker } from "@/components/teacher/StudentModuleTracker";
import { SessionTargetManager } from "@/components/teacher/SessionTargetManager";
const backend_url = import.meta.env.VITE_backend_url

// Session target templates
let SESSION_TARGETS = [
  { module: "speaking", icon: Mic, target: 10, description: "Complete speaking practice sessions" },
  { module: "vocabulary", icon: BookOpen, target: 15, description: "Finish vocabulary building exercises" },
  { module: "grammar", icon: GraduationCap, target: 8, description: "Master grammar concepts" },
  { module: "pronunciation", icon: Volume2, target: 6, description: "Practice pronunciation drills" },
  { module: "reflex", icon: Zap, target: 10, description: "Complete reflex challenges" },
  { module: "story", icon: FileText, target: 7, description: "Read and analyze stories" }
];

const EnhancedTeacherDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedClass, setSelectedClass] = useState(user?.classes[0] || "");
  const [selectedSection, setSelectedSection] = useState(user?.sections[0] || "");
  const [selectedModule, setSelectedModule] = useState("all");

  // Fetch students from backend
  function calculateOverall(modules) {
  
  let totalScore = 0;
  let totalTargets = 0;
    const module = modules.modules
    totalScore = module.grammar.score + module.pronunciation.score + module.reflex.score + module.speaking.score + module.vocabulary.score
    totalTargets = module.grammar.targetSessions + module.pronunciation.targetSessions + module.reflex.targetSessions + module.speaking.targetSessions + module.vocabulary.targetSessions
  if (totalTargets === 0) return 0;


  return (totalScore / totalTargets).toFixed(2);
}
const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const usersession = JSON.parse(localStorage.getItem('userSession'))
        const classes = usersession.classes
        const sections = usersession.sections
        // console.log(classes, sections)
        // get teacher module data
        const moduleResponse = await fetch(backend_url+`/getModuleData?email=${usersession.email}`)
        const ModuleData = await moduleResponse.json()
        SESSION_TARGETS= SESSION_TARGETS.map((doc)=>(
          {...doc, target:ModuleData.data[doc.module+'Target']}
        ))
        
        const classQuery = selectedClass === "all-classes" ? classes : [selectedClass]
        const sectionQuery = selectedSection === "all-sections" ? sections : [selectedSection];
       
        const response = await fetch(backend_url+"students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classes: classQuery,
            sections: sectionQuery
          })
        });

        if (!response.ok) throw new Error("Failed to fetch student data");

        const data = await response.json();
        console.log('session and data updataed')
        setStudents(data);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Could not load student data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    

    fetchStudents();
  }, [selectedClass, selectedSection]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };
  
function calculateTotalAverage(students) {
  let totalScore = 0;
  let totalTargets = 0;

  students.forEach(student => {
    const modules = student.modules;
    for (const key in modules) {
      const mod = modules[key];
      totalScore += mod.score || 0;
      totalTargets += mod.targetSessions || 0;
    }
  });

  if (totalTargets === 0) return "0"; // string

  return (totalScore / totalTargets).toFixed(2); // string with 2 decimals
}

  // Calculate class stats
  const classStats = {
    totalStudents: students.length,
    averageOverall: calculateTotalAverage(students),
    totalSessions: students.reduce(
      (sum, s) => sum + Object.values(s.modules).reduce((moduleSum: any, m: any) => moduleSum + m.sessionsCompleted, 0),
      0
    ),
    averageTime: Math.round(students.reduce((sum, s) => sum + s.totalTimeSpent, 0) / (students.length || 1))
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 text-center text-muted-foreground">Loading student data...</div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-6 text-center text-red-600">Error: {error}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Enhanced Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track student progress across all learning modules with detailed session analytics.
          </p>
        </div>

        {/* Class Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{classStats.totalStudents}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{classStats.averageOverall}%</p>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Target className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{classStats.totalSessions}</p>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{classStats.averageTime}m</p>
                <p className="text-sm text-muted-foreground">Avg Study Time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="student-progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student-progress">Student Progress</TabsTrigger>
            <TabsTrigger value="session-targets">Session Targets</TabsTrigger>
            <TabsTrigger value="module-analytics">Module Analytics</TabsTrigger>
          </TabsList>

          {/* Student Progress Tab */}
          <TabsContent value="student-progress" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-classes">All Classes</SelectItem>
                        {user?.classes.map((className) => (
                          <SelectItem key={className} value={className}>
                            {className}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-sections">All Sections</SelectItem>
                        {user?.sections.map((section) => (
                          <SelectItem key={section} value={section}>
                            Section {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={selectedModule} onValueChange={setSelectedModule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Module" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modules</SelectItem>
                        <SelectItem value="speaking">Speaking</SelectItem>
                        <SelectItem value="vocabulary">Vocabulary</SelectItem>
                        <SelectItem value="grammar">Grammar</SelectItem>
                        <SelectItem value="pronunciation">Pronunciation</SelectItem>
                        <SelectItem value="reflex">Reflex</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Student Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Speaking</TableHead>
                        <TableHead>Vocabulary</TableHead>
                        <TableHead>Grammar</TableHead>
                        <TableHead>Pronunciation</TableHead>
                        <TableHead>Reflex</TableHead>
                        <TableHead>Story</TableHead>
                        <TableHead>Total Time</TableHead>
                        <TableHead>Overall</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.username}>
                          
                          <TableCell>
                            <div>
                              <p className="font-medium">{student.fullName}</p>
                              <p className="text-sm text-muted-foreground">
                                {student.class} - {student.section}
                              </p>
                            </div>
                          </TableCell>
                          {Object.entries(student.modules).map(([module, data]: any) => (
                            <TableCell key={module}>
                              <div className="space-y-1">
                                <Badge variant="outline" className={getScoreColor(data.score)}>
                                 Avg: {Math.floor(data.score / (data.targetSessions | 1))}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {data.sessionsCompleted}/{data.targetSessions} sessions
                                </div>
                                <Progress
                                  value={(data.sessionsCompleted / data.targetSessions) * 100}
                                  className="h-1"
                                />
                              </div>
                            </TableCell>
                          ))}
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{student.totalTimeSpent}m</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={(calculateOverall(student).toString())}>
                              {calculateOverall(student)}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Session Targets Tab */}
          <TabsContent value="session-targets" className="space-y-6">
            <SessionTargetManager
              students={students}
              sessionTargets={SESSION_TARGETS}
              selectedClass={selectedClass}
              selectedSection={selectedSection}
              refresh = {fetchStudents}
            />
          </TabsContent>

          {/* Module Analytics Tab */}
          <TabsContent value="module-analytics" className="space-y-6">
            <StudentModuleTracker students={students} selectedModule={selectedModule} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EnhancedTeacherDashboard;
