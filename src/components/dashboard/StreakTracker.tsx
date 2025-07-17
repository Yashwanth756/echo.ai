
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from 'date-fns';

interface StreakData {
  [key: string]: {
    completed: boolean;
    score?: number;
  };
}

interface StreakTrackerProps {
  streakData: StreakData;
  currentStreak: number;
}

// Mock data to demonstrate the component
const defaultStreakData = {
  // Generate data for the past 30 days
  ...Object.fromEntries(
    Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return [
        format(date, 'yyyy-MM-dd'),
        {
          completed: Math.random() > 0.3,
          score: Math.floor(Math.random() * 40) + 60
        }
      ];
    })
  )
};

export const StreakTracker: React.FC<StreakTrackerProps> = ({ 
  streakData = defaultStreakData,
  currentStreak = 5
}) => {
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return {
      date: date,
      key: format(date, 'yyyy-MM-dd'),
      day: format(date, 'EEE'),
      completed: streakData[format(date, 'yyyy-MM-dd')]?.completed || false,
      score: streakData[format(date, 'yyyy-MM-dd')]?.score
    };
  }).reverse();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Your Learning Streak</span>
          </div>
        </CardTitle>
        <div className="flex items-center text-primary font-medium">
          <span className="text-xl">{currentStreak}</span>
          <span className="ml-1">days</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          {days.map((day) => (
            <div key={day.key} className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">
                {day.day}
              </span>
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs 
                  ${day.completed 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gray-100 text-gray-400'}`}
                title={day.score ? `Score: ${day.score}%` : ''}
              >
                {day.completed ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
