// TypeScript declarations for Web APIs and services
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// VideoSDK types
export interface VideoSDKMeeting {
  id: string;
  localParticipant: any;
  participants: Map<string, any>;
  localMicOn: boolean;
  localWebcamOn: boolean;
  join(): void;
  leave(): void;
  toggleMic(): void;
  startRecording(): void;
  stopRecording(): void;
  startLivestream(config: any): Promise<any>;
  stopLivestream(): Promise<void>;
}

export interface AvatarModel {
  id: string;
  name: string;
  thumbnailUrl: string;
  modelUrl: string;
  category: 'professional' | 'casual' | 'creative';
  gender: 'male' | 'female' | 'neutral';
  expressions: string[];
  animations: string[];
}