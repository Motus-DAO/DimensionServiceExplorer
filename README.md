# 🌌 Dimension Service Explorer
## Find Peace of Mind Through Generative Art & Creators Economy

**Platform:** Farcaster Mini App  
**Network:** Celo Mainnet  
**Organization:** MotusDAO  

---

## 🎯 Vision

Dimension Service Explorer is a Farcaster miniapp where you find peace of mind by exploring other dimensions through generative art. Experiment with fractal experiences, mint your discoveries as NFTs, and earn in a creators economy built on Celo.

This miniapp is part of the **MotusDAO ecosystem funnel**, connecting you to:
- 🤝 **Real human therapists** for personalized mental health support
- 🤖 **AI-trained chat companions** for 24/7 guidance
- 🎨 **Creative expression** through generative art experiences
- 💰 **Creators economy** where your art earns PSY tokens

---

## ✨ What You Can Do

### 🌀 Explore Dimensions
- Browse 13+ unique fractal generators (brainmelt, cosmic, entropy, glitchy, and more)
- Interact with generative art in real-time
- Discover new patterns and visual experiences
- Find peace of mind through creative exploration

### 🎨 Mint Your Experiences
- Capture your favorite fractal moments as NFTs
- Mint directly on Celo Mainnet as ERC721 tokens
- Own your creative discoveries on-chain
- Build your personal collection of dimensional art

### 💰 Creators Economy
- **Earn PSY tokens** through the faucet
- **Exchange PSY** in the creators economy marketplace
- **Swap for cUSD** on Ubeswap to cash out
- **Get rewarded** for creating and sharing art

### 🔗 MotusDAO Ecosystem
- Seamless connection to MotusDAO's mental health services
- Access to human therapists when you need deeper support
- AI chat companions trained for mental wellness
- Complete journey from art exploration to therapeutic support

---

## 🚀 Quick Start

### Prerequisites
- **Farcaster account** (to access the miniapp)
- **Wallet** (Farcaster provides wallet access via SDK)
- **Celo network** configured in your wallet

### Installation (For Developers)

1. **Clone the repository**
```bash
git clone https://github.com/motusdao/dimension-service-explorer.git
cd dimension-service-explorer
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment (.env.local)**
Create `.env.local` in project root:
```bash
# Celo Network Configuration
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_CHAIN_ID=42220

# PSY Token Configuration
NEXT_PUBLIC_PSY_TOKEN_ADDRESS=0x... # PSY ERC20 token address on Celo

# Farcaster Mini App
NEXT_PUBLIC_FARCASTER_APP_URL=https://dimension-service-explorer.vercel.app

# NFT Contract (optional - for minting)
NEXT_PUBLIC_FRACTALES_NFT_ADDRESS=0x... # Fractales NFT contract address on Celo
```

4. **Start the development server**
```bash
cd DimensionServiceExplorer-celo
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

---

## 📖 How to Use

### Step 1: Access via Farcaster

**Quick Access:**
1. Open **Warpcast** (mobile app or web at warpcast.com)
2. In any cast/compose box, paste: `https://dimension-service-explorer.vercel.app`
3. Warpcast will detect it as a miniapp and show a preview card
4. Tap the preview to open the miniapp in fullscreen
5. Your Farcaster account is automatically connected via SDK
6. Your wallet is accessible through Farcaster's built-in wallet

**Alternative Methods:**
- Share the URL in a cast for others to discover
- Add to your Warpcast profile bio
- Create a QR code for easy mobile access

📖 **See [HOW_TO_OPEN_ON_FARCASTER.md](./HOW_TO_OPEN_ON_FARCASTER.md) for detailed instructions**

### Step 2: Explore Dimensions
1. Browse the **Fractales Gallery** to see all available generators
2. Click on any fractal (brainmelt, cosmic, entropy, etc.)
3. Interact with the fractal - adjust parameters, generate new patterns
4. Find a moment that brings you peace

### Step 3: Mint Your Experience
1. When you find a fractal you love, click **"Capture Screen"**
2. Review your captured image
3. Click **"Mint NFT"** to create an ERC721 on Celo
4. Approve the transaction in your wallet
5. Your NFT appears in the **Minted Gallery**

### Step 4: Earn in Creators Economy
1. **Claim PSY tokens** from the faucet
2. **Exchange PSY** in the creators economy marketplace
3. **Swap for cUSD** on Ubeswap when ready to cash out
4. Earn rewards for creating and sharing your art

### Step 5: Connect to MotusDAO Ecosystem
1. Navigate to the **MotusDAO** section
2. **Connect with therapists** for personalized mental health support
3. **Chat with AI companions** trained for mental wellness
4. Continue your journey from art exploration to therapeutic growth

---

## 🏗️ Architecture

### Frontend (Next.js)
```
pages/
├── index.tsx              # Main landing page
├── fractales/
│   ├── index.tsx          # Fractales gallery
│   ├── gallery.tsx        # Minted NFTs gallery
│   └── [name].tsx         # Individual fractal viewer
components/
├── fractales/
│   └── MintedGallery.tsx  # NFT gallery component
├── ui/                    # Holo UI components
└── sections/              # Landing page sections
```

### Smart Contracts (Solidity)
```
contracts/
└── FractalesNFT.sol       # ERC721 NFT contract on Celo
```

### Key Integrations
- **Farcaster Mini App SDK** - User authentication & wallet access
- **Celo Mainnet** - Blockchain for NFTs and tokens
- **PSY Token** - Creators economy rewards
- **Ubeswap** - DEX for PSY ↔ cUSD swaps
- **Arkiv** - Decentralized storage for likes and metadata

---

## 🪙 PSY Token & Creators Economy

### PSY Token Details
- **Name:** PSY Token
- **Symbol:** PSY
- **Network:** Celo Mainnet
- **Standard:** ERC20
- **Purpose:** Rewards for creators in the ecosystem

### How to Earn PSY
1. **Faucet:** Claim free PSY tokens to get started
2. **Minting:** Earn PSY when you mint fractales NFTs
3. **Likes:** Get rewarded when others like your art
4. **Sharing:** Earn for sharing your creations

### How to Use PSY
1. **Exchange:** Trade PSY in the creators economy marketplace
2. **Swap:** Convert PSY to cUSD on Ubeswap
3. **Stake:** (Coming soon) Stake PSY for additional rewards
4. **Governance:** (Coming soon) Vote on platform decisions

---

## 🔗 MotusDAO Ecosystem Integration

Dimension Service Explorer is the **entry point** to the MotusDAO ecosystem:

### Journey Flow
```
Dimension Exploration
    ↓
Art Creation & Minting
    ↓
Creators Economy (PSY rewards)
    ↓
MotusDAO Services
    ├── Human Therapists
    ├── AI Chat Companions
    └── Mental Health Resources
```

### Connected Services
- **Therapy Platform:** Connect with verified human therapists
- **AI Companions:** 24/7 mental health chat support
- **Wellness Resources:** Access to mental health tools and guides
- **Community:** Join the MotusDAO community for support

---

## 🛠️ Development

### Tech Stack
- **Framework:** Next.js 14
- **Blockchain:** Celo Mainnet (EVM-compatible)
- **Smart Contracts:** Solidity, Hardhat
- **UI:** React, Tailwind CSS, Framer Motion
- **Storage:** Arkiv (decentralized storage)

### Key Commands
```bash
# Development
npm run dev

# Build
npm run build

# Deploy contracts
npm run hh:deploy

# Mint test NFT
npm run hh:mint
```

### Project Structure
```
DimensionServiceExplorer-celo/
├── pages/              # Next.js pages
├── components/         # React components
├── contracts/          # Solidity smart contracts
├── lib/                # Utilities and hooks
├── contexts/           # React contexts
├── public/             # Static assets
└── styles/             # Global styles
```

---

## 🌐 Network Configuration

### Celo Mainnet
- **Chain ID:** 42220
- **RPC URL:** https://forno.celo.org
- **Block Explorer:** https://celoscan.io
- **Currency:** PSY, CELO (native), cUSD (stablecoin)

### Adding Celo to Your Wallet
1. Open your wallet (MetaMask, etc.)
2. Add network manually:
   - Network Name: Celo Mainnet
   - RPC URL: https://forno.celo.org
   - Chain ID: 42220
   - Currency Symbol: CELO
   - Block Explorer: https://celoscan.io

---

## 📊 Features Roadmap

### ✅ Current Features
- [x] Farcaster miniapp integration (fully integrated with SDK)
- [x] Farcaster user authentication and profile display
- [x] Farcaster wallet integration for NFT minting
- [x] 13+ fractal generators
- [x] NFT minting on Celo via Farcaster wallet
- [x] Minted gallery
- [x] PSY token faucet
- [x] Creators economy marketplace
- [x] Ubeswap integration for PSY ↔ cUSD

### 🚧 Coming Soon
- [ ] On-chain likes and tipping
- [ ] PSY staking rewards
- [ ] Governance voting
- [ ] Enhanced MotusDAO integration
- [ ] Social sharing features
- [ ] Creator profiles

---

## 🤝 Contributing

Built by the **MotusDAO** community for mental wellness through creative expression.

### Get Involved
- Join our community discussions
- Report issues on GitHub
- Submit pull requests
- Share your fractal creations

---

## 📄 License

MIT License - Open source

---

## 🔗 Links

- **GitHub:** [github.com/motusdao/dimension-service-explorer](https://github.com/motusdao/dimension-service-explorer)
- **MotusDAO:** [motusdao.org](https://motusdao.org)
- **Celo:** [celo.org](https://celo.org)
- **Ubeswap:** [ubeswap.org](https://ubeswap.org)
- **Farcaster:** [farcaster.xyz](https://farcaster.xyz)

---

**Built with ❤️ for finding peace of mind through art**

*Dimension Service Explorer - Explore dimensions, mint experiences, earn in the creators economy*
