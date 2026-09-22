import React from 'react';

export type GamePhase =
  | 'ENTRY'
  | 'TITLE'
  | 'INTRO'
  | 'PHASE_1'
  | 'PHASE_1_RESULT'
  | 'PHASE_2'
  | 'PHASE_3'
  | 'VICTORY';

export interface TriadMetrics {
  connection: number;
  data: number;
  secret: number;
}

export interface DialogueLine {
  name: string;
  portrait: React.ReactNode;
  text: string;
  villain?: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  icon: string;
  pillar: string;
  desc: string;
  spyRebuttal: string;
  pedagogicalTip: string;
}

export interface NodeLog {
  step: number;
  node: string;
  status: string;
  protocol: string;
  visibleData: string;
  notes: string;
  integrityCheck?: string;
}

export interface DispatchResult {
  success: boolean;
  timestamp: string;
  equipmentUsed: string[];
  stats: {
    hasCofre: boolean;
    hasLista: boolean;
    hasAntivirus: boolean;
    hasTurbo: boolean;
    transitSpeedMs: number;
  };
  triad: TriadMetrics;
  payload: {
    original: string;
    isEncrypted: boolean;
    ciphertext: string | null;
    iv: string | null;
    authTag: string | null;
    hashSha256: string;
  };
  nodeLogs: NodeLog[];
  summary: {
    outcome: string;
    verdict: string;
  };
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface QuizEvaluationResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  title: string;
  badge: string;
  feedback: {
    questionId: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}
