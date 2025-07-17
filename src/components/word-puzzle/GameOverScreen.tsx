
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Trophy, ArrowLeft } from "lucide-react";
import { Difficulty } from "./WordScrambleGame";

interface GameOverScreenProps {
  hasWon: boolean;
  targetWord: string;
  difficulty?: Difficulty;
  puzzlesSolved?: number;
  attempts?: number;
  onPlayAgain: () => void;
  onChangeDifficulty?: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  hasWon,
  targetWord,
  difficulty = 'medium',
  puzzlesSolved = 0,
  attempts,
  onPlayAgain,
  onChangeDifficulty,
}) => {
  // Determine badge and message based on puzzles solved
  let badge = "Word Novice";
  let badgeColor = "bg-blue-100 text-blue-800";
  
  if (puzzlesSolved >= 10) {
    badge = "Word Wizard";
    badgeColor = "bg-purple-100 text-purple-800";
  } else if (puzzlesSolved >= 5) {
    badge = "Word Master";
    badgeColor = "bg-green-100 text-green-800";
  } else if (puzzlesSolved >= 3) {
    badge = "Word Explorer";
    badgeColor = "bg-yellow-100 text-yellow-800";
  }
  
  return (
    <div className="w-full flex flex-col items-center justify-center py-8 animate-fade-in">
      <Card className="w-full max-w-md overflow-hidden">
        <div className={`w-full h-2 ${
          difficulty === 'easy' ? 'bg-green-500' : 
          difficulty === 'medium' ? 'bg-yellow-500' : 
          'bg-red-500'
        }`} />
        
        <CardContent className="pt-6">
          {hasWon ? (
            <div className="text-center">
              <div className="mb-4">
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto" />
              </div>
              <h3 className="text-3xl font-bold text-green-600 mb-4">You Won! 🎉</h3>
              <p className="text-xl mb-2">
                Congratulations! You unscrambled <span className="font-bold uppercase">{targetWord}</span>
              </p>
              
              {/* Badge display */}
              <div className="mt-6 mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
                  {badge}
                </span>
              </div>
              
              {/* Stars earned */}
              <div className="flex justify-center gap-1 my-4">
                {Array.from({ length: Math.min(puzzlesSolved, 5) }).map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-8 w-8 text-yellow-400 fill-yellow-400 animate-[scale-in_0.3s_ease-out]"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
              
              <p className="text-lg text-primary font-medium mt-2">
                {puzzlesSolved} {puzzlesSolved === 1 ? 'puzzle' : 'puzzles'} solved!
              </p>
              
              <ConfettiEffect />
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary mb-4">Game Over</h3>
              <p className="text-xl mb-2">
                The word was <span className="font-bold uppercase">{targetWord}</span>
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Better luck next time!
              </p>
            </div>
          )}
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={onPlayAgain} size="lg" className="px-8">
              Play Again
            </Button>
            {onChangeDifficulty && (
              <Button onClick={onChangeDifficulty} variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Change Difficulty
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ConfettiEffect: React.FC = () => {
  // In a real app, we would implement a proper confetti effect
  // For now, we'll just render some colorful dots
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  return (
    <div className="relative w-full h-24 mb-6 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const animationDelay = `${Math.random() * 2}s`;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <div
            key={i}
            className={`absolute rounded-full ${color} opacity-70 animate-[confetti_3s_ease-in-out_forwards]`}
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              animationDelay,
            }}
          />
        );
      })}
    </div>
  );
};
