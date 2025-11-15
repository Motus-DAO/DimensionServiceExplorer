import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HoloButton, HoloText } from '../ui/holo';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  isAIThinking: boolean;
}

export default function MessageInput({
  value,
  onChange,
  onSend,
  disabled,
  isAIThinking
}: MessageInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 2000;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !isAIThinking) {
        onSend();
      }
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled && !isAIThinking) {
      onSend();
    }
  };

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="message-input-container"
    >
      {/* Input Container */}
      <div className={`
        crystal-glass alive-glass rounded-xl border transition-all duration-300
        ${isFocused 
          ? 'border-electric-cyan/30 shadow-md shadow-electric-cyan/5' 
          : 'border-white/15'
        }
        ${disabled ? 'opacity-50' : ''}
      `}>
        <div className="p-4">
          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isAIThinking ? "Psychat is thinking..." : "Share your thoughts, feelings, or therapy insights..."}
              className="w-full resize-none px-4 py-3 text-white placeholder-white/60 focus:outline-none bg-transparent border-0 text-base leading-relaxed"
              disabled={disabled || isAIThinking}
              maxLength={maxLength}
              rows={1}
              style={{ minHeight: '60px', maxHeight: '200px' }}
            />
            
            {/* Character Counter */}
            <div className="absolute bottom-2 right-2 text-xs text-white/40">
              <span className={isOverLimit ? 'text-vibrant-magenta' : isNearLimit ? 'text-yellow-400' : ''}>
                {characterCount}/{maxLength}
              </span>
            </div>
          </div>

          {/* Input Footer */}
          <div className="flex items-center justify-between mt-3">
            {/* Send Button */}
            <div className="flex items-center space-x-2">
              <HoloButton
                onClick={handleSend}
                disabled={!value.trim() || disabled || isAIThinking || isOverLimit}
                className="px-6 py-2"
              >
                {isAIThinking ? '⏳' : disabled ? '🔒' : 'Send'}
              </HoloButton>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {isOverLimit && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-2 crystal-glass alive-glass border border-vibrant-magenta/20 rounded-lg"
        >
          <div className="text-vibrant-magenta text-sm">
            ⚠️ Message too long. Please shorten your message to continue.
          </div>
        </motion.div>
      )}

      {isNearLimit && !isOverLimit && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-2 crystal-glass alive-glass border border-yellow-400/20 rounded-lg"
        >
          <div className="text-yellow-400 text-sm">
            ⚠️ Approaching character limit ({Math.round((characterCount / maxLength) * 100)}%)
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
