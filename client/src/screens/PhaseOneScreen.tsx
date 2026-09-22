import React from 'react';
import { NetworkViz } from '../components/NetworkViz';
import './Screens.css';
import { sound } from '../audio/soundEffects';

interface PhaseOneScreenProps {
  onFire: () => void;
  isFlying: boolean;
  spyState: 'hidden' | 'popped' | 'blocked';
  glitchText: string | null;
  disabled: boolean;
}

export const PhaseOneScreen: React.FC<PhaseOneScreenProps> = ({
  onFire,
  isFlying,
  spyState,
  glitchText,
  disabled
}) => {
  const handleClick = () => {
    sound.playSwoosh();
    onFire();
  };

  return (
    <div className="stage">
      <h2 className="stage-title">FASE 1 — O PRIMEIRO DESPACHO</h2>
      <p className="stage-sub">
        Envie as coordenadas secretas até o Satélite Ícaro. A rota está livre — nada vai travar a transmissão.
      </p>

      <NetworkViz
        isFlying={isFlying}
        isEncrypted={false}
        spyState={spyState}
        glitchText={glitchText}
      />

      <button className="btn" onClick={handleClick} disabled={disabled}>
        DISPARAR SINAL
      </button>
    </div>
  );
};
