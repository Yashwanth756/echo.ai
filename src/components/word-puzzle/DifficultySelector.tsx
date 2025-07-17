import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Difficulty } from './WordScrambleGame';

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  onSelectDifficulty 
}) => {

  const handleSelect = (difficulty: Difficulty) => {
    onSelectDifficulty(difficulty);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">Word Scramble</h2>
        <p className="text-muted-foreground">Choose a difficulty level to begin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Easy Level */}
        <Card
          className="p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
          onClick={() => handleSelect('easy')}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l1.6 4.3a1 1 0 0 0 .95.7h4.45a1 1 0 0 1 .65 1.75L16.4 11.6a1 1 0 0 0-.35 1.1l1.6 4.3a1 1 0 0 1-1.6 1.1L12.8 15.2a1 1 0 0 0-1.1 0l-3.25 2.9a1 1 0 0 1-1.6-1.1l1.6-4.3a1 1 0 0 0-.35-1.1L4.85 8.75a1 1 0 0 1 .65-1.75H10a1 1 0 0 0 .95-.7L12 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-green-700">Easy</h3>
            <ul className="text-sm text-muted-foreground text-left list-disc pl-4 space-y-1">
              <li>4-5 letter words</li>
              <li>3 hints available</li>
              <li>Perfect for beginners</li>
            </ul>
            <Button 
              className="mt-4 bg-green-500 hover:bg-green-600" 
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('easy');
              }}
            >
              Start Easy Mode
            </Button>
          </div>
        </Card>

        {/* Medium Level */}
        <Card
          className="p-6 border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
          onClick={() => handleSelect('medium')}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.189 17.384l-1.128.574a1 1 0 01-1.448-1.056l.215-1.264-1.06-.878a1 1 0 01.554-1.705l1.337-.126.516-1.273a1 1 0 011.842 0l.516 1.273 1.337.126a1 1 0 01.554 1.705l-1.06.878.215 1.264a1 1 0 01-1.448 1.056l-1.128-.574-.223.174zm10.006-4l-1.128.574a1 1 0 01-1.448-1.056l.215-1.264-1.06-.878a1 1 0 01.554-1.705l1.337-.126.516-1.273a1 1 0 011.842 0l.516 1.273 1.337.126a1 1 0 01.554 1.705l-1.06.878.215 1.264a1 1 0 01-1.448 1.056l-1.128-.574-.223.174zm9.222-10l-1.128.574a1 1 0 01-1.448-1.056l.215-1.264-1.06-.878a1 1 0 01.554-1.705l1.337-.126.516-1.273a1 1 0 011.842 0l.516 1.273 1.337.126a1 1 0 01.554 1.705l-1.06.878.215 1.264a1 1 0 01-1.448 1.056l-1.128-.574-.223.174z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-yellow-700">Medium</h3>
            <ul className="text-sm text-muted-foreground text-left list-disc pl-4 space-y-1">
              <li>6-7 letter words</li>
              <li>2 hints available</li>
              <li>Good for practice</li>
            </ul>
            <Button 
              className="mt-4 bg-yellow-500 hover:bg-yellow-600" 
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('medium');
              }}
            >
              Start Medium Mode
            </Button>
          </div>
        </Card>

        {/* Hard Level */}
        <Card
          className="p-6 border-2 border-red-200 hover:border-red-400 hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
          onClick={() => handleSelect('hard')}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-red-700">Hard</h3>
            <ul className="text-sm text-muted-foreground text-left list-disc pl-4 space-y-1">
              <li>8-9 letter words</li>
              <li>No hints available</li>
              <li>For word wizards</li>
            </ul>
            <Button 
              className="mt-4 bg-red-500 hover:bg-red-600" 
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('hard');
              }}
            >
              Start Hard Mode
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Drag letters into the pots to form words. The more puzzles you solve, the more stars you earn!
        </p>
      </div>
    </div>
  );
};
