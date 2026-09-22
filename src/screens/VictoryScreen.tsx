import React from 'react';
import './Screens.css';
import { RecapMatrix } from '../components/RecapMatrix';
import { sound } from '../audio/soundEffects';

interface VictoryScreenProps {
  onRestart: () => void;
  onOpenQuiz: () => void;
  onOpenInspector: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  onRestart,
  onOpenQuiz,
  onOpenInspector
}) => {
  return (
    <div className="stage" style={{ paddingBottom: '160px' }}>
      <div className="result-banner win">VITÓRIA CIFRADA</div>
      <div className="stars">
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>

      <p className="stage-sub" style={{ maxWidth: '600px' }}>
        O espião capturou o pacote inteiro — e só viu símbolos ilegíveis. Só quem tem a chave privada pode ler.
      </p>

      <RecapMatrix />

      <p className="stage-sub" style={{ marginTop: '20px', maxWidth: '640px' }}>
        <b>Lição da missão:</b> perder o segredo não quebra o sistema. O pacote pode chegar inteiro e a missão
        ainda fracassar — se olhos não autorizados lerem o conteúdo.
      </p>

      <p className="stage-sub" style={{ marginTop: '-8px', maxWidth: '640px', fontSize: '15px' }}>
        Confidencialidade tem duas camadas complementares: <b>criptografia</b> esconde o conteúdo de quem intercepta,
        e <b>controle de acesso</b> decide quem tem permissão para solicitar o dado. Nenhuma das duas sozinha basta —
        e a chave da criptografia vira, ela mesma, o novo segredo a proteger.
      </p>

      <div className="btn-row">
        <button
          className="btn gold"
          onClick={() => {
            sound.playClick();
            onOpenQuiz();
          }}
        >
          📝 FAZER TESTE DE FIXAÇÃO
        </button>

        <button
          className="btn ghost"
          onClick={() => {
            sound.playClick();
            onOpenInspector();
          }}
        >
          🔍 INSPECIONAR TELEMETRIA
        </button>

        <button
          className="btn ghost"
          onClick={() => {
            sound.playClick();
            onRestart();
          }}
        >
          🔄 JOGAR NOVAMENTE
        </button>
      </div>
    </div>
  );
};
