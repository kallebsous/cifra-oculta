import React from 'react';
import { NetworkViz } from '../components/NetworkViz';
import './Screens.css';
import { sound } from '../audio/soundEffects';

interface PhaseThreeScreenProps {
  onFire: () => void;
  isFlying: boolean;
  spyState: 'hidden' | 'popped' | 'blocked';
  glitchText: string | null;
  disabled: boolean;
  hasLista: boolean;
}

export const PhaseThreeScreen: React.FC<PhaseThreeScreenProps> = ({
  onFire,
  isFlying,
  spyState,
  glitchText,
  disabled,
  hasLista
}) => {
  const handleClick = () => {
    sound.playSwoosh();
    onFire();
  };

  return (
    <div className="stage">
      <h2 className="stage-title">FASE 3 — A VITÓRIA CIFRADA</h2>
      <p className="stage-sub">
        {hasLista
          ? 'Cofre Criptográfico e Lista de Acesso ativados. O canal está protegido e restrito.'
          : 'O Cofre Criptográfico está equipado. Transmita de novo — desta vez o Agente V pode interceptar à vontade.'}
      </p>

      <NetworkViz
        isFlying={isFlying}
        isEncrypted={true}
        spyState={spyState}
        glitchText={glitchText}
      />

      <button className="btn" onClick={handleClick} disabled={disabled}>
        TRANSMITIR
      </button>
    </div>
  );
};
