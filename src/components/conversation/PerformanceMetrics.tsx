
import React from 'react';
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

interface PerformanceMetricsProps {
  fluencyScore: number;
  vocabularyScore: number;
  grammarScore: number;
}

const PerformanceMetrics = ({
  fluencyScore,
  vocabularyScore,
  grammarScore
}: PerformanceMetricsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Speaking Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <Label>Fluency</Label>
              <span className="text-sm text-muted-foreground">{fluencyScore}%</span>
            </div>
            <Progress value={fluencyScore} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <Label>Vocabulary</Label>
              <span className="text-sm text-muted-foreground">{vocabularyScore}%</span>
            </div>
            <Progress value={vocabularyScore} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <Label>Grammar</Label>
              <span className="text-sm text-muted-foreground">{grammarScore}%</span>
            </div>
            <Progress value={grammarScore} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
