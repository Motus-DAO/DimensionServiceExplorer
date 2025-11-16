'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { HoloPanel, HoloText, HoloButton } from '../ui/holo';
import { HiHeart, HiShare, HiCurrencyDollar } from 'react-icons/hi';
import { usePolkadotWallet } from '../../contexts/PolkadotWalletContext';
import { fetchAllNFTs, FractalNFT, getProvider } from '../../lib/fractales-nft';

interface MintedPhoto {
  id: string;
  imageUrl: string;
  name: string;
  creator: string;
  creatorAddress: string;
  likes: number;
  tips: number;
  mintedAt: string;
  isLiked?: boolean;
  tokenId: string;
}

// Helper to get short address
function getShortAddress(address: string): string {
  if (!address) return 'Unknown';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper to get name from address (mock for now)
function getNameFromAddress(address: string): string {
  // In a real app, you might have a mapping or query a name service
  const names: Record<string, string> = {};
  return names[address] || getShortAddress(address);
}

export default function MintedGallery() {
  const { isConnected, selectedAccount } = usePolkadotWallet();
  const [photos, setPhotos] = useState<MintedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tippingPhoto, setTippingPhoto] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState<string>('0.1');
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [tips, setTips] = useState<Record<string, number>>({});
  const [tipSuccess, setTipSuccess] = useState(false);
  const [tipError, setTipError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch NFTs from contract
  useEffect(() => {
    const loadNFTs = async () => {
      setLoading(true);
      try {
        const contractAddress = (process.env.NEXT_PUBLIC_FRACTALES_NFT_ADDRESS || '').trim();
        if (!contractAddress) {
          console.warn('Fractales NFT contract address not configured');
          setLoading(false);
          return;
        }

        const provider = getProvider();
        if (!provider) {
          console.warn('No provider available');
          setLoading(false);
          return;
        }
        const nfts = await fetchAllNFTs(contractAddress, provider);

        // Load likes and tips from localStorage first
        let savedLikes: Record<string, boolean> = {};
        let savedTips: Record<string, number> = {};
        
        if (typeof window !== 'undefined') {
          const likesData = localStorage.getItem('fractales_likes');
          if (likesData) {
            savedLikes = JSON.parse(likesData);
            setLikes(savedLikes);
          }

          const tipsData = localStorage.getItem('fractales_tips');
          if (tipsData) {
            savedTips = JSON.parse(tipsData);
            setTips(savedTips);
          }
        }

        // Convert to MintedPhoto format
        const mintedPhotos: MintedPhoto[] = nfts.map((nft: FractalNFT) => {
          // Extract image from metadata (could be base64 data URI)
          let imageUrl = nft.image;
          if (imageUrl.startsWith('data:image')) {
            // It's already a data URI, use it directly
          } else if (imageUrl.startsWith('data:application/json;base64,')) {
            // Parse nested JSON
            try {
              const base64 = imageUrl.replace('data:application/json;base64,', '');
              const json = JSON.parse(atob(base64));
              imageUrl = json.image || imageUrl;
            } catch (e) {
              console.error('Error parsing nested image:', e);
            }
          }

          return {
            id: nft.tokenId,
            tokenId: nft.tokenId,
            imageUrl: imageUrl,
            name: nft.name,
            creator: getNameFromAddress(nft.owner),
            creatorAddress: nft.owner,
            likes: 0, // Will be loaded from backend in future
            tips: savedTips[nft.tokenId] || 0,
            mintedAt: new Date().toISOString().split('T')[0],
            isLiked: savedLikes[nft.tokenId] || false,
          };
        });

        setPhotos(mintedPhotos);
      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, []);

  const handleLike = (id: string) => {
    if (!isConnected) {
      alert('Please connect your wallet to like photos');
      return;
    }
    
    const newLikes = { ...likes };
    const isLiked = newLikes[id] || false;
    newLikes[id] = !isLiked;
    setLikes(newLikes);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('fractales_likes', JSON.stringify(newLikes));
    }
    
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === id
          ? {
              ...photo,
              isLiked: !isLiked,
              likes: isLiked ? photo.likes - 1 : photo.likes + 1,
            }
          : photo
      )
    );
  };

  const handleTip = async (id: string) => {
    if (!isConnected || !selectedAccount) {
      setTipError('Please connect your wallet to tip creators');
      return;
    }
    const photo = photos.find(p => p.id === id);
    if (!photo) return;

    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      setTipError('Please enter a valid tip amount');
      return;
    }

    setIsProcessing(true);
    setTipError(null);
    setTipSuccess(false);

    try {
      // In a real implementation, this would send a blockchain transaction
      // For now, we'll just update the local state
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate transaction
      
      const newTips = { ...tips };
      newTips[id] = (newTips[id] || 0) + parseFloat(tipAmount);
      setTips(newTips);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('fractales_tips', JSON.stringify(newTips));
      }
      
      setPhotos(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, tips: newTips[id] }
            : p
        )
      );
      
      setTipSuccess(true);
      // Close modal after 2 seconds
      setTimeout(() => {
        setTippingPhoto(null);
        setTipSuccess(false);
        setTipAmount('0.1');
      }, 2000);
    } catch (error) {
      console.error('Error tipping:', error);
      setTipError('Failed to send tip. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const quickTipAmounts = ['0.1', '0.5', '1.0', '2.0', '5.0'];

  const handleShare = async (photo: MintedPhoto) => {
    const shareData = {
      title: `Check out ${photo.name} by ${photo.creator}`,
      text: `Amazing fractal art on PsyChat!`,
      url: `${window.location.origin}/fractales/${photo.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="mt-16">
        <div className="mb-8">
          <HoloText size="xl" weight="bold">Minted Gallery</HoloText>
          <HoloText size="sm" weight="normal" className="text-white/70">
            Loading minted fractals...
          </HoloText>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="mt-16">
        <div className="mb-8">
          <HoloText size="xl" weight="bold">Minted Gallery</HoloText>
          <HoloText size="sm" weight="normal" className="text-white/70">
            No minted fractals yet. Be the first to mint one!
          </HoloText>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="mb-8">
        <HoloText size="xl" weight="bold">Minted Gallery</HoloText>
        <HoloText size="sm" weight="normal" className="text-white/70">
          Discover and support creators in the PsyChat community ({photos.length} minted)
        </HoloText>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <HoloPanel variant="elevated" size="lg" className="overflow-hidden">
              {/* Image */}
              <div className="relative aspect-square bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 overflow-hidden">
                {photo.imageUrl ? (
                  <img
                    src={photo.imageUrl}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-30">🎨</div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Title and Creator */}
                <div>
                  <HoloText size="base" weight="bold" className="text-cyan-400">
                    {photo.name}
                  </HoloText>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-white/60 text-sm">by</span>
                    <span className="text-fuchsia-400 text-sm font-medium">
                      {photo.creator}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-white/70">
                      <HiHeart className="text-red-400" size={16} />
                      <span>{photo.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-white/70">
                      <HiCurrencyDollar className="text-yellow-400" size={16} />
                      <span>{photo.tips.toFixed(1)} DOT</span>
                    </div>
                  </div>
                  <span className="text-white/50 text-xs">
                    {photo.mintedAt}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2 border-t border-cyan-500/20">
                  <HoloButton
                    onClick={() => handleLike(photo.id)}
                    variant={photo.isLiked ? 'primary' : 'secondary'}
                    size="sm"
                    className="flex-1"
                  >
                    <div className="flex items-center space-x-2">
                      <HiHeart
                        className={photo.isLiked ? 'text-red-400' : 'text-white/70'}
                        size={16}
                      />
                      <span>{photo.isLiked ? 'Liked' : 'Like'}</span>
                    </div>
                  </HoloButton>

                  <HoloButton
                    onClick={() => {
                      setTippingPhoto(photo.id);
                      setTipAmount('0.1');
                      setTipError(null);
                      setTipSuccess(false);
                    }}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    <div className="flex items-center space-x-2">
                      <HiCurrencyDollar className="text-yellow-400" size={16} />
                      <span>Tip</span>
                    </div>
                  </HoloButton>

                  <HoloButton
                    onClick={() => handleShare(photo)}
                    variant="secondary"
                    size="sm"
                    className="px-3"
                  >
                    <HiShare className="text-cyan-400" size={16} />
                  </HoloButton>
                </div>
              </div>
            </HoloPanel>
          </motion.div>
        ))}
      </div>

      {/* Tip Modal */}
      {tippingPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => {
            if (!isProcessing) {
              setTippingPhoto(null);
              setTipError(null);
              setTipSuccess(false);
            }
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md"
          >
            <HoloPanel variant="elevated" size="xl" className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <HoloText size="xl" weight="bold" className="text-cyan-400">
                  Tip Creator
                </HoloText>
                {!isProcessing && (
                  <button
                    onClick={() => {
                      setTippingPhoto(null);
                      setTipError(null);
                      setTipSuccess(false);
                    }}
                    className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
                  >
                    ×
                  </button>
                )}
              </div>

              {tipSuccess ? (
                /* Success State */
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-400"
                  >
                    <HiCurrencyDollar className="text-green-400" size={32} />
                  </motion.div>
                  <HoloText size="lg" weight="bold" className="text-green-400 mb-2">
                    Tip Sent!
                  </HoloText>
                  <p className="text-white/70 text-sm">
                    Your tip of {tipAmount} DOT has been sent to{' '}
                    {photos.find(p => p.id === tippingPhoto)?.creator}
                  </p>
                </div>
              ) : (
                <>
                  {/* Photo Preview */}
                  {(() => {
                    const photo = photos.find(p => p.id === tippingPhoto);
                    if (!photo) return null;
                    return (
                      <div className="mb-6">
                        <div className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg border border-cyan-500/20">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            {photo.imageUrl ? (
                              <img
                                src={photo.imageUrl}
                                alt={photo.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 flex items-center justify-center">
                                <span className="text-2xl">🎨</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <HoloText size="base" weight="bold" className="text-cyan-400 truncate">
                              {photo.name}
                            </HoloText>
                            <p className="text-white/60 text-sm truncate">
                              by {photo.creator}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Quick Tip Amounts */}
                  <div className="mb-4">
                    <label className="text-white/70 text-sm mb-2 block">
                      Quick Tip Amounts
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {quickTipAmounts.map((amount) => (
                        <HoloButton
                          key={amount}
                          onClick={() => {
                            setTipAmount(amount);
                            setTipError(null);
                          }}
                          variant={tipAmount === amount ? 'primary' : 'secondary'}
                          size="sm"
                          className="text-xs"
                        >
                          {amount}
                        </HoloButton>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount Input */}
                  <div className="mb-4">
                    <label className="text-white/70 text-sm mb-2 block">
                      Custom Amount (DOT)
                    </label>
                    <input
                      type="number"
                      value={tipAmount}
                      onChange={(e) => {
                        setTipAmount(e.target.value);
                        setTipError(null);
                      }}
                      className="w-full px-4 py-3 bg-black/40 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="0.1"
                      min="0.01"
                      step="0.01"
                      disabled={isProcessing}
                    />
                  </div>

                  {/* Error Message */}
                  {tipError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
                    >
                      <p className="text-red-400 text-sm">{tipError}</p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <HoloButton
                      onClick={() => {
                        setTippingPhoto(null);
                        setTipError(null);
                        setTipSuccess(false);
                      }}
                      variant="secondary"
                      size="md"
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      Cancel
                    </HoloButton>
                    <HoloButton
                      onClick={() => handleTip(tippingPhoto)}
                      variant="primary"
                      size="md"
                      className="flex-1"
                      disabled={isProcessing || !tipAmount || parseFloat(tipAmount) <= 0}
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <HiCurrencyDollar className="text-yellow-400" size={18} />
                          <span>Send Tip</span>
                        </div>
                      )}
                    </HoloButton>
                  </div>
                </>
              )}
            </HoloPanel>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
