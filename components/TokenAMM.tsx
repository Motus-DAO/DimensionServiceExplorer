import { useState, useEffect } from 'react';
import { usePolkadotWallet } from '../contexts/PolkadotWalletContext';

interface TokenBalance {
  token: string;
  symbol: string;
  balance: number;
  usdValue: number;
}

interface LiquidityPool {
  pair: string;
  liquidity: number;
  volume24h: number;
  price: number;
  priceChange24h: number;
}

export default function TokenAMM() {
  const { selectedAccount } = usePolkadotWallet();
  const walletAddress = selectedAccount?.address || null;
  const [fromToken, setFromToken] = useState('PSY');
  const [toToken, setToToken] = useState('rUSD');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSlippage, setShowSlippage] = useState(false);

  // Mock token balances
  const [balances] = useState<TokenBalance[]>([
    { token: 'PSY', symbol: 'PSY', balance: 1250.75, usdValue: 1250.75 },
    { token: 'rUSD', symbol: 'rUSD', balance: 850.25, usdValue: 850.25 },
  ]);

  // Mock liquidity pool data
  const [poolData] = useState<LiquidityPool>({
    pair: 'PSY/rUSD',
    liquidity: 525000,
    volume24h: 45000,
    price: 1.0,
    priceChange24h: 2.3,
  });

  // Calculate swap amounts (mock calculation)
  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const mockRate = fromToken === 'PSY' ? 1.0 : 1.0; // 1:1 for demo
      const calculated = parseFloat(fromAmount) * mockRate;
      setToAmount(calculated.toFixed(6));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwap = async () => {
    if (!walletAddress || !fromAmount || !toAmount) return;

    setIsSwapping(true);
    try {
      // Mock Raydium AMM swap simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`Swapping ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`);
      alert(`Swap successful! Received ${toAmount} ${toToken}`);
      
      // Reset form
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
      alert('Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  const handleReverseTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const getBalance = (token: string) => {
    const balance = balances.find(b => b.token === token);
    return balance ? balance.balance.toFixed(4) : '0.0000';
  };

  const getPriceImpact = () => {
    if (!fromAmount) return 0;
    const amount = parseFloat(fromAmount);
    const impact = (amount / poolData.liquidity) * 100;
    return Math.min(impact, 99.9); // Cap at 99.9%
  };

  const priceImpact = getPriceImpact();
  const isHighImpact = priceImpact > 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="psychat-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Token Trading</h2>
          <div className="text-sm text-white/60">
            Powered by Raydium AMM • Mock Trading
          </div>
        </div>
        <div className="text-xs text-white/60">
          💡 This is a mock interface for demonstration. Real trading will be available soon.
        </div>
      </div>

      {/* Main Swap Interface */}
      <div className="psychat-card p-6">
        <div className="space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <label className="text-sm text-white/70">From</label>
            <div className="crystal-glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-psy-purple to-psy-blue flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{fromToken[0]}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{fromToken}</div>
                    <div className="text-xs text-white/60">Balance: {getBalance(fromToken)}</div>
                  </div>
                </div>
                <button
                  onClick={() => setFromAmount(getBalance(fromToken))}
                  className="text-xs text-psy-blue hover:text-psy-purple transition-colors"
                >
                  MAX
                </button>
              </div>
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-transparent text-2xl font-bold text-white placeholder-white/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <button
              onClick={handleReverseTokens}
              className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <label className="text-sm text-white/70">To</label>
            <div className="crystal-glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-psy-green to-electric-cyan flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{toToken[0]}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{toToken}</div>
                    <div className="text-xs text-white/60">Balance: {getBalance(toToken)}</div>
                  </div>
                </div>
              </div>
              <input
                type="number"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="w-full bg-transparent text-2xl font-bold text-white placeholder-white/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Price Impact & Slippage */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/70">Price Impact</span>
              <span className={`text-sm font-medium ${isHighImpact ? 'text-red-400' : 'text-white'}`}>
                {priceImpact.toFixed(2)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/70">Slippage Tolerance</span>
              <button
                onClick={() => setShowSlippage(!showSlippage)}
                className="text-sm text-psy-blue hover:text-psy-purple transition-colors"
              >
                {slippage}% ⚙️
              </button>
            </div>

            {showSlippage && (
              <div className="crystal-glass rounded-lg p-3">
                <div className="flex space-x-2 mb-2">
                  {[0.1, 0.5, 1.0].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        slippage === value
                          ? 'bg-psy-purple text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
                  className="w-full psychat-input text-sm"
                  placeholder="Custom slippage"
                />
              </div>
            )}
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!fromAmount || !toAmount || isSwapping}
            className="w-full psychat-button py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSwapping ? 'Swapping...' : `Swap ${fromToken} for ${toToken}`}
          </button>
        </div>
      </div>

      {/* Pool Information */}
      <div className="psychat-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Pool Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="crystal-glass rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">Pool</div>
            <div className="text-white font-semibold">{poolData.pair}</div>
          </div>
          <div className="crystal-glass rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">Liquidity</div>
            <div className="text-white font-semibold">${poolData.liquidity.toLocaleString()}</div>
          </div>
          <div className="crystal-glass rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">24h Volume</div>
            <div className="text-white font-semibold">${poolData.volume24h.toLocaleString()}</div>
          </div>
          <div className="crystal-glass rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">24h Change</div>
            <div className={`font-semibold ${poolData.priceChange24h >= 0 ? 'text-psy-green' : 'text-red-400'}`}>
              {poolData.priceChange24h >= 0 ? '+' : ''}{poolData.priceChange24h}%
            </div>
          </div>
        </div>
      </div>

      {/* Token Balances */}
      <div className="psychat-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Your Balances</h3>
        <div className="space-y-3">
          {balances.map((balance) => (
            <div key={balance.token} className="flex justify-between items-center crystal-glass rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-psy-purple to-psy-blue flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{balance.symbol[0]}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{balance.symbol}</div>
                  <div className="text-xs text-white/60">${balance.usdValue.toFixed(2)} USD</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{balance.balance.toFixed(4)}</div>
                <div className="text-xs text-white/60">{balance.symbol}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Panel */}
      <div className="psychat-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">How Trading Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🔄</div>
            <h4 className="font-semibold text-white mb-2">Automated Market Maker</h4>
            <p className="text-sm text-white/70">
              Raydium AMM provides instant liquidity and fair pricing through automated algorithms.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="font-semibold text-white mb-2">$PSY Token Economy</h4>
            <p className="text-sm text-white/70">
              Trade $PSY and $rUSD tokens to participate in the PsyChat ecosystem.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="font-semibold text-white mb-2">Instant Settlement</h4>
            <p className="text-sm text-white/70">
              All trades are executed instantly on Solana with minimal fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
