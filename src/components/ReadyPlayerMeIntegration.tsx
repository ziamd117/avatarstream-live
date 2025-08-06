import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Palette, 
  Sparkles, 
  Download, 
  Upload,
  RotateCcw,
  Save
} from 'lucide-react';
import { avatarModelService } from '@/services/avatarModelService';

interface ReadyPlayerMeIntegrationProps {
  selectedAvatar: string;
  onAvatarUpdate?: (avatarId: string) => void;
}

const ReadyPlayerMeIntegration: React.FC<ReadyPlayerMeIntegrationProps> = ({
  selectedAvatar,
  onAvatarUpdate
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customization, setCustomization] = useState({
    skinTone: 'medium',
    hairStyle: 'professional',
    hairColor: 'brown',
    eyeColor: 'brown',
    outfit: 'business-casual',
    accessories: [] as string[]
  });

  const skinTones = [
    { id: 'light', name: 'Light', color: '#FDBCB4' },
    { id: 'medium', name: 'Medium', color: '#E0AC69' },
    { id: 'tan', name: 'Tan', color: '#C68642' },
    { id: 'dark', name: 'Dark', color: '#8D5524' }
  ];

  const hairStyles = [
    { id: 'professional', name: 'Professional Short' },
    { id: 'casual', name: 'Casual Wave' },
    { id: 'business', name: 'Business Cut' },
    { id: 'academic', name: 'Academic Style' }
  ];

  const hairColors = [
    { id: 'black', name: 'Black', color: '#2C1810' },
    { id: 'brown', name: 'Brown', color: '#8B4513' },
    { id: 'blonde', name: 'Blonde', color: '#FAD5A5' },
    { id: 'auburn', name: 'Auburn', color: '#A52A2A' },
    { id: 'gray', name: 'Gray', color: '#808080' }
  ];

  const outfits = [
    { id: 'business-formal', name: 'Business Formal', description: 'Suit and tie' },
    { id: 'business-casual', name: 'Business Casual', description: 'Smart shirt' },
    { id: 'academic', name: 'Academic', description: 'Professor attire' },
    { id: 'creative', name: 'Creative', description: 'Modern casual' }
  ];

  const accessories = [
    { id: 'glasses', name: 'Glasses' },
    { id: 'watch', name: 'Watch' },
    { id: 'necklace', name: 'Necklace' },
    { id: 'earrings', name: 'Earrings' }
  ];

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAccessoryToggle = (accessoryId: string) => {
    setCustomization(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryId)
        ? prev.accessories.filter(id => id !== accessoryId)
        : [...prev.accessories, accessoryId]
    }));
  };

  const generateAvatar = async () => {
    try {
      setIsCustomizing(true);
      
      // Mock Ready Player Me avatar generation
      const newAvatar = await avatarModelService.generateAvatar(customization);
      
      if (newAvatar) {
        onAvatarUpdate?.(newAvatar.id);
      }
      
      setIsCustomizing(false);
    } catch (error) {
      console.error('Failed to generate avatar:', error);
      setIsCustomizing(false);
    }
  };

  const loadExistingAvatar = async () => {
    try {
      const avatar = await avatarModelService.loadAvatarModel(selectedAvatar);
      console.log('Loaded avatar:', avatar);
    } catch (error) {
      console.error('Failed to load avatar:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Avatar Customization</span>
            <Badge variant="outline" className="text-xs">Ready Player Me</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={loadExistingAvatar}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="clothing">Clothing</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4">
            {/* Skin Tone */}
            <div className="space-y-3">
              <Label>Skin Tone</Label>
              <div className="grid grid-cols-4 gap-2">
                {skinTones.map((tone) => (
                  <motion.button
                    key={tone.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCustomizationChange('skinTone', tone.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      customization.skinTone === tone.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded"
                      style={{ backgroundColor: tone.color }}
                    />
                    <div className="text-xs mt-1">{tone.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Hair Style */}
            <div className="space-y-3">
              <Label>Hair Style</Label>
              <div className="grid grid-cols-2 gap-2">
                {hairStyles.map((style) => (
                  <Button
                    key={style.id}
                    variant={customization.hairStyle === style.id ? "default" : "outline"}
                    onClick={() => handleCustomizationChange('hairStyle', style.id)}
                    className="h-auto p-3 text-left"
                  >
                    {style.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div className="space-y-3">
              <Label>Hair Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {hairColors.map((color) => (
                  <motion.button
                    key={color.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCustomizationChange('hairColor', color.id)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      customization.hairColor === color.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div
                      className="w-full h-6 rounded"
                      style={{ backgroundColor: color.color }}
                    />
                    <div className="text-xs mt-1">{color.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="clothing" className="space-y-4">
            <div className="space-y-3">
              <Label>Professional Outfits</Label>
              <div className="space-y-2">
                {outfits.map((outfit) => (
                  <motion.div
                    key={outfit.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      customization.outfit === outfit.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleCustomizationChange('outfit', outfit.id)}
                  >
                    <div className="font-medium">{outfit.name}</div>
                    <div className="text-sm text-muted-foreground">{outfit.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessories" className="space-y-4">
            <div className="space-y-3">
              <Label>Accessories</Label>
              <div className="grid grid-cols-2 gap-2">
                {accessories.map((accessory) => (
                  <Button
                    key={accessory.id}
                    variant={customization.accessories.includes(accessory.id) ? "default" : "outline"}
                    onClick={() => handleAccessoryToggle(accessory.id)}
                    className="h-auto p-3"
                  >
                    {accessory.name}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Button
            onClick={generateAvatar}
            disabled={isCustomizing}
            className="w-full gradient-stream"
            size="lg"
          >
            {isCustomizing ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating Avatar...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Custom Avatar
              </>
            )}
          </Button>

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        {/* API Status */}
        <div className="text-xs text-muted-foreground">
          {avatarModelService.isSupported()
            ? 'Ready Player Me integration ready'
            : 'Avatar service unavailable'
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadyPlayerMeIntegration;