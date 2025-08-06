import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Hand, 
  ThumbsUp, 
  Heart,
  Zap,
  Smile
} from 'lucide-react';
import avatarTeacher1 from '@/assets/avatar-teacher-1.jpg';
import avatarTeacher2 from '@/assets/avatar-teacher-2.jpg';
import avatarTeacher3 from '@/assets/avatar-teacher-3.jpg';
import studioBackground from '@/assets/studio-background.jpg';

interface AvatarDisplayProps {
  selectedAvatar: string;
  isStreaming: boolean;
  isMuted: boolean;
}

interface GestureOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  key: string;
}

const gestureOptions: GestureOption[] = [
  { id: 'wave', name: 'Wave', icon: <Hand className="w-4 h-4" />, color: 'bg-blue-500', key: '1' },
  { id: 'thumbs-up', name: 'Thumbs Up', icon: <ThumbsUp className="w-4 h-4" />, color: 'bg-green-500', key: '2' },
  { id: 'heart', name: 'Heart', icon: <Heart className="w-4 h-4" />, color: 'bg-red-500', key: '3' },
  { id: 'excited', name: 'Excited', icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-500', key: '4' },
  { id: 'smile', name: 'Smile', icon: <Smile className="w-4 h-4" />, color: 'bg-purple-500', key: '5' }
];

const avatarImages = {
  'avatar-1': avatarTeacher1,
  'avatar-2': avatarTeacher2,
  'avatar-3': avatarTeacher3
};

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  selectedAvatar,
  isStreaming,
  isMuted
}) => {
  const [currentExpression, setCurrentExpression] = useState('neutral');
  const [isLipSyncing, setIsLipSyncing] = useState(false);
  const [activeGesture, setActiveGesture] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // Simulate lip sync animation when not muted and streaming
  useEffect(() => {
    if (isStreaming && !isMuted) {
      const interval = setInterval(() => {
        setIsLipSyncing(true);
        setAudioLevel(Math.random() * 100);
        setTimeout(() => setIsLipSyncing(false), 200);
      }, 300 + Math.random() * 500);
      
      return () => clearInterval(interval);
    } else {
      setIsLipSyncing(false);
      setAudioLevel(0);
    }
  }, [isStreaming, isMuted]);

  // Gesture activation
  const activateGesture = (gestureId: string) => {
    setActiveGesture(gestureId);
    setTimeout(() => setActiveGesture(null), 2000);
  };

  // Keyboard shortcuts for gestures
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const gesture = gestureOptions.find(g => g.key === e.key);
      if (gesture && isStreaming) {
        activateGesture(gesture.id);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isStreaming]);

  return (
    <div className="relative w-full h-full">
      {/* Studio Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${studioBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Avatar Container */}
      <div className="relative h-full flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{
            scale: isLipSyncing ? [1, 1.02, 1] : 1,
            y: isStreaming ? [0, -5, 0] : 0
          }}
          transition={{
            scale: { duration: 0.2 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Avatar Image */}
          <div className="relative w-80 h-80 mx-auto">
            <img
              src={avatarImages[selectedAvatar as keyof typeof avatarImages] || avatarTeacher1}
              alt="Virtual Avatar"
              className={`w-full h-full rounded-full object-cover border-4 ${
                isStreaming ? 'border-primary shadow-avatar animate-avatar-float' : 'border-border'
              }`}
            />
            
            {/* Speaking Indicator */}
            <AnimatePresence>
              {isLipSyncing && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                >
                  <Volume2 className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Muted Indicator */}
            {isMuted && isStreaming && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                <MicOff className="w-4 h-4 text-destructive-foreground" />
              </div>
            )}

            {/* Audio Level Visualizer */}
            {audioLevel > 0 && (
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
                <div className="flex flex-col space-y-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary rounded-full"
                      animate={{
                        height: audioLevel > (i * 20) ? 8 + (i * 2) : 2,
                        opacity: audioLevel > (i * 20) ? 1 : 0.3
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Expression Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge 
              variant={isLipSyncing ? "default" : "secondary"}
              className="transition-all duration-200"
            >
              {isLipSyncing ? 'Speaking' : currentExpression}
            </Badge>
          </div>

          {/* Active Gesture Display */}
          <AnimatePresence>
            {activeGesture && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: -20 }}
                className="absolute -top-16 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center space-x-2">
                  {gestureOptions.find(g => g.id === activeGesture)?.icon}
                  <span className="text-sm font-medium">
                    {gestureOptions.find(g => g.id === activeGesture)?.name}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Gesture Controls */}
      {isStreaming && (
        <div className="absolute top-4 right-4">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
            <h4 className="text-xs font-medium mb-2">Quick Gestures</h4>
            <div className="grid grid-cols-5 gap-1">
              {gestureOptions.map((gesture) => (
                <Button
                  key={gesture.id}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => activateGesture(gesture.id)}
                  title={`${gesture.name} (Press ${gesture.key})`}
                >
                  {gesture.icon}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Press 1-5 for shortcuts</p>
          </div>
        </div>
      )}

      {/* Stream Quality Indicator */}
      {isStreaming && (
        <div className="absolute top-4 left-4">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-stream-success rounded-full animate-live-pulse" />
              <span className="text-xs font-medium">HD Quality</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDisplay;