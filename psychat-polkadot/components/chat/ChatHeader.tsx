import React from 'react';

interface ChatHeaderProps {
  onToggleHNFT?: () => void;
  isHNFTVisible?: boolean;
}

export default function ChatHeader({
  onToggleHNFT,
  isHNFTVisible
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-cyan-400/20 bg-black/90 backdrop-blur-sm relative z-[100] w-full flex-shrink-0">
      <h1 className="text-2xl font-bold text-cyan-400 font-futuristic">
        Therapy Chat
      </h1>
      <button
        onClick={onToggleHNFT}
        className="text-white hover:text-cyan-400 transition-all duration-300 text-sm px-4 py-2 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-400/10 bg-black/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
      >
        {isHNFTVisible ? "Hide Panel" : "Show Panel"}
      </button>
    </div>
  );
}
