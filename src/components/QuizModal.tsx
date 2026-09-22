import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizEvaluationResult } from '../types/game';
import { fetchQuiz, evaluateQuizApi } from '../engine/gameEngine';
import { sound } from '../audio/soundEffects';
import './QuizModal.css';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<QuizEvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchQuiz()
        .then((q) => {
          setQuestions(q);
          setAnswers({});
          setCurrentIndex(0);
          setResult(null);
        })
        .catch((err) => console.error('Erro ao buscar perguntas do quiz:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (!currentQ) return;
    sound.playClick();
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Submeter ao backend
      setLoading(true);
      evaluateQuizApi(answers)
        .then((res) => {
          setResult(res);
          if (res.passed) {
            sound.playVictory();
          } else {
            sound.playAlert();
          }
        })
        .catch((err) => console.error('Erro na avaliação do quiz:', err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="quiz-overlay">
      <div className="quiz-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="quiz-title">
            {result ? 'RESULTADO DA AVALIAÇÃO' : `TESTE DE FIXAÇÃO — PERGUNTA ${currentIndex + 1}/${questions.length}`}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--paper)',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--gold)', fontFamily: 'Space Mono' }}>PROCESSANDO DADOS NO SERVIDOR...</p>
        ) : result ? (
          <div>
            <div
              style={{
                fontSize: '22px',
                fontFamily: 'Bebas Neue',
                color: result.passed ? 'var(--safe)' : 'var(--gold)',
                marginBottom: '8px'
              }}
            >
              {result.title} — NOTA: {result.score}/{result.total} ({result.percentage}%)
            </div>

            <div style={{ maxHeight: '380px', overflowY: 'auto', marginBottom: '16px' }}>
              {result.feedback.map((item, idx) => (
                <div
                  key={item.questionId}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    padding: '10px 12px',
                    marginBottom: '10px',
                    borderLeft: `4px solid ${item.isCorrect ? 'var(--safe)' : 'var(--leak)'}`
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>
                    #{idx + 1}. {item.question}
                  </div>
                  <div style={{ fontSize: '14px', margin: '4px 0', color: item.isCorrect ? 'var(--safe)' : 'var(--leak)' }}>
                    Sua resposta: {item.userAnswer || 'Nenhuma'} {item.isCorrect ? '✔ Correta' : `✖ Incorreta (Certa: ${item.correctAnswer})`}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--paper-dim)' }}>
                    {item.explanation}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn" onClick={onClose}>
              CONCLUIR REVISÃO
            </button>
          </div>
        ) : currentQ ? (
          <div>
            <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--paper)', margin: '10px 0 18px' }}>
              {currentQ.question}
            </p>

            <div>
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    className={`quiz-opt ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(opt.id)}
                  >
                    <b>{opt.id})</b> {opt.text}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                className="btn"
                disabled={!answers[currentQ.id]}
                onClick={handleNext}
              >
                {currentIndex === questions.length - 1 ? 'ENVIAR RESPOSTAS' : 'PRÓXIMA PERGUNTA'}
              </button>
            </div>
          </div>
        ) : (
          <p>Nenhuma pergunta disponível.</p>
        )}
      </div>
    </div>
  );
};
