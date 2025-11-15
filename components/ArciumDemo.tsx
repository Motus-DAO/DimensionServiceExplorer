import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HoloPanel, HoloText } from './ui';
// Removed arciumChatService import - was Solana-specific
// Placeholder types for XX Network encryption
interface EncryptedMessage {
  id: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
  encryptedData?: string;
  publicKey?: string;
}

interface ChatAnalysis {
  sentiment: string;
  topics: string[];
  insights: string[];
  computationId?: string;
  mpcNodes?: number;
  processingTime?: number;
  encryptedInsights?: string;
}
import { FaLock, FaShieldAlt, FaNetworkWired, FaBrain, FaEye, FaEyeSlash } from 'react-icons/fa';

interface ArciumDemoProps {
  className?: string;
}

export const ArciumDemo: React.FC<ArciumDemoProps> = ({ className }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({
    isConnected: false,
    nodeCount: 0,
    lastUpdate: 0,
    isLocalnet: false
  });
  const [demoMessage, setDemoMessage] = useState('Hello, I need help with my anxiety...');
  const [encryptedMessage, setEncryptedMessage] = useState<EncryptedMessage | null>(null);
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null);
  const [showEncrypted, setShowEncrypted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Placeholder for XX Network initialization
    setIsInitialized(true);
    setNetworkStatus({
      isConnected: true,
      nodeCount: 0,
      lastUpdate: Date.now(),
      isLocalnet: false
    });
  }, []);

  const handleEncryptMessage = async () => {
    if (!demoMessage.trim()) return;
    
    setIsProcessing(true);
    try {
      // Placeholder for XX Network encryption
      const encryptedData = btoa(unescape(encodeURIComponent(demoMessage)));
      const encrypted: EncryptedMessage = {
        id: `msg_${Date.now()}`,
        content: demoMessage,
        timestamp: Date.now(),
        encrypted: true,
        encryptedData: encryptedData,
        publicKey: `key_${Date.now()}`
      };
      setEncryptedMessage(encrypted);
      
      // Simulate processing
      setTimeout(() => {
        const analysis: ChatAnalysis = {
          sentiment: 'neutral',
          topics: ['anxiety', 'therapy'],
          insights: ['Placeholder analysis - will be replaced with XX Network processing'],
          computationId: `comp_${Date.now()}`,
          mpcNodes: 0,
          processingTime: 2000,
          encryptedInsights: 'Placeholder encrypted insights'
        };
        setAnalysis(analysis as any);
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Encryption failed:', error);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setEncryptedMessage(null);
    setAnalysis(null);
    setShowEncrypted(false);
    setDemoMessage('Hello, I need help with my anxiety...');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Arcium MPC Integration Demo</h2>
        <p className="text-white/70">Privacy-preserving chat encryption with Multi-Party Computation</p>
      </motion.div>

      {/* Network Status */}
      <HoloPanel className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FaNetworkWired className="text-purple-400 text-xl" />
            <div>
              <h3 className="text-lg font-semibold text-white">Arcium Network Status</h3>
              <p className="text-sm text-white/70">MPC nodes and encryption services</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            networkStatus.isConnected 
              ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
              : 'bg-red-500/20 text-red-400 border border-red-400/30'
          }`}>
            {networkStatus.isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        {networkStatus.nodeCount > 0 && (
          <div className="flex items-center space-x-4 text-sm text-white/60">
            <span>MPC Nodes: {networkStatus.nodeCount}</span>
            <span>•</span>
            <span>Network: {networkStatus.isLocalnet ? 'Local' : 'Remote'}</span>
            <span>•</span>
            <span>Last Update: {new Date(networkStatus.lastUpdate).toLocaleTimeString()}</span>
          </div>
        )}
      </HoloPanel>

      {/* Demo Interface */}
      <HoloPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <FaLock className="text-cyan-400" />
          <span>Encryption Demo</span>
        </h3>

        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-2">Therapy Message</label>
            <textarea
              value={demoMessage}
              onChange={(e) => setDemoMessage(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/20 border border-cyan-400/30 text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none"
              rows={3}
              placeholder="Enter a sensitive therapy message..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleEncryptMessage}
              disabled={isProcessing || !demoMessage.trim()}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isProcessing ? 'Encrypting...' : 'Encrypt with Arcium'}
            </button>
            
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {encryptedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            {/* Encrypted Data Display */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-400/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FaShieldAlt className="text-purple-400" />
                  <span className="text-sm font-medium text-white">Encrypted Data</span>
                </div>
                <button
                  onClick={() => setShowEncrypted(!showEncrypted)}
                  className="flex items-center space-x-1 text-xs text-purple-300 hover:text-purple-200 transition-colors"
                >
                  {showEncrypted ? <FaEyeSlash /> : <FaEye />}
                  <span>{showEncrypted ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              
              <div className="font-mono text-xs text-white/80 break-all">
                {showEncrypted ? encryptedMessage.encryptedData : '••••••••••••••••••••••••••••••••'}
              </div>
              
              <div className="mt-2 flex items-center space-x-4 text-xs text-white/60">
                <span>ID: {encryptedMessage.id}</span>
                <span>•</span>
                <span>Key: {encryptedMessage.publicKey}</span>
                <span>•</span>
                <span>Time: {new Date(encryptedMessage.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* MPC Analysis */}
            {analysis && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/20">
              <div className="flex items-center space-x-2 mb-3">
                <FaBrain className="text-green-400" />
                <span className="text-sm font-medium text-white">MPC Analysis Results</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-white/60 mb-1">Sentiment</div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    analysis.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                    analysis.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {analysis.sentiment}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-white/60 mb-1">Topics</div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.topics.map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-white/60 mb-1">Computation ID</div>
                  <div className="font-mono text-xs text-white/80 break-all">
                    {analysis.computationId}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-white/60 mb-1">MPC Nodes</div>
                  <div className="text-sm text-blue-400">{analysis.mpcNodes}</div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Processing Time</div>
                  <div className="text-sm text-green-400">{analysis.processingTime}ms</div>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-black/20 rounded text-xs text-white/70">
                {analysis.encryptedInsights}
              </div>
            </div>
            )}
          </motion.div>
        )}
      </HoloPanel>

      {/* Features Overview */}
      <HoloPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Arcium MPC Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <FaLock className="text-cyan-400 mt-1" />
              <div>
                <div className="text-sm font-medium text-white">End-to-End Encryption</div>
                <div className="text-xs text-white/60">Messages encrypted before transmission</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <FaShieldAlt className="text-purple-400 mt-1" />
              <div>
                <div className="text-sm font-medium text-white">Multi-Party Computation</div>
                <div className="text-xs text-white/60">Analysis without exposing raw data</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <FaBrain className="text-green-400 mt-1" />
              <div>
                <div className="text-sm font-medium text-white">Privacy-Preserving AI</div>
                <div className="text-xs text-white/60">AI analysis on encrypted data only</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <FaNetworkWired className="text-blue-400 mt-1" />
              <div>
                <div className="text-sm font-medium text-white">Decentralized Network</div>
                <div className="text-xs text-white/60">No single point of failure</div>
              </div>
            </div>
          </div>
        </div>
      </HoloPanel>
    </div>
  );
};

export default ArciumDemo;
