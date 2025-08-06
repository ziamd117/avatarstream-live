import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp,
  Heart,
  MessageSquare
} from 'lucide-react';

interface StreamStatsProps {
  viewerCount: number;
  isStreaming: boolean;
}

const StreamStats: React.FC<StreamStatsProps> = ({
  viewerCount,
  isStreaming
}) => {
  const streamDuration = isStreaming ? Math.floor(Math.random() * 45) + 5 : 0;
  const totalLikes = Math.floor(viewerCount * 2.3) + Math.floor(Math.random() * 20);
  const chatMessages = Math.floor(viewerCount * 1.8) + Math.floor(Math.random() * 15);

  const stats = [
    {
      label: 'Viewers',
      value: viewerCount,
      icon: Eye,
      color: 'text-primary',
      format: (val: number) => val.toString()
    },
    {
      label: 'Duration',
      value: streamDuration,
      icon: Clock,
      color: 'text-secondary',
      format: (val: number) => `${val}m`
    },
    {
      label: 'Likes',
      value: totalLikes,
      icon: Heart,
      color: 'text-red-500',
      format: (val: number) => val.toString()
    },
    {
      label: 'Messages',
      value: chatMessages,
      icon: MessageSquare,
      color: 'text-green-500',
      format: (val: number) => val.toString()
    }
  ];

  if (!isStreaming) {
    return (
      <Badge variant="outline" className="flex items-center space-x-2">
        <Users className="w-3 h-3" />
        <span>Offline</span>
      </Badge>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center space-x-1 text-sm"
        >
          <stat.icon className={`w-4 h-4 ${stat.color}`} />
          <motion.span
            key={stat.value}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="font-medium"
          >
            {stat.format(stat.value)}
          </motion.span>
          <span className="text-muted-foreground hidden md:inline">
            {stat.label}
          </span>
        </motion.div>
      ))}
      
      <Badge variant="default" className="flex items-center space-x-1 bg-stream-live/10 text-stream-live border-stream-live/20">
        <div className="w-2 h-2 bg-stream-live rounded-full animate-live-pulse" />
        <span className="font-medium">LIVE</span>
      </Badge>
    </div>
  );
};

export default StreamStats;