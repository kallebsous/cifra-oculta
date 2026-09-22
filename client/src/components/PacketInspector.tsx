import React from 'react';
import { DispatchResult, NodeLog } from '../types/game';
import { TerminalSquare, Server, Ghost, Satellite, Lock, Mail, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import './PacketInspector.css';

interface PacketInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  lastDispatch: DispatchResult | null;
}

const getNodeIcon = (nodeName: string) => {
  if (nodeName.includes('CONSOLE')) return <TerminalSquare size={20} />;
  if (nodeName.includes('RELÉ')) return <Server size={20} />;
  if (nodeName.includes('AGENTE')) return <Ghost size={20} />;
  if (nodeName.includes('ÍCARO')) return <Satellite size={20} />;
  return <Server size={20} />;
};

export const PacketInspector: React.FC<PacketInspectorProps> = ({
  isOpen,
  onClose,
  lastDispatch
}) => {
  return (
    <div className={`inspector-drawer ${!isOpen ? 'closed' : ''}`}>
      <div className="inspector-header">
        <span>&gt; INSPETOR DE PACOTES DE REDE</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#000',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          [✕]
        </button>
      </div>

      <div className="inspector-body">
        {!lastDispatch ? (
          <div className="empty-state">
            <Mail size={32} opacity={0.5} />
            <p>Nenhum pacote transmitido ainda.<br/>Dispare o sinal para capturar telemetria em tempo real.</p>
          </div>
        ) : (
          <>
            {/* Packet Metadata Card */}
            <div className="meta-card">
              <div className="meta-header">
                {lastDispatch.payload.isEncrypted ? <Lock size={16} /> : <AlertTriangle size={16} color="var(--red)" />}
                <span>RESUMO DO PACOTE</span>
                <span className="timestamp">{new Date(lastDispatch.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="meta-grid">
                <div><span>STATUS</span> <b className={lastDispatch.payload.isEncrypted ? 'safe' : 'danger'}>{lastDispatch.payload.isEncrypted ? 'CIFRADO (TLS/AES-256)' : 'EM CLARO (RAW HTTP)'}</b></div>
                <div><span>HASH</span> <b>{lastDispatch.payload.hashSha256}</b></div>
                {lastDispatch.payload.isEncrypted && (
                  <>
                    <div><span>IV</span> <b>{lastDispatch.payload.iv}</b></div>
                    <div><span>TAG</span> <b>{lastDispatch.payload.authTag}</b></div>
                  </>
                )}
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="timeline-title">REGISTRO DE SALTOS DE REDE (HOPS)</div>
            <div className="timeline">
              {lastDispatch.nodeLogs.map((log, idx) => {
                const isSpy = log.node.includes('AGENTE');
                const isEncrypted = lastDispatch.payload.isEncrypted;
                const isDanger = isSpy && !isEncrypted;
                const isSafe = isSpy && isEncrypted;

                return (
                  <div key={log.step} className={`timeline-step ${isDanger ? 'danger' : ''} ${isSafe ? 'safe' : ''}`}>
                    
                    <div className="step-icon-wrap">
                      <div className={`step-icon ${isDanger ? 'icon-danger' : ''} ${isSafe ? 'icon-safe' : ''}`}>
                        {getNodeIcon(log.node)}
                      </div>
                      {idx < lastDispatch.nodeLogs.length - 1 && <div className="step-line" />}
                    </div>

                    <div className="step-content">
                      <div className="step-header">
                        <span className="step-num">#{log.step}</span>
                        <span className="step-node">{log.node}</span>
                        <span className="step-status">[{log.status}]</span>
                      </div>
                      <div className="step-protocol">{log.protocol}</div>
                      
                      <div className="step-payload-card">
                        <div className="payload-label">CONTEÚDO VISÍVEL NO NÓ:</div>
                        <div className="payload-data">{log.visibleData}</div>
                      </div>

                      <div className="step-notes">
                        {isSafe && <ShieldCheck size={12} />}
                        {isDanger && <AlertTriangle size={12} />}
                        {log.node.includes('ÍCARO') && <CheckCircle2 size={12} />}
                        <span>{log.notes}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
