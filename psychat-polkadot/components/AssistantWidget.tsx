import React, { useCallback, useMemo, useRef, useState } from 'react';
import { HoloButton } from './ui/holo/HoloButton';
import { HoloPanel } from './ui/holo/HoloPanel';

type AssistantMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
};

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const toggle = useCallback(() => setIsOpen(v => !v), []);

  const placeholder = useMemo(
    () => 'Ask me anything about PsyChat or request an action…',
    []
  );

  const send = useCallback(async () => {
    const content = input.trim();
    if (!content || isLoading) return;

    const userMsg: AssistantMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: content,
      ts: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content }],
          provider: 'xai',
          model: 'grok-4',
        }),
      });
      const data = await res.json();
      const aiText: string = data?.response || 'Sorry, I could not generate a response.';

      const aiMsg: AssistantMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        text: aiText,
        ts: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error('Assistant error', e);
      setMessages(prev => [
        ...prev,
        {
          id: `e_${Date.now()}`,
          role: 'assistant',
          text: 'There was an issue reaching the assistant. Please try again.',
          ts: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60]">
      <div className="pointer-events-auto">
        {/* Floating toggle button with holo styling */}
        <HoloButton
          size="md"
          variant="primary"
          onClick={toggle}
          className="!p-0 h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
        >
          {isOpen ? <span className="text-xl">×</span> : <span className="text-sm tracking-wider">AI</span>}
        </HoloButton>

        {/* Popup panel */}
        {isOpen && (
          <div className="mt-3 w-[360px]">
            <HoloPanel variant="floating" size="lg" className="bg-black/40">
              <div className="flex items-center justify-between border-b border-cyan-400/20 px-4 py-3">
                <div className="text-sm font-medium text-cyan-200">PsyChat Assistant</div>
                <HoloButton variant="ghost" size="sm" onClick={toggle} className="!px-2 !py-1">
                  ×
                </HoloButton>
              </div>

              <div className="max-h-[50vh] space-y-3 overflow-y-auto px-4 py-3">
              {messages.length === 0 && (
                <div className="rounded-lg border border-dashed border-cyan-400/20 p-3 text-xs text-cyan-200/80">
                  Ask about features, how to mint or trade, or request actions like “buy token X with 1 SOL”. I’ll guide you and, when ready, I’ll ask for confirmation before any transaction.
                </div>
              )}

              {messages.map(m => (
                <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div
                    className={
                      'inline-block max-w-[80%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ' +
                      (m.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/30 text-cyan-100'
                        : 'bg-black/40 text-cyan-100 border border-cyan-400/20')
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              </div>

              <div className="border-t border-cyan-400/20 p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    rows={2}
                    className="flex-1 resize-none rounded-xl border border-cyan-400/20 bg-black/40 px-3 py-2 text-sm text-cyan-100 placeholder-cyan-300/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  />
                  <HoloButton
                    onClick={send}
                    disabled={isLoading || input.trim().length === 0}
                    size="sm"
                    className="h-9 px-3"
                  >
                    {isLoading ? 'Sending…' : 'Send'}
                  </HoloButton>
                </div>
                <div className="mt-1 text-[10px] text-cyan-300/50">Press ⌘/Ctrl+Enter to send</div>
              </div>
            </HoloPanel>
          </div>
        )}
      </div>
    </div>
  );
}


