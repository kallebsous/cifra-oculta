import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { simulateDispatch } from './simulation.js';
import { QUIZ_QUESTIONS } from './quizData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, '../../client/dist');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Operação Cifra Oculta Backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Lista de Equipamentos disponíveis
app.get('/api/equipment', (req, res) => {
  res.json({
    equipment: [
      {
        id: 'antivirus',
        name: 'Antivírus / Firewall',
        icon: 'shield',
        pillar: 'DISPONIBILIDADE',
        desc: 'Bloqueia ataques diretos e pacotes maliciosos contra o sistema.',
        spyRebuttal: 'Um firewall? Isso me impede de derrubar o link, não de ler o que passa por ele. Continue, por favor.',
        pedagogicalTip: 'Firewall protege a Disponibilidade e o perímetro, mas não esconde o conteúdo em trânsito.'
      },
      {
        id: 'turbo',
        name: 'Turbo de Propulsão',
        icon: 'rocket',
        pillar: 'VELOCIDADE',
        desc: 'Acelera a velocidade de transmissão dos pacotes pela rota.',
        spyRebuttal: 'Mais rápido, é? Ótimo — assim eu perco menos tempo copiando tudo.',
        pedagogicalTip: 'Velocidade não esconde nada, só entrega o segredo mais rápido para quem não deveria ver.'
      },
      {
        id: 'lista',
        name: 'Lista de Acesso',
        icon: 'clipboard',
        pillar: 'CONTROLE DE ACESSO',
        desc: 'Só libera a leitura para quem está formalmente autorizado a pedir o dado.',
        spyRebuttal: 'Boa tentativa. Mas eu não preciso pedir educadamente — eu escuto o cabo. A lista não me impede de ouvir, só de perguntar.',
        pedagogicalTip: 'Controle de acesso decide quem tem direito de solicitar o dado. Se houver escuta no canal (sniffing), precisa de criptografia junto.'
      },
      {
        id: 'cofre',
        name: 'Cofre Criptográfico',
        icon: 'lock',
        pillar: 'CRIPTOGRAFIA (CONFIDENCIALIDADE)',
        desc: 'Tranca e embaralha o pacote com chave privada antes de entrar na rede pública.',
        spyRebuttal: '#&*!? ...peguei o pacote inteirinho de novo, mas isso aqui não é coordenada nenhuma. É só ruído. Inútil pra mim.',
        pedagogicalTip: 'Criptografia garante a Confidencialidade tornando o texto ininteligível para qualquer interceptador sem a chave.'
      }
    ]
  });
});

// Despacho de pacote e simulação de rota
app.post('/api/dispatch', (req, res) => {
  const { equipment = [], customPayload } = req.body;
  const result = simulateDispatch({ equipment, customPayload });
  res.json(result);
});

// Obter perguntas do mini-quiz
app.get('/api/quiz', (req, res) => {
  // Retorna perguntas sem indicar o flag 'correct' no payload inicial para evitar trapaça
  const sanitizedQuestions = QUIZ_QUESTIONS.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options.map(opt => ({ id: opt.id, text: opt.text }))
  }));
  res.json({ questions: sanitizedQuestions });
});

// Avaliação de respostas do quiz
app.post('/api/quiz/evaluate', (req, res) => {
  const { answers = {} } = req.body; // { "1": "B", "2": "A", "3": "B" }
  let score = 0;
  const total = QUIZ_QUESTIONS.length;
  const feedback = [];

  for (const q of QUIZ_QUESTIONS) {
    const userAnswer = answers[q.id];
    const correctOpt = q.options.find(o => o.correct);
    const isCorrect = userAnswer === correctOpt?.id;

    if (isCorrect) score += 1;

    feedback.push({
      questionId: q.id,
      question: q.question,
      userAnswer,
      correctAnswer: correctOpt?.id,
      isCorrect,
      explanation: q.explanation
    });
  }

  const passed = score === total;

  res.json({
    score,
    total,
    percentage: Math.round((score / total) * 100),
    passed,
    title: passed ? "ESPECIALISTA EM CONFIDENCIALIDADE" : "AGENTE EM TREINAMENTO",
    badge: passed ? "MASTER_CIPHER_CERTIFIED" : "NOVICE_DISPATCHER",
    feedback
  });
});

// Servir frontend compilado caso exista
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Cifra Oculta] Backend rodando na porta ${PORT}`);
  if (fs.existsSync(clientDist)) {
    console.log(`[Cifra Oculta] Frontend integrado disponível em http://localhost:${PORT}`);
  }
});

