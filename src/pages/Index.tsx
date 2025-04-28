
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import WebcamCapture from '@/components/WebcamCapture';
import SignRecognition from '@/components/SignRecognition';
import { detectSign, getRecognizableSigns } from '@/services/signDetection';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [recognizedSign, setRecognizedSign] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  
  const handleVideoFrame = (imageData: ImageData) => {
    // Process the video frame to detect signs
    const result = detectSign(imageData);
    
    if (result.sign !== recognizedSign || Math.abs(result.confidence - confidence) > 0.1) {
      setRecognizedSign(result.sign);
      setConfidence(result.confidence);
    }
  };
  
  const recognizableSigns = getRecognizableSigns();

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign Sense</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          Real-time sign language recognition system
        </p>
      </header>

      <main className="w-full max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sign Detection</CardTitle>
            <CardDescription>
              Position your hands in the camera view to recognize sign language gestures
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <WebcamCapture onFrame={handleVideoFrame} />
            <SignRecognition 
              recognizedSign={recognizedSign} 
              confidence={confidence} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recognizable Signs</CardTitle>
            <CardDescription>
              This system can currently recognize the following signs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recognizableSigns.map((sign) => (
                <Badge key={sign} variant="secondary" className="text-md py-1 px-3">
                  {sign}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
