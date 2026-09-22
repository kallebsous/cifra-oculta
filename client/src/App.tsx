import React, { useState, useEffect, useCallback } from 'react';
import { GamePhase, TriadMetrics, DialogueLine, Equipment, DispatchResult } from './types/game';
import { HUD } from './components/HUD';
import { DialogueBox } from './components/DialogueBox';
import { PacketInspector } from './components/PacketInspector';
import { QuizModal } from './components/QuizModal';
import { TitleScreen } from './screens/TitleScreen';
import { PhaseIntroScreen } from './screens/PhaseIntroScreen';
import { PhaseOneScreen } from './screens/PhaseOneScreen';
import { PhaseOneResultScreen } from './screens/PhaseOneResultScreen';
import { PhaseTwoScreen } from './screens/PhaseTwoScreen';
import { PhaseThreeScreen } from './screens/PhaseThreeScreen';
import { VictoryScreen } from './screens/VictoryScreen';
import { fetchEquipmentList, dispatchPacketApi } from './services/api';
import { sound } from './audio/soundEffects';
import { User, Satellite, Ghost, Search, Volume2, VolumeX, Menu } from 'lucide-react';

export const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('ENTRY');
  const [triad, setTriad] = useState<TriadMetrics>({ connection: 0, data: 0, secret: 0 });
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [equippedIds, setEquippedIds] = useState<string[]>([]);
  const [testedCardId, setTestedCardId] = useState<string | null>(null);

  // Network Visualizer state
  const [isFlying, setIsFlying] = useState(false);
  const [spyState, setSpyState] = useState<'hidden' | 'popped' | 'blocked'>('hidden');
  const [glitchText, setGlitchText] = useState<string | null>(null);
  const [isFiring, setIsFiring] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Telemetry & Modals
  const [lastDispatch, setLastDispatch] = useState<DispatchResult | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);

  // Dialogue Engine state
  const [dialogueQueue, setDialogueQueue] = useState<DialogueLine[]>([]);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueLine | null>(null);
  const [dialogueCallback, setDialogueCallback] = useState<(() => void) | null>(null);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

  // Carregar equipamentos do backend ao montar
  useEffect(() => {
    fetchEquipmentList().then(setEquipmentList).catch(console.error);
  }, []);

  // Fila de diálogo
  const queueDialogue = useCallback((lines: DialogueLine[], callback?: () => void) => {
    if (!lines || lines.length === 0) return;
    const [first, ...rest] = lines;
    setDialogueQueue(rest);
    setCurrentDialogue(first);
    setDialogueCallback(() => callback || null);
    setIsDialogueOpen(true);
  }, []);

  const advanceDialogue = useCallback(() => {
    if (dialogueQueue.length > 0) {
      const [next, ...rest] = dialogueQueue;
      setDialogueQueue(rest);
      setCurrentDialogue(next);
    } else {
      setIsDialogueOpen(false);
      setCurrentDialogue(null);
      if (dialogueCallback) {
        const cb = dialogueCallback;
        setDialogueCallback(null);
        cb();
      }
    }
  }, [dialogueQueue, dialogueCallback]);

  // Iniciar Missão (do Título para a Intro)
  const handleStartGame = () => {
    setPhase('INTRO');
    setTriad({ connection: 0, data: 0, secret: 0 });
    setIsFlying(false);
    setSpyState('hidden');
    setGlitchText(null);
    setIsFiring(false);

    queueDialogue(
      [
        {
          name: 'COMANDANTE',
          portrait: <User size={42} strokeWidth={1.5} />,
          text: 'Atenção. Uma equipe tática ficou isolada na zona de risco após um colapso nas comunicações.'
        },
        {
          name: 'COMANDANTE',
          portrait: <User size={42} strokeWidth={1.5} />,
          text: 'Nossa única ponte de resgate é o Satélite Ícaro, o último em órbita que ainda responde.'
        },
        {
          name: 'COMANDANTE',
          portrait: <User size={42} strokeWidth={1.5} />,
          text: 'Mas a rede não é mais nossa. O Agente V assumiu os nós intermediários. Se ele interceptar e ler essas coordenadas antes do resgate chegar, nossas tropas viram uma emboscada.'
        },
        {
          name: 'COMANDANTE',
          portrait: <User size={42} strokeWidth={1.5} />,
          text: 'Portanto, memorize isso: não basta o sinal chegar lá. Ele SÓ pode chegar para quem devia recebê-lo. Você está no controle do console. Aperte o botão quando estiver pronto.'
        }
      ],
      () => setPhase('PHASE_1') // Após a intro, vai para a Fase 1 e libera o disparo
    );
  };

  const handleEnter = () => {
    sound.playClick();
    sound.playBgm();
    setPhase('TITLE');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setVolume(val);
  };

  // Disparo Fase 1
  const handleFirePhaseOne = async () => {
    setIsFiring(true);
    setIsFlying(true);

    try {
      const result = await dispatchPacketApi([]);
      setLastDispatch(result);

      setTimeout(() => {
        setTriad({ connection: 100, data: 100, secret: 0 });
        setSpyState('popped');
        setGlitchText('#COORD-4471-ÍCARO#');
        sound.playAlert();

        queueDialogue(
          [
            {
              name: 'ÍCARO',
              portrait: <Satellite size={42} strokeWidth={1.5} />,
              text: 'Pacote recebido. Integridade 100%. Nenhum byte alterado no caminho.'
            },
            {
              name: 'AGENTE V',
              portrait: <Ghost size={42} strokeWidth={1.5} />,
              villain: true,
              text: 'Valeu pelas coordenadas, recruta! Copiei cada linha antes de deixar passar. Nem precisei quebrar nada — você entregou de bandeja.'
            },
            {
              name: 'COMANDANTE',
              portrait: <User size={42} strokeWidth={1.5} />,
              text: 'E não foi só ele. Olha o log do relé: três estações intermediárias também abriram o pacote sem querer, só de curiosidade.'
            },
            {
              name: 'COMANDANTE',
              portrait: <User size={42} strokeWidth={1.5} />,
              text: 'Confidencialidade não é "esconder do inimigo". É garantir que SÓ quem tem permissão consiga entender — mesmo que o pacote passe pelas mãos de todo mundo no meio do caminho.'
            },
            {
              name: 'COMANDANTE',
              portrait: <User size={42} strokeWidth={1.5} />,
              text: 'O satélite recebeu certinho, mas isso não foi vitória nenhuma. Entregar sem embaralhar é como gritar o segredo no meio da rua: a carta chega, mas todo mundo no caminho também ouve.'
            }
          ],
          () => setPhase('PHASE_1_RESULT')
        );
      }, 1450);
    } catch (err) {
      console.error('Erro no despacho da Fase 1:', err);
      setIsFiring(false);
    }
  };

  // Ir para Fase 2
  const handleGoPhaseTwo = () => {
    setPhase('PHASE_2');
    setEquippedIds([]);
    setTestedCardId(null);

    queueDialogue([
      {
        name: 'COMANDANTE',
        portrait: <User size={42} strokeWidth={1.5} />,
        text: 'Não vamos repetir esse erro. Antes de reenviar, escolha um equipamento pra transmissão.'
      },
      {
        name: 'COMANDANTE',
        portrait: <User size={42} strokeWidth={1.5} />,
        text: 'Toque em cada carta pra testar — o Agente V vai te dizer na cara se ainda consegue te ler.'
      }
    ]);
  };

  // Selecionar cartas na Fase 2
  const handleSelectCard = (id: string) => {
    setTestedCardId(id);

    if (id === 'antivirus') {
      queueDialogue([
        {
          name: 'AGENTE V',
          portrait: <Ghost size={42} strokeWidth={1.5} />,
          villain: true,
          text: 'Um firewall? Isso me impede de derrubar o link, não de ler o que passa por ele. Continue, por favor.'
        },
        {
          name: 'COMANDANTE',
          portrait: <User size={42} strokeWidth={1.5} />,
          text: 'Firewall protege a Disponibilidade — mantém o serviço de pé. Mas não esconde o conteúdo de ninguém.'
        }
      ]);
    } else if (id === 'turbo') {
      queueDialogue([
        {
          name: 'AGENTE V',
          portrait: <Ghost size={42} strokeWidth={1.5} />,
          villain: true,
          text: 'Mais rápido, é? Ótimo — assim eu perco menos tempo copiando tudo.'
        },
        {
          name: 'COMANDANTE',
          portrait: <User size={42} strokeWidth={1.5} />,
          text: 'Velocidade não esconde nada, só entrega o segredo mais rápido pra quem não devia ver.'
        }
      ]);
    } else if (id === 'lista') {
      const nowActive = !equippedIds.includes('lista');
      setEquippedIds((prev) =>
        nowActive ? [...prev.filter((c) => c !== 'lista'), 'lista'] : prev.filter((c) => c !== 'lista')
      );

      if (nowActive) {
        queueDialogue([
          {
            name: 'COMANDANTE',
            portrait: <User size={42} strokeWidth={1.5} />,
            text: 'A Lista de Acesso define QUEM pode até pedir esse dado — só terminais cadastrados recebem resposta.'
          },
          {
            name: 'AGENTE V',
            portrait: <Ghost size={42} strokeWidth={1.5} />,
            villain: true,
            text: 'Boa tentativa. Mas eu não preciso pedir educadamente — eu escuto o cabo. A lista não me impede de ouvir, só de perguntar.'
          },
          {
            name: 'COMANDANTE',
            portrait: <User size={42} strokeWidth={1.5} />,
            text: 'Ele tem razão: controle de acesso decide quem pode SOLICITAR o dado. Não esconde o conteúdo se alguém grampear a linha. É outra camada, não substitui o cofre.'
          }
        ]);
      }
    } else if (id === 'cofre') {
      setEquippedIds((prev) => (prev.includes('cofre') ? prev : [...prev, 'cofre']));

      queueDialogue([
        {
          name: 'COMANDANTE',
          portrait: <User size={42} strokeWidth={1.5} />,
          text: 'O Cofre Criptográfico embaralha a mensagem com uma chave privada antes de sair daqui.'
        },
        {
          name: 'COMANDANTE',
          portrait: <User size={42} strokeWidth={1.5} />,
          text: 'Só quem tem a chave do outro lado consegue destrancar. Pro Agente V, vai virar ruído.'
        }
      ]);
    }
  };

  // Ir para Fase 3
  const handleGoPhaseThree = () => {
    setPhase('PHASE_3');
    setIsFlying(false);
    setSpyState('hidden');
    setGlitchText(null);
    setIsFiring(false);
    setTriad({ connection: 0, data: 0, secret: 100 });

    const hasLista = equippedIds.includes('lista');
    queueDialogue(
      hasLista
        ? [
            {
              name: 'COMANDANTE',
              portrait: <User size={42} strokeWidth={1.5} />,
              text: 'Cofre travado E lista de acesso ativa. Dupla camada: mesmo quem intercepta o cabo, e mesmo quem tenta pedir o dado sem autorização, sai no zero a zero.'
            },
            {
              name: 'COMANDANTE',
              portrait: <User size={42} strokeWidth={1.5} />,
              text: 'Sem a chave, tudo que ele vai ver é embaralhado. Manda ver.'
            }
          ]
        : [
            {
              name: 'COMANDANTE',
              portrait: <User size={42} strokeWidth={1.5} />,
              text: 'Cofre travado na mensagem. Pode deixar o Agente V interceptar à vontade dessa vez.'
            },
            {
              name: 'COMANDANTE',
              portrait: <User size={42} strokeWidth={1.5} />,
              text: 'Sem a chave, tudo que ele vai ver é embaralhado. Manda ver.'
            }
          ]
    );
  };

  // Disparo Fase 3 (Cifrado)
  const handleFirePhaseThree = async () => {
    setIsFiring(true);
    setIsFlying(true);

    try {
      const result = await dispatchPacketApi(equippedIds);
      setLastDispatch(result);

      setTimeout(() => {
        setTriad({ connection: 100, data: 100, secret: 100 });
        setSpyState('blocked');
        const cipherSample = result.payload.ciphertext ? `#${result.payload.ciphertext.substring(0, 14)}...` : '#7fA$k!Nq&2Zx?%';
        setGlitchText(cipherSample);
        sound.playVictory();

        queueDialogue(
          [
            {
              name: 'AGENTE V',
              portrait: <Ghost size={42} strokeWidth={1.5} />,
              villain: true,
              text: '#&*!? ...peguei o pacote inteirinho de novo, mas isso aqui não é coordenada nenhuma. É só ruído. Inútil pra mim.'
            },
            {
              name: 'ÍCARO',
              portrait: <Satellite size={42} strokeWidth={1.5} />,
              text: 'Pacote recebido — 100%. Chave privada aplicada. Coordenadas decifradas com sucesso.'
            },
            {
              name: 'COMANDANTE',
              portrait: <User size={42} strokeWidth={1.5} />,
              text: 'Aí sim. O pacote chegou inteiro pro Ícaro E virou lixo ilegível pra quem interceptou. Isso é Confidencialidade.'
            },
            {
              name: 'COMANDANTE',
              portrait: <User size={42} strokeWidth={1.5} />,
              text: 'Repara: o Agente V nunca foi impedido de capturar o pacote. Só foi impedido de entender ele.'
            },
            {
              name: 'COMANDANTE',
              portrait: <User size={42} strokeWidth={1.5} />,
              text: 'Uma última coisa antes de comemorar: o segredo agora é a chave. Se ela vazar, cai tudo junto — proteger uma mensagem cifrada é, no fundo, proteger quem guarda a chave.'
            }
          ],
          () => setPhase('VICTORY')
        );
      }, 1450);
    } catch (err) {
      console.error('Erro no despacho da Fase 3:', err);
      setIsFiring(false);
    }
  };

  // Reiniciar
  const handleRestart = () => {
    setEquippedIds([]);
    setTestedCardId(null);
    setTriad({ connection: 0, data: 0, secret: 0 });
    setPhase('TITLE');
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const isHudVisible = phase !== 'TITLE' && phase !== 'ENTRY';

  return (
    <div className="app-container">
      {/* Decoração Persona 5 */}
      <div className="slash-decor">
        <i className="s1" />
        <i className="s2" />
        <i className="s3" />
        <i className="s4" />
      </div>

      {/* Barra de utilitários superior */}
      <div className={`top-toolbar ${isMobileMenuOpen ? 'open' : ''}`}>
        <button 
          className="tool-btn mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          title="Menu"
        >
          <Menu size={18} />
        </button>

        <div className="top-toolbar-content">
          <button
            className={`tool-btn ${isInspectorOpen ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              setIsInspectorOpen((prev) => !prev);
              setIsMobileMenuOpen(false);
            }}
            title="Ver o fluxo de dados em texto puro ou cifrado"
          >
            <Search size={14} /> <span>INSPECIONAR PACOTE</span> {lastDispatch ? '●' : ''}
          </button>

          <div className="volume-control-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '0 8px', border: '1px solid var(--paper-dim)' }}>
            <button
              className="tool-btn"
              onClick={toggleSound}
              title={isMuted ? 'Ativar som' : 'Silenciar som'}
              style={{ border: 'none', padding: '6px 8px', margin: 0, height: 'auto' }}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={volume} 
              onChange={handleVolumeChange} 
              style={{ width: '80px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* HUD Tríade CIA */}
      <HUD triad={triad} visible={isHudVisible} />

      {/* Overlay de Entrada */}
      {phase === 'ENTRY' && (
        <div className="entry-overlay" onClick={handleEnter}>
          <div className="blink">CLIQUE PARA INICIAR O SISTEMA</div>
        </div>
      )}

      {/* Telas do Jogo */}
      <div className={`screen ${phase === 'TITLE' ? 'active' : ''}`}>
        <TitleScreen onStart={handleStartGame} />
      </div>

      <div className={`screen ${phase === 'INTRO' ? 'active' : ''}`}>
        <PhaseIntroScreen />
      </div>

      <div className={`screen ${phase === 'PHASE_1' ? 'active' : ''}`}>
        <PhaseOneScreen
          onFire={handleFirePhaseOne}
          isFlying={isFlying}
          spyState={spyState}
          glitchText={glitchText}
          disabled={isFiring}
        />
      </div>

      <div className={`screen ${phase === 'PHASE_1_RESULT' ? 'active' : ''}`}>
        <PhaseOneResultScreen
          onContinue={handleGoPhaseTwo}
          onOpenInspector={() => setIsInspectorOpen(true)}
        />
      </div>

      <div className={`screen ${phase === 'PHASE_2' ? 'active' : ''}`}>
        <PhaseTwoScreen
          equipmentList={equipmentList}
          equippedIds={equippedIds}
          testedCardId={testedCardId}
          onSelectCard={handleSelectCard}
          onContinue={handleGoPhaseThree}
        />
      </div>

      <div className={`screen ${phase === 'PHASE_3' ? 'active' : ''}`}>
        <PhaseThreeScreen
          onFire={handleFirePhaseThree}
          isFlying={isFlying}
          spyState={spyState}
          glitchText={glitchText}
          disabled={isFiring}
          hasLista={equippedIds.includes('lista')}
        />
      </div>

      <div className={`screen ${phase === 'VICTORY' ? 'active' : ''}`}>
        <VictoryScreen
          onRestart={handleRestart}
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenInspector={() => setIsInspectorOpen(true)}
        />
      </div>

      {/* Caixa de Diálogo */}
      <DialogueBox
        isOpen={isDialogueOpen}
        currentLine={currentDialogue}
        onAdvance={advanceDialogue}
        variant={phase === 'INTRO' ? 'top' : 'bottom'}
      />

      {/* Drawer do Terminal Inspetor de Pacote */}
      <PacketInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        lastDispatch={lastDispatch}
      />

      {/* Modal do Mini-Quiz Pedagógico */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </div>
  );
};
