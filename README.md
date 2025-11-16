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
- Polkadot.js API
- Polkadot wallet extension (Polkadot.js, Talisman, or SubWallet)
- OpenAI or xAI Grok API key

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
