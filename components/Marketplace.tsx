import { useState, useEffect } from 'react';
import { keccak256 } from 'js-sha3';
import { usePolkadotWallet } from '../contexts/PolkadotWalletContext';
import TokenAMM from './TokenAMM';

interface DataListing {
  id: string;
  title: string;
  description: string;
  category: 'anxiety' | 'depression' | 'stress' | 'relationships' | 'general';
  price: number;
        currency: 'PSY' | 'rUSD';
  seller: string;
  buyer: string;
  buyerType: 'AI Training' | 'Academic Research' | 'Consumer Patterns' | 'Corporate Wellness';
  purpose: string;
  bids: number;
  endTime: Date;
  liquidity: number;
  verified: boolean;
  ethicsApproved: boolean;
}

interface UserChatNFT {
  id: string;
  sessionId: string;
  category: 'anxiety' | 'depression' | 'stress' | 'relationships' | 'general';
  messageCount: number;
  date: string;
  walrusCid: string;
  mintAddress: string;
  isListed: boolean;
  price?: number;
  eligiblePools: string[];
  zkProof?: string;
}

interface Bid {
  id: string;
  amount: number;
  bidder: string;
  timestamp: Date;
}

export default function Marketplace() {
  const { selectedAccount } = usePolkadotWallet();
  const walletAddress = selectedAccount?.address || null;
  const [listings, setListings] = useState<DataListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<DataListing | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'anxiety' | 'depression' | 'stress' | 'relationships'>('all');
  const [nftMetadata, setNftMetadata] = useState<Map<string, any>>(new Map());
  const [showTrading, setShowTrading] = useState(false);
  const [showBuyerDirectory, setShowBuyerDirectory] = useState(false);
  const [userChatNFTs, setUserChatNFTs] = useState<UserChatNFT[]>([]);
  const [showMyData, setShowMyData] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<UserChatNFT | null>(null);
  const [isListing, setIsListing] = useState(false);
  const [showAIScanning, setShowAIScanning] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [scanningComplete, setScanningComplete] = useState(false);
  const [showScannedResults, setShowScannedResults] = useState(false);
  const [currentPoolCategory, setCurrentPoolCategory] = useState<string>('');

  // Placeholder for fetching asset metadata (to be replaced with Polkadot asset queries)
  const fetchNFTMetadata = async (mintAddress: string) => {
    try {
      // Placeholder - will be replaced with Polkadot asset metadata fetching
      setNftMetadata(prev => new Map(prev.set(mintAddress, {
        name: 'Session Asset',
        symbol: 'PSY',
        description: 'Encrypted therapy session data',
        image: undefined,
        attributes: [],
        uri: ''
      })));
    } catch (error) {
      console.error('Error fetching asset metadata:', error);
    }
  };

  // Generate mock user ChatNFTs with eligibility checking
  const generateMockUserChatNFTs = (): UserChatNFT[] => {
    const categories = ['anxiety', 'depression', 'stress', 'relationships', 'general'];
    const nfts: UserChatNFT[] = [];
    
    for (let i = 0; i < 8; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      // Simulate AI/ZKP eligibility checking
      const eligiblePools = getEligiblePools(category, Math.floor(Math.random() * 20) + 5);
      
      nfts.push({
        id: `chatnft_${i + 1}`,
        sessionId: `session_${Date.now()}_${i}`,
        category: category as any,
        messageCount: Math.floor(Math.random() * 20) + 5,
        date: date.toISOString().split('T')[0],
        walrusCid: `walrus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        mintAddress: `mint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isListed: Math.random() > 0.6,
        price: Math.random() > 0.6 ? Math.random() * 5 + 0.5 : undefined,
        eligiblePools,
        zkProof: `zk_proof_${Math.random().toString(36).substr(2, 16)}`
      });
    }
    
    return nfts;
  };

  // Simulate AI/ZKP eligibility checking for data pools
  const getEligiblePools = (category: string, messageCount: number): string[] => {
    const pools = [];
    
    // All categories are eligible for general research
    pools.push('General Research Pool');
    
    // Category-specific pools
    if (category === 'anxiety') {
      pools.push('Anxiety Patterns Pool', 'Remote Work Stress Pool');
    } else if (category === 'depression') {
      pools.push('Depression Recovery Pool', 'Mental Health Research Pool');
    } else if (category === 'stress') {
      pools.push('Workplace Stress Pool', 'Productivity Analytics Pool');
    } else if (category === 'relationships') {
      pools.push('Communication Patterns Pool', 'Couples Therapy Pool');
    }
    
    // High message count gets access to premium pools
    if (messageCount >= 15) {
      pools.push('Premium Insights Pool', 'Deep Analysis Pool');
    }
    
    // ZK proof verification (simulated)
    if (Math.random() > 0.1) { // 90% pass rate
      pools.push('ZK Verified Pool');
    }
    
    return pools;
  };

  // Mock data for demo with buyer transparency
  useEffect(() => {
    const mockListings: DataListing[] = [
      {
        id: '1',
        title: 'Anxiety Patterns in Remote Workers',
        description: 'ZK-verified insights from 2,400+ therapy sessions revealing anxiety triggers, coping mechanisms, and recovery patterns in remote work environments.',
        category: 'anxiety',
        price: 4.2,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'OpenAI Research',
        buyerType: 'AI Training',
        purpose: 'Training GPT-5 on mental health empathy and therapeutic responses for remote workers',
        bids: 1247,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        liquidity: 28000,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '2',
        title: 'Depression Recovery Trajectories',
        description: 'Anonymized data from 1,800+ users showing depression recovery patterns, intervention effectiveness, and long-term outcomes with ZK privacy proofs.',
        category: 'depression',
        price: 3.8,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'Stanford Psychology Lab',
        buyerType: 'Academic Research',
        purpose: 'Peer-reviewed research on depression intervention timing and effectiveness',
        bids: 892,
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        liquidity: 18500,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '3',
        title: 'Workplace Stress & Productivity Analytics',
        description: 'Professional stress patterns, burnout indicators, and productivity correlations from 3,200+ corporate wellness sessions.',
        category: 'stress',
        price: 2.9,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'Microsoft Employee Wellness',
        buyerType: 'Corporate Wellness',
        purpose: 'Enhancing employee wellness programs and stress management initiatives',
        bids: 2156,
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        liquidity: 35000,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '4',
        title: 'Relationship Communication Patterns',
        description: 'Communication styles, conflict resolution strategies, and relationship satisfaction data from 1,500+ couples therapy sessions.',
        category: 'relationships',
        price: 3.5,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'BetterHelp',
        buyerType: 'Consumer Patterns',
        purpose: 'Improving therapist matching algorithms and relationship counseling quality',
        bids: 634,
        endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        liquidity: 22000,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '5',
        title: 'Teen Mental Health Trends',
        description: 'Insights from 2,100+ teen therapy sessions covering social media impact, peer pressure, and academic stress patterns.',
        category: 'anxiety',
        price: 4.7,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'UNICEF Mental Health',
        buyerType: 'Academic Research',
        purpose: 'Global youth mental health policy development and intervention strategies',
        bids: 3421,
        endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        liquidity: 42000,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '6',
        title: 'Meditation & Mindfulness Effectiveness',
        description: 'Data from 1,900+ meditation sessions showing effectiveness patterns, user engagement, and mental health outcomes.',
        category: 'stress',
        price: 2.3,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'Headspace Inc.',
        buyerType: 'Consumer Patterns',
        purpose: 'Optimizing meditation app features and personalized mindfulness recommendations',
        bids: 1873,
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        liquidity: 16500,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '7',
        title: 'PTSD Recovery Patterns',
        description: 'Trauma recovery insights from 800+ specialized therapy sessions with anonymized PTSD treatment outcomes and coping strategies.',
        category: 'depression',
        price: 5.1,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'NIH Research',
        buyerType: 'Academic Research',
        purpose: 'Clinical research on PTSD treatment effectiveness and recovery timelines',
        bids: 456,
        endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        liquidity: 38000,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '8',
        title: 'AI Therapy Interaction Patterns',
        description: 'User interaction data from 3,500+ AI therapy sessions showing engagement patterns, effectiveness metrics, and user preferences.',
        category: 'general',
        price: 3.2,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'Anthropic AI',
        buyerType: 'AI Training',
        purpose: 'Training Claude for more empathetic and effective AI therapy responses',
        bids: 2894,
        endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        liquidity: 45000,
        verified: true,
        ethicsApproved: true,
      },
    ];
    setListings(mockListings);
    
    // Initialize user ChatNFTs
    setUserChatNFTs(generateMockUserChatNFTs());
  }, []);

  const filteredListings = listings.filter(listing => 
    filter === 'all' || listing.category === filter
  );

  const handleBid = async (listingId: string) => {
    if (!walletAddress || !bidAmount) return;

    setIsBidding(true);
    try {
      // Mock Raydium AMM integration for bidding
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update listing with new bid
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, bids: listing.bids + 1 }
          : listing
      ));

      setBidAmount('');
      console.log('Bid placed successfully via Raydium AMM');
    } catch (error) {
      console.error('Bidding failed:', error);
    } finally {
      setIsBidding(false);
    }
  };

  const handleClaim = async (category: string) => {
    if (!walletAddress) return;
    // Placeholder for Polkadot claim logic
    try {
      // Placeholder - will be replaced with Polkadot runtime calls
      const proof = keccak256(category + '_valid');
      const sig = 'placeholder_tx_hash';
      console.log('Claim $PSY sig:', sig);
    } catch (e: any) {
      console.error('Claim failed', e);
    }
  };

  const handleListNFT = async (nftId: string) => {
    if (!walletAddress) return;

    setIsListing(true);
    try {
      // Find the NFT to get its calculated price
      const nft = userChatNFTs.find(n => n.id === nftId);
      if (!nft) return;
      
      const calculatedPrice = calculateAutomaticPrice(nft);
      
      // Simulate AI/ZKP verification and listing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update NFT with listing information
      setUserChatNFTs(prev => prev.map(nft => 
        nft.id === nftId 
          ? { 
              ...nft, 
              isListed: true, 
              price: calculatedPrice,
              zkProof: `zk_proof_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
            }
          : nft
      ));

      setSelectedNFT(null);
      console.log('ChatNFT listed successfully with ZK verification');
    } catch (error) {
      console.error('Listing failed:', error);
    } finally {
      setIsListing(false);
    }
  };

  const handleUnlistNFT = async (nftId: string) => {
    try {
      // Update NFT to remove listing
      setUserChatNFTs(prev => prev.map(nft => 
        nft.id === nftId 
          ? { ...nft, isListed: false, price: undefined }
          : nft
      ));
      
      console.log('ChatNFT unlisted successfully');
    } catch (error) {
      console.error('Unlisting failed:', error);
    }
  };

  // Filter ChatNFTs by pool category
  const getEligibleChatNFTsForPool = (poolCategory: string) => {
    return userChatNFTs.filter(nft => 
      nft.category === poolCategory || 
      nft.eligiblePools.some(pool => 
        pool.toLowerCase().includes(poolCategory.toLowerCase()) ||
        poolCategory.toLowerCase().includes(nft.category.toLowerCase())
      )
    );
  };

  // Calculate automatic price based on data quality
  const calculateAutomaticPrice = (nft: UserChatNFT) => {
    let basePrice = 0.5; // Base price in PSY tokens
    
    // Category multipliers
    const categoryMultipliers = {
      'anxiety': 1.2,
      'depression': 1.3,
      'stress': 1.1,
      'relationships': 1.4,
      'general': 1.0
    };
    
    // Message count bonus (more messages = higher value)
    const messageBonus = Math.min(nft.messageCount * 0.1, 2.0); // Max 2.0 bonus
    
    // Eligible pools bonus (more pools = higher value)
    const poolBonus = Math.min(nft.eligiblePools.length * 0.2, 1.0); // Max 1.0 bonus
    
    // ZK proof bonus
    const zkBonus = nft.zkProof ? 0.3 : 0;
    
    // Calculate final price
    const categoryMultiplier = categoryMultipliers[nft.category] || 1.0;
    const finalPrice = (basePrice + messageBonus + poolBonus + zkBonus) * categoryMultiplier;
    
    return Math.round(finalPrice * 10) / 10; // Round to 1 decimal place
  };

  const handleCheckDataEligibility = async (poolCategory: string) => {
    setCurrentPoolCategory(poolCategory);
    setShowAIScanning(true);
    setScanningProgress(0);
    setScanningComplete(false);
    
    // Simulate AI scanning progress
    const progressInterval = setInterval(() => {
      setScanningProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setScanningComplete(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Auto-close after completion and show results
    setTimeout(() => {
      setShowAIScanning(false);
      setShowScannedResults(true);
      setScanningProgress(0);
      // Keep scanningComplete true so the button stays active
    }, 4000);
  };


  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Ending soon';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      anxiety: 'bg-yellow-500/20 text-yellow-300',
      depression: 'bg-blue-500/20 text-blue-300',
      stress: 'bg-red-500/20 text-red-300',
      relationships: 'bg-pink-500/20 text-pink-300',
      general: 'bg-gray-500/20 text-gray-300',
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getBuyerTypeColor = (buyerType: string) => {
    const colors = {
      'AI Training': 'bg-purple-500/20 text-purple-300',
      'Academic Research': 'bg-blue-500/20 text-blue-300',
      'Consumer Patterns': 'bg-green-500/20 text-green-300',
      'Corporate Wellness': 'bg-orange-500/20 text-orange-300',
    };
    return colors[buyerType as keyof typeof colors] || colors['AI Training'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="psychat-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-display text-h1 text-white">Data Marketplace</h2>
          <div className="text-body text-body-sm text-white/60">
            Powered by Raydium AMM • {listings.length} listings
          </div>
        </div>
        <div className="text-caption text-white/60">
          Verify transactions on <a className="underline" href={`https://solscan.io/?cluster=devnet`} target="_blank" rel="noreferrer">Solscan (devnet)</a>
        </div>

        <div className="text-body text-body-sm text-white/60 mb-4">
          💡 Anonymized mental health insights • 🔒 ZK-verified data integrity • 💰 Earn from your data
        </div>

        {/* How It Works Steps */}
        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <h3 className="text-heading text-h3 text-white mb-3">How Your Data Works for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-psy-purple rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                <div>
                  <div className="text-heading text-h6 text-white">Generate Valuable Insights</div>
                  <div className="text-caption text-white/70">Your conversations create anonymized mental health patterns and therapeutic insights</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-psy-blue rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                <div>
                  <div className="text-heading text-h6 text-white">Self-Custody & Sovereignty</div>
                  <div className="text-caption text-white/70">You own your data completely - stored in your wallet, controlled by you</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-psy-green rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                <div>
                  <div className="text-heading text-h6 text-white">Choose to Monetize</div>
                  <div className="text-caption text-white/70">List your insights for verified buyers or keep them private - your choice</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">4</div>
                <div>
                  <div className="text-heading text-h6 text-white">Earn $PSY Tokens</div>
                  <div className="text-caption text-white/70">Get paid in $PSY tokens with 95% revenue share, auto-compound DeFi yields</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="text-caption text-white/60">
              <strong>Key Benefits:</strong> Complete liquid RWAs ownership • ZK privacy protection • Transparent buyer verification • 
              Fair pricing via Raydium AMM • Your data, your rules
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-4">
        {['all', 'anxiety', 'depression', 'stress', 'relationships'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-3 py-1 rounded-full text-body text-body-sm transition-colors ${
              filter === cat
                ? 'bg-psy-purple text-white'
                : 'bg-black/30 text-white/80 hover:bg-black/40 border border-white/20'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="psychat-card p-6 cursor-pointer hover:bg-black/30 transition-colors bg-black/20 border border-white/10"
            onClick={() => setSelectedListing(listing)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(listing.category)}`}>
                  {listing.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getBuyerTypeColor(listing.buyerType)}`}>
                  {listing.buyerType}
                </span>
              </div>
              <span className="text-xs text-white/60">
                {formatTimeRemaining(listing.endTime)}
              </span>
            </div>

            <h3 className="text-heading text-h3 text-white mb-2">
              {listing.title}
            </h3>

            <div className="mb-3">
              <div className="text-body text-body-sm text-psy-blue mb-1">
                👤 {listing.buyer}
              </div>
              <div className="text-caption text-white/70">
                Purpose: {listing.purpose}
              </div>
            </div>

            <p className="text-body text-body-sm text-white/70 mb-4 line-clamp-2">
              {listing.description}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-body text-body-sm">
                <span className="text-white/60">Price:</span>
                <span className="text-mono text-body-md text-white">
                  {listing.price} {listing.currency}
                </span>
              </div>
              <div className="flex justify-between text-body text-body-sm">
                <span className="text-white/60">Data Sources:</span>
                <span className="text-mono text-body-md text-psy-green">{listing.bids} sellers</span>
              </div>
              <div className="flex justify-between text-body text-body-sm">
                <span className="text-white/60">Liquidity:</span>
                <span className="text-mono text-body-md text-psy-blue">${listing.liquidity.toLocaleString()}</span>
              </div>
              <div className="flex space-x-2 mt-2">
                {listing.verified && (
                  <span className="text-caption bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    ✓ Verified Buyer
                  </span>
                )}
                {listing.ethicsApproved && (
                  <span className="text-caption bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    ✓ Ethics Approved
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="w-full psychat-button" onClick={() => setSelectedListing(listing)}>
                View Details
              </button>
              <button className="w-full psychat-button bg-psy-green" onClick={() => handleClaim(listing.category)}>
                Claim $PSY
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedListing(null)}
        >
          <div 
            className="psychat-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-display text-h2 text-white">
                {selectedListing.title}
              </h3>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm font-medium ${getCategoryColor(selectedListing.category)}`}>
                  {selectedListing.category}
                </span>
                <span className="text-body text-body-sm text-white/60">
                  by {selectedListing.seller}
                </span>
              </div>

              <p className="text-body text-body-md text-white/80">
                {selectedListing.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-body text-body-sm text-white/60 mb-1">Current Price</div>
                  <div className="text-mono text-h2 text-white">
                    {selectedListing.price} {selectedListing.currency}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-body text-body-sm text-white/60 mb-1">Data Sources</div>
                  <div className="text-mono text-h2 text-psy-green">
                    {selectedListing.bids} sellers
                  </div>
                </div>
              </div>

              <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-4">
                <div className="text-body text-body-sm text-white/80 mb-2">
                  <strong>Raydium AMM Integration:</strong> This listing is powered by Raydium's 
                  automated market maker for fair pricing and instant liquidity.
                </div>
                <div className="text-body text-body-sm text-white/60">
                  Liquidity Pool: ${selectedListing.liquidity.toLocaleString()}
                </div>
              </div>

              {/* Sell Your Data Section */}
              <div className="space-y-3">
                <h4 className="text-heading text-h4 text-white">Sell Your Data to This Pool</h4>
                <div className="bg-psy-green/10 border border-psy-green/20 rounded-lg p-4 mb-4">
                  <div className="text-body text-body-sm text-white/80 mb-2">
                    <strong>Want to contribute to this data pool?</strong> Check if your ChatNFTs are eligible and list them for sale.
                  </div>
                  <div className="text-caption text-white/60">
                    Your data will be aggregated with {selectedListing.bids} other sellers • Earn 95% of the revenue
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleCheckDataEligibility(selectedListing.category)}
                    className="psychat-button bg-psy-green px-8 py-3 text-lg"
                  >
                    Check My Data Eligibility
                  </button>
                </div>
                <div className="text-caption text-white/60">
                  AI analysis with ZKPs will determine if your ChatNFTs match this pool's requirements
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Data for Sale Section */}
      <div className="psychat-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-heading text-h3 text-white">My Data for Sale</h3>
          <button
            onClick={() => setShowMyData(!showMyData)}
            className="psychat-button bg-psy-green hover:bg-psy-green/80 transition-colors flex items-center space-x-2"
          >
            <span>{showMyData ? '👁️' : '📊'}</span>
            <span>{showMyData ? 'Hide My Data' : 'Show My Data'}</span>
          </button>
        </div>
        
        {!showMyData && (
          <div className="bg-psy-green/10 border border-psy-green/20 rounded-lg p-4">
            <div className="text-body text-body-sm text-white/80 mb-2">
              <strong>AI-Powered Eligibility:</strong> Your ChatNFTs are automatically analyzed using AI and ZK proofs to determine which data pools they're eligible for.
            </div>
            <div className="text-caption text-white/60">
              Click "Show My Data" to see your ChatNFTs and their eligible data pools for sale.
            </div>
          </div>
        )}
        
        {showMyData && (
          <div className="space-y-4">
            <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-4">
              <div className="text-body text-body-sm text-white/80 mb-2">
                <strong>How It Works:</strong> Each of your therapy session ChatNFTs is analyzed by AI to determine eligibility for specific data pools. ZK proofs ensure privacy while proving data quality.
              </div>
              <div className="text-caption text-white/60">
                Total ChatNFTs: {userChatNFTs.length} • Listed: {userChatNFTs.filter(nft => nft.isListed).length} • Eligible Pools: {new Set(userChatNFTs.flatMap(nft => nft.eligiblePools)).size}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userChatNFTs.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-black/20 border border-white/10 rounded-lg p-4 hover:bg-black/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(nft.category)}`}>
                        {nft.category}
                      </span>
                      {nft.isListed && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-psy-green/20 text-psy-green">
                          Listed
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/60">
                      {nft.date}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="text-heading text-h5 text-white mb-1">
                      Session #{nft.sessionId.split('_')[1]}
                    </div>
                    <div className="text-body text-body-sm text-white/60">
                      {nft.messageCount} messages • {nft.eligiblePools.length} eligible pools
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-body text-body-sm text-white/70">
                      <strong>Eligible Pools:</strong>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {nft.eligiblePools.slice(0, 3).map((pool, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-psy-blue/20 text-psy-blue text-xs rounded"
                        >
                          {pool}
                        </span>
                      ))}
                      {nft.eligiblePools.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded">
                          +{nft.eligiblePools.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {nft.isListed ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-body text-body-sm">
                        <span className="text-white/60">Listed Price:</span>
                        <span className="text-mono text-psy-green">
                          {nft.price} PSY
                        </span>
                      </div>
                      <button
                        onClick={() => handleUnlistNFT(nft.id)}
                        className="w-full psychat-button bg-red-500 hover:bg-red-600"
                      >
                        Unlist
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedNFT(nft)}
                      className="w-full psychat-button"
                    >
                      List for Sale
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Data Buyer Directory */}
      <div className="psychat-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-heading text-h3 text-white">Data Buyer Directory</h3>
          <button
            onClick={() => setShowBuyerDirectory(true)}
            className="psychat-button bg-psy-blue hover:bg-psy-blue/80 transition-colors flex items-center space-x-2"
          >
            <span>🔍</span>
            <span>Explore Buyers</span>
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-psy-blue/10 to-psy-purple/10 border border-psy-blue/20 rounded-lg p-4">
          <div className="text-body text-body-sm text-white/80 mb-2">
            <strong>Full Transparency:</strong> See exactly who's buying your data and why. 
            All buyers are verified and ethics-approved.
          </div>
          <div className="text-caption text-white/60">
            Revenue Split: 95% to you, 5% to platform • All transactions on-chain
          </div>
        </div>
      </div>

      {/* Token Trading Section */}
      <div className="psychat-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-heading text-h3 text-white">Token Trading</h3>
          <button
            onClick={() => setShowTrading(!showTrading)}
            className="psychat-button bg-psy-purple hover:bg-psy-purple/80 transition-colors"
          >
            {showTrading ? 'Hide Trading' : 'Show Trading'}
          </button>
        </div>
        
        {!showTrading && (
          <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-4">
            <div className="text-body text-body-sm text-white/80 mb-2">
              <strong>AMM Trading Available:</strong> Trade $PSY and $rUSD tokens with instant liquidity through Raydium AMM.
            </div>
            <div className="text-caption text-white/60">
              Click "Show Trading" to access the trading interface and participate in the PsyChat token economy.
            </div>
          </div>
        )}
        
        {showTrading && (
          <div className="mt-4">
            <TokenAMM />
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="psychat-card p-6">
        <h3 className="text-heading text-h3 text-white mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="text-heading text-h5 text-white mb-2">Quantum-Resistant Encryption</h4>
            <p className="text-body text-body-sm text-white/70">
              Data is encrypted with XX Network E2E encryption to protect privacy while stored on Arkiv blockchain.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🏪</div>
            <h4 className="text-heading text-h5 text-white mb-2">Polkadot DEX</h4>
            <p className="text-body text-body-sm text-white/70">
              Fair pricing and instant liquidity through Polkadot's decentralized exchange.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="text-heading text-h5 text-white mb-2">Polkadot Payments</h4>
            <p className="text-body text-body-sm text-white/70">
              Secure payments with Polkadot $PSY native tokens and auto-compound earnings into DeFi yields.
            </p>
          </div>
        </div>
      </div>

      {/* Data Buyer Directory Modal */}
      {showBuyerDirectory && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowBuyerDirectory(false)}
        >
          <div 
            className="psychat-card p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-display text-h2 text-white">Data Buyer Directory</h3>
              <button
                onClick={() => setShowBuyerDirectory(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* AI Companies */}
              <div className="bg-gradient-to-br from-psy-blue/20 to-psy-blue/5 border border-psy-blue/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-psy-blue rounded-full flex items-center justify-center text-white font-bold">AI</div>
                  <div>
                    <div className="text-heading text-h4 text-white">AI Companies</div>
                    <div className="text-body text-body-sm text-psy-blue">12 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-body text-body-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">OpenAI</span>
                    <span className="text-mono text-psy-green">$2.3M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Anthropic</span>
                    <span className="text-mono text-psy-green">$1.8M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Google DeepMind</span>
                    <span className="text-mono text-psy-green">$3.1M spent</span>
                  </div>
                </div>
                <div className="mt-3 text-caption text-white/60">
                  Focus: Training LLMs for therapeutic responses and mental health empathy
                </div>
              </div>

              {/* Research Labs */}
              <div className="bg-gradient-to-br from-psy-green/20 to-psy-green/5 border border-psy-green/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-psy-green rounded-full flex items-center justify-center text-white font-bold">R</div>
                  <div>
                    <div className="text-heading text-h4 text-white">Research Labs</div>
                    <div className="text-body text-body-sm text-psy-green">8 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Stanford Psychology</span>
                    <span className="text-psy-green">$890K spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">MIT Brain Sciences</span>
                    <span className="text-psy-green">$1.2M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Harvard Medical</span>
                    <span className="text-psy-green">$750K spent</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/60">
                  Focus: Peer-reviewed research on mental health patterns and interventions
                </div>
              </div>

              {/* Wellness Apps */}
              <div className="bg-gradient-to-br from-psy-purple/20 to-psy-purple/5 border border-psy-purple/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-psy-purple rounded-full flex items-center justify-center text-white font-bold">W</div>
                  <div>
                    <div className="text-heading text-h4 text-white">Wellness Apps</div>
                    <div className="text-body text-body-sm text-psy-purple">5 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Headspace</span>
                    <span className="text-psy-green">$1.5M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Calm</span>
                    <span className="text-psy-green">$2.1M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">BetterHelp</span>
                    <span className="text-psy-green">$980K spent</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/60">
                  Focus: Improving user experience and therapeutic matching algorithms
                </div>
              </div>

              {/* Corporate Wellness */}
              <div className="bg-gradient-to-br from-psy-orange/20 to-psy-orange/5 border border-psy-orange/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-psy-orange rounded-full flex items-center justify-center text-white font-bold">C</div>
                  <div>
                    <div className="text-heading text-h4 text-white">Corporate</div>
                    <div className="text-body text-body-sm text-psy-orange">3 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Microsoft</span>
                    <span className="text-psy-green">$1.2M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Salesforce</span>
                    <span className="text-psy-green">$890K spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Meta</span>
                    <span className="text-psy-green">$1.6M spent</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/60">
                  Focus: Employee wellness programs and workplace mental health initiatives
                </div>
              </div>

              {/* Government & NGOs */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">G</div>
                  <div>
                    <div className="text-heading text-h4 text-white">Government & NGOs</div>
                    <div className="text-body text-body-sm text-yellow-400">4 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">WHO Mental Health</span>
                    <span className="text-psy-green">$2.8M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">NIH Research</span>
                    <span className="text-psy-green">$1.9M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">UNICEF</span>
                    <span className="text-psy-green">$1.3M spent</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/60">
                  Focus: Global mental health policy and public health initiatives
                </div>
              </div>

              {/* Academic Institutions */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                  <div>
                    <div className="text-heading text-h4 text-white">Academic</div>
                    <div className="text-body text-body-sm text-cyan-400">6 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">UCLA Psychology</span>
                    <span className="text-psy-green">$650K spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Oxford Psychiatry</span>
                    <span className="text-psy-green">$780K spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Yale Medicine</span>
                    <span className="text-psy-green">$920K spent</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/60">
                  Focus: Clinical research and evidence-based therapy development
                </div>
              </div>
            </div>

            <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-4">
              <div className="text-body text-body-sm text-white/80 mb-2">
                <strong>Verification Process:</strong> All buyers undergo strict verification including ethics review, 
                data usage transparency, and compliance with privacy regulations.
              </div>
              <div className="text-caption text-white/60">
                Total Market Value: $28.7M • Average Purchase: $2,400 • 95% Revenue Share to Data Owners
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ChatNFT Listing Modal */}
      {selectedNFT && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedNFT(null)}
        >
          <div 
            className="psychat-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-display text-h2 text-white">
                List ChatNFT for Sale
              </h3>
              <button
                onClick={() => setSelectedNFT(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* NFT Details */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-heading text-h4 text-white">
                      Session #{selectedNFT.sessionId.split('_')[1]}
                    </div>
                    <div className="text-body text-body-sm text-white/60">
                      {selectedNFT.category} • {selectedNFT.messageCount} messages • {selectedNFT.date}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(selectedNFT.category)}`}>
                    {selectedNFT.category}
                  </span>
                </div>
                
                <div className="text-body text-body-sm text-white/70 mb-2">
                  <strong>Storage:</strong> {selectedNFT.walrusCid.slice(0, 20)}...
                </div>
              </div>

              {/* Eligible Pools */}
              <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-4">
                <div className="text-body text-body-sm text-white/80 mb-3">
                  <strong>AI Analysis Results - Eligible Data Pools:</strong>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedNFT.eligiblePools.map((pool, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-psy-blue/20 rounded"
                    >
                      <span className="text-psy-blue">✓</span>
                      <span className="text-body text-body-sm text-white/80">{pool}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-caption text-white/60">
                  ZK Proof: {selectedNFT.zkProof}
                </div>
              </div>

              {/* Automatic Pricing Section */}
              <div className="space-y-3">
                <h4 className="text-heading text-h4 text-white">Automatic Price Calculation</h4>
                <div className="bg-psy-green/10 border border-psy-green/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-heading text-h3 text-psy-green">
                      {calculateAutomaticPrice(selectedNFT)} PSY
                    </span>
                    <span className="text-body text-body-sm text-white/60">Calculated Price</span>
                  </div>
                  <div className="text-body text-body-sm text-white/80 mb-3">
                    AI-determined fair price based on data quality and market demand
                  </div>
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="text-body text-body-sm text-white/70 mb-2">
                    <strong>Price Breakdown:</strong>
                  </div>
                  <div className="space-y-1 text-caption text-white/60">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>0.5 PSY</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Message Count Bonus ({selectedNFT.messageCount} msgs):</span>
                      <span>+{Math.min(selectedNFT.messageCount * 0.1, 2.0).toFixed(1)} PSY</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eligible Pools Bonus ({selectedNFT.eligiblePools.length} pools):</span>
                      <span>+{Math.min(selectedNFT.eligiblePools.length * 0.2, 1.0).toFixed(1)} PSY</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ZK Proof Bonus:</span>
                      <span>+{selectedNFT.zkProof ? '0.3' : '0.0'} PSY</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category Multiplier ({selectedNFT.category}):</span>
                      <span>x{selectedNFT.category === 'anxiety' ? '1.2' : selectedNFT.category === 'depression' ? '1.3' : selectedNFT.category === 'stress' ? '1.1' : selectedNFT.category === 'relationships' ? '1.4' : '1.0'}</span>
                    </div>
                    <div className="border-t border-white/20 pt-1 mt-2">
                      <div className="flex justify-between font-bold text-psy-green">
                        <span>Final Price:</span>
                        <span>{calculateAutomaticPrice(selectedNFT)} PSY</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Summary */}
              <div className="bg-psy-green/10 border border-psy-green/20 rounded-lg p-4">
                <div className="text-body text-body-sm text-white/80 mb-2">
                  <strong>AI Analysis Summary:</strong>
                </div>
                <div className="space-y-1 text-caption text-white/60">
                  <div>• Data Quality: High ({selectedNFT.messageCount} messages)</div>
                  <div>• Category Relevance: {selectedNFT.category} insights</div>
                  <div>• Privacy Compliance: ZK-verified anonymization</div>
                  <div>• Market Demand: {selectedNFT.eligiblePools.length} active pools</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleListNFT(selectedNFT.id)}
                  disabled={isListing}
                  className="flex-1 psychat-button bg-psy-green disabled:opacity-50"
                >
                  {isListing ? 'Processing...' : `List for ${calculateAutomaticPrice(selectedNFT)} PSY`}
                </button>
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="px-6 psychat-button bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Scanning Modal */}
      {showAIScanning && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => {
            // Don't allow closing during scanning
            if (!scanningComplete) return;
            setShowAIScanning(false);
          }}
        >
          <div 
            className="psychat-card p-6 max-w-lg w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <h3 className="text-heading text-h3 text-white mb-3">
                AI Data Analysis
              </h3>
              <p className="text-body text-body-sm text-white/70">
                Scanning your ChatNFTs for data pool eligibility
              </p>
            </div>

            {/* Holographic Container */}
            <div className="relative mb-6">
              <div className="relative w-64 h-64 mx-auto">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full border-4 border-psy-blue/30 animate-pulse"></div>
                
                {/* Rotating inner rings */}
                <div className="absolute inset-4 rounded-full border-2 border-psy-purple/50 animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-8 rounded-full border border-psy-green/40 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                
                {/* Central holographic display */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-psy-blue/20 via-psy-purple/20 to-psy-green/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🤖</div>
                    <div className="text-heading text-h4 text-white mb-2">
                      {scanningComplete ? 'Analysis Complete' : 'AI Scanning...'}
                    </div>
                    <div className="text-body text-body-sm text-white/60">
                      {scanningComplete ? 'Privacy verified with ZKPs' : 'Ensuring privacy with ZKPs'}
                    </div>
                  </div>
                </div>

                {/* Floating data particles */}
                <div className="absolute inset-0">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-psy-blue rounded-full animate-ping"
                      style={{
                        left: `${20 + (i * 7)}%`,
                        top: `${15 + (i * 6)}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '2s'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-body text-body-sm text-white/60 mb-2">
                <span>Scanning Progress</span>
                <span>{Math.round(scanningProgress)}%</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-psy-blue via-psy-purple to-psy-green transition-all duration-300 ease-out"
                  style={{ width: `${scanningProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Status Messages */}
            <div className="space-y-2 text-left">
              <div className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-500 ${
                scanningProgress > 20 ? 'bg-psy-blue/10 border border-psy-blue/20' : 'bg-white/5'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  scanningProgress > 20 ? 'bg-psy-blue text-white' : 'bg-white/20 text-white/60'
                }`}>
                  {scanningProgress > 20 ? '✓' : '1'}
                </div>
                <div>
                  <div className="text-body text-body-sm text-white">Data Collection</div>
                  <div className="text-caption text-white/60">Gathering your ChatNFT metadata</div>
                </div>
              </div>

              <div className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-500 ${
                scanningProgress > 50 ? 'bg-psy-purple/10 border border-psy-purple/20' : 'bg-white/5'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  scanningProgress > 50 ? 'bg-psy-purple text-white' : 'bg-white/20 text-white/60'
                }`}>
                  {scanningProgress > 50 ? '✓' : '2'}
                </div>
                <div>
                  <div className="text-body text-body-sm text-white">AI Analysis</div>
                  <div className="text-caption text-white/60">Analyzing content patterns and quality</div>
                </div>
              </div>

              <div className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-500 ${
                scanningProgress > 80 ? 'bg-psy-green/10 border border-psy-green/20' : 'bg-white/5'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  scanningProgress > 80 ? 'bg-psy-green text-white' : 'bg-white/20 text-white/60'
                }`}>
                  {scanningProgress > 80 ? '✓' : '3'}
                </div>
                <div>
                  <div className="text-body text-body-sm text-white">ZK Proof Generation</div>
                  <div className="text-caption text-white/60">Creating privacy-preserving proofs</div>
                </div>
              </div>

              <div className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-500 ${
                scanningComplete ? 'bg-psy-green/10 border border-psy-green/20' : 'bg-white/5'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  scanningComplete ? 'bg-psy-green text-white' : 'bg-white/20 text-white/60'
                }`}>
                  {scanningComplete ? '✓' : '4'}
                </div>
                <div>
                  <div className="text-body text-body-sm text-white">Pool Matching</div>
                  <div className="text-caption text-white/60">Finding eligible data pools</div>
                </div>
              </div>
            </div>

            {/* Completion Message */}
            {scanningComplete && (
              <div className="mt-4 p-3 bg-psy-green/10 border border-psy-green/20 rounded-lg">
                <div className="text-heading text-h5 text-psy-green mb-1">
                  🎉 Analysis Complete!
                </div>
                <div className="text-body text-body-sm text-white/80">
                  Your data is eligible for sale. You can now list your ChatNFTs in the marketplace.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scanned Results Modal */}
      {showScannedResults && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setShowScannedResults(false)}
        >
          <div 
            className="psychat-card p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-display text-h2 text-white mb-2">
                  Your {currentPoolCategory} Data
                </h3>
                <p className="text-body text-body-md text-white/70">
                  AI analysis complete - Your {currentPoolCategory} data is ready for sale
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowScannedResults(false);
                    // Navigate to profile tab by triggering a custom event
                    window.dispatchEvent(new CustomEvent('navigateToProfile'));
                  }}
                  className="psychat-button bg-psy-blue hover:bg-psy-blue/80 text-sm px-4 py-2"
                >
                  See Listed Data
                </button>
                <button
                  onClick={() => setShowScannedResults(false)}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Success Banner */}
            <div className="bg-psy-green/10 border border-psy-green/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🎉</div>
                <div>
                  <div className="text-heading text-h4 text-psy-green mb-1">
                    Analysis Complete!
                  </div>
                  <div className="text-body text-body-sm text-white/80">
                    Found {getEligibleChatNFTsForPool(currentPoolCategory).length} eligible ChatNFTs for {currentPoolCategory} pool • ZK proofs verified • Ready for marketplace
                  </div>
                </div>
              </div>
            </div>

            {/* ChatNFTs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {getEligibleChatNFTsForPool(currentPoolCategory).map((nft) => (
                <div
                  key={nft.id}
                  className="bg-black/20 border border-white/10 rounded-lg p-4 hover:bg-black/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(nft.category)}`}>
                        {nft.category}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-psy-green/20 text-psy-green">
                        Eligible
                      </span>
                    </div>
                    <span className="text-xs text-white/60">
                      {nft.date}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="text-heading text-h5 text-white mb-1">
                      Session #{nft.sessionId.split('_')[1]}
                    </div>
                    <div className="text-body text-body-sm text-white/60">
                      {nft.messageCount} messages • {nft.eligiblePools.length} pools
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-body text-body-sm text-white/70">
                      <strong>Eligible Pools:</strong>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {nft.eligiblePools.slice(0, 2).map((pool, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-psy-blue/20 text-psy-blue text-xs rounded"
                        >
                          {pool}
                        </span>
                      ))}
                      {nft.eligiblePools.length > 2 && (
                        <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded">
                          +{nft.eligiblePools.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {nft.isListed ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-body text-body-sm">
                        <span className="text-white/60">Listed Price:</span>
                        <span className="text-mono text-psy-green">
                          {nft.price} PSY
                        </span>
                      </div>
                      <button
                        onClick={() => handleUnlistNFT(nft.id)}
                        className="w-full psychat-button bg-red-500 hover:bg-red-600"
                      >
                        Unlist
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedNFT(nft);
                        setShowScannedResults(false);
                      }}
                      className="w-full psychat-button bg-psy-green hover:bg-psy-green/80"
                    >
                      Sell This Data
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-heading text-h3 text-psy-blue mb-1">
                    {getEligibleChatNFTsForPool(currentPoolCategory).length}
                  </div>
                  <div className="text-body text-body-sm text-white/60">
                    Eligible for {currentPoolCategory}
                  </div>
                </div>
                <div>
                  <div className="text-heading text-h3 text-psy-green mb-1">
                    {getEligibleChatNFTsForPool(currentPoolCategory).filter(nft => nft.isListed).length}
                  </div>
                  <div className="text-body text-body-sm text-white/60">
                    Already Listed
                  </div>
                </div>
                <div>
                  <div className="text-heading text-h3 text-psy-purple mb-1">
                    {getEligibleChatNFTsForPool(currentPoolCategory).filter(nft => !nft.isListed).length}
                  </div>
                  <div className="text-body text-body-sm text-white/60">
                    Ready to Sell
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
