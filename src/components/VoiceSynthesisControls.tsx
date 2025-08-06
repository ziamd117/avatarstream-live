import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Volume2, 
  Play, 
  Square, 
  Settings, 
  Mic,
  MessageSquare,
  Zap
} from 'lucide-react';
import { voiceSynthesisService } from '@/services/voiceSynthesisService';

interface VoiceSynthesisControlsProps {
  isStreaming: boolean;
  onVoiceSettingsChange?: (settings: any) => void;
}

const VoiceSynthesisControls: React.FC<VoiceSynthesisControlsProps> = ({
  isStreaming,
  onVoiceSettingsChange
}) => {
  const [selectedVoice, setSelectedVoice] = useState('Aria');
  const [testText, setTestText] = useState("Hello everyone! Welcome to today's educational session. I'm excited to share some fascinating concepts with you.");
  const [isPlaying, setIsPlaying] = useState(false);
  const [stability, setStability] = useState([0.5]);
  const [similarity, setSimilarity] = useState([0.75]);
  const [style, setStyle] = useState([0.0]);
  const [apiKeySet, setApiKeySet] = useState(false);

  const elevenLabsVoices = voiceSynthesisService.getElevenLabsVoices();
  const browserVoices = voiceSynthesisService.getAvailableVoices();

  const handlePlayTest = async () => {
    setIsPlaying(true);
    try {
      await voiceSynthesisService.speakText(testText, {
        voiceId: selectedVoice,
        stability: stability[0],
        similarityBoost: similarity[0],
        style: style[0],
        speakerBoost: true
      });
    } catch (error) {
      console.error('Voice synthesis failed:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    voiceSynthesisService.stop();
    setIsPlaying(false);
  };

  const handleApiKeySubmit = (apiKey: string) => {
    voiceSynthesisService.setElevenLabsApiKey(apiKey);
    setApiKeySet(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5" />
            <span>Voice Synthesis</span>
            {isPlaying && (
              <Badge variant="default" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Speaking
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* API Key Setup */}
        {!apiKeySet && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
          >
            <h4 className="font-medium mb-2">ElevenLabs API Key</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Enter your ElevenLabs API key for premium voice synthesis. Otherwise, browser voices will be used.
            </p>
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Enter API key..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    handleApiKeySubmit(e.currentTarget.value);
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector('input[type="password"]') as HTMLInputElement;
                  if (input?.value) {
                    handleApiKeySubmit(input.value);
                  }
                }}
                variant="outline"
              >
                Set Key
              </Button>
            </div>
          </motion.div>
        )}

        {/* Voice Selection */}
        <div className="space-y-3">
          <Label>Voice Selection</Label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">ElevenLabs Voices</div>
                {elevenLabsVoices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.name}>
                    <div className="flex items-center justify-between w-full">
                      <span>{voice.name}</span>
                      <Badge variant="secondary" className="text-xs ml-2">Premium</Badge>
                    </div>
                  </SelectItem>
                ))}
              </div>
              <div className="p-2 border-t">
                <div className="text-xs font-medium text-muted-foreground mb-2">Browser Voices</div>
                {browserVoices.slice(0, 5).map((voice) => (
                  <SelectItem key={voice.voiceURI} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* Voice Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Stability: {stability[0].toFixed(2)}</Label>
            <Slider
              value={stability}
              onValueChange={setStability}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Higher values make voice more stable but less expressive
            </p>
          </div>

          <div className="space-y-2">
            <Label>Similarity Boost: {similarity[0].toFixed(2)}</Label>
            <Slider
              value={similarity}
              onValueChange={setSimilarity}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Enhances similarity to the original voice
            </p>
          </div>

          <div className="space-y-2">
            <Label>Style Exaggeration: {style[0].toFixed(2)}</Label>
            <Slider
              value={style}
              onValueChange={setStyle}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Amplifies the style of the voice
            </p>
          </div>
        </div>

        {/* Test Voice */}
        <div className="space-y-3">
          <Label>Test Voice</Label>
          <div className="space-y-2">
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test voice..."
              className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handlePlayTest}
                disabled={isPlaying || !testText.trim()}
                className="flex-1"
                variant={isPlaying ? "secondary" : "default"}
              >
                {isPlaying ? (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Speaking...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test Voice
                  </>
                )}
              </Button>
              {isPlaying && (
                <Button onClick={handleStop} variant="destructive">
                  <Square className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Auto Respond
          </Button>
          <Button variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Voice Effects
          </Button>
        </div>

        {/* Status */}
        <div className="text-xs text-muted-foreground">
          {voiceSynthesisService.isSupported() 
            ? `Voice synthesis ready • ${apiKeySet ? 'ElevenLabs' : 'Browser'} voices`
            : 'Voice synthesis not supported in this browser'
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSynthesisControls;