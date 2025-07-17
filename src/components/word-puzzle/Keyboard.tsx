
import React from "react";
import { Button } from "@/components/ui/button";

type LetterStatus = 'correct' | 'present' | 'absent';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  keyStatus: Record<string, LetterStatus>;
}

export const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onEnter,
  keyStatus,
}) => {
  // Keyboard layout
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace']
  ];

  const handleKeyClick = (key: string) => {
    if (key === 'enter') {
      onEnter();
    } else if (key === 'backspace') {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  // Get the appropriate style based on key status
  const getKeyStyle = (key: string) => {
    if (!keyStatus[key]) return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
    
    switch (keyStatus[key]) {
      case 'correct':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'present':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'absent':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      default:
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
    }
  };

  return (
    <div className="w-full">
      {rows.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex justify-center gap-1 mb-2"
        >
          {row.map((key) => {
            const isSpecialKey = key === 'enter' || key === 'backspace';
            const keyStyle = isSpecialKey ? 'bg-gray-300 hover:bg-gray-400 text-gray-800' : getKeyStyle(key);
            
            return (
              <Button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`
                  h-12 px-2 md:px-3 min-w-[30px] font-medium uppercase text-sm
                  transition-colors duration-300 flex items-center justify-center
                  ${keyStyle}
                  ${key === 'enter' ? 'text-xs px-1' : ''}
                  ${key === 'backspace' ? 'text-xs' : ''}
                `}
                variant="ghost"
              >
                {key === 'backspace' ? '⌫' : key}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
