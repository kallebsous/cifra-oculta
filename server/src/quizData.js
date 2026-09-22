export const QUIZ_QUESTIONS = [
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
