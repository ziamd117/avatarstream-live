// Speech Recognition and Subtitles Service
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types/global';
export interface SubtitleLine {
  id: string;
  text: string;
  timestamp: number;
  confidence: number;
  isInterim: boolean;
}

export class SpeechToTextService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onSubtitleCallback: ((subtitle: SubtitleLine) => void) | null = null;
  private huggingFaceModel: any = null;

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    // Check for browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition() as SpeechRecognition;
      
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event) => {
        this.handleSpeechResult(event);
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // Restart if we're supposed to be listening
          this.recognition?.start();
        }
      };
    } else {
      console.warn('Speech Recognition not supported in this browser');
      this.initializeFallbackRecognition();
    }
  }

  private async initializeFallbackRecognition() {
    try {
      // Fallback to Hugging Face Transformers for speech recognition
      const { pipeline } = await import('@huggingface/transformers');
      this.huggingFaceModel = await pipeline(
        'automatic-speech-recognition',
        'onnx-community/whisper-tiny.en',
        { device: 'webgpu' }
      );
      console.log('Initialized Hugging Face speech recognition');
    } catch (error) {
      console.error('Failed to initialize fallback speech recognition:', error);
    }
  }

  private handleSpeechResult(event: SpeechRecognitionEvent) {
    const lastResult = event.results[event.results.length - 1];
    const transcript = lastResult[0].transcript;
    const confidence = lastResult[0].confidence;
    const isInterim = !lastResult.isFinal;

    const subtitle: SubtitleLine = {
      id: `subtitle-${Date.now()}`,
      text: transcript,
      timestamp: Date.now(),
      confidence: confidence || 0.8,
      isInterim: isInterim
    };

    if (this.onSubtitleCallback) {
      this.onSubtitleCallback(subtitle);
    }
  }

  async startListening(onSubtitle: (subtitle: SubtitleLine) => void) {
    this.onSubtitleCallback = onSubtitle;
    this.isListening = true;

    if (this.recognition) {
      try {
        this.recognition.start();
        console.log('Started speech recognition');
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        this.startMockRecognition();
      }
    } else {
      this.startMockRecognition();
    }
  }

  private startMockRecognition() {
    // Mock speech recognition for demo
    const mockPhrases = [
      "Welcome to today's lesson on quantum physics.",
      "Let's explore the fascinating world of wave-particle duality.",
      "This concept revolutionized our understanding of nature.",
      "Questions are welcome in the chat at any time.",
      "Now let's look at some practical applications.",
    ];

    let phraseIndex = 0;
    const interval = setInterval(() => {
      if (!this.isListening) {
        clearInterval(interval);
        return;
      }

      const subtitle: SubtitleLine = {
        id: `mock-subtitle-${Date.now()}`,
        text: mockPhrases[phraseIndex % mockPhrases.length],
        timestamp: Date.now(),
        confidence: 0.95,
        isInterim: false
      };

      if (this.onSubtitleCallback) {
        this.onSubtitleCallback(subtitle);
      }

      phraseIndex++;
    }, 8000 + Math.random() * 4000); // Random interval between 8-12 seconds
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.stop();
    }
    console.log('Stopped speech recognition');
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      if (this.huggingFaceModel) {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const result = await this.huggingFaceModel(arrayBuffer);
        return result.text || '';
      }
      
      // Fallback to mock transcription
      return "Mock transcription result";
    } catch (error) {
      console.error('Failed to transcribe audio:', error);
      return '';
    }
  }

  isSupported(): boolean {
    return !!(this.recognition || this.huggingFaceModel);
  }
}

export const speechToTextService = new SpeechToTextService();