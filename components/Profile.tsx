import { useState, useEffect } from 'react';
// Wallet connection removed - Profile will be adapted for Farcaster later
import SpotlightCard from './SpotlightCard';
import { 
  mockPsychologists, 
  mockPayments, 
  mockYieldPositions, 
  generateMockDatasetNFTs,
  MockPsychologist,
  MockPayment,
  MockYieldPosition
} from '../utils/mockProfileData';

interface DatasetNFT {
  id: string;
  sessionId: string;
  category: string;
  messageCount: number;
  date: string;
  walrusCid: string;
  mintAddress: string;
  isListed: boolean;
  price: number;
}

interface UserProfile {
  walletAddress: string;
  hnftAddress: string | null;
  joinDate: string | null;
  totalEarnings: number;
  totalSessions: number;
  activeYieldPositions: number;
}

export default function Profile() {
  // Wallet connection removed - Profile will be adapted for Farcaster later
  const connected = false; // Placeholder until Farcaster integration
  const walletAddress = null; // Placeholder until Farcaster integration
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [datasetNFTs, setDatasetNFTs] = useState<DatasetNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connected || !walletAddress) {
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Placeholder for checking DID identity (to be replaced with Polkadot DID check)
        let hnftAddress: string | null = null;
        let joinDate: string | null = null;
        
        // Check localStorage for existing identity
        if (typeof window !== 'undefined') {
          const saved = window.localStorage.getItem('psychat_hnft_pda');
          if (saved) {
            hnftAddress = saved;
            joinDate = new Date().toISOString().split('T')[0];
          }
        }

        // Generate mock dataset NFTs
        const mockNFTs = generateMockDatasetNFTs(8);
        setDatasetNFTs(mockNFTs);

        // Calculate totals
        const totalEarnings = mockPayments.reduce((sum, payment) => {
          if (payment.currency === 'PSY') {
            return sum + payment.amount * 100; // Convert to cents for display
          }
          return sum + payment.amount;
        }, 0);

        const totalSessions = mockNFTs.length;
        const activeYieldPositions = mockYieldPositions.filter(pos => pos.isActive).length;

        setProfile({
          walletAddress: walletAddress,
          hnftAddress,
          joinDate,
          totalEarnings,
          totalSessions,
          activeYieldPositions,
        });

      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [connected, walletAddress]);

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'data_sale': return '💰';
      case 'yield_farming': return '🌾';
      case 'ubi_claim': return '🎁';
      default: return '💳';
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'data_sale': return 'text-psy-green';
      case 'yield_farming': return 'text-psy-blue';
      case 'ubi_claim': return 'text-psy-purple';
      default: return 'text-white';
    }
  };

  if (!connected) {
    return (
      <div className="psychat-card p-8 text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-display text-h2 text-white mb-4">Connect Your Wallet</h2>
        <p className="text-body text-body-md text-white/80 mb-6">
          Connect your wallet to view your PsyChat profile and data.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="psychat-card p-8 text-center">
        <div className="text-4xl mb-4">⏳</div>
        <h2 className="text-heading text-h3 text-white mb-2">Loading Profile...</h2>
        <p className="text-body text-body-sm text-white/60">Fetching your data from the blockchain</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="psychat-card p-8 text-center">
        <div className="text-4xl mb-4">❌</div>
        <h2 className="text-heading text-h3 text-white mb-2">Error Loading Profile</h2>
        <p className="text-body text-body-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-black/10 backdrop-blur-sm rounded-lg p-6">
        {/* Profile Header */}
        <SpotlightCard className="p-6" spotlightColor="rgba(97, 220, 163, 0.2)">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-psy-green/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h1 className="text-display text-h1 text-white">Your PsyChat Profile</h1>
            <p className="text-body text-body-sm text-white/60">
              {profile?.walletAddress ? `${profile.walletAddress.slice(0, 8)}...${profile.walletAddress.slice(-8)}` : 'Wallet not connected'}
            </p>
            {profile?.hnftAddress && (
              <div className="mt-2 text-caption text-psy-green flex items-center">
                <span className="mr-1">🎫</span>
                HNFT Identity Active
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-mono text-h2 text-psy-green">{profile?.totalSessions || 0}</div>
            <div className="text-body text-body-sm text-white/60">Therapy Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-mono text-h2 text-psy-blue">{profile?.totalEarnings.toFixed(2) || 0}</div>
            <div className="text-body text-body-sm text-white/60">Total Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-mono text-h2 text-psy-purple">{profile?.activeYieldPositions || 0}</div>
            <div className="text-body text-body-sm text-white/60">Active Positions</div>
          </div>
        </div>
      </SpotlightCard>

      {/* Identity Section */}
      <SpotlightCard className="p-6" spotlightColor="rgba(147, 51, 234, 0.2)">
        <h2 className="text-heading-major text-h2 text-white mb-4">Identity & Verification</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
            <div>
              <div className="text-body text-body-sm text-white/60 mb-1">Wallet Address</div>
              <div className="text-mono text-body-sm text-white">
                {profile?.walletAddress ? `${profile.walletAddress.slice(0, 12)}...${profile.walletAddress.slice(-12)}` : 'Not available'}
              </div>
            </div>
            <div className="text-psy-green">✅</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
            <div>
              <div className="text-body text-body-sm text-white/60 mb-1">HNFT Identity</div>
              <div className="text-mono text-body-sm text-white">
                {profile?.hnftAddress ? `${profile.hnftAddress.slice(0, 12)}...${profile.hnftAddress.slice(-12)}` : 'Not minted yet'}
              </div>
            </div>
            <div className={profile?.hnftAddress ? 'text-psy-green' : 'text-white/40'}>
              {profile?.hnftAddress ? '✅' : '⏳'}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
            <div>
              <div className="text-body text-body-sm text-white/60 mb-1">Member Since</div>
              <div className="text-body text-body-md text-white">
                {profile?.joinDate ? formatDate(profile.joinDate) : 'Not available'}
              </div>
            </div>
            <div className="text-psy-blue">🎫</div>
          </div>
        </div>
      </SpotlightCard>

      {/* Therapy Data Section */}
      <SpotlightCard className="p-6" spotlightColor="rgba(97, 179, 220, 0.2)">
        <h2 className="text-heading-major text-h2 text-white mb-4">Therapy Sessions & NFTs</h2>
        
        {datasetNFTs.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <div className="text-4xl mb-2">💭</div>
            <p className="text-body text-body-md">No therapy sessions yet</p>
            <p className="text-body text-body-sm mt-2">Start chatting to create your first session NFT</p>
          </div>
        ) : (
          <div className="space-y-3">
            {datasetNFTs.slice(0, 5).map((nft) => (
              <div key={nft.id} className="p-4 bg-black/20 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-heading text-h5 text-white">Session #{nft.sessionId.split('_')[1]}</div>
                    <div className="text-body text-body-sm text-white/60 capitalize">{nft.category} • {nft.messageCount} messages</div>
                  </div>
                  <div className="text-right">
                    <div className="text-body text-body-sm text-white/60">{formatDate(nft.date)}</div>
                    {nft.isListed && (
                      <div className="text-caption bg-psy-green/20 text-psy-green px-2 py-1 rounded mt-1">
                        Listed • {formatCurrency(nft.price, 'PSY')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-caption text-white/50 text-mono">
                  Storage: {nft.walrusCid.slice(0, 16)}...
                </div>
              </div>
            ))}
            {datasetNFTs.length > 5 && (
              <div className="text-center text-white/60 text-body text-body-sm">
                +{datasetNFTs.length - 5} more sessions
              </div>
            )}
          </div>
        )}
      </SpotlightCard>

      {/* Psychologist Connections (Mock/Placeholder) */}
      <SpotlightCard className="p-6" spotlightColor="rgba(248, 113, 113, 0.2)">
        <h2 className="text-heading-major text-h2 text-white mb-4">Psychologist Connections</h2>
        <div className="mb-4 p-3 bg-psy-orange/10 border border-psy-orange/20 rounded-lg">
          <div className="text-body text-body-sm text-white/80">
            <strong>Coming Soon:</strong> Direct connections with verified psychologists for personalized care.
          </div>
        </div>
        
        <div className="space-y-3">
          {mockPsychologists.map((psych) => (
            <div key={psych.id} className="p-4 bg-black/20 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-heading text-h5 text-white">{psych.name}</div>
                  <div className="text-body text-body-sm text-white/60">{psych.specialty}</div>
                  <div className="text-caption text-white/50 mt-1">
                    {psych.sessionCount} sessions • Last: {formatDate(psych.lastSession)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-mono text-body-sm text-psy-green">⭐ {psych.rating}</div>
                  <div className="text-caption text-white/50">
                    {psych.isVerified ? 'Verified' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SpotlightCard>

      {/* Payments & Earnings */}
      <SpotlightCard className="p-6" spotlightColor="rgba(74, 222, 128, 0.2)">
        <h2 className="text-heading-major text-h2 text-white mb-4">Payment History</h2>
        
        <div className="space-y-3">
          {mockPayments.slice(0, 5).map((payment) => (
            <div key={payment.id} className="p-4 bg-black/20 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getPaymentTypeIcon(payment.type)}</div>
                  <div>
                    <div className="text-heading text-h5 text-white">{payment.description}</div>
                    <div className="text-body text-body-sm text-white/60">{formatDate(payment.date)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-mono text-body-md ${getPaymentTypeColor(payment.type)}`}>
                    {formatCurrency(payment.amount, payment.currency)}
                  </div>
                  <div className="text-caption text-white/50 capitalize">
                    {payment.type.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SpotlightCard>

      {/* Yield Information */}
      <SpotlightCard className="p-6" spotlightColor="rgba(97, 220, 163, 0.2)">
        <h2 className="text-heading-major text-h2 text-white mb-4">Yield Positions</h2>
        
        <div className="space-y-3">
          {mockYieldPositions.map((position) => (
            <div key={position.id} className="p-4 bg-black/20 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-heading text-h5 text-white">{position.protocol} - {position.pool}</div>
                  <div className="text-body text-body-sm text-white/60">
                    {formatCurrency(position.amount, position.currency)}
                    {position.autoCompound && <span className="ml-2 text-psy-green">🔄 Auto-compound</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-mono text-body-md text-psy-green">{position.apy}% APY</div>
                  <div className="text-caption text-white/50">
                    {position.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SpotlightCard>
    </div>
  );
}
