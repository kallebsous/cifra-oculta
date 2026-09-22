import { Equipment, DispatchResult, QuizQuestion, QuizEvaluationResult } from '../types/game';

const API_BASE = '/api';

export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Falha no health check');
  return res.json();
}

export async function fetchEquipmentList(): Promise<Equipment[]> {
  try {
    const res = await fetch(`${API_BASE}/equipment`);
    if (!res.ok) throw new Error('Falha ao obter equipamentos');
    const data = await res.json();
    return data.equipment;
  } catch (err) {
    console.warn('[API] Usando lista de equipamentos local de fallback', err);
    return [
      {
        id: 'antivirus',
        name: 'Antivírus / Firewall',
        icon: '🛡️',
        pillar: 'DISPONIBILIDADE',
        desc: 'Bloqueia ataques ao pacote.',
        spyRebuttal: 'Um firewall? Isso me impede de derrubar o link, não de ler o que passa por ele. Continue, por favor.',
        pedagogicalTip: 'Firewall protege a Disponibilidade, mas não esconde o conteúdo em trânsito.'
      },
      {
        id: 'turbo',
        name: 'Turbo de Propulsão',
        icon: '🚀',
        pillar: 'VELOCIDADE',
        desc: 'Faz o pacote voar mais rápido.',
        spyRebuttal: 'Mais rápido, é? Ótimo — assim eu perco menos tempo copiando tudo.',
        pedagogicalTip: 'Velocidade não esconde nada, só entrega o segredo mais rápido.'
      },
      {
        id: 'lista',
        name: 'Lista de Acesso',
        icon: '📋',
        pillar: 'CONTROLE DE ACESSO',
        desc: 'Só libera a leitura pra quem está autorizado a pedir.',
        spyRebuttal: 'Boa tentativa. Mas eu não preciso pedir educadamente — eu escuto o cabo. A lista não me impede de ouvir, só de perguntar.',
        pedagogicalTip: 'Controle de acesso decide quem pode solicitar o dado. Não esconde se alguém grampear a linha.'
      },
      {
        id: 'cofre',
        name: 'Cofre Criptográfico',
        icon: '🔒',
        pillar: 'CRIPTOGRAFIA (CONFIDENCIALIDADE)',
        desc: 'Tranca a mensagem com uma chave privada.',
        spyRebuttal: '#&*!? ...peguei o pacote inteirinho de novo, mas isso aqui não é coordenada nenhuma. É só ruído. Inútil pra mim.',
        pedagogicalTip: 'Criptografia garante a Confidencialidade tornando o texto ininteligível para interceptadores.'
      }
    ];
  }
}

export async function dispatchPacketApi(equipment: string[], customPayload?: string): Promise<DispatchResult> {
  // Simula latência de rede realista (400ms a 1200ms dependendo do equipamento)
  const hasTurbo = equipment.includes('turbo');
  const delay = hasTurbo ? 400 : 1200;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return simulateDispatchFallback(equipment, customPayload);
}

export async function fetchQuiz(): Promise<QuizQuestion[]> {
  // Simula latência de rede leve
  await new Promise(resolve => setTimeout(resolve, 300));
  return FALLBACK_QUIZ;
}

export async function evaluateQuizApi(answers: Record<number, string>): Promise<QuizEvaluationResult> {
  // Simula latência de processamento
  await new Promise(resolve => setTimeout(resolve, 500));
  return simulateQuizEvaluation(answers);
}

// --- FALLBACK LOGIC PARA VERCEL (FRONTEND ONLY) ---

function simulateDispatchFallback(equipment: string[], customPayload?: string): DispatchResult {
  const payload = customPayload || "COORD-4471-ÍCARO [LAT: -23.5505, LON: -46.6333, ALT: 420km, AZ: 128.4°]";
  const hasCofre = equipment.includes('cofre');
  const hasLista = equipment.includes('lista');
  const hasAntivirus = equipment.includes('antivirus');
  const hasTurbo = equipment.includes('turbo');

  const fakeHash = Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
  const fakeIv = Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join('');
  
  let encryptedPayload = null;
  let decryptedText = null;
  if (hasCofre) {
    encryptedPayload = Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');
    decryptedText = payload;
  }

  const nodeLogs = [
    {
      step: 1,
      node: "CONSOLE TERRESTRE",
      status: "DISPATCHED",
      protocol: hasCofre ? "TLS 1.3 / AES-256-GCM" : "RAW / HTTP PLAINTEXT",
      visibleData: hasCofre ? `CIPHERTEXT: ${encryptedPayload?.substring(0, 24)}... (IV: ${fakeIv})` : payload,
      notes: hasLista ? "Controle de Acesso: Token de autorização assinado anexado." : "Sem restrição de requisição."
    },
    {
      step: 2,
      node: "ESTAÇÃO RELÉ ALFA",
      status: "FORWARDED",
      protocol: "PACKET INSPECT",
      visibleData: hasCofre ? "[BLOCO ILEGÍVEL DE BYTES]" : payload,
      notes: hasCofre ? "Relé encaminhou sem conseguir ler o miolo." : "Operador do relé leu as coordenadas completas no log de auditoria."
    },
    {
      step: 3,
      node: "AGENTE V (SNIFFER / TAP)",
      status: "INTERCEPTED",
      protocol: "PROMISCUOUS TAP",
      visibleData: hasCofre ? `#&7f!$*0x${encryptedPayload?.substring(0, 16)} [SEM CHAVE PRIVADA]` : payload,
      notes: hasCofre
        ? "Agente V capturou 100% dos bytes, mas sem a chave privada de Ícaro só obteve entropia inútil."
        : "Vazamento total! Agente V copiou coordenadas de lançamento sem deixar vestígios."
    },
    {
      step: 4,
      node: "SATÉLITE ÍCARO",
      status: "RECEIVED",
      protocol: "FINAL DESTINATION",
      visibleData: hasCofre ? `DECIFRADO: ${decryptedText}` : payload,
      integrityCheck: `SHA-256: ${fakeHash} (CONFERE)`,
      notes: "Sinal recebido. " + (hasCofre ? "Chave privada combinada com sucesso." : "Conteúdo recebido em claro.")
    }
  ];

  return {
    success: true,
    timestamp: new Date().toISOString(),
    equipmentUsed: equipment,
    stats: { hasCofre, hasLista, hasAntivirus, hasTurbo, transitSpeedMs: hasTurbo ? 400 : 1200 },
    triad: { connection: 100, data: 100, secret: hasCofre ? 100 : 0 },
    payload: { original: payload, isEncrypted: hasCofre, ciphertext: encryptedPayload || null, iv: fakeIv, authTag: "fake-auth", hashSha256: fakeHash },
    nodeLogs,
    summary: {
      outcome: hasCofre ? "VITÓRIA CIFRADA" : "DERROTA SILENCIOSA",
      verdict: hasCofre ? "Confidencialidade mantida: o pacote foi capturado, mas a mensagem permaneceu secreta." : "Falha de Confidencialidade: a entrega funcionou, mas o segredo vazou."
    }
  };
}

interface FallbackQuizOption {
  id: string;
  text: string;
  correct?: boolean;
}

interface FallbackQuizQuestion {
  id: number;
  question: string;
  options: FallbackQuizOption[];
  explanation: string;
}

const FALLBACK_QUIZ_DATA: FallbackQuizQuestion[] = [
  {
    id: 1,
    question: "Por que o Firewall não impediu o Agente V de ler as coordenadas?",
    options: [
      { id: "A", text: "Porque o Agente V já possuía a chave privada de decifração." },
      { id: "B", text: "Porque firewalls protegem a Disponibilidade e tráfego não autorizado, mas não alteram a legibilidade de dados interceptados em trânsito.", correct: true },
      { id: "C", text: "Porque o firewall apenas diminui a velocidade de entrega do sinal." },
      { id: "D", text: "Porque firewalls só funcionam quando combinados com turbo de propulsão." }
    ],
    explanation: "Firewalls atuam filtrando portas e pacotes suspeitos para manter a disponibilidade e integridade do perímetro. Contudo, dados trafegando em texto puro (HTTP/plaintext) podem ser espionados por qualquer nó ou sniffer na rota."
  },
  {
    id: 2,
    question: "Qual é a diferença essencial entre Controle de Acesso e Criptografia?",
    options: [
      { id: "A", text: "Controle de Acesso define QUEM pode solicitar o dado; Criptografia esconde o CONTEÚDO caso o tráfego seja interceptado.", correct: true },
      { id: "B", text: "São nomes diferentes para a mesma tecnologia de proteção por senha." },
      { id: "C", text: "Controle de Acesso protege a integridade e Criptografia protege a velocidade." },
      { id: "D", text: "Criptografia é apenas para servidores web, enquanto controle de acesso é para satélites." }
    ],
    explanation: "São camadas complementares! A Lista de Acesso impede que nós não autorizados façam requisições legítimas. Já a Criptografia garante que, mesmo com escuta clandestina no canal (eavesdropping/MITM), a mensagem seja ininteligível sem a chave."
  },
  {
    id: 3,
    question: "Ao cifrar uma mensagem secreta, onde passa a residir a responsabilidade de segurança?",
    options: [
      { id: "A", text: "No cabo físico de transmissão, que não pode ser rompido." },
      { id: "B", text: "Na custódia e guarda da Chave Privada de decifração.", correct: true },
      { id: "C", text: "A responsabilidade acaba, pois mensagens cifradas são imunes a qualquer ataque." },
      { id: "D", text: "Exclusivamente no provedor de internet do satélite." }
    ],
    explanation: "A criptografia transforma o segredo do texto no segredo da chave. Proteger uma mensagem cifrada é, na prática, proteger a custódia das chaves criptográficas (gerenciamento de chaves / KMS)."
  }
];

const FALLBACK_QUIZ: QuizQuestion[] = FALLBACK_QUIZ_DATA.map(q => ({
  id: q.id,
  question: q.question,
  options: q.options.map(o => ({ id: o.id, text: o.text }))
}));

function simulateQuizEvaluation(answers: Record<number, string>): QuizEvaluationResult {
  let score = 0;
  const feedback = [];
  for (const q of FALLBACK_QUIZ_DATA) {
    const userAnswer = answers[q.id];
    const correctOption = q.options.find(o => o.correct);
    const isCorrect = userAnswer === correctOption?.id;
    if (isCorrect) score++;
    feedback.push({
      questionId: q.id,
      question: q.question,
      userAnswer: userAnswer || '',
      correctAnswer: correctOption?.id || '',
      isCorrect: isCorrect,
      explanation: q.explanation
    });
  }
  
  const percentage = (score / FALLBACK_QUIZ_DATA.length) * 100;
  const passed = score === FALLBACK_QUIZ_DATA.length;

  return {
    score,
    total: FALLBACK_QUIZ_DATA.length,
    percentage,
    passed,
    title: passed ? "OPERAÇÃO CONCLUÍDA" : "FALHA NA OPERAÇÃO",
    badge: passed ? "Mestre da Confidencialidade" : "Recruta em Treinamento",
    feedback
  };
}
