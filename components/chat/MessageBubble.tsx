import { motion } from 'framer-motion';
import { HoloText } from '../ui/holo';
// Removed arcium-chat import - was Solana-specific
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

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

export default function MessageBubble({ message, isUser }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return formatTime(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`message-bubble ${isUser ? 'user' : 'ai'} mb-4`}
    >
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[85%]`}>
          {/* Avatar and Timestamp - Inline */}
          <div className={`flex items-center space-x-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-vibrant-magenta to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
            )}
            <div className={`text-xs text-white/60`}>
              {isUser ? 'You' : 'Psychat'} • {formatRelativeTime(message.timestamp)}
            </div>
            {isUser && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-electric-cyan to-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">U</span>
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className={`relative`}>
            <div className={`
              crystal-glass alive-glass rounded-xl p-4 w-full
              ${isUser 
                ? 'bg-gradient-to-br from-electric-cyan/10 to-electric-cyan/3 border border-electric-cyan/20' 
                : 'bg-gradient-to-br from-vibrant-magenta/10 to-vibrant-magenta/3 border border-vibrant-magenta/20'
              }
            `}>
              <p className={`text-white/90 leading-relaxed font-terminal text-sm ${isUser ? 'text-right' : 'text-left'}`}>
                {message.text}
              </p>
              
              {/* Status Badges - Enhanced with Arcium */}
              <div className={`flex flex-wrap gap-1 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {message.encrypted && (
                  <span className="text-xs bg-electric-cyan/15 text-electric-cyan px-2 py-0.5 rounded flex items-center gap-1">
                    🔒 XX Network E2E encryption
                  </span>
                )}
                {message.encryptedData && (
                  <span className="text-xs bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded flex items-center gap-1">
                    🛡️ Arkiv blockchain storage
                  </span>
                )}
                {message.arciumAnalysis && (
                  <span className="text-xs bg-green-500/15 text-green-300 px-2 py-0.5 rounded flex items-center gap-1">
                    🧠 AI
                  </span>
                )}
                {message.hnftMinted && (
                  <span className="text-xs bg-vibrant-magenta/15 text-vibrant-magenta px-2 py-0.5 rounded">
                    🎫
                  </span>
                )}
                {/* Demo badges for hackathon - show on all messages */}
                {!message.encrypted && !message.encryptedData && !message.arciumAnalysis && !message.hnftMinted && (
                  <>
                    <span className="text-xs bg-electric-cyan/15 text-electric-cyan px-2 py-0.5 rounded flex items-center gap-1">
                      🔒 XX Network E2E encryption
                    </span>
                    <span className="text-xs bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded flex items-center gap-1">
                      🛡️ Arkiv blockchain storage
                    </span>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
