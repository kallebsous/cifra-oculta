import React from 'react';

export const RecapMatrix: React.FC = () => {
  return (
    <div className="recap-table">
      <div className="row">
        <div>PILAR DA TRÍADE</div>
        <div>FASE 1 (DESPROTEGIDO)</div>
        <div>FASE 3 (CIFRA ATIVA)</div>
      </div>
      <div className="row">
        <div>Conexão (Disponibilidade)</div>
        <div className="safe-text">Chegou 100%</div>
        <div className="safe-text">Chegou 100%</div>
      </div>
      <div className="row">
        <div>Dados (Integridade)</div>
        <div className="safe-text">Intacto 100%</div>
        <div className="safe-text">Intacto 100%</div>
      </div>
      <div className="row">
        <div>Segredo (Confidencialidade)</div>
        <div className="leak-text">Vazou 0%</div>
        <div className="safe-text">Protegido 100%</div>
      </div>
      <div className="row">
        <div>Quem conseguia ler</div>
        <div className="leak-text">Qualquer nó da rota</div>
        <div className="safe-text">Apenas quem tem a chave</div>
      </div>
    </div>
  );
};
