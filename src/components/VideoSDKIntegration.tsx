import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Radio, 
  Square, 
  Users, 
  Clock, 
  Eye, 
  TrendingUp,
  Wifi,
  WifiOff,
  Signal
} from 'lucide-react';
import { videoSDKService } from '@/services/videoSDKService';
import { createStreamingAPI } from '@/services/streamingAPI';

interface VideoSDKIntegrationProps {
  selectedAvatar: string;
  onStreamStatusChange?: (isLive: boolean) => void;
}

const VideoSDKIntegration: React.FC<VideoSDKIntegrationProps> = ({
  selectedAvatar,
  onStreamStatusChange
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamSession, setStreamSession] = useState<any>(null);
  const [connectionQuality, setConnectionQuality] = useState(85);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);

  // Mock API configuration
  const apiConfig = {
    videoSDK: {
      token: 'mock-token-' + Date.now(),
      apiKey: 'mock-api-key'
    },
    streaming: {
      rtmpUrl: 'rtmp://mock-stream.videosdk.live/live',
      streamKey: 'mock-stream-key-' + Date.now()
    }
  };

  const streamingAPI = createStreamingAPI(apiConfig);

  useEffect(() => {
    // Initialize VideoSDK connection
    initializeConnection();
  }, []);

  useEffect(() => {
    // Update stream duration
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  const initializeConnection = async () => {
    try {
      const meeting = await videoSDKService.initializeMeeting({
        token: apiConfig.videoSDK.token,
        meetingId: `edu-stream-${Date.now()}`,
        name: 'EduStream Session',
        micEnabled: true,
        webcamEnabled: false
      });

      const agent = await videoSDKService.createAvatarAgent({
        avatarId: selectedAvatar,
        voiceId: 'Aria',
        lipSyncEnabled: true,
        gestureMapping: {
          'wave': 'greeting',
          'thumbs-up': 'approval',
          'heart': 'love',
          'excited': 'enthusiasm',
          'smile': 'happiness'
        },
        expressionSensitivity: 0.8
      });

      setIsConnected(true);
      console.log('VideoSDK initialized:', { meeting, agent });
    } catch (error) {
      console.error('Failed to initialize VideoSDK:', error);
      setIsConnected(false);
    }
  };

  const startStream = async () => {
    try {
      // Create streaming session
      const session = await streamingAPI.initializeStream({
        title: 'Anonymous Educator - Live Learning Session',
        description: 'Educational content with virtual avatar',
        visibility: 'public',
        avatarId: selectedAvatar,
        voiceConfig: {
          voiceId: 'Aria',
          provider: 'elevenlabs',
          settings: {
            stability: 0.5,
            clarity: 0.8,
            speed: 1.0,
            pitch: 1.0
          }
        },
        features: {
          subtitles: true,
          aiChat: true,
          gestureControl: true,
          voiceSynthesis: true,
          screenSharing: false,
          recording: true
        }
      });

      // Start the stream
      const status = await streamingAPI.startStream(session.id);
      
      setStreamSession(session);
      setIsStreaming(true);
      setViewerCount(1); // Start with 1 viewer
      onStreamStatusChange?.(true);

      console.log('Stream started:', { session, status });
    } catch (error) {
      console.error('Failed to start stream:', error);
    }
  };

  const stopStream = async () => {
    try {
      if (streamSession) {
        await streamingAPI.stopStream(streamSession.id);
      }
      
      setIsStreaming(false);
      setStreamSession(null);
      setViewerCount(0);
      setStreamDuration(0);
      onStreamStatusChange?.(false);

      console.log('Stream stopped');
    } catch (error) {
      console.error('Failed to stop stream:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate viewer count changes
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 6) - 2; // -2 to +3
          return Math.max(0, prev + change);
        });
        setConnectionQuality(prev => {
          const change = Math.floor(Math.random() * 20) - 10; // -10 to +10
          return Math.max(60, Math.min(100, prev + change));
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5" />
            <span>VideoSDK Streaming</span>
            {isStreaming && (
              <Badge variant="default" className="bg-stream-live text-white">
                <div className="w-2 h-2 bg-white rounded-full animate-live-pulse mr-1" />
                LIVE
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Badge variant="outline" className="text-green-500 border-green-500">
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-500 border-red-500">
                <WifiOff className="w-3 h-3 mr-1" />
                Disconnected
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Connection Quality</span>
            <div className="flex items-center space-x-2">
              <Signal className="w-4 h-4" />
              <span className="font-medium">{connectionQuality}%</span>
            </div>
          </div>
          <Progress value={connectionQuality} className="h-2" />
        </div>

        {/* Stream Controls */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            {!isStreaming ? (
              <Button
                onClick={startStream}
                disabled={!isConnected}
                className="flex-1 gradient-stream shadow-stream"
                size="lg"
              >
                <Radio className="w-4 h-4 mr-2" />
                Start Live Stream
              </Button>
            ) : (
              <Button
                onClick={stopStream}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <Square className="w-4 h-4 mr-2" />
                End Stream
              </Button>
            )}
          </div>

          {!isConnected && (
            <Button
              onClick={initializeConnection}
              variant="outline"
              className="w-full"
            >
              <Wifi className="w-4 h-4 mr-2" />
              Reconnect to VideoSDK
            </Button>
          )}
        </div>

        {/* Stream Statistics */}
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Eye className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{viewerCount}</div>
              <div className="text-xs text-muted-foreground">Viewers</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{formatDuration(streamDuration)}</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">HD</div>
              <div className="text-xs text-muted-foreground">Quality</div>
            </div>
          </motion.div>
        )}

        {/* Stream Configuration */}
        {streamSession && (
          <div className="space-y-2 text-sm">
            <h4 className="font-medium">Stream Configuration</h4>
            <div className="space-y-1 text-muted-foreground">
              <div>Session ID: {streamSession.id.slice(-8)}</div>
              <div>Avatar: {selectedAvatar}</div>
              <div>Quality: 1080p @ 30fps</div>
              <div>Latency: ~100ms</div>
            </div>
          </div>
        )}

        {/* API Status */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>VideoSDK API Status</span>
            <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
              {isConnected ? 'Ready' : 'Initializing'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoSDKIntegration;