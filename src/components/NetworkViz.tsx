import React from 'react';
import { sound } from '../audio/soundEffects';
import { TerminalSquare, Satellite, Ghost, Lock, Mail } from 'lucide-react';
import './NetworkViz.css';

interface NetworkVizProps {
  isFlying: boolean;
  isEncrypted: boolean;
  spyState: 'hidden' | 'popped' | 'blocked';
  glitchText: string | null;
}

export const NetworkViz: React.FC<NetworkVizProps> = ({
  isFlying,
  isEncrypted,
  spyState,
  glitchText
}) => {
  return (
    <div className="viz">
      <div className="track" />

      {/* Node: Console */}
      <div className="node">
        <div className="icon-box console"><TerminalSquare size={40} /></div>
        <div className="name">CONSOLE</div>
      </div>

      {/* Packet */}
      <div
        className={`packet ${isEncrypted ? 'locked' : ''} ${isFlying ? 'flying' : ''}`}
        style={{ opacity: isFlying ? 1 : 0 }}
      >
        {isEncrypted ? <Lock size={20} /> : <Mail size={20} />}
      </div>

      {/* Spy: Agente V */}
      <div
        className={`spy ${spyState === 'popped' ? 'pop' : ''} ${
          spyState === 'blocked' ? 'pop blocked' : ''
        }`}
      >
        <Ghost size={48} />
        <span className="qmark">
          {spyState === 'blocked' ? '#&*!?' : '?!'}
        </span>
      </div>

      {/* Glitchtext overlay */}
      {glitchText && (
        <div className="glitchtext show">
          {glitchText}
        </div>
      )}

      {/* Node: Ícaro */}
      <div className="node">
        <div className="icon-box sat"><Satellite size={40} /></div>
        <div className="name">ÍCARO</div>
      </div>
    </div>
  );
};
