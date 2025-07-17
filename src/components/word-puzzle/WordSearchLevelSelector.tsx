
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Grid3X3, Target, Trophy } from 'lucide-react';
import { DifficultyLevel } from './WordSearchGame';

interface LevelInfo {
  level: DifficultyLevel;
  title: string;
  description: string;
  gridSize: string;
  wordCount: number;
  subjects: string[];
  timeEstimate: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const LEVEL_INFO: LevelInfo[] = [
  {
    level: 'beginner',
    title: 'Beginner',
    description: 'Perfect for starting your word search journey',
    gridSize: '8×8',
    wordCount: 10,
    subjects: ['Basic Science', 'English'],
    timeEstimate: '5-10 min',
    icon: '🟢',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200 hover:border-green-400'
  },
  {
    level: 'intermediate',
    title: 'Intermediate',
    description: 'Ready for a greater challenge',
    gridSize: '10×10',
    wordCount: 10,
    subjects: ['Biology', 'Environment'],
    timeEstimate: '10-15 min',
    icon: '🟡',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200 hover:border-yellow-400'
  },
  {
    level: 'advanced',
    title: 'Advanced',
    description: 'For word search masters',
    gridSize: '12×12',
    wordCount: 10,
    subjects: ['Chemistry', 'Space Science', 'Technology'],
    timeEstimate: '15-25 min',
    icon: '🔴',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200 hover:border-red-400'
  }
];

interface WordSearchLevelSelectorProps {
  onLevelSelect: (level: DifficultyLevel) => void;
  onBack: () => void;
  userProgress?: {
    level: DifficultyLevel;
    score: number;
  };
}

export const WordSearchLevelSelector: React.FC<WordSearchLevelSelectorProps> = ({
  onLevelSelect,
  onBack,
  userProgress
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button onClick={onBack} variant="outline" className="mb-4">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔍 Word Search Adventure
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Find hidden words in letter grids and expand your vocabulary!
          </p>
          
          {userProgress && (
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">
                Current Level: {userProgress.level} | Best Score: {userProgress.score}
              </span>
            </div>
          )}
        </div>

        {/* Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {LEVEL_INFO.map((levelInfo) => (
            <Card 
              key={levelInfo.level}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${levelInfo.bgColor} ${levelInfo.borderColor} border-2`}
              onClick={() => onLevelSelect(levelInfo.level)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{levelInfo.icon}</div>
                <CardTitle className={`text-2xl ${levelInfo.color}`}>
                  {levelInfo.title}
                </CardTitle>
                <p className="text-muted-foreground">{levelInfo.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{levelInfo.gridSize} Grid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{levelInfo.wordCount} Words</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{levelInfo.timeEstimate}</span>
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <p className="text-sm font-medium mb-2">Subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {levelInfo.subjects.map((subject) => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Play Button */}
                <Button 
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLevelSelect(levelInfo.level);
                  }}
                >
                  Start {levelInfo.title} Level
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📚 How to Play
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">🎯 Objective</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Find all 10 hidden words in the letter grid</li>
                  <li>• Words can be horizontal, vertical, or diagonal</li>
                  <li>• Use the hints to help identify words</li>
                  <li>• Complete all words to advance to the next level</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🎮 Controls</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Click and drag to select letters</li>
                  <li>• Words can be found in any direction</li>
                  <li>• Found words will be highlighted in green</li>
                  <li>• Check hints on the right side for guidance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl mb-2">🧠</div>
            <h3 className="font-semibold mb-1">Educational</h3>
            <p className="text-xs text-muted-foreground">Learn science vocabulary</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl mb-2">⏱️</div>
            <h3 className="font-semibold mb-1">Timed Challenge</h3>
            <p className="text-xs text-muted-foreground">Race against the clock</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-semibold mb-1">Score System</h3>
            <p className="text-xs text-muted-foreground">Earn points and bonuses</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1">Smart Hints</h3>
            <p className="text-xs text-muted-foreground">Educational clues</p>
          </div>
        </div>
      </div>
    </div>
  );
};
