
import React from 'react';

interface LetterTileProps {
  letter: string;
  isHinted: boolean;
  isCorrect: boolean | null;
  index: number;
}

export const LetterTile: React.FC<LetterTileProps> = ({ 
  letter, 
  isHinted, 
  isCorrect,
  index 
}) => {
  // Calculate different styles based on state
  const tileClass = isHinted
    ? 'bg-yellow-500 text-white border-yellow-500 animate-pulse'
    : isCorrect === true
      ? 'bg-green-500 text-white border-green-500 animate-[flip-in_0.5s_ease-out_forwards]'
      : isCorrect === false
        ? 'bg-red-100 border-red-200'
        : 'bg-primary/10 border-primary hover:bg-primary/20';
        
  // Use animation delay based on index for sequential animations
  const animationDelay = `${index * 100}ms`;
  
  // Generate a vibrant, kid-friendly background color for each tile
  const colors = [
    'bg-[#FEC6A1] border-[#F97316]', // Soft Orange
    'bg-[#E5DEFF] border-[#8B5CF6]', // Soft Purple
    'bg-[#FFDEE2] border-[#F43F5E]', // Soft Pink
    'bg-[#FDE1D3] border-[#F97316]', // Soft Peach
    'bg-[#D3E4FD] border-[#0EA5E9]', // Soft Blue
    'bg-[#F2FCE2] border-[#22C55E]', // Soft Green
    'bg-[#FEF7CD] border-[#EAB308]', // Soft Yellow
  ];
  
  // Use a consistent color based on the letter to make it look more playful
  const colorIndex = letter.charCodeAt(0) % colors.length;
  const tileColorClass = isHinted || isCorrect !== null ? '' : colors[colorIndex];
        
  return (
    <div
      data-letter={letter}
      className={`
        select-none cursor-pointer active:cursor-grabbing
        flex items-center justify-center
        w-12 h-16 md:w-16 md:h-20
        text-2xl md:text-3xl font-bold uppercase
        border-2 rounded-lg m-1 
        transition-all duration-200 hover:scale-105 active:scale-95
        ${tileClass} ${tileColorClass}
        animate-[bounce_0.5s_ease-out]
      `}
      style={{
        animationDelay,
        transform: isCorrect ? 'rotateX(360deg)' : '',
        transitionDelay: isCorrect !== null ? animationDelay : '0ms',
      }}
    >
      {letter}
    </div>
  );
};
