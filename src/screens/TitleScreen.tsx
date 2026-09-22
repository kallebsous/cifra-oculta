import React from 'react';
import './Screens.css';
import { sound } from '../audio/soundEffects';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  const handleStart = () => {
    sound.playClick();
    sound.playBgm();
    onStart();
  };

  return (
    <div className="stage">
      <div className="calendar-chip">
        <div className="day">14</div>
        <div className="meta">
          <b>QUINTA-FEIRA</b>
          <span>Turno da Noite · Base Secreta</span>
        </div>
      </div>

      <h1 className="title-lg">
        CIFRA<br />OCULTA
      </h1>

      <div className="subtitle-cap">UMA MISSÃO SOBRE CONFIDENCIALIDADE</div>

      <button className="btn" onClick={handleStart}>
        INICIAR MISSÃO
      </button>

      <footer className="credit">
        CONSOLE DE LANÇAMENTO DA TERRA — CONTATO: SATÉLITE ÍCARO
      </footer>
    </div>
  );
};
