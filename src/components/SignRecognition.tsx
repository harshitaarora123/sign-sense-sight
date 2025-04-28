import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface SignRecognitionProps {
  recognizedSign: string | null;
  confidence: number;
}

const SignRecognition: React.FC<SignRecognitionProps> = ({ recognizedSign, confidence }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add newly recognized signs to history
  useEffect(() => {
    if (recognizedSign && confidence > 0.7) {
      setIsProcessing(true);
      
      // Small delay to simulate processing
      const timer = setTimeout(() => {
        setHistory(prev => {
          // Don't add duplicates in a row
          if (prev.length > 0 && prev[prev.length - 1] === recognizedSign) {
            return prev;
          }
          
          // Keep only the last 5 items
          const newHistory = [...prev, recognizedSign];
          if (newHistory.length > 5) {
            return newHistory.slice(newHistory.length - 5);
          }
          return newHistory;
        });
        setIsProcessing(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [recognizedSign, confidence]);

  return (
    <div className="recognition-box w-full max-w-[600px] mt-4">
      <div className="flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Current Recognition</h3>
          <div className="h-14 flex items-center">
            {recognizedSign ? (
              <div className="flex items-center">
                <span className={`sign-badge text-xl ${isProcessing ? 'animate-pulse-light' : ''}`}>
                  {recognizedSign}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {Math.round(confidence * 100)}% confidence
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">No sign detected</span>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Recent Signs</h3>
          <div className="flex flex-wrap gap-2">
            {history.length > 0 ? (
              history.map((sign, index) => (
                <Badge key={index} variant="outline" className="text-md py-1">
                  {sign}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">No history yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignRecognition;
