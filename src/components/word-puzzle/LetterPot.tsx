
import React from 'react';

interface LetterPotProps {
  letter: string | null;
  isHinted: boolean;
  isCorrect: boolean | null;
  index: number;
  onLetterRemove: () => void;
}

export const LetterPot: React.FC<LetterPotProps> = ({ 
  letter, 
  isHinted, 
  isCorrect,
  index,
  onLetterRemove
}) => {
  // Calculate different styles based on state
  const potClass = letter 
    ? isHinted
      ? 'bg-yellow-500 border-yellow-500 text-white animate-pulse'
      : isCorrect === true
        ? 'bg-green-500 border-green-500 text-white animate-[flip-in_0.5s_ease-out_forwards]'
        : isCorrect === false
          ? 'bg-red-100 border-red-200'
          : 'bg-primary/10 border-primary shadow-sm' 
    : 'bg-primary/5 border-primary/30 border-dashed hover:bg-primary/10';
        
  // Use animation delay based on index for sequential animations
  const animationDelay = `${index * 100}ms`;
       
  return (
    <div className="m-1 relative">
      <div
        data-pot-index={index}
        className={`
          flex items-center justify-center
          w-16 h-16 md:w-20 md:h-20
          text-2xl md:text-3xl font-bold uppercase
          border-2 rounded-lg
          transition-all duration-300
          ${potClass}
          ${!letter ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}
        `}
        style={{
          animationDelay,
          transform: isCorrect ? 'rotateX(360deg)' : '',
          transitionDelay: isCorrect !== null ? animationDelay : '0ms',
        }}
      >
        {letter && (
          <div 
            className="w-full h-full flex items-center justify-center cursor-pointer 
                      transition-transform hover:scale-105 active:scale-95"
            onClick={onLetterRemove}
          >
            {letter}
          </div>
        )}
        
        {!letter && (
          <div className="w-8 h-8 md:w-10 md:h-10 opacity-30">
            {/* Empty pot indicator */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="6" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
              <path d="M12 2 L12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Add visual indicator for drag target */}
      {!letter && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 border-2 border-dashed border-primary/30 rounded-full animate-[pulse_3s_ease-in-out_infinite]"></div>
        </div>
      )}
    </div>
  );
};
