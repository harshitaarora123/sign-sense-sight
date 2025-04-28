
import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface WebcamCaptureProps {
  onFrame: (imageData: ImageData) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onFrame }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  const animationRef = useRef<number | null>(null);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        setHasPermission(true);
        processFrames();
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access webcam. Please check permissions.",
        variant: "destructive"
      });
      setHasPermission(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  };

  const processFrames = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    const processFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data for processing
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        onFrame(imageData);
      }
      
      // Continue processing frames
      animationRef.current = requestAnimationFrame(processFrame);
    };
    
    animationRef.current = requestAnimationFrame(processFrame);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="camera-container mb-4">
        {isActive && <div className="camera-overlay"></div>}
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${!isActive && 'opacity-70'}`}
        />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
            <Scan className="w-24 h-24 text-muted-foreground opacity-50" />
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      <Button 
        onClick={isActive ? stopWebcam : startWebcam}
        className="mt-2"
        variant={isActive ? "outline" : "default"}
      >
        {isActive ? (
          <>
            <CameraOff className="mr-2 h-4 w-4" /> 
            Stop Camera
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" /> 
            Start Camera
          </>
        )}
      </Button>

      {hasPermission === false && (
        <p className="text-destructive mt-2 text-sm">
          Camera access denied. Please check your browser permissions.
        </p>
      )}
    </div>
  );
};

export default WebcamCapture;
