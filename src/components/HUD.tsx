import React from 'react';
import { TriadMetrics } from '../types/game';
import './HUD.css';

interface HUDProps {
  triad: TriadMetrics;
  visible: boolean;
}

export const HUD: React.FC<HUDProps> = ({ triad, visible }) => {
  const getBarColor = (val: number, isSecret = false) => {
    if (val >= 100) return 'var(--safe)';
    if (val <= 0) return 'var(--leak)';
    return isSecret ? 'var(--gold)' : 'var(--paper-dim)';
  };

  return (
    <div className={`hud-wrapper ${!visible ? 'hidden' : ''}`}>
      <div className="triad-box" title="Disponibilidade: o pacote consegue trafegar e alcançar o destino?">
        <div className="label">📶 CONEXÃO</div>
        <div className="bar">
          <span
            style={{
              width: `${triad.connection}%`,
              background: getBarColor(triad.connection)
            }}
          />
        </div>
        <div className="pct" style={{ color: getBarColor(triad.connection) }}>
          {triad.connection}%
        </div>
      </div>

      <div className="triad-box" title="Integridade: os dados chegaram sem adulteração ou corrupção de bytes?">
        <div className="label">📦 DADOS</div>
        <div className="bar">
          <span
            style={{
              width: `${triad.data}%`,
              background: getBarColor(triad.data)
            }}
          />
        </div>
        <div className="pct" style={{ color: getBarColor(triad.data) }}>
          {triad.data}%
        </div>
      </div>

      <div className="triad-box" title="Confidencialidade: olhos não autorizados foram impedidos de ler o conteúdo?">
        <div className="label">🔐 SEGREDO</div>
        <div className="bar">
          <span
            style={{
              width: `${triad.secret}%`,
              background: getBarColor(triad.secret, true)
            }}
          />
        </div>
        <div className="pct" style={{ color: getBarColor(triad.secret, true) }}>
          {triad.secret}%
        </div>
      </div>
    </div>
  );
};
