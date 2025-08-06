import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Palette, 
  Volume2, 
  Camera, 
  Settings,
  Sliders,
  Eye,
  Mic,
  Share2
} from 'lucide-react';

interface StreamControlsProps {
  isStreaming: boolean;
  selectedAvatar: string;
  onAvatarChange: (avatarId: string) => void;
}

const StreamControls: React.FC<StreamControlsProps> = ({
  isStreaming,
  selectedAvatar,
  onAvatarChange
}) => {
  const [streamTitle, setStreamTitle] = useState('Anonymous Educator - Live Learning Session');
  const [streamDescription, setStreamDescription] = useState('Join us for an interactive educational experience with cutting-edge virtual avatar technology.');
  const [voiceEnhancement, setVoiceEnhancement] = useState(true);
  const [gestureResponse, setGestureResponse] = useState(85);
  const [expressionSensitivity, setExpressionSensitivity] = useState(70);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sliders className="w-5 h-5" />
          <span>Stream Configuration</span>
          {isStreaming && (
            <Badge variant="secondary" className="ml-auto">
              <Eye className="w-3 h-3 mr-1" />
              Live
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stream-title">Stream Title</Label>
              <Input
                id="stream-title"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                disabled={isStreaming}
                placeholder="Enter stream title..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stream-description">Description</Label>
              <Input
                id="stream-description"
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                disabled={isStreaming}
                placeholder="Describe your stream..."
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Monitor className="w-4 h-4 mr-2" />
                Screen Share
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="avatar" className="space-y-4">
            <div className="space-y-3">
              <Label>Expression Sensitivity</Label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={expressionSensitivity}
                  onChange={(e) => setExpressionSensitivity(Number(e.target.value))}
                  className="flex-1"
                  disabled={isStreaming}
                />
                <span className="text-sm text-muted-foreground w-12">
                  {expressionSensitivity}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Gesture Response Time</Label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gestureResponse}
                  onChange={(e) => setGestureResponse(Number(e.target.value))}
                  className="flex-1"
                  disabled={isStreaming}
                />
                <span className="text-sm text-muted-foreground w-12">
                  {gestureResponse}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Palette className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-enhancement">Voice Enhancement</Label>
              <Button
                variant={voiceEnhancement ? "default" : "outline"}
                size="sm"
                onClick={() => setVoiceEnhancement(!voiceEnhancement)}
              >
                {voiceEnhancement ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="space-y-3">
              <Label>Microphone Level</Label>
              <div className="flex items-center space-x-3">
                <Mic className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-primary h-full rounded-full"
                    animate={{ width: `${Math.random() * 80 + 20}%` }}
                    transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Audio Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Real-time Transcription</Label>
                  <p className="text-xs text-muted-foreground">
                    Display live captions for accessibility
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>AI Chat Assistant</Label>
                  <p className="text-xs text-muted-foreground">
                    Auto-respond to common questions
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Stream Analytics</Label>
                  <p className="text-xs text-muted-foreground">
                    Track engagement and performance
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Stats
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StreamControls;