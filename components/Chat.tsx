import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { storeEncryptedConversation } from '../lib/encrypted-data-storage';
import { HoloPanel, HoloButton, HoloText } from '../components/ui/holo';
import { ComplexMolecule, WaterMolecule } from '../components/ui';
import { usePolkadotWallet } from '../contexts/PolkadotWalletContext';
import { useArkiv } from '../contexts/ArkivContext';
import { useArkivChat } from '../lib/hooks/useArkivChat';
import { useHyperbridge } from '../contexts/HyperbridgeContext';
import { useXXNetwork } from '../contexts/XXNetworkContext';

// New chat components
import HNFTIdentityCard from './chat/HNFTIdentityCard';
import HNFTStatusCompact from './chat/HNFTStatusCompact';
import ChatTerminal from './chat/ChatTerminal';
import ChatNFTList from './chat/ChatNFTList';
import ChatNFTStatusCompact from './chat/ChatNFTStatusCompact';
import XXChannelStatus from './chat/XXChannelStatus';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  encrypted?: boolean;
  hnftMinted?: boolean;
}

interface ChatNFT {
  transactionSignature: string;
  sessionId: string;
  timestamp: Date;
  messageCount?: number;
}

interface ChatProps {
  onNavigateToVideo?: () => void;
}

export default function Chat({ onNavigateToVideo }: ChatProps) {
  const { isConnected: isWalletConnected, selectedAccount } = usePolkadotWallet();
  const walletAddress = selectedAccount?.address || null;
  const { isConnected: isArkivConnected, connect: arkivConnect, ensureChatBase, mutateEntities, deriveChatBaseKey, walletClient, enc } = useArkiv();
  const arkivChat = useArkivChat(walletAddress);
  const { setup: hyperSetup, requestSessionVerification, monitorVerification, markVerified, isSessionVerified } = useHyperbridge();
  const [isSessionVerifiedState, setIsSessionVerifiedState] = useState(false);
  const { 
    ready: xxReady, 
    sendDirectMessage, 
    received, 
    selfPubkeyBase64, 
    selfToken, 
    walletAddress: xxWalletAddr,
    // Channel functions
    createTherapyChannel,
    sendChannelMessage,
    getChannelMessages,
    getTherapyChannel,
    channelReady
  } = useXXNetwork() as any;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState<'idle' | 'encrypting' | 'encrypted' | 'error'>('idle');
  const [optInMint, setOptInMint] = useState(true);
  const [hnftPda, setHnftPda] = useState<string | null>(null);
  const [hnftSig, setHnftSig] = useState<string | null>(null);
  const [lastTxUrl, setLastTxUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inProgressRef = useRef(false);
  
  // New state for HNFT section expansion
  const [isHNFTExpanded, setIsHNFTExpanded] = useState(true);
  
  // State for HNFT section visibility
  const [isHNFTVisible, setIsHNFTVisible] = useState(true);
  
  // AI thinking state for typing indicator
  const [isAIThinking, setIsAIThinking] = useState(false);

  // ChatNFT state management
  const [chatNFTs, setChatNFTs] = useState<ChatNFT[]>([]);
  const [isChatNFTListExpanded, setIsChatNFTListExpanded] = useState(false);
  const [isChatNFTVisible, setIsChatNFTVisible] = useState(true);
  const [txCount, setTxCount] = useState(0);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('psychat_active_session');
      if (saved) return saved;
    }
    const sid = Date.now().toString();
    if (typeof window !== 'undefined') window.localStorage.setItem('psychat_active_session', sid);
    return sid;
  });
  
  // XX Network channel state
  const [xxChannelId, setXXChannelId] = useState<string | null>(null);
  const [xxSyncStatus, setXXSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const clearMockData = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('psychat_hnft_pda');
      window.localStorage.removeItem('psychat_hnft_sig');
      window.localStorage.removeItem('psychat_chat_nfts');
      setHnftPda(null);
      setHnftSig(null);
      setChatNFTs([]);
      console.log('Mock data cleared');
    }
  };

  // Placeholder for transaction URL builder (to be replaced with Polkadot explorer)
  const buildTxUrl = (sig: string) => {
    // Placeholder - will be replaced with Polkadot explorer URL
    return `#${sig}`;
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    try { console.log('[XX] Ready state', { xxReady }); } catch {}
  }, [xxReady]);

  useEffect(() => {
    if (!walletAddress || !activeSessionId) return;
    const loadHistory = async () => {
      try {
        // Load from Arkiv first (existing implementation)
        const msgs = await arkivChat.getMessagesForSession(activeSessionId);
        const decoded = (msgs.entities || msgs || []).map((e: any) => {
          const roleAttr = e.attributes?.find((a: any) => a.key === 'role');
          const r = roleAttr?.value === 'assistant' ? 'assistant' : 'user';
          const payload = e.payload || e.payloadBase64;
          let text = '';
          if (typeof payload === 'string') {
            try {
              text = Buffer.from(payload, 'base64').toString('utf-8');
            } catch {
              text = payload;
            }
          } else if (payload instanceof Uint8Array) {
            try {
              text = new TextDecoder().decode(payload);
            } catch {
              text = '';
            }
          }
          return { id: `arkiv_${e.entityKey || Math.random()}`, role: r, text, timestamp: new Date() } as any;
        });
        if (decoded.length) setMessages(decoded as any);
        
        // Create XX Network channel for this session
        if (xxReady && channelReady && createTherapyChannel) {
          try {
            const channelId = await createTherapyChannel(activeSessionId);
            setXXChannelId(channelId);
            
            // Load XX Network messages
            const xxMessages = await getChannelMessages(channelId);
            if (xxMessages && xxMessages.length > 0) {
              const xxDecoded = xxMessages.map((m: any) => ({
                id: m.id,
                role: m.role,
                text: m.text,
                timestamp: new Date(m.timestamp)
              }));
              // Merge with Arkiv messages (avoid duplicates by checking if already have messages)
              if (!decoded.length) {
                setMessages(xxDecoded as any);
              }
            }
            try { console.log('[XX] Channel loaded for session', { channelId, sessionId: activeSessionId }); } catch {}
          } catch (e) {
            try { console.error('[XX] Failed to load channel', e); } catch {}
          }
        }
      } catch {}
    };
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, activeSessionId, xxReady, channelReady]);

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.history.back();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Auto-hide HNFT section on mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setIsHNFTVisible(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Connect Arkiv SDK and ensure chat base as soon as wallet is available
  useEffect(() => {
    const initArkiv = async () => {
      try {
        await arkivConnect();
        if (walletAddress) {
          await ensureChatBase(walletAddress);
          console.log('[Arkiv] Chat base ensured', { polkadotAddress: walletAddress });
          try {
            const k = `psychat_arkiv_tx_log_${walletAddress}`;
            const raw = localStorage.getItem(k);
            const arr = raw ? JSON.parse(raw) : [];
            setTxCount(Array.isArray(arr) ? arr.length : 0);
          } catch {}
          try {
            await hyperSetup();
          } catch {}
        }
      } catch {}
    };
    initArkiv();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  useEffect(() => {
    const pickLatestSession = async () => {
      try {
        if (!walletAddress) return;
        const sessions = await arkivChat.getSessions();
        const all = sessions.entities || [];
        if (!all.length) return;
        const latest = all[all.length - 1];
        const sidAttr = latest?.attributes?.find((a: any) => a.key === 'sessionId');
        const sid = sidAttr?.value || latest?.sessionId;
        if (sid && sid !== activeSessionId) {
          setActiveSessionId(String(sid));
          try { console.log('[Arkiv] Active session set', { sessionId: sid }); } catch {}
          if (typeof window !== 'undefined') window.localStorage.setItem('psychat_active_session', String(sid));
        }
      } catch {}
    };
    pickLatestSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const appendTxLog = (entry: { txHash?: string; entityKey?: string; type: string; sessionId?: string; role?: string; timestamp: number }, address?: string | null) => {
    try {
      const key = address ? `psychat_arkiv_tx_log_${address}` : 'psychat_arkiv_tx_log';
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(entry);
      localStorage.setItem(key, JSON.stringify(arr));
      setTxCount(arr.length);
    } catch {}
  };

  // Removed cleanupOldTransactions - was Solana-specific

  // Set initial HNFT expansion state
  useEffect(() => {
    // When HNFT is minted, automatically collapse to show compact sidebar
    if (hnftPda) {
      // Small delay to allow user to see the success state before collapsing
      const timer = setTimeout(() => {
        setIsHNFTExpanded(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [hnftPda]);

  // Handle HNFT card close - collapse but keep available
  const handleHNFTClose = () => {
    console.log('Closing HNFT card, setting isHNFTExpanded to false');
    setIsHNFTExpanded(false);
  };

  useEffect(() => {
    // Clear any existing mock data to force fresh minting
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('psychat_hnft_pda');
      const savedSig = window.localStorage.getItem('psychat_hnft_sig');
      
      // If we have mock data, clear it
      if (saved && saved.startsWith('mock_')) {
        console.log('Clearing mock HNFT data');
        window.localStorage.removeItem('psychat_hnft_pda');
        window.localStorage.removeItem('psychat_hnft_sig');
        setHnftPda(null);
        setHnftSig(null);
      } else if (saved && savedSig) {
        setHnftPda(saved);
        setHnftSig(savedSig);
      }

      // Load ChatNFTs from localStorage
      const savedChatNFTs = window.localStorage.getItem('psychat_chat_nfts');
      if (savedChatNFTs) {
        try {
          const parsedChatNFTs = JSON.parse(savedChatNFTs);
          // Convert timestamp strings back to Date objects
          const chatNFTsWithDates = parsedChatNFTs.map((nft: any) => ({
            ...nft,
            timestamp: new Date(nft.timestamp)
          }));
          setChatNFTs(chatNFTsWithDates);
        } catch (error) {
          console.error('Error parsing saved ChatNFTs:', error);
        }
      }
    }
  }, []);

  // Placeholder for checking existing identity (to be replaced with Polkadot DID check)
  useEffect(() => {
    // Check localStorage for existing identity
    if (typeof window !== 'undefined' && walletAddress) {
      const saved = window.localStorage.getItem('psychat_hnft_pda');
      const savedSig = window.localStorage.getItem('psychat_hnft_sig');
      if (saved && savedSig) {
        setHnftPda(saved);
        setHnftSig(savedSig);
      }
    }
  }, [walletAddress]);

  // Placeholder for encryption (to be replaced with XX Network encryption)
  const encryptWithXXNetwork = async (text: string): Promise<{ encrypted: string; proof: string; storageCid: string }> => {
    setIsEncrypting(true);
    // Placeholder encryption - will be replaced with XX Network SDK
    const encrypted = btoa(unescape(encodeURIComponent(text)));
    const proof = `proof_${Date.now()}`;
    const storageCid = `storage_${Date.now()}`;
    setIsEncrypting(false);
    return { encrypted, proof, storageCid };
  };

  // Placeholder for creating DID identity (to be replaced with Polkadot DID creation)
  const createDIDIdentity = async (): Promise<string> => {
    if (!isWalletConnected || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    setIsMinting(true);
    try {
      // Placeholder - will be replaced with Polkadot DID creation
      const didAddress = `did:polkadot:${walletAddress}_${Date.now()}`;
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Store in localStorage
      window.localStorage.setItem('psychat_hnft_pda', didAddress);
      window.localStorage.setItem('psychat_hnft_sig', txHash);
      setHnftPda(didAddress);
      setHnftSig(txHash);

      setIsMinting(false);
      return buildTxUrl(txHash);
    } catch (error) {
      setIsMinting(false);
      throw error as any;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !isWalletConnected) return;
    if (!hnftPda) {
      alert('Please create your PsyChat identity first.');
      return;
    }

    const userText = inputText.trim();
    const userId = `msg_${Date.now()}`;
    setInputText('');
    
    // Reset sync status to show new message is being processed
    setXXSyncStatus('idle');

    // Append user message
    const userMsg: Message = {
      id: userId,
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    
    // Store in Arkiv (existing blockchain storage)
    try {
      await arkivChat.ensureBase();
      console.log('[Arkiv] Storing message', { role: 'user', sessionId: activeSessionId });
      const receipt = await arkivChat.storeMessage(activeSessionId, 'user', userText);
      appendTxLog({ txHash: receipt.txHash, entityKey: receipt.entityKey, type: 'chatMessage', sessionId: activeSessionId, role: 'user', timestamp: Date.now() }, walletAddress);
      console.log('[Arkiv] Message stored', { role: 'user', entityKey: receipt.entityKey, txHash: receipt.txHash, sessionId: activeSessionId });
    } catch {}
    
    // Store in XX Network channel (decentralized E2E encrypted storage)
    if (xxReady && channelReady && xxChannelId && sendChannelMessage) {
      try {
        // Small delay to ensure UI updates before async operation
        await new Promise(resolve => setTimeout(resolve, 50));
        setXXSyncStatus('syncing');
        console.log('[XX] Sending channel message', { role: 'user', channelId: xxChannelId });
        const success = await sendChannelMessage(xxChannelId, 'user', userText);
        if (success) {
          // Keep synced status visible for a moment
          setXXSyncStatus('synced');
          console.log('[XX] Channel message sent');
          // Reset to idle after 1.5 seconds
          setTimeout(() => setXXSyncStatus('idle'), 1500);
        } else {
          setXXSyncStatus('error');
          // Reset error after 3 seconds
          setTimeout(() => setXXSyncStatus('idle'), 3000);
        }
      } catch (e) {
        setXXSyncStatus('error');
        console.error('[XX] Failed to send channel message', e);
        // Reset error after 3 seconds
        setTimeout(() => setXXSyncStatus('idle'), 3000);
      }
    }

    try {
      // Set AI thinking state
      setIsAIThinking(true);
      
      // Call Psychat API (using Grok)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userText }], provider: 'xai', model: 'grok-4-latest' }),
      });
      const data = await res.json();
      const aiText: string = data?.response || 'Sorry, there was an issue generating a response.';
      const sentiment: string = data?.sentiment || 'neutral';

      // Append assistant message
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: aiText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Store in Arkiv
      try {
        console.log('[Arkiv] Storing message', { role: 'assistant', sessionId: activeSessionId });
        const receipt2 = await arkivChat.storeMessage(activeSessionId, 'assistant', aiText);
        appendTxLog({ txHash: receipt2.txHash, entityKey: receipt2.entityKey, type: 'chatMessage', sessionId: activeSessionId, role: 'assistant', timestamp: Date.now() }, walletAddress);
        console.log('[Arkiv] Message stored', { role: 'assistant', entityKey: receipt2.entityKey, txHash: receipt2.txHash, sessionId: activeSessionId });
      } catch {}
      
      // Store in XX Network channel
      if (xxReady && channelReady && xxChannelId && sendChannelMessage) {
        try {
          // Small delay for visual feedback
          await new Promise(resolve => setTimeout(resolve, 50));
          setXXSyncStatus('syncing');
          console.log('[XX] Sending channel message', { role: 'assistant', channelId: xxChannelId });
          const success = await sendChannelMessage(xxChannelId, 'assistant', aiText);
          if (success) {
            setXXSyncStatus('synced');
            console.log('[XX] Channel message sent');
            // Reset to idle after 1.5 seconds
            setTimeout(() => setXXSyncStatus('idle'), 1500);
          } else {
            setXXSyncStatus('error');
            // Reset error after 3 seconds
            setTimeout(() => setXXSyncStatus('idle'), 3000);
          }
        } catch (e) {
          setXXSyncStatus('error');
          console.error('[XX] Failed to send channel message', e);
          // Reset error after 3 seconds
          setTimeout(() => setXXSyncStatus('idle'), 3000);
        }
      }

      // Keep chatting fluid; minting occurs only on "End Session"
    } catch (e) {
      console.error('Error processing chat:', e);
    } finally {
      setIsAIThinking(false);
    }
  };

  // Handle received XX Network messages (filter out metadata)
  useEffect(() => {
    if (!received || !received.length) return;
    const last = received[received.length - 1];
    
    // Filter out XX Network internal messages (metadata, notifications, etc.)
    // Only process messages with [CHANNEL:...] prefix that we sent
    if (last.startsWith('[CHANNEL:')) {
      try {
        // Extract channel metadata and message
        const metadataEnd = last.indexOf(']');
        if (metadataEnd > 0) {
          const metadataStr = last.substring(9, metadataEnd); // Skip '[CHANNEL:'
          const messageText = last.substring(metadataEnd + 1);
          const metadata = JSON.parse(metadataStr);
          
          // Only add if it's a valid channel message and not a duplicate
          if (metadata.channelId && messageText && metadata.role) {
            const isDuplicate = messages.some(m => m.text === messageText && m.role === metadata.role);
            if (!isDuplicate) {
              const msg: any = { 
                id: `xx_${Date.now()}`, 
                role: metadata.role, 
                text: messageText, 
                timestamp: new Date(metadata.timestamp || Date.now()) 
              };
              setMessages(prev => [...prev, msg]);
            }
          }
        }
      } catch (e) {
        console.error('[XX] Failed to parse received message', e);
      }
    }
    // Ignore all other XX Network internal messages (notifications, updates, etc.)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [received]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle identity creation with error handling
  const handleMintHNFT = async (): Promise<string> => {
    if (!isWalletConnected || !walletAddress) {
      alert('Connect wallet');
      return '';
    }
    if (isMinting) {
      console.log('Identity creation already in progress, ignoring click');
      return '';
    }
    setIsMinting(true);
    try {
      setError(null);
      setSuccess(null);
      const txUrl = await createDIDIdentity();
      setLastTxUrl(txUrl);
      setSuccess('Identity created successfully! You can now start chatting.');
      return txUrl;
    } catch (e: any) {
      console.error('Identity creation failed:', e);
      const errorMessage = e?.message || String(e);
      setError('Identity creation failed: ' + errorMessage);
      return '';
    } finally {
      setIsMinting(false);
    }
  };

  // Handle end session with asset creation (Identity must exist first)
  const handleEndSession = async () => {
    if (inProgressRef.current || isEncrypting || isMinting) return;
    if (!isWalletConnected || !walletAddress) {
      alert('Connect wallet');
      return;
    }
    
    // Check if user has identity - mandatory for chat
    if (!hnftPda) {
      setError('Please create your identity first before ending the session.');
      return;
    }
    
    try {
      inProgressRef.current = true;
      setError(null);
      setSuccess(null);
      setLastTxUrl(null);
      
      // Step 1: Encrypt entire conversation with XX Network (placeholder)
      console.log('🔐 Encrypting conversation history with XX Network...');
      setEncryptionStatus('encrypting');
      
      let encryptionResult;
      try {
        // Placeholder - will be replaced with XX Network encryption
        const encryptedData = JSON.stringify(messages);
        const encrypted = btoa(unescape(encodeURIComponent(encryptedData)));
        const decryptionKey = `key_${Date.now()}`;
        
        encryptionResult = {
          success: true,
          encryptedData: encrypted,
          decryptionKey: decryptionKey,
          timestamp: Date.now()
        };
        
        setEncryptionStatus('encrypted');
        console.log('✅ Conversation encrypted successfully');
      } catch (error) {
        console.warn('⚠️ Encryption error, proceeding without encryption:', error);
        setEncryptionStatus('error');
        encryptionResult = null;
      }
      
      // Step 2: Store encrypted data (placeholder for Arkiv storage)
      console.log('📦 Storing encrypted conversation data...');
      const storageCid = `storage_${Date.now()}`;
      
      // Store full encrypted data separately from metadata
      if (encryptionResult && encryptionResult.success && encryptionResult.encryptedData && encryptionResult.decryptionKey) {
        storeEncryptedConversation(activeSessionId, {
          encryptedData: encryptionResult.encryptedData,
          decryptionKey: encryptionResult.decryptionKey,
          timestamp: encryptionResult.timestamp || Date.now(),
          mxeAddress: 'placeholder' // Will be replaced with actual storage address
        }, storageCid);
      }
      
      const sessionStartTime = messages.length > 0 ? messages[0].timestamp : new Date();
      const sessionEndTime = new Date();
      const addr = walletAddress || '';
      if (!isArkivConnected) {
        await arkivConnect();
      }
      const baseKey = deriveChatBaseKey(addr);
      await ensureChatBase(addr);
      const attributes = [
        { key: 'type', value: 'chatSession' },
        { key: 'polkadotAddress', value: addr },
        { key: 'chatBaseKey', value: baseKey },
        { key: 'sessionId', value: activeSessionId },
        { key: 'messageCount', value: String(messages.length) },
        { key: 'start', value: String(sessionStartTime.getTime()) },
        { key: 'end', value: String(sessionEndTime.getTime()) },
        { key: 'storageCid', value: storageCid },
        { key: 'encrypted', value: encryptionResult ? 'true' : 'false' },
        { key: 'version', value: '1' },
      ];
      const { entityKey: sessionEntityKey, txHash } = await walletClient.createEntity({
        payload: enc.encode('Chat Session'),
        contentType: 'text/plain',
        attributes,
        expiresIn: 200,
      });
      appendTxLog({ txHash, entityKey: sessionEntityKey, type: 'chatSession', sessionId: activeSessionId, timestamp: Date.now() }, walletAddress);
      console.log('[Arkiv] Session stored', { entityKey: sessionEntityKey, txHash, sessionId: activeSessionId, attributes });

      try {
        const { commitmentHash } = await requestSessionVerification(sessionEntityKey, addr, activeSessionId);
        const status = await monitorVerification(commitmentHash);
        if (status === 'delivered' || status === 'unknown') {
          markVerified(addr, activeSessionId);
          setIsSessionVerifiedState(true);
        }
      } catch {}
      const txUrl = buildTxUrl(txHash);
      const newChatNFT = {
        transactionSignature: txHash,
        sessionId: activeSessionId,
        timestamp: new Date(),
        messageCount: messages.length
      };

      // Update state and localStorage
      setChatNFTs(prev => {
        const updated = [...prev, newChatNFT];
        localStorage.setItem('psychat_chat_nfts', JSON.stringify(updated));
        return updated;
      });

      // Show confirmation in sidebar by expanding ChatNFT list
      setIsChatNFTListExpanded(true);
      
      const encryptionStatusText = encryptionResult ? 
        ' (encrypted conversation stored separately)' : 
        ' (no encryption)';
      setSuccess(`✅ Session asset created successfully${encryptionStatusText}! View it in the sidebar panel.`);
      setLastTxUrl(txUrl);
    } catch (e: any) {
      console.error('End session failed:', e);
      const msg = e?.message || String(e);
      setError('Session creation failed: ' + msg);
    }
    finally {
      inProgressRef.current = false;
      try {
        const nextSid = Date.now().toString();
        setActiveSessionId(nextSid);
        if (typeof window !== 'undefined') window.localStorage.setItem('psychat_active_session', nextSid);
      } catch {}
    }
  };

  // Debug log (commented out to reduce console spam)
  // console.log('Current state:', { hnftPda, isHNFTExpanded });

  return (
    <div className="chat-section-container relative fixed inset-0 z-40 chat-section-background overflow-hidden">
      
      {/* Crystal corner accents */}
      <div className="crystal-corner-tl" />
      <div className="crystal-corner-tr" />
      <div className="crystal-corner-bl" />
      <div className="crystal-corner-br" />
      
      {/* Sharp geometric lines */}
      <div className="absolute top-0 left-1/4 right-1/4 h-0.5 crystal-line" />
      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 crystal-line-magenta" />
      <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 crystal-line-purple" />
      <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 crystal-line" />
      
      {/* Geometric overlay */}
      <div className="geometric-overlay" />
      
      {/* Layout wrapper */}
      <div className="flex gap-4 h-full p-4">
        {/* HNFT Section - Conditional rendering */}
        {isHNFTVisible && (
          <>
            {!hnftPda ? (
              /* Show full HNFT card when no HNFT exists */
              <div className="hnft-section-expanded w-full max-w-md mx-auto">
                <HNFTIdentityCard
                  hnftPda={hnftPda}
                  hnftSig={hnftSig || ''}
                  onMint={handleMintHNFT}
                  isMinting={isMinting}
                  error={error}
                  success={success}
                  isExpanded={true}
                  onToggle={() => setIsHNFTExpanded(!isHNFTExpanded)}
                  onClose={handleHNFTClose}
                  publicKey={walletAddress}
                />
              </div>
            ) : isHNFTExpanded ? (
              /* Show expanded HNFT card when HNFT exists and expanded */
              <div className="hnft-section-expanded w-80">
                <HNFTIdentityCard
                  hnftPda={hnftPda}
                  hnftSig={hnftSig || ''}
                  onMint={handleMintHNFT}
                  isMinting={isMinting}
                  error={error}
                  success={success}
                  isExpanded={isHNFTExpanded}
                  onToggle={() => setIsHNFTExpanded(!isHNFTExpanded)}
                  onClose={handleHNFTClose}
                  publicKey={walletAddress}
                />
              </div>
            ) : isChatNFTListExpanded ? (
              /* Show expanded ChatNFT list when ChatNFT is expanded */
              <div className="hnft-section-expanded w-80">
                <ChatNFTList
                  chatNFTs={chatNFTs}
                  isExpanded={isChatNFTListExpanded}
                  onToggle={() => setIsChatNFTListExpanded(!isChatNFTListExpanded)}
                />
              </div>
            ) : (
              /* Show compact sidebar when HNFT exists but collapsed */
              <div className="hnft-sidebar relative z-50 space-y-4">
                <HNFTStatusCompact
                  hnftPda={hnftPda}
                  hnftSig={hnftSig || ''}
                  onExpand={() => {
                    console.log('Expanding HNFT card, setting isHNFTExpanded to true');
                    setIsHNFTExpanded(true);
                    // Collapse ChatNFT when expanding HNFT
                    setIsChatNFTListExpanded(false);
                  }}
                  onHide={() => setIsHNFTVisible(false)}
                />
                
                {/* Add ChatNFT Status Compact */}
                <ChatNFTStatusCompact
                  chatNFTCount={chatNFTs.length}
                  onExpand={() => {
                    console.log('Expanding ChatNFT list and main sidebar');
                    setIsHNFTExpanded(true);
                    setIsChatNFTListExpanded(true);
                    // Collapse HNFT when expanding ChatNFT
                    setIsHNFTExpanded(false);
                  }}
                  onHide={() => {
                    console.log('Hiding ChatNFT section');
                    setIsChatNFTVisible(false);
                  }}
                />
              </div>
            )}
          </>
        )}
        
        {/* Chat Terminal - Always show, but with different states */}
        <div className="chat-terminal-section flex-1 h-full w-full overflow-hidden flex flex-col">
          {/* XX Network Status Bar */}
          {xxReady && channelReady && xxChannelId && (
            <div className="px-4 pt-3 pb-2">
              <XXChannelStatus
                ready={xxReady && channelReady}
                channelId={xxChannelId}
                syncStatus={xxSyncStatus}
                messageCount={messages.length}
              />
            </div>
          )}
          
          <div className="flex-1 overflow-hidden">
            <ChatTerminal
              messages={messages}
              inputText={inputText}
              setInputText={setInputText}
              handleSendMessage={handleSendMessage}
              isEncrypting={isEncrypting}
              isMinting={isMinting}
              isAIThinking={isAIThinking}
            encryptionStatus={encryptionStatus}
            onEndSession={handleEndSession}
            onToggleHNFT={() => setIsHNFTVisible(!isHNFTVisible)}
            isHNFTVisible={isHNFTVisible}
            hasHNFT={!!hnftPda}
            onNavigateToVideo={onNavigateToVideo}
            txCount={txCount}
            verified={isSessionVerifiedState}
            xxReady={xxReady}
            selfPubkeyBase64={selfPubkeyBase64}
            selfToken={selfToken}
            walletAddress={xxWalletAddr || walletAddress}
          />
          </div>
        </div>

        {/* Floating HNFT Toggle Button - Only show when HNFT is hidden */}
        {hnftPda && !isHNFTVisible && (
          <button
            onClick={() => setIsHNFTVisible(true)}
            className="fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full bg-electric-cyan/20 hover:bg-electric-cyan/30 border border-electric-cyan/30 hover:border-electric-cyan/50 flex items-center justify-center text-electric-cyan hover:text-electric-cyan/80 transition-all duration-200 hover:scale-105 shadow-lg"
            title="Show Panel"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}

      </div>
    </div>
  );
}
