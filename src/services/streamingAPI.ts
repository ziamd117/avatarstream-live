// Extensible API Architecture for Avatar Streaming Platform
import type { AvatarModel } from '../types/global';
export interface StreamingAPI {
  // Core streaming operations
  initializeStream(config: StreamConfig): Promise<StreamSession>;
  startStream(sessionId: string): Promise<StreamStatus>;
  stopStream(sessionId: string): Promise<void>;
  updateStreamSettings(sessionId: string, settings: Partial<StreamConfig>): Promise<void>;
  
  // Avatar management
  loadAvatar(avatarId: string): Promise<AvatarModel>;
  updateAvatarExpression(sessionId: string, expression: string): Promise<void>;
  triggerAvatarGesture(sessionId: string, gesture: string): Promise<void>;
  
  // AI features
  enableSubtitles(sessionId: string, options: SubtitleOptions): Promise<void>;
  processVoiceCommand(sessionId: string, command: string): Promise<CommandResponse>;
  generateAIResponse(sessionId: string, input: string): Promise<string>;
}

export interface StreamConfig {
  title: string;
  description: string;
  visibility: 'public' | 'private' | 'unlisted';
  avatarId: string;
  voiceConfig: VoiceConfiguration;
  features: StreamFeatures;
}

export interface StreamFeatures {
  subtitles: boolean;
  aiChat: boolean;
  gestureControl: boolean;
  voiceSynthesis: boolean;
  screenSharing: boolean;
  recording: boolean;
}

export interface StreamSession {
  id: string;
  config: StreamConfig;
  status: StreamStatus;
  participants: Participant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamStatus {
  state: 'initializing' | 'live' | 'paused' | 'ended' | 'error';
  viewerCount: number;
  duration: number;
  quality: StreamQuality;
  url?: string;
}

export interface StreamQuality {
  resolution: '720p' | '1080p' | '4K';
  bitrate: number;
  fps: number;
  latency: number;
}

export interface Participant {
  id: string;
  name: string;
  role: 'host' | 'moderator' | 'viewer';
  joinedAt: Date;
  isActive: boolean;
}

export interface VoiceConfiguration {
  voiceId: string;
  provider: 'elevenlabs' | 'browser' | 'azure';
  settings: {
    stability: number;
    clarity: number;
    speed: number;
    pitch: number;
  };
}

export interface SubtitleOptions {
  language: string;
  provider: 'browser' | 'whisper' | 'azure';
  realTime: boolean;
  confidence: number;
}

export interface CommandResponse {
  success: boolean;
  action: string;
  data?: any;
  error?: string;
}

// Main API Implementation
export class StreamingAPIImplementation implements StreamingAPI {
  private sessions: Map<string, StreamSession> = new Map();
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  async initializeStream(config: StreamConfig): Promise<StreamSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: StreamSession = {
      id: sessionId,
      config,
      status: {
        state: 'initializing',
        viewerCount: 0,
        duration: 0,
        quality: {
          resolution: '1080p',
          bitrate: 2500,
          fps: 30,
          latency: 100
        }
      },
      participants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(sessionId, session);
    
    // Initialize VideoSDK session
    await this.setupVideoSDK(session);
    
    // Load avatar model
    await this.loadAvatar(config.avatarId);
    
    // Setup AI features
    await this.initializeAIFeatures(session);

    return session;
  }

  async startStream(sessionId: string): Promise<StreamStatus> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    try {
      // Start VideoSDK livestream
      const streamUrl = await this.startVideoSDKStream(session);
      
      session.status.state = 'live';
      session.status.url = streamUrl;
      session.updatedAt = new Date();
      
      return session.status;
    } catch (error) {
      session.status.state = 'error';
      throw error;
    }
  }

  async stopStream(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.status.state = 'ended';
    session.updatedAt = new Date();
    
    // Cleanup resources
    await this.cleanupSession(sessionId);
  }

  async updateStreamSettings(sessionId: string, settings: Partial<StreamConfig>): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.config = { ...session.config, ...settings };
    session.updatedAt = new Date();
  }

  async loadAvatar(avatarId: string): Promise<AvatarModel> {
    // Delegate to avatar service
    const { avatarModelService } = await import('./avatarModelService');
    const avatar = await avatarModelService.loadAvatarModel(avatarId);
    
    if (!avatar) {
      throw new Error('Failed to load avatar');
    }

    return avatar;
  }

  async updateAvatarExpression(sessionId: string, expression: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status.state !== 'live') {
      throw new Error('Invalid session or not live');
    }

    // Update avatar expression through VideoSDK Agent
    console.log(`Updating avatar expression: ${expression}`);
  }

  async triggerAvatarGesture(sessionId: string, gesture: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status.state !== 'live') {
      throw new Error('Invalid session or not live');
    }

    // Trigger gesture through VideoSDK Agent
    console.log(`Triggering avatar gesture: ${gesture}`);
  }

  async enableSubtitles(sessionId: string, options: SubtitleOptions): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Initialize speech-to-text service
    const { speechToTextService } = await import('./speechToTextService');
    await speechToTextService.startListening((subtitle) => {
      // Broadcast subtitle to viewers
      this.broadcastSubtitle(sessionId, subtitle);
    });
  }

  async processVoiceCommand(sessionId: string, command: string): Promise<CommandResponse> {
    try {
      // Parse and execute voice commands
      const parsedCommand = this.parseVoiceCommand(command);
      
      switch (parsedCommand.action) {
        case 'gesture':
          await this.triggerAvatarGesture(sessionId, parsedCommand.param);
          return { success: true, action: 'gesture', data: parsedCommand.param };
          
        case 'expression':
          await this.updateAvatarExpression(sessionId, parsedCommand.param);
          return { success: true, action: 'expression', data: parsedCommand.param };
          
        default:
          return { success: false, action: 'unknown', error: 'Command not recognized' };
      }
    } catch (error) {
      return { success: false, action: 'error', error: error.message };
    }
  }

  async generateAIResponse(sessionId: string, input: string): Promise<string> {
    // Generate AI response using LLM
    // This would integrate with OpenAI, Claude, or other LLM providers
    return `AI response to: ${input}`;
  }

  // Private helper methods
  private async setupVideoSDK(session: StreamSession): Promise<void> {
    const { videoSDKService } = await import('./videoSDKService');
    
    await videoSDKService.initializeMeeting({
      token: this.config.videoSDK.token,
      meetingId: session.id,
      name: session.config.title,
      micEnabled: true,
      webcamEnabled: false
    });

    await videoSDKService.createAvatarAgent({
      avatarId: session.config.avatarId,
      voiceId: session.config.voiceConfig.voiceId,
      lipSyncEnabled: true,
      gestureMapping: {},
      expressionSensitivity: 0.8
    });
  }

  private async startVideoSDKStream(session: StreamSession): Promise<string> {
    const { videoSDKService } = await import('./videoSDKService');
    
    const stream = await videoSDKService.startLiveStream({
      rtmpUrl: this.config.streaming.rtmpUrl,
      streamKey: this.config.streaming.streamKey
    });

    return stream.downstreamUrl || 'https://mock-stream.example.com';
  }

  private async initializeAIFeatures(session: StreamSession): Promise<void> {
    if (session.config.features.subtitles) {
      await this.enableSubtitles(session.id, {
        language: 'en-US',
        provider: 'browser',
        realTime: true,
        confidence: 0.8
      });
    }

    if (session.config.features.voiceSynthesis) {
      const { voiceSynthesisService } = await import('./voiceSynthesisService');
      if (this.config.elevenLabs?.apiKey) {
        voiceSynthesisService.setElevenLabsApiKey(this.config.elevenLabs.apiKey);
      }
    }
  }

  private parseVoiceCommand(command: string): { action: string; param: string } {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('wave') || lowerCommand.includes('hello')) {
      return { action: 'gesture', param: 'wave' };
    }
    if (lowerCommand.includes('smile')) {
      return { action: 'expression', param: 'smile' };
    }
    if (lowerCommand.includes('thumbs up')) {
      return { action: 'gesture', param: 'thumbs-up' };
    }
    
    return { action: 'unknown', param: '' };
  }

  private broadcastSubtitle(sessionId: string, subtitle: any): void {
    // Broadcast subtitle to all participants
    console.log(`Broadcasting subtitle for session ${sessionId}:`, subtitle.text);
  }

  private async cleanupSession(sessionId: string): Promise<void> {
    const { videoSDKService } = await import('./videoSDKService');
    const { speechToTextService } = await import('./speechToTextService');
    
    await videoSDKService.stopLiveStream();
    speechToTextService.stopListening();
    
    this.sessions.delete(sessionId);
  }
}

export interface APIConfig {
  videoSDK: {
    token: string;
    apiKey: string;
  };
  streaming: {
    rtmpUrl: string;
    streamKey: string;
  };
  elevenLabs?: {
    apiKey: string;
  };
  openAI?: {
    apiKey: string;
  };
  readyPlayerMe?: {
    apiKey: string;
  };
}

// Export singleton instance
export const createStreamingAPI = (config: APIConfig): StreamingAPI => {
  return new StreamingAPIImplementation(config);
};