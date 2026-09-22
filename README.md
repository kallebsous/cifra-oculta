# Operação Cifra Oculta

Bem-vindo ao repositório de **Operação Cifra Oculta**, um minigame web educativo construído para ensinar o pilar da **Confidencialidade** na segurança da informação, utilizando uma estética de anime/espionagem (Persona 5 style).

## 🏗️ Arquitetura do Projeto

Este projeto utiliza uma arquitetura **Monorepo** separada em duas partes principais:

### 1. `client/` (Frontend)
- **Tecnologias:** React 18, TypeScript, Vite, CSS puro.
- **Ícones e Áudio:** Utiliza `lucide-react` para iconografia SVG nítida e nativa, e Web Audio API (`soundEffects.ts`) para geração procedural de efeitos sonoros retro e gerenciamento de trilha sonora (BGM).
- **Estrutura Principal:**
  - `src/App.tsx`: Gerencia as fases do jogo (`ENTRY`, `TITLE`, `INTRO`, `PHASE_1`, `PHASE_2`, etc) e contém o Motor de Diálogos.
  - `src/components/`: Componentes modulares de interface (HUD, DialogueBox, NetworkViz, PacketInspector).
  - `src/screens/`: Telas de cada fase do jogo isoladas.
  - `src/audio/`: Gestão de áudios e playlist musical.

### 2. `server/` (Backend)
- **Tecnologias:** Node.js, Express.
- **Responsabilidade:** Simula as respostas da rede e valida se a tríade CIA foi respeitada. Ele fornece os equipamentos (Cofre Criptográfico, Lista de Permissão) e determina se o pacote foi interceptado no caminho pelo Agente V.
- **Estrutura Principal:**
  - `src/index.js`: Roteador Express e servidor principal (porta 3001).
  - `src/simulation.js`: Lógica do simulador de rede para calcular métricas da tríade CIA baseando-se nos equipamentos selecionados.
  - `src/quizData.js`: Dados e validação para o Quiz pedagógico final.

## 🚀 Como Rodar

O repositório é configurado com ferramentas para rodar simultaneamente os dois ambientes:

1. Instale as dependências na raiz (isso instalará client e server simultaneamente):
   ```bash
   npm install
   ```

2. Inicie os servidores de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O backend rodará na porta `3001` e o frontend usará o proxy do Vite (`5173`).*

## 🎨 Design e UI
- **Estética:** O CSS faz uso extensivo de `clip-path` para criar caixas angulares. Cores de alto contraste (`--gold`, `--red`, `--ink`) e animações de glitch ajudam na imersão narrativa.
- **Responsividade:** Layout preparado para adaptar-se em visualizações de desktop e terminais.

*Divirta-se configurando pacotes seguros e escapando do Agente V!*
