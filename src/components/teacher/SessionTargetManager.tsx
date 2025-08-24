import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Target, 
  Plus, 
  Edit, 
  Save, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Users
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
const backend_url = import.meta.env.VITE_backend_url

interface SessionTarget {
  module: string;
  icon: React.ComponentType<any>;
  target: number;
  description: string;
}

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
}

interface SessionTargetManagerProps {
  students: StudentData[];
  sessionTargets: SessionTarget[];
  selectedClass: string;
  selectedSection: string;
  refresh;
}

export const SessionTargetManager: React.FC<SessionTargetManagerProps> = ({
  students,
  sessionTargets,
  selectedClass,
  selectedSection,
  refresh
}) => {
  const { toast } = useToast();
  const [editingTargets, setEditingTargets] = useState<{[key: string]: number}>({});
  const [isEditing, setIsEditing] = useState(false);
  const [newTargetModule, setNewTargetModule] = useState('');
  const [newTargetValue, setNewTargetValue] = useState(10);
  const [showCreateTarget, setShowCreateTarget] = useState(false);
  const navigate = useNavigate();

  const handleEditTarget = (module: string, currentTarget: number) => {
    setEditingTargets(prev => ({ ...prev, [module]: currentTarget }));
    setIsEditing(true);
  };

  const handleSaveTarget = async (module: string) => {
    const target = editingTargets[module];
    if (target && target > 0) {
      console.log(target, module)
      const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
        const classes = userSession.classes
        const sections = userSession.sections
        
  
        const classQuery = selectedClass === "all-classes" ? classes : [selectedClass]
        const sectionQuery = selectedSection === "all-sections" ? sections : [selectedSection];
       console.log(classQuery, sectionQuery)
      const response = await fetch(backend_url+'updateModuleData',{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email:userSession.email, module, target, classes:classQuery, sections:sectionQuery})
      })
      const updateResponse  = await response.json()
      console.log(updateResponse)
      if(updateResponse.message) await refresh()
      toast({
        title: "Target Updated",
        description: `${module} target updated to ${target} sessions for ${selectedClass} - Section ${selectedSection}`,
      });
    }
    setEditingTargets(prev => {
      const updated = { ...prev };
      delete updated[module];
      return updated;
    });
    if (Object.keys(editingTargets).length <= 1) {
      setIsEditing(false);
    }
  };
  function calculateOverall(modules) {

  let totalScore = 0;
  let totalTargets = 0;
    const module = modules.modules
    totalScore = module.grammar.score + module.pronunciation.score + module.reflex.score + module.speaking.score + module.vocabulary.score
    totalTargets = module.grammar.targetSessions + module.pronunciation.targetSessions + module.reflex.targetSessions + module.speaking.targetSessions + module.vocabulary.targetSessions
  if (totalTargets === 0) return 0;

  return (totalScore / totalTargets).toFixed(2);
}

  const handleCancelEdit = (module: string) => {
    setEditingTargets(prev => {
      const updated = { ...prev };
      delete updated[module];
      return updated;
    });
    if (Object.keys(editingTargets).length <= 1) {
      setIsEditing(false);
    }
  };

  const handleCreateNewTarget = () => {
    if (newTargetModule && newTargetValue > 0) {
      toast({
        title: "New Target Created",
        description: `Created ${newTargetValue} session target for ${newTargetModule}`,
      });
      setShowCreateTarget(false);
      setNewTargetModule('');
      setNewTargetValue(10);
    }
  };

  const getProgressStatus = (completed: number, target: number) => {
    const percentage = (completed / target) * 100;
    if (percentage >= 100) return { status: 'completed', color: 'text-green-600', icon: CheckCircle };
    if (percentage >= 75) return { status: 'on-track', color: 'text-blue-600', icon: Target };
    if (percentage >= 50) return { status: 'behind', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'critical', color: 'text-red-600', icon: AlertTriangle };
  };

  const calculateModuleStats = (module: string) => {
    const moduleData = students.map(s => s.modules[module]).filter(Boolean);
    const totalCompleted = moduleData.reduce((sum, m) => sum + m.sessionsCompleted, 0);
    const totalTarget = moduleData.reduce((sum, m) => sum + m.targetSessions, 0);
    const averageScore = Math.round(moduleData.reduce((sum, m) => sum + m.score, 0) / moduleData.length || 0);
    const totalTime = moduleData.reduce((sum, m) => sum + m.totalTime, 0);
    
    return {
      totalCompleted,
      totalTarget,
      averageScore,
      totalTime,
      completion: totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0
    };
  };

  return (
    <div className="space-y-6">
      {/* Session Targets Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Session Targets for {selectedClass === 'all-classes' ? 'All Classes' : selectedClass} 
              {selectedSection !== 'all-sections' && ` - Section ${selectedSection}`}
            </CardTitle>
            <Button 
              onClick={() => setShowCreateTarget(!showCreateTarget)}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Target
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create new target form */}
          {showCreateTarget && (
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>Module</Label>
                    <Select value={newTargetModule} onValueChange={setNewTargetModule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="speaking">Speaking</SelectItem>
                        <SelectItem value="vocabulary">Vocabulary</SelectItem>
                        <SelectItem value="grammar">Grammar</SelectItem>
                        <SelectItem value="pronunciation">Pronunciation</SelectItem>
                        <SelectItem value="reflex">Reflex</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Target Sessions</Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={newTargetValue}
                      onChange={(e) => setNewTargetValue(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateNewTarget} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Create
                    </Button>
                    <Button 
                      onClick={() => setShowCreateTarget(false)} 
                      variant="outline" 
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Module targets grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessionTargets.map((target) => {
              const stats = calculateModuleStats(target.module);
              const IconComponent = target.icon;
              const isEditing = editingTargets[target.module] !== undefined;
              
              return (
                <Card key={target.module} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold capitalize">{target.module}</h3>
                      </div>
                      {!isEditing ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTarget(target.module, target.target)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveTarget(target.module)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancelEdit(target.module)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Target:</span>
                        {!isEditing ? (
                          <Badge variant="outline">{target.target} sessions</Badge>
                        ) : (
                          <Input
                            type="number"
                            min={1}
                            max={50}
                            value={editingTargets[target.module]}
                            onChange={(e) => setEditingTargets(prev => ({
                              ...prev,
                              [target.module]: Number(e.target.value)
                            }))}
                            className="w-20 h-8"
                          />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Class Progress:</span>
                          <span>{stats.completion}%</span>
                        </div>
                        <Progress value={stats.completion} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Completed:</span>
                          <p className="font-medium">{stats.totalCompleted}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg Score:</span>
                          <p className="font-medium">{stats.averageScore}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{stats.totalTime}m total</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Individual Student Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  {sessionTargets.map(target => (
                    <TableHead key={target.module} className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <target.icon className="h-4 w-4" />
                        <span className="capitalize">{target.module}</span>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead>Overall Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const overallProgress = Math.round(
                    Object.values(student.modules).reduce((sum, module) => 
                      sum + ((module.sessionsCompleted / module.targetSessions) * 100), 0
                    ) / Object.keys(student.modules).length
                  );
                  
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
                      {sessionTargets.map(target => {
                        const moduleData = student.modules[target.module];
                        if (!moduleData) return <TableCell key={target.module}>-</TableCell>;
                        // if(moduleData.targetSessions==0)moduleData
                        const progress = (moduleData.sessionsCompleted / moduleData.targetSessions) * 100;
                        const status = getProgressStatus(moduleData.sessionsCompleted, moduleData.targetSessions);
                        const StatusIcon = status.icon;
                        
                        return (
                          <TableCell key={target.module} className="text-center">
                            <div className="space-y-1">
                              <div className="flex items-center justify-center gap-1 text-sm">
                                <StatusIcon className={`h-4 w-4 ${status.color}`} />
                                <span>{moduleData.sessionsCompleted}/{moduleData.targetSessions}</span>
                              </div>
                              <Progress value={progress} className="h-1" />
                              <div className="text-xs text-muted-foreground">
                                {!Math.round(progress)?'0':Math.round(progress)}%
                              </div>
                            </div>
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <div className="space-y-1">
                          <Badge 
                            variant="outline" 
                            className={
                              overallProgress >= 80 ? 'text-green-600 bg-green-50' :
                              overallProgress >= 60 ? 'text-yellow-600 bg-yellow-50' :
                              'text-red-600 bg-red-50'
                            }
                          >
                            {calculateOverall(student)}%
                          </Badge>
                          <Progress value={Number(calculateOverall(student))} className="h-1" />
                        </div>
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