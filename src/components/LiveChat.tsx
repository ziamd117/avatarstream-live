import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Heart, 
  ThumbsUp, 
  Smile,
  Users,
  Settings,
  Bot
} from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'reaction' | 'system';
  isAI?: boolean;
}

interface LiveChatProps {
  isStreaming: boolean;
}

const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    user: 'Student_Alex',
    message: 'Great explanation of quantum physics! 🔬',
    timestamp: new Date(Date.now() - 120000),
    type: 'message'
  },
  {
    id: '2',
    user: 'LearnerSarah',
    message: 'Can you explain the double-slit experiment?',
    timestamp: new Date(Date.now() - 90000),
    type: 'message'
  },
  {
    id: '3',
    user: 'EduBot',
    message: 'The double-slit experiment demonstrates wave-particle duality. Let me know if you need more details!',
    timestamp: new Date(Date.now() - 60000),
    type: 'message',
    isAI: true
  },
  {
    id: '4',
    user: 'PhysicsLover',
    message: 'This avatar teaching is amazing! So clear and engaging 👏',
    timestamp: new Date(Date.now() - 30000),
    type: 'message'
  }
];

const LiveChat: React.FC<LiveChatProps> = ({ isStreaming }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(isStreaming ? sampleMessages : []);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate new messages when streaming
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        const randomMessages = [
          'This is so helpful! Thank you! 🙏',
          'Can you go over that last part again?',
          'Amazing use of avatar technology!',
          'The visual explanations are perfect',
          'Best online class ever! 🎓',
          'Question: How does this apply in real life?',
          'Love the interactive approach! 💯'
        ];
        
        const randomUsers = [
          'Student_Mike', 'LearnerJess', 'QuestionMaster', 'ScienceGeek', 
          'FuturePhD', 'CuriousLearner', 'TechStudent'
        ];

        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date(),
          type: 'message'
        };

        setMessages(prev => [...prev, newMsg]);
      }, 8000 + Math.random() * 12000);

      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: 'You',
        message: newMessage,
        timestamp: new Date(),
        type: 'message'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate AI response occasionally
      if (Math.random() > 0.7) {
        setIsTyping(true);
        setTimeout(() => {
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            user: 'EduBot',
            message: 'Great question! Let me provide some additional context on that topic.',
            timestamp: new Date(),
            type: 'message',
            isAI: true
          };
          setMessages(prev => [...prev, aiResponse]);
          setIsTyping(false);
        }, 2000);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Live Chat</span>
          </div>
          <div className="flex items-center space-x-2">
            {isStreaming && (
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {messages.length + Math.floor(Math.random() * 50) + 10}
              </Badge>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 pb-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div className="flex items-start space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    message.isAI 
                      ? 'bg-primary text-primary-foreground'
                      : message.user === 'You'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.isAI ? <Bot className="w-3 h-3" /> : message.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {message.user}
                      </span>
                      {message.isAI && (
                        <Badge variant="outline" className="text-xs">AI</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground break-words">
                      {message.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-muted-foreground"
            >
              <Bot className="w-4 h-4" />
              <span className="text-sm">EduBot is typing...</span>
              <div className="flex space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-1 h-1 bg-muted-foreground rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-1 h-1 bg-muted-foreground rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-1 h-1 bg-muted-foreground rounded-full"
                />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reactions */}
        <div className="flex space-x-2 pb-2">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isStreaming ? "Ask a question..." : "Join the stream to chat"}
            disabled={!isStreaming}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isStreaming}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveChat;