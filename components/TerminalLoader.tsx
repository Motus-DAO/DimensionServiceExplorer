import { useState, useEffect } from 'react';
import DecryptedText from './DecryptedText';

interface TerminalLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

export default function TerminalLoader({ onComplete, duration = 6000 }: TerminalLoaderProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const lines = [
    "Welcome to the Lunarpunk world,",
    "A new kind of Liquid Public Goods.",
    "An AI Dataconomy that empowers humans.",
    "From Degen to Regen tokenomics.",
    "Self-custody and sovereignty.",
    "This is the future of mental health in Web3."
  ];

  useEffect(() => {
    const lineInterval = setInterval(() => {
      setCurrentLine(prev => {
        if (prev < lines.length - 1) {
          return prev + 1;
        } else {
          clearInterval(lineInterval);
          // Wait a bit before completing
          setTimeout(() => {
            setIsComplete(true);
            setShowLoader(false);
            onComplete?.();
          }, 2000);
          return prev;
        }
      });
    }, duration / lines.length);

    return () => clearInterval(lineInterval);
  }, [lines.length, duration, onComplete]);

  if (!showLoader) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-fadeIn">
      <div className="w-full max-w-4xl mx-4">
        <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="ml-4 text-gray-300 text-sm font-mono">
            Dimension Service Explorer Terminal v1.0.0
          </div>
        </div>

        <div className="bg-black border-2 border-gray-700 rounded-b-lg p-6 font-mono text-green-400 min-h-[400px]">
          <div className="flex items-center mb-4">
            <span className="text-green-400 mr-2">dimension-service-explorer $</span>
            <span className="text-gray-400">dse --init --lunarpunk</span>
            <div className="w-2 h-4 bg-green-400 ml-1 animate-pulse"></div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-yellow-400">Loading The Digital Renaissance...</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            
            <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-3000 ease-in-out"
                style={{ width: `${(currentLine / lines.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            {lines.map((line, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index <= currentLine 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-5'
                }`}
              >
                {index <= currentLine && (
                  <DecryptedText
                    text={line}
                    speed={30}
                    maxIterations={15}
                    sequential={true}
                    revealDirection="start"
                    className="text-green-400"
                    encryptedClassName="text-gray-500"
                    animateOn="view"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-700">
            <div className="text-gray-500 text-sm">
              <div>Initializing Web3 connection...</div>
              <div>Loading AI models...</div>
              <div>Setting up decentralized storage...</div>
            </div>
          </div>

          <div className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
