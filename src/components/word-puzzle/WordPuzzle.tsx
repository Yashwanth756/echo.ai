
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Volume2, VolumeX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WordScrambleGame from "@/components/word-puzzle/WordScrambleGame";
import VocabularyArcade from "@/components/word-puzzle/VocabularyArcade";

// Game options with their details
const gameOptions = [
  {
    id: "word-scramble",
    name: "Word Scramble",
    description: "Unscramble letters to form a valid English word",
    icon: "🔤",
    comingSoon: false,
  },
  {
    id: "vocabulary-arcade",
    name: "Vocabulary Arcade",
    description: "Match words with their correct definitions",
    icon: "📚",
    comingSoon: false,
  },
];

const WordPuzzle = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const selectGame = (gameId: string) => {
    if (gameOptions.find(game => game.id === gameId)?.comingSoon) {
      return; // Don't select games marked as coming soon
    }
    setSelectedGame(gameId);
  };

  return (
    <AppLayout>
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Word Puzzles</h1>
            <p className="text-muted-foreground mt-1">
              Fun and challenging word games to improve your English
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {}}
            title={true ? "Enable sound" : "Mute sound"}
            className="h-10 w-10 rounded-full hover:bg-primary/10"
          >
            {true ? 
              <VolumeX className="h-5 w-5" /> : 
              <Volume2 className="h-5 w-5" />
            }
          </Button>
        </header>

        {!selectedGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameOptions.map((game) => (
              <Card 
                key={game.id}
                onClick={() => selectGame(game.id)}
                className={`cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg border-primary/10 ${
                  game.comingSoon ? 'opacity-70' : 'hover:border-primary/30'
                } animate-fade-in`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{game.icon}</span>
                    <span>{game.name}</span>
                    {game.comingSoon && (
                      <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{game.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            {selectedGame === "word-scramble" && <WordScrambleGame />}
            {selectedGame === "vocabulary-arcade" && <VocabularyArcade />}
            
            <Button 
              onClick={() => setSelectedGame(null)} 
              variant="outline"
              className="mt-4"
            >
              Back to Game Selection
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default WordPuzzle;
