import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Settings, 
  Users, 
  MessageSquare, 
  Share2,
  Radio,
  Square,
  Volume2
} from 'lucide-react';
import AvatarSelector from './AvatarSelector';
import StreamControls from './StreamControls';
import LiveChat from './LiveChat';
import StreamStats from './StreamStats';
import AvatarDisplay from './AvatarDisplay';

interface StreamingStudioProps {
  onStartStream?: () => void;
  onEndStream?: () => void;
}

const StreamingStudio: React.FC<StreamingStudioProps> = ({
  onStartStream,
  onEndStream
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('avatar-1');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamTitle, setStreamTitle] = useState('Anonymous Educator - Live Learning Session');

  // Simulate viewer count changes
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  const handleStartStream = () => {
    setIsStreaming(true);
    setViewerCount(Math.floor(Math.random() * 10) + 1);
    onStartStream?.();
  };

  const handleEndStream = () => {
    setIsStreaming(false);
    setViewerCount(0);
    onEndStream?.();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold gradient-stream bg-clip-text text-transparent">
                EduStream Pro
              </h1>
              <div className="flex items-center space-x-2">
                {isStreaming && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center space-x-2 px-3 py-1 bg-stream-live/10 rounded-full border border-stream-live/20"
                  >
                    <div className="w-2 h-2 bg-stream-live rounded-full animate-live-pulse" />
                    <span className="text-sm font-medium text-stream-live">LIVE</span>
                  </motion.div>
                )}
                <span className="text-sm text-muted-foreground">{streamTitle}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <StreamStats viewerCount={viewerCount} isStreaming={isStreaming} />
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stream Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar Display */}
            <Card className="overflow-hidden shadow-avatar">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-dark">
                  <AvatarDisplay 
                    selectedAvatar={selectedAvatar}
                    isStreaming={isStreaming}
                    isMuted={isMuted}
                  />
                  
                  {/* Stream Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={isMuted ? "destructive" : "secondary"}
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant={isVideoEnabled ? "secondary" : "destructive"}
                          size="sm"
                          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                        >
                          {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                        </Button>
                        <Button variant="secondary" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {isStreaming ? (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={handleEndStream}
                            className="shadow-glow"
                          >
                            <Square className="w-4 h-4 mr-2" />
                            End Stream
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="lg"
                            onClick={handleStartStream}
                            className="gradient-stream shadow-stream hover:animate-stream-glow"
                          >
                            <Radio className="w-4 h-4 mr-2" />
                            Go Live
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stream Controls */}
            <StreamControls 
              isStreaming={isStreaming}
              selectedAvatar={selectedAvatar}
              onAvatarChange={setSelectedAvatar}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar Selection */}
            {!isStreaming && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AvatarSelector 
                  selectedAvatar={selectedAvatar}
                  onSelect={setSelectedAvatar}
                />
              </motion.div>
            )}

            {/* Live Chat */}
            <LiveChat isStreaming={isStreaming} />
            
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-auto p-3">
                    <Users className="w-4 h-4 mb-1" />
                    <span className="text-xs">Invite</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3">
                    <MessageSquare className="w-4 h-4 mb-1" />
                    <span className="text-xs">Chat</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3">
                    <Share2 className="w-4 h-4 mb-1" />
                    <span className="text-xs">Share</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3">
                    <Volume2 className="w-4 h-4 mb-1" />
                    <span className="text-xs">Audio</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingStudio;