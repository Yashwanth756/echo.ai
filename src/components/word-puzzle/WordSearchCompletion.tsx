
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Target, Star, RefreshCw, ArrowRight } from 'lucide-react';
import { DifficultyLevel } from './WordSearchGame';

interface WordSearchCompletionProps {
  difficulty: DifficultyLevel;
  score: number;
  timeElapsed: number;
  wordsFound: number;
  totalWords: number;
  onNextLevel?: () => void;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  isLastLevel?: boolean;
}

export const WordSearchCompletion: React.FC<WordSearchCompletionProps> = ({
  difficulty,
  score,
  timeElapsed,
  wordsFound,
  totalWords,
  onNextLevel,
  onPlayAgain,
  onBackToMenu,
  isLastLevel = false
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceRating = (): { rating: string; message: string; stars: number } => {
    const completionRate = (wordsFound / totalWords) * 100;
    const timeBonus = Math.max(0, 300 - timeElapsed); // 5 minutes max bonus
    
    if (completionRate === 100 && timeBonus > 180) {
      return { rating: "Excellent!", message: "Outstanding performance! You're a word search master!", stars: 5 };
    } else if (completionRate === 100 && timeBonus > 60) {
      return { rating: "Great Job!", message: "Well done! You found all words efficiently.", stars: 4 };
    } else if (completionRate === 100) {
      return { rating: "Good Work!", message: "Nice! You found all the words.", stars: 3 };
    } else if (completionRate >= 80) {
      return { rating: "Not Bad!", message: "Good effort! Try to find more words next time.", stars: 2 };
    } else {
      return { rating: "Keep Trying!", message: "Practice makes perfect! Don't give up!", stars: 1 };
    }
  };

  const performance = getPerformanceRating();

  const getDifficultyInfo = () => {
    switch (difficulty) {
      case 'beginner':
        return { icon: '🟢', color: 'text-green-600', nextLevel: 'Intermediate' };
      case 'intermediate':
        return { icon: '🟡', color: 'text-yellow-600', nextLevel: 'Advanced' };
      case 'advanced':
        return { icon: '🔴', color: 'text-red-600', nextLevel: null };
      default:
        return { icon: '⚪', color: 'text-gray-600', nextLevel: null };
    }
  };

  const difficultyInfo = getDifficultyInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
      <div className="container mx-auto max-w-2xl">
        <Card className="text-center shadow-2xl border-2 border-green-200">
          <CardHeader className="pb-4">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-3xl mb-2 text-green-600">
              Level Complete!
            </CardTitle>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">{difficultyInfo.icon}</span>
              <span className={`text-xl font-semibold ${difficultyInfo.color}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Performance Rating */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="text-xl font-bold mb-2">{performance.rating}</h3>
              <div className="flex justify-center mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i} 
                    className={`h-6 w-6 ${i < performance.stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-muted-foreground">{performance.message}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{wordsFound}/{totalWords}</div>
                <div className="text-sm text-muted-foreground">Words Found</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{Math.round((wordsFound/totalWords) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Completion</div>
              </div>
            </div>

            {/* Score Breakdown */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Words Found ({wordsFound} × {difficulty === 'beginner' ? 10 : difficulty === 'intermediate' ? 15 : 20} points)</span>
                    <span className="font-semibold">
                      {wordsFound * (difficulty === 'beginner' ? 10 : difficulty === 'intermediate' ? 15 : 20)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Bonus (max 300 - {timeElapsed} sec)</span>
                    <span className="font-semibold">
                      {Math.max(0, 300 - timeElapsed)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total Score</span>
                    <span>{score}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!isLastLevel && difficultyInfo.nextLevel && wordsFound === totalWords && (
                <Button 
                  onClick={onNextLevel}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Next Level: {difficultyInfo.nextLevel}
                </Button>
              )}
              
              <Button 
                onClick={onPlayAgain}
                variant="outline"
                size="lg"
                className="border-2 border-blue-300 hover:bg-blue-50"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Play Again
              </Button>
              
              <Button 
                onClick={onBackToMenu}
                variant="outline"
                size="lg"
              >
                Back to Menu
              </Button>
            </div>

            {/* Achievements */}
            <div className="flex flex-wrap justify-center gap-2">
              {wordsFound === totalWords && (
                <Badge className="bg-green-500">
                  🏆 Perfect Score
                </Badge>
              )}
              {timeElapsed < 180 && (
                <Badge className="bg-blue-500">
                  ⚡ Speed Demon
                </Badge>
              )}
              {wordsFound >= totalWords * 0.8 && (
                <Badge className="bg-purple-500">
                  🎯 Word Master
                </Badge>
              )}
              {difficulty === 'advanced' && wordsFound === totalWords && (
                <Badge className="bg-red-500">
                  🔥 Advanced Champion
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
