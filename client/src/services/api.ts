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
  const res = await fetch(`${API_BASE}/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ equipment, customPayload })
  });
  if (!res.ok) throw new Error('Erro ao despachar pacote');
  return res.json();
}

export async function fetchQuiz(): Promise<QuizQuestion[]> {
  const res = await fetch(`${API_BASE}/quiz`);
  if (!res.ok) throw new Error('Erro ao carregar quiz');
  const data = await res.json();
  return data.questions;
}

export async function evaluateQuizApi(answers: Record<number, string>): Promise<QuizEvaluationResult> {
  const res = await fetch(`${API_BASE}/quiz/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  });
  if (!res.ok) throw new Error('Erro ao submeter quiz');
  return res.json();
}
