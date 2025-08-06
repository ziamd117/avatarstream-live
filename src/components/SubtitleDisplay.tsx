import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Subtitles, 
  Volume2, 
  VolumeX,
  Settings,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { speechToTextService, SubtitleLine } from '@/services/speechToTextService';

interface SubtitleDisplayProps {
  isStreaming: boolean;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({
  isStreaming,
  isEnabled,
  onToggle
}) => {
  const [subtitles, setSubtitles] = useState<SubtitleLine[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (isStreaming && isEnabled && !isListening) {
      startSubtitles();
    } else if ((!isStreaming || !isEnabled) && isListening) {
      stopSubtitles();
    }
  }, [isStreaming, isEnabled, isListening]);

  const startSubtitles = async () => {
    try {
      setIsListening(true);
      await speechToTextService.startListening((subtitle) => {
        setSubtitles(prev => {
          const newSubtitles = [...prev.filter(s => s.id !== subtitle.id), subtitle];
          return newSubtitles.slice(-5); // Keep only last 5 subtitles
        });
        setConfidence(subtitle.confidence);
      });
    } catch (error) {
      console.error('Failed to start subtitles:', error);
      setIsListening(false);
    }
  };

  const stopSubtitles = () => {
    speechToTextService.stopListening();
    setIsListening(false);
    setSubtitles([]);
  };

  const currentSubtitle = subtitles[subtitles.length - 1];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Subtitles className="w-5 h-5" />
            <span>Live Subtitles</span>
            {isListening && (
              <Badge variant="default" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Live
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => onToggle(!isEnabled)}
              disabled={!speechToTextService.isSupported()}
            >
              {isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Subtitle Display */}
        <div className="min-h-[80px] bg-muted/50 rounded-lg p-4 border-2 border-dashed border-border">
          <AnimatePresence mode="wait">
            {currentSubtitle ? (
              <motion.div
                key={currentSubtitle.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <p className={`text-lg font-medium ${
                  currentSubtitle.isInterim ? 'text-muted-foreground italic' : 'text-foreground'
                }`}>
                  {currentSubtitle.text}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Confidence: {Math.round(currentSubtitle.confidence * 100)}%
                  </span>
                  <span>
                    {new Date(currentSubtitle.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {isEnabled && isStreaming 
                  ? "Listening for speech..." 
                  : "Enable subtitles to see live transcription"
                }
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Confidence Meter */}
        {isListening && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Speech Confidence</span>
              <span className="font-medium">{Math.round(confidence * 100)}%</span>
            </div>
            <Progress value={confidence * 100} className="h-2" />
          </div>
        )}

        {/* Recent Subtitles History */}
        {subtitles.length > 1 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Recent</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {subtitles.slice(-4, -1).reverse().map((subtitle) => (
                <motion.div
                  key={subtitle.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="text-sm text-muted-foreground p-2 bg-muted/30 rounded"
                >
                  {subtitle.text}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => speechToTextService.isSupported() ? null : alert('Speech recognition not supported')}
            >
              {speechToTextService.isSupported() ? (
                <>
                  <Mic className="w-3 h-3 mr-1" />
                  Supported
                </>
              ) : (
                <>
                  <MicOff className="w-3 h-3 mr-1" />
                  Not Supported
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="text-xs">
              Export
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubtitleDisplay;