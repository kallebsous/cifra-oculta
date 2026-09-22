import timaoMp3 from './timao.mp3';
import cabulosoMp3 from './cabuloso.mp3';
import santasticoMp3 from './santastico.mp3';

const playlist = [timaoMp3, cabulosoMp3, santasticoMp3];

// Gerador de efeitos sonoros procedural com Web Audio API nativa
class SoundSystem {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private bgm: HTMLAudioElement | null = null;
  public globalVolume: number = 1.0;
  private lastTrackIndex: number = -1;

  constructor() {
    this.bgm = new Audio();
    this.bgm.volume = 0.4 * this.globalVolume;

    this.bgm.addEventListener('ended', () => {
      this.playNextRandomTrack(true);
    });

    this.playNextRandomTrack(false);
  }

  private playNextRandomTrack(autoplay: boolean) {
    if (!this.bgm) return;
    
    let nextIndex = Math.floor(Math.random() * playlist.length);
    // Evita repetir a mesma música logo em seguida
    if (playlist.length > 1 && nextIndex === this.lastTrackIndex) {
      nextIndex = (nextIndex + 1) % playlist.length;
    }
    
    this.lastTrackIndex = nextIndex;
    this.bgm.src = playlist[nextIndex];
    this.bgm.load();

    if (autoplay && !this.isMuted) {
      this.bgm.play().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.globalVolume = vol;
    if (this.bgm) {
      this.bgm.volume = 0.4 * this.globalVolume;
    }
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    
    if (this.bgm) {
      if (this.isMuted) {
        this.bgm.pause();
      } else {
        // Only attempt to play if it was already playing, or let the user click play
        this.bgm.play().catch(() => {});
      }
    }
    
    return this.isMuted;
  }

  public playBgm() {
    if (!this.isMuted && this.bgm && this.bgm.paused) {
      this.bgm.play().catch(() => {});
    }
  }

  // Clique mecânico de interface
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.18 * this.globalVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  // Blip de texto/diálogo estilo JRPG
  public playDialogueBlip(villain = false) {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = villain ? 'sawtooth' : 'sine';
    const freq = villain ? 220 : 540;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq + 40, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.08 * this.globalVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }

  // Disparo de pacote (swoosh)
  public playSwoosh() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.12 * this.globalVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  }

  // Sirene/Alerta de vazamento de segredo
  public playAlert() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [320, 310, 480].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.15 * this.globalVolume, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + (idx + 1) * 0.12);
    });
  }

  // Acorde de equipar carta
  public playCardEquip() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.12 * this.globalVolume, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.2);
    });
  }

  // Fanfarra triunfante de vitória cifrada
  public playVictory() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.18 * this.globalVolume, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    });
  }
}

export const sound = new SoundSystem();
