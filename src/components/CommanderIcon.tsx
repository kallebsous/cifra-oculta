import React from 'react';

interface CommanderIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const CommanderIcon: React.FC<CommanderIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Body (similar to Lucide User) */}
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      {/* Head */}
      <circle cx="12" cy="11" r="4" />
      {/* Commander Cap Crown */}
      <path d="M7 7.5 L9 3 h6 L17 7.5" fill={color} stroke="none" />
      {/* Commander Cap Visor */}
      <path d="M5.5 8 Q 12 5 18.5 8" />
    </svg>
  );
};
