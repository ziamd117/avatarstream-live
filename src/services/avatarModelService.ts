// Ready Player Me Avatar Integration Service
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

export interface AvatarCustomization {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  outfit: string;
  accessories: string[];
}

export class AvatarModelService {
  private apiKey: string | null = null;
  private baseUrl = 'https://models.readyplayer.me/v1';
  private cache: Map<string, AvatarModel> = new Map();

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async loadAvatarModel(avatarId: string): Promise<AvatarModel | null> {
    // Check cache first
    if (this.cache.has(avatarId)) {
      return this.cache.get(avatarId)!;
    }

    try {
      // Mock Ready Player Me API call
      const response = await fetch(`${this.baseUrl}/avatars/${avatarId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Ready Player Me API error: ${response.status}`);
      }

      const avatarData = await response.json();
      const avatar: AvatarModel = {
        id: avatarData.id,
        name: avatarData.name,
        thumbnailUrl: avatarData.thumbnailUrl,
        modelUrl: avatarData.modelUrl,
        category: avatarData.category,
        gender: avatarData.gender,
        expressions: avatarData.expressions || [],
        animations: avatarData.animations || [],
      };

      this.cache.set(avatarId, avatar);
      return avatar;
    } catch (error) {
      console.error('Failed to load avatar model:', error);
      return this.createMockAvatar(avatarId);
    }
  }

  private createMockAvatar(avatarId: string): AvatarModel {
    // Mock avatar models for demo
    const mockAvatars: Record<string, AvatarModel> = {
      'avatar-1': {
        id: 'avatar-1',
        name: 'Professor Alex',
        thumbnailUrl: '/src/assets/avatar-teacher-1.jpg',
        modelUrl: 'https://models.readyplayer.me/mock-avatar-1.glb',
        category: 'professional',
        gender: 'neutral',
        expressions: ['neutral', 'smile', 'surprised', 'thinking', 'explaining'],
        animations: ['idle', 'talk', 'gesture', 'nod', 'point'],
      },
      'avatar-2': {
        id: 'avatar-2',
        name: 'Dr. Maya',
        thumbnailUrl: '/src/assets/avatar-teacher-2.jpg',
        modelUrl: 'https://models.readyplayer.me/mock-avatar-2.glb',
        category: 'professional',
        gender: 'female',
        expressions: ['confident', 'smile', 'serious', 'encouraging', 'questioning'],
        animations: ['idle', 'talk', 'gesture', 'emphasize', 'welcome'],
      },
      'avatar-3': {
        id: 'avatar-3',
        name: 'Teacher Sam',
        thumbnailUrl: '/src/assets/avatar-teacher-3.jpg',
        modelUrl: 'https://models.readyplayer.me/mock-avatar-3.glb',
        category: 'professional',
        gender: 'male',
        expressions: ['friendly', 'smile', 'excited', 'thoughtful', 'supportive'],
        animations: ['idle', 'talk', 'gesture', 'applaud', 'teaching'],
      },
    };

    return mockAvatars[avatarId] || mockAvatars['avatar-1'];
  }

  async customizeAvatar(avatarId: string, customization: AvatarCustomization): Promise<AvatarModel | null> {
    try {
      // Mock customization API call
      const response = await fetch(`${this.baseUrl}/avatars/${avatarId}/customize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customization),
      });

      if (!response.ok) {
        throw new Error(`Customization failed: ${response.status}`);
      }

      const customizedAvatar = await response.json();
      this.cache.set(avatarId, customizedAvatar);
      return customizedAvatar;
    } catch (error) {
      console.error('Avatar customization failed:', error);
      // Return original avatar as fallback
      return this.loadAvatarModel(avatarId);
    }
  }

  async generateAvatar(customization: AvatarCustomization): Promise<AvatarModel | null> {
    try {
      const response = await fetch(`${this.baseUrl}/avatars/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customization),
      });

      if (!response.ok) {
        throw new Error(`Avatar generation failed: ${response.status}`);
      }

      const newAvatar = await response.json();
      this.cache.set(newAvatar.id, newAvatar);
      return newAvatar;
    } catch (error) {
      console.error('Avatar generation failed:', error);
      return null;
    }
  }

  getAvailableExpressions(avatarId: string): string[] {
    const avatar = this.cache.get(avatarId);
    return avatar?.expressions || ['neutral', 'smile', 'thinking', 'explaining'];
  }

  getAvailableAnimations(avatarId: string): string[] {
    const avatar = this.cache.get(avatarId);
    return avatar?.animations || ['idle', 'talk', 'gesture', 'nod'];
  }

  async preloadAvatars(avatarIds: string[]): Promise<void> {
    const promises = avatarIds.map(id => this.loadAvatarModel(id));
    await Promise.all(promises);
  }

  clearCache() {
    this.cache.clear();
  }

  isSupported(): boolean {
    return true; // Always supported as we have fallback mock implementation
  }
}

export const avatarModelService = new AvatarModelService();