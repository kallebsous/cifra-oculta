import React, { useEffect } from 'react';
import { DialogueLine } from '../types/game';
import { sound } from '../audio/soundEffects';
import './DialogueBox.css';

interface DialogueBoxProps {
  currentLine: DialogueLine | null;
  onAdvance: () => void;
  isOpen: boolean;
  variant?: 'bottom' | 'top';
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ currentLine, onAdvance, isOpen, variant = 'bottom' }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        sound.playDialogueBlip(currentLine?.villain);
        onAdvance();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onAdvance, currentLine]);

  if (!isOpen || !currentLine) return null;

  const handleClick = () => {
    sound.playDialogueBlip(currentLine.villain);
    onAdvance();
  };

  return (
    <div className={`dialogue-wrap variant-${variant} ${!isOpen ? 'hidden' : ''}`} onClick={handleClick}>
      <div className="dialogue-container">
        
        {/* Persona 5 style spiky portrait backdrop */}
        <div className={`portrait-backdrop ${currentLine.villain ? 'villain' : ''}`}></div>

        <div className={`portrait ${currentLine.villain ? 'villain' : ''}`}>
          {currentLine.portrait}
        </div>

        <div className="speaker-wrap">
          <div className={`speaker ${currentLine.villain ? 'villain' : ''}`}>
            <span className="dot" />
            <span>{currentLine.name}</span>
          </div>
        </div>

        <div className="dialogue-box">
          <div className="dialogue-text">
            {currentLine.text}
          </div>

          <div className="dialogue-next">
            <span>continuar</span>
            <span className="arrow">▼</span>
          </div>
        </div>

      </div>
    </div>
  );
};
