
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircleUser } from "lucide-react";

interface LevelIndicatorProps {
  level: string;
  xp: number;
  xpToNextLevel: number;
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  level = "Intermediate",
  xp = 1250,
  xpToNextLevel = 2000
}) => {
  const progress = Math.round((xp / xpToNextLevel) * 100);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <CircleUser className="h-4 w-4 text-primary" />
            <span>Your Level</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="bg-primary/20 text-primary rounded-full px-4 py-2 flex items-center justify-center font-semibold">
              {level}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span className="text-primary font-medium">{xp}</span>
            <span className="mx-1">/</span>
            <span>{xpToNextLevel} XP</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>{progress}% to next level</div>
            <div>{xpToNextLevel - xp} XP needed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
