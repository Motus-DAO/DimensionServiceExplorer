import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePolkadotWallet } from '../contexts/PolkadotWalletContext';
import EarningBento from './EarningBento';

// Import chart configuration to ensure proper registration
import '../lib/chartConfig';

const Line = dynamic(() => import('react-chartjs-2').then(m => m.Line), { ssr: false });

interface Earnings {
  totalEarned: number;
  currency: 'PSY' | 'rUSD';
  fromDataSales: number;
  fromYieldFarming: number;
  autoCompounded: number;
  ubiAvailable: number;
  revenueShare: {
    userEarnings: number;
    platformFee: number;
    totalRevenue: number;
  };
}

interface YieldOption {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  protocol: 'Raydium' | 'Forward Industries' | 'MotusDAO Treasury';
  risk: 'Low' | 'Medium' | 'High';
  minStake: number;
}

interface HNFTStats {
  totalMinted: number;
  totalListed: number;
  totalSold: number;
  averagePrice: number;
}

export default function Dashboard() {
  const { selectedAccount } = usePolkadotWallet();
  const walletAddress = selectedAccount?.address || null;
  const [earnings, setEarnings] = useState<Earnings>({
    totalEarned: 12.5,
    currency: 'PSY',
    fromDataSales: 8.2,
    fromYieldFarming: 4.3,
    autoCompounded: 2.1,
    ubiAvailable: 3.2,
    revenueShare: {
      userEarnings: 45.0,
      platformFee: 15.0,
      totalRevenue: 60.0,
    },
  });

  const [hnftStats, setHnftStats] = useState<HNFTStats>({
    totalMinted: 15,
    totalListed: 8,
    totalSold: 5,
    averagePrice: 2.1,
  });

  const [yieldOptions, setYieldOptions] = useState<YieldOption[]>([]);
  const [selectedYield, setSelectedYield] = useState<string>('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isClaimingUbi, setIsClaimingUbi] = useState(false);
  const [isAutoCompoundEnabled, setIsAutoCompoundEnabled] = useState(true);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    // Set chart ready since registration is handled by import
    setChartReady(true);

    // Mock yield farming options
    const mockYieldOptions: YieldOption[] = [
      {
        id: 'raydium-sol-usdc',
        name: 'PSY-rUSD Pool',
        apy: 15.2,
        tvl: 2500000,
        protocol: 'Raydium',
        risk: 'Low',
        minStake: 0.1,
      },
      {
        id: 'forward-treasury',
        name: 'Forward Industries Treasury',
        apy: 12.8,
        tvl: 1800000,
        protocol: 'Forward Industries',
        risk: 'Low',
        minStake: 1.0,
      },
      {
        id: 'motusdao-psy',
        name: '$PSYC Token Staking',
        apy: 18.5,
        tvl: 950000,
        protocol: 'MotusDAO Treasury',
        risk: 'Medium',
        minStake: 0.5,
      },
    ];
    setYieldOptions(mockYieldOptions);
  }, []);

  const handleClaimUbi = async () => {
    if (!walletAddress) return;

    setIsClaimingUbi(true);
    try {
      // Placeholder for Polkadot UBI claim
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update earnings
      setEarnings(prev => ({
        ...prev,
        totalEarned: prev.totalEarned + prev.ubiAvailable,
        fromYieldFarming: prev.fromYieldFarming + prev.ubiAvailable,
        ubiAvailable: 0, // Reset after claiming
      }));

      console.log('Successfully claimed UBI via Reflect $rUSD');
    } catch (error) {
      console.error('UBI claiming failed:', error);
    } finally {
      setIsClaimingUbi(false);
    }
  };

  const handleToggleAutoCompound = () => {
    setIsAutoCompoundEnabled(!isAutoCompoundEnabled);
  };

  const handleStake = async () => {
    if (!selectedYield || !stakeAmount) return;

    setIsStaking(true);
    try {
      // Placeholder for Polkadot staking
      const pid = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
      if (pid && walletAddress) {
        try {
          // Placeholder - will be replaced with Polkadot runtime calls
          const sig = 'placeholder_tx_hash';
          console.log('Stake UBI sig:', sig);
        } catch (e) {
          console.warn('Anchor stakeUbi unavailable, using mock:', e);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      const amount = parseFloat(stakeAmount);
      setEarnings(prev => ({
        ...prev,
        autoCompounded: prev.autoCompounded + amount,
      }));

      setStakeAmount('');
      setSelectedYield('');
      console.log('Successfully staked via Reflect $rUSD');
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const formatAPY = (apy: number) => {
    return `${apy.toFixed(1)}% APY`;
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      Low: 'text-green-400',
      Medium: 'text-yellow-400',
      High: 'text-red-400',
    };
    return colors[risk as keyof typeof colors] || colors.Medium;
  };

  return (
    <div className="space-y-6 bg-black/10 backdrop-blur-sm rounded-lg p-6">
      {/* Primary Metrics - Hero Section with EarningBento */}
      <div className="psychat-card p-6">
        <h2 className="text-display text-h1 text-white mb-6">Earnings Dashboard</h2>
        
        {/* Interactive EarningBento Grid */}
        <EarningBento
          earnings={earnings}
          hnftStats={hnftStats}
          onClaimUbi={handleClaimUbi}
          onToggleAutoCompound={handleToggleAutoCompound}
          isAutoCompoundEnabled={isAutoCompoundEnabled}
          isClaimingUbi={isClaimingUbi}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={false}
          enableMagnetism={true}
          clickEffect={true}
          glowColor="132, 0, 255"
          particleCount={8}
        />

        {/* UBI Stream Status */}
        <div className={`bg-gradient-to-r from-teal-500/15 via-cyan-500/15 to-blue-500/15 border rounded-lg p-4 backdrop-blur-sm mt-6 ${
          isAutoCompoundEnabled ? 'border-teal-400/40' : 'border-gray-500/40'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`${isAutoCompoundEnabled ? 'text-teal-300' : 'text-gray-400'}`} style={{ 
              textShadow: isAutoCompoundEnabled ? '0 0 15px rgba(20, 184, 166, 0.8)' : 'none' 
            }}>💰</span>
            <span className={`text-heading text-h4 ${
              isAutoCompoundEnabled ? 'text-teal-300' : 'text-gray-400'
            }`} style={{ 
              textShadow: isAutoCompoundEnabled ? '0 0 15px rgba(20, 184, 166, 0.8)' : 'none' 
            }}>
              UBI Stream {isAutoCompoundEnabled ? 'Active' : 'Paused'}
            </span>
          </div>
          <p className={`text-body text-body-sm ${
            isAutoCompoundEnabled ? 'text-teal-300/90' : 'text-gray-400/70'
          }`}>
            {isAutoCompoundEnabled 
              ? 'Your data earnings are automatically compounding at 5-15% APY, creating a sustainable Universal Basic Income stream from your mental health insights.'
              : 'Auto-compounding is currently paused. Enable the toggle above to resume automatic earnings growth.'
            }
          </p>
        </div>
      </div>

      {/* Secondary Metrics - Earnings Breakdown */}
      <div className="psychat-card p-6">
        <h3 className="text-heading text-h2 text-white mb-4">Earnings Breakdown</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Sales */}
          <div className="bg-gradient-to-br from-fuchsia-500/15 to-red-500/15 border border-fuchsia-400/40 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-body text-body-sm text-fuchsia-300/90">From Data Sales</div>
              <span className="text-xl">📊</span>
            </div>
            <div className="text-mono text-h2 text-fuchsia-300 mb-1" style={{ textShadow: '0 0 15px rgba(255, 0, 255, 0.8)' }}>
              {formatCurrency(earnings.fromDataSales, 'PSY')}
            </div>
            <div className="text-caption text-fuchsia-300/70">Mental health insights monetization</div>
          </div>

          {/* Yield Farming */}
          <div className="bg-gradient-to-br from-purple-500/15 to-pink-500/15 border border-purple-400/40 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-body text-body-sm text-purple-300/90">From Yield Farming</div>
              <span className="text-xl">🌾</span>
            </div>
            <div className="text-mono text-h2 text-purple-300 mb-1" style={{ textShadow: '0 0 15px rgba(139, 92, 246, 0.8)' }}>
              {formatCurrency(earnings.fromYieldFarming, 'rUSD')}
            </div>
            <div className="text-caption text-purple-300/70">DeFi protocol yields</div>
          </div>
        </div>
      </div>

      {/* Tertiary Metrics - Revenue Share */}
      <div className="psychat-card p-6">
        <h3 className="text-heading text-h2 text-white mb-4">Revenue Share Breakdown</h3>
        
        <div className="bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-400/40 rounded-lg p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-mono text-h1 text-emerald-300 mb-2" style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.8)' }}>
                {formatCurrency(earnings.revenueShare.userEarnings, 'rUSD')}
              </div>
              <div className="text-body text-body-sm text-emerald-300/80">Your Earnings (95%)</div>
            </div>
            <div className="text-center">
              <div className="text-mono text-h1 text-rose-300 mb-2" style={{ textShadow: '0 0 15px rgba(251, 113, 133, 0.8)' }}>
                {formatCurrency(earnings.revenueShare.platformFee, 'rUSD')}
              </div>
              <div className="text-body text-body-sm text-rose-300/80">Platform Fee (5%)</div>
            </div>
            <div className="text-center">
              <div className="text-mono text-h1 text-violet-300 mb-2" style={{ textShadow: '0 0 15px rgba(196, 181, 253, 0.8)' }}>
                {formatCurrency(earnings.revenueShare.totalRevenue, 'rUSD')}
              </div>
              <div className="text-body text-body-sm text-violet-300/80">Total Revenue</div>
            </div>
          </div>
          <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-400/30 rounded-lg p-4">
            <div className="text-body text-body-sm text-cyan-300/90">
              <strong>Transparent Economics:</strong> You keep 95% of all data sales revenue. 
              The remaining 5% supports platform development, security, and infrastructure.
            </div>
          </div>
        </div>
      </div>

      {/* HNFT Statistics */}
      <div className="psychat-card p-6">
        <h3 className="text-heading text-h2 text-white mb-4">Your HNFT Portfolio</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-mono text-h2 text-white">{hnftStats.totalMinted}</div>
            <div className="text-body text-body-sm text-white/60">Total Minted</div>
          </div>
          <div className="text-center">
            <div className="text-mono text-h2 text-psy-blue">{hnftStats.totalListed}</div>
            <div className="text-body text-body-sm text-white/60">Listed</div>
          </div>
          <div className="text-center">
            <div className="text-mono text-h2 text-psy-green">{hnftStats.totalSold}</div>
            <div className="text-body text-body-sm text-white/60">Sold</div>
          </div>
          <div className="text-center">
            <div className="text-mono text-h2 text-psy-purple">
              {formatCurrency(hnftStats.averagePrice, 'PSY')}
            </div>
            <div className="text-body text-body-sm text-white/60">Avg Price</div>
          </div>
        </div>
      </div>

      {/* Growth & UBI Chart */}
      <div className="psychat-card p-6">
        <h3 className="text-heading text-h2 text-white mb-4">Growth & UBI Projection</h3>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="h-64">
            {typeof window !== 'undefined' && chartReady ? (
              <Line
              data={{
                labels: ['Month 1', 'Month 3', 'Month 6', 'Month 12'],
                datasets: [
                  {
                    label: 'User Growth',
                    data: [100, 1000, 10000, 1000000],
                    borderColor: '#4BC0C0',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    fill: false,
                  },
                  {
                    label: 'UBI Earnings ($)',
                    data: [10, 100, 1000, 10000],
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    labels: { color: '#ffffff' } 
                  } 
                },
                scales: {
                  x: { 
                    type: 'category',
                    ticks: { color: '#cccccc' }, 
                    grid: { color: 'rgba(255,255,255,0.08)' } 
                  },
                  y: { 
                    type: 'linear',
                    beginAtZero: true, 
                    ticks: { color: '#cccccc' }, 
                    grid: { color: 'rgba(255,255,255,0.08)' } 
                  },
                },
              }}
            />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-body text-body-md text-white/70">Loading chart...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Yield Farming Options */}
      <div className="psychat-card p-6">
        <h3 className="text-heading text-h2 text-white mb-4">DeFi Yield Options</h3>
        <p className="text-body text-body-md text-white/70 mb-6">
          Auto-compound your earnings into high-yield DeFi protocols via Reflect $rUSD
        </p>

        <div className="space-y-4 mb-6">
          {yieldOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                selectedYield === option.id
                  ? 'border-psy-purple bg-psy-purple/10'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => setSelectedYield(option.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-heading text-h5 text-white">{option.name}</h4>
                  <p className="text-body text-body-sm text-white/60">{option.protocol}</p>
                </div>
                <div className="text-right">
                  <div className="text-mono text-h4 text-psy-green">
                    {formatAPY(option.apy)}
                  </div>
                  <div className="text-body text-body-sm text-white/60">
                    TVL: ${(option.tvl / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-body text-body-sm ${getRiskColor(option.risk)}`}>
                  {option.risk} Risk
                </span>
                <span className="text-body text-body-sm text-white/60">
                  Min: {option.minStake} rUSD
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Staking Interface */}
        {selectedYield && (
          <div className="bg-black/20 rounded-lg p-4">
            <h4 className="text-heading text-h5 text-white mb-3">
              Stake in {yieldOptions.find(o => o.id === selectedYield)?.name}
            </h4>
            <div className="flex space-x-3">
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Amount to stake"
                className="flex-1 psychat-input"
              />
              <button
                onClick={handleStake}
                disabled={!stakeAmount || isStaking}
                className="psychat-button px-6 disabled:opacity-50"
              >
                {isStaking ? 'Staking...' : 'Stake'}
              </button>
            </div>
            <div className="text-caption text-white/60 mt-2">
              Powered by Reflect $rUSD • Auto-compound enabled
            </div>
          </div>
        )}
      </div>

      {/* Impact Metrics */}
      <div className="psychat-card p-6">
        <h3 className="text-heading text-h2 text-white mb-4">Impact Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-mono text-h1 text-psy-green mb-2">$30B</div>
            <div className="text-body text-body-sm text-white/60">Total Addressable Market</div>
            <div className="text-caption text-white/50 mt-1">
              Mental health data economy
            </div>
          </div>
          <div className="text-center">
            <div className="text-mono text-h1 text-psy-blue mb-2">40%</div>
            <div className="text-body text-body-sm text-white/60">Therapy Cost Reduction</div>
            <div className="text-caption text-white/50 mt-1">
              Through tokenized subsidies
            </div>
          </div>
          <div className="text-center">
            <div className="text-mono text-h1 text-psy-purple mb-2">1M+</div>
            <div className="text-body text-body-sm text-white/60">Scalable Users</div>
            <div className="text-caption text-white/50 mt-1">
              Platform capacity
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-psy-blue/10 border border-psy-blue/20 rounded-lg">
          <div className="text-body text-body-sm text-white/80">
            <strong>MotusDAO Vision:</strong> PsyChat aligns with our mission to democratize 
            mental health access through Web3 technology. By tokenizing therapy data and 
            creating sustainable UBI streams, we're building a more equitable mental health ecosystem.
          </div>
        </div>
      </div>
    </div>
  );
}


