# 🧠 PsyChat
## Polkadot-Native Mental Health Platform MVP

**Built for:** Polkadot Sub Zero   
**Track:** Polkadot, Arkiv, Kusama, XX Network, Marketing Track  
**Organization:** MotusDAO  

---

## 🎯 Vision

PsyChat is a privacy-first mental health platform that empowers users to own their therapy data, earn from anonymized insights, and access sustainable DeFi yields. Built natively on Polkadot with deep integrations across the ecosystem, PsyChat leverages XX Network's quantum-resistant privacy protocols for secure communication, Arkiv's decentralized storage for immutable therapy records, Hyperbridge's cross-chain interoperability for seamless multi-chain experiences, and Kusama's experimental governance for community-driven platform evolution. The platform enables users to maintain complete sovereignty over their mental health data through soulbound Human NFTs (HNFTs), participate in a decentralized marketplace where anonymized insights are traded transparently, and benefit from sustainable Universal Basic Income (UBI) streams generated through DeFi yield farming. By combining Web3 technologies with mental health care, PsyChat creates a new paradigm where users are not just patients but active participants in a data economy that values privacy, ownership, and financial empowerment.

## ✨ Key Features

### 🔒 Privacy-First Design
- **XX Network Privacy:** Quantum-resistant encryption protocols protect personal data
- **Soulbound HNFTs:** Non-transferable Human NFTs ensure data ownership
- **Anonymized Insights:** Only aggregated, privacy-preserving data is shared
- **Arkiv Storage:** Decentralized, immutable storage for therapy records

### 🏪 Decentralized Marketplace
- **Cross-Chain Trading:** Hyperbridge enables seamless data trading across Polkadot ecosystem
- **Fair Pricing:** Transparent marketplace for anonymized mental health insights
- **Research Access:** Institutions can bid on anonymized mental health insights

### 💰 Sustainable UBI Streams
- **Auto-Compound Earnings:** DeFi yields from data sales (5-15% APY)
- **Multiple Yield Options:** Polkadot parachain staking, MotusDAO $PSYC staking, cross-chain DeFi
- **Mobile-First UX:** Polkadot wallet integration for seamless user experience

## 🪙 PSYC Token Information

### Token Details
- **Name:** Psychat token
- **Symbol:** PSYC
- **Network:** Polkadot Ecosystem
- **Standard:** Substrate-based token
- **Governance:** Kusama experimental governance integration

### Token Utility
- **Data Ownership:** PSYC tokens represent ownership of therapy data through HNFTs
- **Staking Rewards:** Stake PSYC to earn yields from platform revenue
- **Governance:** Participate in platform decisions through Kusama governance
- **Marketplace:** Use PSYC for trading anonymized mental health insights

## 🏗️ Architecture

### Frontend (Next.js)
```
pages/
├── index.tsx              # Main app with wallet integration
├── _app.tsx              # Wallet adapter setup
├── api/chat.ts           # AI chat API endpoint
components/
├── Chat.tsx              # Therapy notes interface with ZK encryption
├── Marketplace.tsx       # Data trading marketplace
├── Dashboard.tsx         # Earnings & yield farming
└── ClientWalletButton.tsx # Wallet connection component
```

### Backend (Substrate Runtime)
```
runtime/
└── lib.rs                # HNFT minting, marketplace, auto-compound pallets
```

**Polkadot Integration:**
- **Parachain:** Built as Polkadot parachain
- **Features:** Soulbound HNFTs, Marketplace, Auto-compound yields
- **Cross-Chain:** Hyperbridge integration for multi-chain interoperability

### Ecosystem Integrations
```
utils/
├── polkadotIntegrations.ts # XX Network, Arkiv, Hyperbridge, Kusama integrations
├── identity/hnftOperations.ts # HNFT minting and management
├── nft/chatNFTMinting.ts     # NFT creation utilities
├── nft/metadataStorage.ts    # Metadata handling (Arkiv integration)
└── tokenCreation.ts          # Token creation utilities
```

**Polkadot Ecosystem Architecture:**
- **XX Network:** Quantum-resistant privacy protocols for secure communication
- **Arkiv:** Decentralized storage for immutable therapy records
- **Hyperbridge:** Cross-chain interoperability for seamless multi-chain experiences
- **Kusama:** Experimental governance for community-driven platform evolution

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- **Polkadot wallet extension** (Polkadot.js, Talisman, or SubWallet) - Required for main app features
- **MetaMask** - Required for Kusama/Fractales NFT gallery (EVM-compatible)
- OpenAI or xAI Grok API key

> **📖 New to PsyChat?** See the [How to Use PsyChat](#-how-to-use-psychat) section below for detailed step-by-step instructions on wallet setup, identity minting, and using all features.

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/motusdao/psychat.git
cd psychat
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment (.env.local)**
Create `.env.local` in project root:
```bash
# AI Provider Configuration
OPENAI_API_KEY=sk-...
XAI_API_KEY=xai-...
NEXT_PUBLIC_DEFAULT_PROVIDER=openai   # or xai
NEXT_PUBLIC_DEFAULT_MODEL=gpt-4o-mini # or grok-4

# Polkadot Network Configuration
NEXT_PUBLIC_POLKADOT_NETWORK=polkadot  # or kusama, westend
NEXT_PUBLIC_RPC_URL=wss://rpc.polkadot.io  # or custom RPC endpoint

# XX Network Configuration
NEXT_PUBLIC_XX_NETWORK_ENABLED=true

# Arkiv Storage Configuration
NEXT_PUBLIC_ARHIV_ENABLED=true
```

6. **Start the development server**
```bash
npm run dev
```

7. **Open in browser**
```
http://localhost:3000
```

### Grok vs OpenAI in the App
- In Chat, use the AI Provider dropdown to select OpenAI or xAI Grok.
- Models: examples `gpt-4o-mini`, `gpt-4o` (OpenAI) or `grok-4` (xAI).
- The backend auto-selects OpenAI if `OPENAI_API_KEY` is set; otherwise uses xAI if `XAI_API_KEY` is present.

## 📖 How to Use PsyChat

This guide will walk you through using PsyChat step-by-step, from wallet setup to interacting with all features.

### Step 1: Install Polkadot Wallet Extension

**Why you need a Polkadot wallet:**
PsyChat is built on the Polkadot ecosystem and requires a Polkadot-compatible wallet to:
- Connect your identity to the blockchain
- Mint your Human NFT (HNFT) identity
- Sign transactions for storing data on Arkiv
- Enable XX Network encryption (uses wallet signature for identity)
- Interact with Polkadot-based features

**Supported wallets:**
- **Polkadot.js Extension** (recommended): [Install from Chrome Web Store](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd)
- **Talisman Wallet**: [Install from talisman.xyz](https://www.talisman.xyz/)
- **SubWallet**: [Install from subwallet.app](https://subwallet.app/)

**Setup instructions:**
1. Install one of the wallet extensions above
2. Create a new account or import an existing one
3. Make sure your account is unlocked and ready to sign transactions
4. You can use any Polkadot network (Polkadot, Kusama, or Westend testnet)

### Step 2: Connect Wallet and Mint Your Identity

**What is Identity Minting?**
Identity minting creates a **soulbound Human NFT (HNFT)** that represents your unique identity on PsyChat. This NFT:
- Is non-transferable (soulbound to your wallet)
- Acts as your digital identity for therapy sessions
- Enables you to own and control your mental health data
- Is required before you can start chatting

**How to mint your identity:**
1. Open PsyChat in your browser (`http://localhost:3000` or the deployed URL)
2. Click the **"Connect Wallet"** button in the top right
3. Select your Polkadot wallet extension (Polkadot.js, Talisman, or SubWallet)
4. Choose an account from your wallet
5. Approve the connection request
6. Once connected, navigate to the **Chat** tab
7. You'll see an **"Mint Identity HNFT"** button - click it
8. Approve the transaction in your wallet (this may take a few moments)
9. Wait for confirmation - you'll see a success message when your identity is created
10. You can now start chatting!

**Note:** You only need to mint your identity once per wallet. After minting, your identity persists across sessions.

### Step 3: Start Chatting and Data Analysis

**How data analysis works:**
As you chat with the AI therapist, PsyChat automatically:
- **Encrypts messages** using XX Network's quantum-resistant encryption
- **Stores messages** on Arkiv blockchain (decentralized storage)
- **Analyzes sentiment** in real-time (positive, negative, or neutral)
- **Extracts topics** from your conversations (keyword analysis)
- **Tracks session duration** and message counts
- **Generates insights** based on conversation patterns

**To start a therapy session:**
1. After minting your identity, you'll see the chat interface
2. Type a message in the input field (e.g., "I've been feeling anxious lately")
3. Press Enter or click Send
4. Your message is:
   - Encrypted with XX Network
   - Sent to the AI (OpenAI or xAI Grok)
   - Stored on Arkiv blockchain
5. The AI responds with therapeutic guidance
6. Continue the conversation - all messages are automatically encrypted and stored
7. View session analytics in the chat interface (duration, topics, sentiment)

**Data ownership:**
- All your messages are encrypted and stored on-chain via Arkiv
- You own your data through your HNFT identity
- Messages are linked to your wallet address
- You can end a session to create a session summary NFT

### Step 4: Kusama Experience - Fractales NFT Gallery

**What is the Kusama experience?**
The Fractales feature lets you create, mint, and display generative art NFTs on Paseo's testnet. This showcases PsyChat's integration with Kusama's experimental art layer.

**Why you need MetaMask:**
The Fractales feature uses **EVM-compatible contracts** deployed on Polkadot Hub Testnet, which requires an Ethereum-compatible wallet like MetaMask (not Polkadot.js).

**Setup MetaMask for Kusama Testnet:**

1. **Install MetaMask** (if you don't have it):
   - [Install from metamask.io](https://metamask.io/download/)

2. **Add Polkadot Hub Testnet to MetaMask:**
   - Open MetaMask
   - Click the network dropdown (top of extension)
   - Click "Add Network" or "Add a network manually"
   - Enter the following details:
     ```
     Network Name: Polkadot Hub TestNet
     RPC URL: https://testnet-passet-hub-eth-rpc.polkadot.io
     Chain ID: 0x190f1b46 (or 421614550 in decimal)
     Currency Symbol: PAS
     Block Explorer: https://blockscout-passet-hub.parity-testnet.parity.io/
     ```
   - Click "Save"

3. **Switch to Polkadot Hub TestNet:**
   - Select "Polkadot Hub TestNet" from the network dropdown

4. **Get test tokens (PAS):**
   - You'll need PAS tokens to pay for gas fees when minting NFTs
   - The app will prompt you to connect MetaMask when you visit the Fractales gallery
   - If you need test tokens, check the Polkadot Hub Testnet faucet or contact the team

**Using Fractales:**
1. Navigate to the **Fractales** section (via the navigation dock or `/fractales` route)
2. Browse available fractal generators (brainmelt, cosmic, entropy, etc.)
3. Click on a fractal to open it
4. Interact with the fractal (adjust parameters, generate new patterns)
5. Click **"Capture Screen"** to save your fractal as an image
6. Click **"Mint NFT"** to create an NFT on Kusama testnet
7. Approve the transaction in MetaMask (make sure you're on Polkadot Hub TestNet)
8. Wait for confirmation - your NFT will appear in the Minted Gallery

**Important notes:**
- Fractales uses **MetaMask** (EVM wallet), not Polkadot.js
- You must be on **Polkadot Hub TestNet** (not mainnet)
- You need **PAS test tokens** for gas fees
- NFTs are minted as ERC721 tokens on the testnet

### Step 5: Complete User Flow Summary

**Full workflow for judges:**

1. **Setup (one-time):**
   - Install Polkadot.js Extension (or Talisman/SubWallet)
   - Install MetaMask (for Fractales)
   - Add Polkadot Hub TestNet to MetaMask
   - Get test tokens if needed

2. **Main PsyChat experience:**
   - Connect Polkadot wallet → Mint HNFT identity → Start chatting
   - Messages are encrypted (XX Network) and stored (Arkiv)
   - Data is analyzed automatically (sentiment, topics, insights)
   - End session to create session summary

3. **Kusama/Fractales experience:**
   - Switch to MetaMask
   - Ensure you're on Polkadot Hub TestNet
   - Navigate to Fractales gallery
   - Generate and mint art NFTs

**Quick test checklist:**
- ✅ Polkadot wallet connected
- ✅ HNFT identity minted
- ✅ Chat messages encrypted and stored
- ✅ Data analysis visible (sentiment, topics)
- ✅ MetaMask connected to Polkadot Hub TestNet
- ✅ Fractales NFT minted successfully

### Troubleshooting

**Wallet connection issues:**
- Make sure the wallet extension is unlocked
- Refresh the page and try connecting again
- Check that you've approved the connection request

**Identity minting fails:**
- Ensure your wallet has enough balance for transaction fees
- Check that you're connected to a supported network (Polkadot/Kusama/Westend)
- Try refreshing and reconnecting your wallet

**MetaMask not connecting:**
- Verify you're on Polkadot Hub TestNet (not mainnet)
- Check that the network is added correctly (Chain ID: 0x190f1b46)
- Make sure MetaMask is unlocked

**No test tokens:**
- Contact the team for testnet faucet information
- Check the Polkadot Hub Testnet block explorer for faucet links

## 🔧 Ecosystem Integrations

### XX Network (Privacy Integration)
- **Quantum-resistant encryption protocols**
- **Secure communication channels**
- **Privacy-preserving data transmission**

```typescript
import { XXNetworkIntegration } from './utils/polkadotIntegrations';

// Encrypt therapy data using XX Network
const encrypted = await XXNetworkIntegration.encryptMessage(therapyNote, userId);

// Decrypt data securely
const decrypted = await XXNetworkIntegration.decryptMessage(encrypted, userId);
```

### Arkiv (Storage Integration)
- **Decentralized storage for therapy records**
- **Immutable data storage**
- **Content addressing for data integrity**
- **Real-time subscriptions** for live message updates
- **Strategic TTL design** for cost-efficient ephemeral data

**Arkiv Track Submission:**
- 📄 [ARKIV_SUBMISSION.md](./ARKIV_SUBMISSION.md) - Complete submission documentation
- 📖 [ARKIV_RUNBOOK.md](./ARKIV_RUNBOOK.md) - Setup and troubleshooting guide
- 💡 [ARKIV_FRICTION_POINTS.md](./ARKIV_FRICTION_POINTS.md) - Developer experience feedback

```typescript
import { useArkiv } from '@/contexts/ArkivContext';
import { useArkivChat } from '@/lib/hooks/useArkivChat';

// Store therapy message on Arkiv
const arkivChat = useArkivChat(polkadotAddress);
const receipt = await arkivChat.storeMessage(sessionId, 'user', 'Hello!');

// Query messages with TTL expiration
const messages = await arkivChat.getMessagesForSession(sessionId);

// Subscribe to real-time updates
const unsubscribe = arkivChat.subscribeMessages(sessionId, (entity) => {
  console.log('New message:', entity);
});
```

### Hyperbridge (Cross-Chain Integration)
- **Cross-chain interoperability**
- **Multi-chain data trading**
- **Seamless asset transfers**

```typescript
import { HyperbridgeIntegration } from './utils/polkadotIntegrations';

// Bridge data across chains
const bridgeTx = await HyperbridgeIntegration.bridgeData(data, targetChain);

// Execute cross-chain transaction
const result = await HyperbridgeIntegration.executeCrossChain(tx);
```

### Kusama (Governance Integration)
- **Experimental governance features**
- **Community-driven platform evolution**
- **On-chain voting and proposals**

```typescript
import { KusamaIntegration } from './utils/polkadotIntegrations';

// Submit governance proposal
const proposalId = await KusamaIntegration.submitProposal(proposal);

// Vote on proposal
const voteTx = await KusamaIntegration.vote(proposalId, vote);
```

### xAI Grok (AI Integration)
- Grok-4 model via OpenAI SDK-compatible API
- Base URL: `https://api.x.ai/v1`

```bash
export XAI_API_KEY=your_key_here
```

## 📱 Mobile Experience

### Polkadot Mobile Wallets
- **Native mobile wallet integration**
- **Polkadot.js mobile support**
- **Talisman and SubWallet mobile apps**
- **Seamless cross-platform experience**

### Social Features
- **Viral sharing of data listings**
- **One-tap payments and interactions**
- **Social media integration**

## 🎯 MotusDAO Department Alignment

### Data Sovereignty & Privacy
- ✅ XX Network quantum-resistant encryption
- ✅ Soulbound HNFTs for data ownership
- ✅ Arkiv decentralized storage

### Therapeutic Marketplace
- ✅ Hyperbridge cross-chain trading
- ✅ Anonymized insights for research
- ✅ Transparent marketplace pricing

### Investment & Resilience
- ✅ Auto-compound DeFi yields (5-15% APY)
- ✅ Multiple yield farming options
- ✅ Sustainable UBI streams

### AI & Analytics
- ✅ Privacy-preserving trend analysis
- ✅ Anonymized data aggregation
- ✅ Research insights generation

### Community Outreach
- ✅ Mobile-first design
- ✅ Social sharing features
- ✅ Polkadot wallet integration

## 📊 Impact Metrics

### Market Opportunity
- **$500M TAM** in mental health data economy
- **1M+ users** scalable platform capacity
- **40% therapy cost reduction** through tokenized subsidies

### Technical Metrics
- **~500 LOC frontend** (Next.js components)
- **~200 LOC runtime** (Substrate pallets)
- **4 ecosystem integrations** (XX Network, Arkiv, Hyperbridge, Kusama)
- **Mobile-responsive** design
- **Cross-chain interoperability** via Hyperbridge
- **Quantum-resistant encryption** via XX Network

### User Benefits
- **Data ownership:** Users control their mental health data
- **Earnings potential:** Sustainable income from data insights
- **Privacy protection:** XX Network quantum-resistant encryption ensures data security
- **DeFi integration:** Auto-compound earnings into yields

## 🛠️ Development

### Code Structure
```
psychat/
├── pages/                 # Next.js pages
├── components/           # React components
├── runtime/              # Substrate runtime pallets
├── utils/                # Polkadot ecosystem integrations
├── docs/                 # Documentation
└── styles/               # Tailwind CSS
```

### Key Files
- `pages/index.tsx` - Main application interface
- `pages/api/chat.ts` - AI chat API endpoint
- `components/Chat.tsx` - Therapy notes with XX Network encryption
- `components/Marketplace.tsx` - Cross-chain data trading
- `components/Dashboard.tsx` - Earnings and yield farming
- `components/ClientWalletButton.tsx` - Polkadot wallet connection component
- `runtime/lib.rs` - Substrate runtime logic
- `utils/polkadotIntegrations.ts` - Polkadot ecosystem integrations
- `utils/identity/hnftOperations.ts` - HNFT minting operations
- `utils/nft/chatNFTMinting.ts` - NFT creation utilities

### Testing
```bash
# Run frontend tests
npm test

# Test Substrate runtime
cargo test

# Build runtime
cargo build --release

# Verify RPC endpoint
polkadot-js-api --ws wss://rpc.polkadot.io
```

## 🎬 Demo

### 3-Minute Demo Script
See `docs/demo_script.md` for the complete demo presentation including:
- **Hook (30s):** Problem and solution overview
- **Flow (90s):** Live demonstration of core features
- **Impact (60s):** Market opportunity and technical innovation

### Key Demo Points
1. **Chat Interface:** Type therapy note → XX Network encryption → HNFT minting
2. **Marketplace:** Browse listings → Place bid → Cross-chain trading
3. **Dashboard:** View earnings → Auto-compound → DeFi yields
4. **Mobile:** Polkadot wallet → Social sharing → Viral distribution

## 🏆 Hackathon Submission

### Judging Criteria Alignment
- **40% Novelty/Impact:** First mental health data ownership platform on Polkadot
- **30% Execution:** 4+ ecosystem integrations, working MVP
- **20% UX:** Mobile-first design, seamless wallet integration
- **10% Business Plan:** $30B TAM, sustainable UBI model

### Ecosystem Integration Bonus
- ✅ **XX Network:** Quantum-resistant privacy protocols
- ✅ **Arkiv:** Decentralized storage for immutable records
- ✅ **Hyperbridge:** Cross-chain interoperability
- ✅ **Kusama:** Experimental governance features
- ✅ **xAI Grok:** AI integration for therapy conversations

## 📄 License

MIT License - Open source per hackathon rules

## 🤝 Contributing

Built by the MotusDAO community for the Polkadot Sub Zero hackathon.

### Team
- **MotusDAO:** Mental health Web3 platform
- **Polkadot Sub Zero:** Polkadot hackathon
- **Ecosystem Partners:** XX Network, Arkiv, Hyperbridge, Kusama

## 🔗 Links

- **GitHub:** [github.com/motusdao/psychat](https://github.com/motusdao/psychat)
- **Demo:** [psychat.app](https://psychat.app)
- **MotusDAO:** [motusdao.org](https://motusdao.org)
- **Polkadot Sub Zero:** [polkadot.network](https://polkadot.network)

### Ecosystem Links
- **XX Network:** [xx.network](https://xx.network)
- **Arkiv:** [arkiv.io](https://arkiv.io)
- **Hyperbridge:** [hyperbridge.network](https://hyperbridge.network)
- **Kusama:** [kusama.network](https://kusama.network)

---

**Built with ❤️ for the cypherpunk future of mental health**

*PsyChat - Own your data, earn from insights, heal the world*
