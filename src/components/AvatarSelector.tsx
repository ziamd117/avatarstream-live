import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, User, Sparkles } from 'lucide-react';
import avatarTeacher1 from '@/assets/avatar-teacher-1.jpg';
import avatarTeacher2 from '@/assets/avatar-teacher-2.jpg';
import avatarTeacher3 from '@/assets/avatar-teacher-3.jpg';

interface AvatarOption {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  premium?: boolean;
}

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatarId: string) => void;
}

const avatarOptions: AvatarOption[] = [
  {
    id: 'avatar-1',
    name: 'Professor Alex',
    description: 'Friendly and approachable educator',
    image: avatarTeacher1,
    features: ['Natural expressions', 'Professional attire', 'Warm personality']
  },
  {
    id: 'avatar-2',
    name: 'Dr. Maya',
    description: 'Confident and knowledgeable instructor',
    image: avatarTeacher2,
    features: ['Dynamic gestures', 'Authoritative presence', 'Clear communication'],
    premium: true
  },
  {
    id: 'avatar-3',
    name: 'Teacher Sam',
    description: 'Engaging and interactive mentor',
    image: avatarTeacher3,
    features: ['Animated expressions', 'Student-focused', 'Encouraging demeanor']
  }
];

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedAvatar,
  onSelect
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Choose Your Avatar</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select a virtual educator that represents your teaching style
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {avatarOptions.map((avatar, index) => (
          <motion.div
            key={avatar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`relative rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              selectedAvatar === avatar.id
                ? 'border-primary bg-primary/5 shadow-avatar'
                : 'border-border hover:border-primary/50 hover:bg-accent/5'
            }`}
            onClick={() => onSelect(avatar.id)}
          >
            <div className="p-4">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {selectedAvatar === avatar.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-sm">{avatar.name}</h3>
                    {avatar.premium && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {avatar.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {avatar.features.map((feature, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-xs px-2 py-0"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        <div className="pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Customize Avatar
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Adjust expressions, gestures, and appearance
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarSelector;