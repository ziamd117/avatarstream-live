// Voice Synthesis Service with ElevenLabs Integration
export interface VoiceConfig {
  voiceId: string;
  stability: number;
  similarityBoost: number;
  style: number;
  speakerBoost: boolean;
}

export interface SynthesisOptions {
  text: string;
  voiceConfig: VoiceConfig;
  outputFormat?: 'mp3' | 'wav';
}

export class VoiceSynthesisService {
  private apiKey: string | null = null;
  private speechSynthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.initializeBrowserSynthesis();
  }

  private initializeBrowserSynthesis() {
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
      this.loadVoices();
      
      // Load voices when they become available
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.speechSynthesis) {
      this.voices = this.speechSynthesis.getVoices();
    }
  }

  setElevenLabsApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async synthesizeWithElevenLabs(options: SynthesisOptions): Promise<Blob | null> {
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not set, using browser synthesis');
      return this.synthesizeWithBrowser(options.text, options.voiceConfig.voiceId);
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${options.voiceConfig.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: options.text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: options.voiceConfig.stability,
            similarity_boost: options.voiceConfig.similarityBoost,
            style: options.voiceConfig.style,
            use_speaker_boost: options.voiceConfig.speakerBoost,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('ElevenLabs synthesis failed:', error);
      return this.synthesizeWithBrowser(options.text, options.voiceConfig.voiceId);
    }
  }

  private synthesizeWithBrowser(text: string, voiceId?: string): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.speechSynthesis) {
        resolve(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find voice by ID or use default
      if (voiceId) {
        const voice = this.voices.find(v => v.voiceURI === voiceId || v.name === voiceId);
        if (voice) {
          utterance.voice = voice;
        }
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        // Browser synthesis doesn't return blob, so we resolve with null
        resolve(null);
      };

      utterance.onerror = () => {
        resolve(null);
      };

      this.speechSynthesis.speak(utterance);
    });
  }

  async speakText(text: string, voiceConfig?: Partial<VoiceConfig>): Promise<void> {
    const defaultConfig: VoiceConfig = {
      voiceId: 'Aria', // Default ElevenLabs voice
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.0,
      speakerBoost: true,
    };

    const config = { ...defaultConfig, ...voiceConfig };

    try {
      const audioBlob = await this.synthesizeWithElevenLabs({
        text,
        voiceConfig: config,
      });

      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        await audio.play();
        
        // Clean up
        audio.onended = () => URL.revokeObjectURL(audioUrl);
      }
    } catch (error) {
      console.error('Voice synthesis failed:', error);
    }
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  getElevenLabsVoices() {
    // Popular ElevenLabs voices with their IDs
    return [
      { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', description: 'Professional female voice' },
      { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', description: 'Authoritative male voice' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Warm female narrator' },
      { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Clear male educator' },
      { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'Gentle female teacher' },
    ];
  }

  stop() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  isSupported(): boolean {
    return !!this.speechSynthesis;
  }
}

export const voiceSynthesisService = new VoiceSynthesisService();