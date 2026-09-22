import React from 'react';
import './Screens.css';
import { sound } from '../audio/soundEffects';

interface PhaseOneResultScreenProps {
  onContinue: () => void;
  onOpenInspector: () => void;
}

export const PhaseOneResultScreen: React.FC<PhaseOneResultScreenProps> = ({
  onContinue,
  onOpenInspector
}) => {
  const handleContinue = () => {
    sound.playClick();
    onContinue();
  };

  return (
    <div className="stage">
      <div className="result-banner fail">DERROTA SILENCIOSA</div>
      <div className="stars">
        <span>★</span>
        <span className="dim">★</span>
        <span className="dim">★</span>
      </div>

      <p className="stage-sub" style={{ maxWidth: '580px' }}>
        O pacote chegou 100% intacto ao satélite — mas qualquer estação no caminho, aliada ou não,
        leu cada palavra. Entregar certo não é o mesmo que entregar em segredo: faltou <b>Confidencialidade</b>.
      </p>

      <div className="btn-row">
        <button className="btn" onClick={handleContinue}>
          ESCOLHER EQUIPAMENTO
        </button>
        <button className="btn ghost" onClick={onOpenInspector}>
          🔍 INSPECIONAR TELEMETRIA
        </button>
      </div>
    </div>
  );
};
