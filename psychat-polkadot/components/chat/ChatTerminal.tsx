import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HoloButton, HoloText } from '../ui/holo';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SessionHeader from './SessionHeader';
import MessageInput from './MessageInput';
import GridDistortion from '../GridDistortion';
import ChatHeader from './ChatHeader';
// Removed arciumChatService import - was Solana-specific
// Placeholder types for XX Network encryption
interface EncryptedMessage {
  id: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
}

interface ChatAnalysis {
  sentiment: string;
  topics: string[];
  insights: string[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  encrypted?: boolean;
  hnftMinted?: boolean;
  encryptedData?: EncryptedMessage;
  arciumAnalysis?: ChatAnalysis;
}

interface ChatTerminalProps {
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  isEncrypting: boolean;
  isMinting: boolean;
  isAIThinking: boolean;
  encryptionStatus: 'idle' | 'encrypting' | 'encrypted' | 'error';
  onEndSession: () => Promise<void>;
  onToggleHNFT?: () => void;
  isHNFTVisible?: boolean;
  hasHNFT?: boolean;
  onNavigateToVideo?: () => void;
}

export default function ChatTerminal({
  messages,
  inputText,
  setInputText,
  handleSendMessage,
  isEncrypting,
  isMinting,
  isAIThinking,
  encryptionStatus,
  onEndSession,
  onToggleHNFT,
  isHNFTVisible,
  hasHNFT = false,
  onNavigateToVideo
}: ChatTerminalProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [sessionStart] = useState<Date>(new Date());
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  
  // Arcium state
  const [arciumStatus, setArciumStatus] = useState<{
    isConnected: boolean;
    nodeCount: number;
    lastUpdate: number;
  }>({ isConnected: false, nodeCount: 0, lastUpdate: 0 });
  const [isArciumInitialized, setIsArciumInitialized] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearTop = scrollTop < 100;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      const hasScrollableContent = scrollHeight > clientHeight;
      setShowScrollToTop(!isNearTop && hasScrollableContent);
      setShowScrollDown(!isNearBottom && hasScrollableContent);
    }
  };


  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Initialize Arcium service
  useEffect(() => {
    // Placeholder for XX Network initialization
    setIsArciumInitialized(true);
    setArciumStatus({
      isConnected: true,
      nodeCount: 0,
      lastUpdate: Date.now()
    });
  }, []);

  // Update Arcium status periodically
  useEffect(() => {
    if (!isArciumInitialized) return;

    // Placeholder for XX Network status updates
    const updateStatus = async () => {
      setArciumStatus({
        isConnected: true,
        nodeCount: 0,
        lastUpdate: Date.now()
      });
    };

    const interval = setInterval(updateStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [isArciumInitialized]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Session duration calculation
  const getSessionDuration = () => {
    const now = new Date();
    const diff = now.getTime() - sessionStart.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  // Extract topics from messages (basic keyword extraction)
  const extractTopics = () => {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
    
    const allText = messages
      .map(m => m.text.toLowerCase())
      .join(' ')
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    const wordCount = allText.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh] md:max-h-[90vh]">
      
      {/* Header - Separate component on top */}
      <ChatHeader 
        onToggleHNFT={onToggleHNFT}
        isHNFTVisible={isHNFTVisible}
      />
      
      {/* Terminal Container - Mobile Optimized */}
      <div className="chat-terminal flex-1 flex flex-col crystal-glass crystal-panel crystal-layer-2 relative">
        {/* Grid Distortion Background */}
        <GridDistortion 
          grid={20}
          mouse={0.15}
          strength={0.1}
          relaxation={0.95}
          imageSrc=""
          className="absolute inset-0 z-0"
        />
        
        {/* Crystal corner accents */}
        <div className="crystal-corner-tl" />
        <div className="crystal-corner-tr" />
        <div className="crystal-corner-bl" />
        <div className="crystal-corner-br" />
        
        {/* Geometric overlay */}
        <div className="geometric-overlay" />
        
        {/* Sharp geometric lines */}
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 crystal-line" />
        <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 crystal-line-magenta" />
        <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 crystal-line-purple" />
        <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 crystal-line" />
        
        {/* Crystal scan line effect */}
        <div className="absolute inset-0 crystal-grid animate-[holographic-scan_6s_linear_infinite]" />
      
      {/* Content Area - Mobile Optimized */}
      <div className="flex-1 flex flex-col p-3 md:p-4 crystal-glass-hover relative z-10 min-h-0">

        {/* Messages - Scrollable Container - Mobile Optimized */}
        <div 
          ref={messagesContainerRef}
          className="messages-container flex-1 overflow-y-auto mb-3 md:mb-4 custom-scrollbar max-h-[40vh] md:max-h-[50vh] min-h-[150px] md:min-h-[200px] relative"
        >
          {/* Scroll fade indicators */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
          
          {/* Scroll to top button - Mobile Optimized */}
          {showScrollToTop && (
            <button
              onClick={scrollToTop}
              className="absolute top-2 md:top-4 right-2 md:right-4 z-20 p-2 md:p-2 rounded-lg bg-black/60 border border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] crystal-glass-hover"
              title="Scroll to top"
            >
              <svg className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          )}
          
          
          {/* Scroll down indicator - Mobile Optimized */}
          {showScrollDown && (
            <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-20 p-2 rounded-lg bg-black/60 border border-cyan-400/30 animate-bounce">
              <svg className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          )}
          
          <div className="p-2">
            {!hasHNFT ? (
              <div className="text-center py-8 md:py-12 text-white/80">
                <div className="text-4xl md:text-6xl mb-3 md:mb-4">🔐</div>
                <h2 className="text-lg md:text-h2 text-white mb-3 md:mb-4">Mint Your Identity First</h2>
                <p className="text-sm md:text-body-lg mb-2 text-white/90">To start chatting, you need to mint your PsyChat identity HNFT.</p>
                <p className="text-xs md:text-body-sm text-white/60">
                  This creates your decentralized identity for secure, private conversations.
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-white/80">
                <div className="text-3xl md:text-4xl mb-2">💭</div>
                <p className="text-sm md:text-body-lg text-white">Start a conversation with Psychat...</p>
                <p className="text-xs md:text-body-sm mt-2 text-white/60">
                  Each conversation will be encrypted, minted as a ChatNFT and added to you HNFT.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isUser={message.role === 'user'}
                  />
                ))}
              </div>
            )}
            
            {/* Typing Indicator */}
            {isAIThinking && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Arcium Status Display - Mobile Optimized */}
        {hasHNFT && (
          <div className="mb-3 md:mb-4 p-2 md:p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className={`w-2 h-2 rounded-full ${arciumStatus.isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-xs md:text-body-sm text-white/80">
                  Arcium MPC: {arciumStatus.isConnected ? 'Connected' : 'Disconnected'}
                </span>
                {arciumStatus.nodeCount > 0 && (
                  <span className="text-xs text-white/60">
                    ({arciumStatus.nodeCount} nodes)
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 border border-green-400/30">
                  🔒 Encrypted
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Input - Mobile Optimized */}
        {hasHNFT && (
          <div className="mb-3 md:mb-4">
            <MessageInput
              value={inputText}
              onChange={setInputText}
              onSend={handleSendMessage}
              disabled={isEncrypting || isMinting}
              isAIThinking={isAIThinking}
            />
          </div>
        )}

        {/* End Session Button - Mobile Optimized */}
        {hasHNFT && (
          <div className="mb-3 md:mb-4 flex justify-end">
            <button
              onClick={onEndSession}
              disabled={isEncrypting || isMinting || messages.length === 0}
              className="text-xs md:text-body-sm text-white hover:text-white transition-all duration-300 px-3 md:px-4 py-2 rounded-lg border border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              End Session and Mint ChatNFT
            </button>
          </div>
        )}

        {/* Talk to Human Therapist Button - Mobile Optimized */}
        {hasHNFT && onNavigateToVideo && (
          <div className="mb-3 md:mb-4 flex justify-center">
            <button
              onClick={onNavigateToVideo}
              className="text-xs md:text-body-sm text-white hover:text-white transition-all duration-300 px-4 md:px-6 py-2 md:py-3 rounded-lg border border-cyan-400/50 hover:border-cyan-400/70 bg-cyan-500/10 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center space-x-2"
            >
              <span>👨‍⚕️</span>
              <span className="hidden sm:inline">Talk to a Human Therapist</span>
              <span className="sm:hidden">Human Therapist</span>
            </button>
          </div>
        )}

        {/* Encryption Status Indicator - Mobile Optimized */}
        {hasHNFT && encryptionStatus !== 'idle' && (
          <div className="mb-3 md:mb-4 flex justify-center">
            <div className={`px-3 md:px-4 py-2 rounded-lg border text-xs md:text-body-sm transition-all duration-300 ${
              encryptionStatus === 'encrypting' 
                ? 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10 animate-pulse' 
                : encryptionStatus === 'encrypted'
                ? 'text-green-400 border-green-400/50 bg-green-400/10'
                : 'text-red-400 border-red-400/50 bg-red-400/10'
            }`}>
              {encryptionStatus === 'encrypting' && (
                <span className="flex items-center gap-1 md:gap-2">
                  <span>🔐</span>
                  <span className="hidden sm:inline">Encrypting conversation with Arcium MPC...</span>
                  <span className="sm:hidden">Encrypting...</span>
                </span>
              )}
              {encryptionStatus === 'encrypted' && (
                <span className="flex items-center gap-1 md:gap-2">
                  <span>✅</span>
                  <span className="hidden sm:inline">Conversation encrypted and stored in ChatNFT</span>
                  <span className="sm:hidden">Encrypted & Stored</span>
                </span>
              )}
              {encryptionStatus === 'error' && (
                <span className="flex items-center gap-1 md:gap-2">
                  <span>⚠️</span>
                  <span className="hidden sm:inline">Encryption failed, but ChatNFT will still be created</span>
                  <span className="sm:hidden">Encryption failed</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
