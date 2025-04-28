
// Mock sign language detection service
// In a real application, this would use a trained machine learning model

// Supported signs mapping
const supportedSigns = {
  'hello': [0, 1, 2, 3, 4], // Simulated hand feature vector for "hello" gesture
  'thank you': [1, 2, 3, 4, 0], // Simulated hand feature vector for "thank you" gesture
  'yes': [2, 3, 4, 0, 1], // Simulated hand feature vector for "yes" gesture
  'no': [3, 4, 0, 1, 2], // Simulated hand feature vector for "no" gesture
  'please': [4, 0, 1, 2, 3], // Simulated hand feature vector for "please" gesture
};

// Simplified mock detection function
export const detectSign = (imageData: ImageData): { sign: string | null; confidence: number } => {
  // In a real implementation, this would:
  // 1. Process the image to detect hand landmarks
  // 2. Extract features from landmarks
  // 3. Run those features through a trained model
  // 4. Return the predicted sign and confidence

  // Generate a random number to simulate different detections
  const randomValue = Math.random();
  
  // Only recognize a sign about 40% of the time to simulate realistic detection
  if (randomValue > 0.6) {
    // Select a random sign
    const signs = Object.keys(supportedSigns);
    const randomSignIndex = Math.floor(Math.random() * signs.length);
    const selectedSign = signs[randomSignIndex];
    
    // Random confidence between 0.7 and 0.95
    const confidence = 0.7 + Math.random() * 0.25;
    
    return {
      sign: selectedSign,
      confidence
    };
  }
  
  return {
    sign: null,
    confidence: 0
  };
};

// List of signs the system can recognize
export const getRecognizableSigns = (): string[] => {
  return Object.keys(supportedSigns);
};
