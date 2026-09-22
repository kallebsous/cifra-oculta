import React from 'react';
import './Screens.css';

interface PhaseIntroScreenProps {}

export const PhaseIntroScreen: React.FC<PhaseIntroScreenProps> = () => {
  return (
    <div className="stage" style={{ justifyContent: 'flex-end', alignItems: 'center', background: 'rgba(0,0,0,0.6)' }}>
      <div className="dossier-card" style={{ marginBottom: '8vh' }}>
        <div className="dossier-header">DOSSIÊ TÁTICO</div>
        <div className="dossier-body">
          <div className="dossier-row"><span>CODINOME:</span> <b>OPERAÇÃO CIFRA OCULTA</b></div>
          <div className="dossier-row"><span>OBJETIVO:</span> <b>TRANSMITIR COORDENADAS VITAIS</b></div>
          <div className="dossier-row"><span>AMEAÇA:</span> <b style={{color: 'var(--red)'}}>AGENTE V (SNIFFER DE REDE)</b></div>
          <div className="dossier-row"><span>FOCO:</span> <b style={{color: 'var(--gold)'}}>CONFIDENCIALIDADE</b></div>
        </div>
      </div>
    </div>
  );
};
