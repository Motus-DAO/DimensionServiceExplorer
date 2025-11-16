# MILESTONE 2 PLAN: PsyChat

**Team:** MotusDAO  

**Track:** [X] SHIP-A-TON   

**Date:** 16-11-2025

---

## 📍 Buenos Aires, Argentina

**What we built/validated this weekend:**

- **XX.Network E2E encryption chat** - Quantum-resistant post-quantum encrypted messaging system with channel-based architecture for therapy sessions
- **ARKIV for decentralized DB** - Immutable Polkadot blockchain storage for encrypted therapy records with triple redundancy (Arkiv + XX Network IndexedDB + localStorage)
- **Kusama Social/Art layer for minting generative art** - Fractales NFT gallery system for minting and displaying generative art NFTs on Kusama testnet

**What's working:**

- **Post-quantum encrypted chat** - XX Network channel-based encryption with wallet-based identity recovery
- **Arkiv storage** - Decentralized, immutable storage for therapy session data on Polkadot
- **Kusama (testnet) minting** - Generative art NFT minting on Kusama testnet with Fractales integration
- **AI therapy chat** - xAI Grok and OpenAI integration for AI-assisted therapy conversations
- **Video therapy sessions** - Jitsi Meet integration for human therapist video sessions
- **Polkadot wallet integration** - Seamless wallet connection via Polkadot.js Extension
- **HNFT identity system** - Soulbound Human NFT framework for user identity on Polkadot

**What still needs work:**

- **DID containers (Pallets)** - Substrate runtime pallets for Decentralized Identity (DID) management and soulbound HNFT minting
- **Mintable dataset NFTs** - ChatNFT minting workflow to tokenize therapy sessions as tradeable datasets
- **Datamarketplace integration** - Anonymized insights marketplace with Polkadot DEX integration for data trading
- **Token deployment on mainnet** - PSYC token deployment on Polkadot mainnet with governance integration
- **Payment processing** - Complete Polkadot-based payment system for therapist sessions (currently mocked)
- **Cross-chain interoperability** - Hyperbridge integration for multi-chain data trading

**Blockers or hurdles we hit:**

- **xx.node connections** - XX Network node connectivity issues affecting channel synchronization
- **Time constraints** - Limited development window during hackathon weekend
- **Substrate pallet development** - Complex runtime development for DID and marketplace pallets
- **Mainnet deployment** - Infrastructure and testing requirements for mainnet token deployment

---

## 🚀 WHAT WE'LL SHIP IN 30 DAYS

**Our MVP will do this:**

PsyChat is a privacy-first mental health platform that enables users to own their therapy data through quantum-resistant encryption (XX Network), immutable blockchain storage (Arkiv), and soulbound identity NFTs (HNFTs). Users can engage in AI-assisted therapy sessions, book human therapists via video, and monetize anonymized insights through a decentralized marketplace. The platform serves mental health patients seeking privacy, data ownership, and sustainable income from their therapy journey, while providing researchers and institutions access to anonymized mental health insights for scientific advancement.

### Features We'll Build (4 core features)

**Week 1-2: DID Pallets & ChatNFT Minting**

- **Feature:** Deploy Substrate DID pallet on Kusama testnet + complete ChatNFT minting workflow that tokenizes therapy sessions
- **Why it matters:** Without on-chain identity and NFT minting, users can't prove ownership of their therapy data. This is the foundation for the data marketplace.
- **Who builds it:** [Cesar Angulo] - [CTO] (40 hours)
- **Specific deliverables:**
  - DID pallet deployed on Kusama testnet with wallet-based identity binding
  - ChatNFT minting function that creates NFT from encrypted session data stored in Arkiv
  - Frontend UI component to trigger minting after therapy session ends
  - Metadata stored in Arkiv, NFT reference stored on-chain
- **Success criteria:** User can mint 1 ChatNFT per therapy session, NFT metadata retrievable from Arkiv

**Week 2-3: Data Marketplace MVP**

- **Feature:** Build marketplace UI where users list anonymized datasets for sale, researchers browse and bid, transactions execute on Polkadot
- **Why it matters:** This is the revenue model - users need a way to monetize their data. Without this, there's no economic incentive to use the platform.
- **Who builds it:** [Cesar Angulo] - [CTO] (30 hours) + [Jesus Camacho] - [Dev assistant] (15 hours)
- **Specific deliverables:**
  - Anonymization engine that aggregates therapy data (removes PII, creates statistical insights)
  - Marketplace page with dataset listings (title, description, price, bid count)
  - Bid submission UI that creates Polkadot transaction
  - Sale execution when bid accepted (transfers DOT/KSM to seller)
- **Success criteria:** 1 dataset can be listed, 1 bid can be placed, sale completes with on-chain transaction

**Week 3-4: Payment System for Therapist Sessions**

- **Feature:** Replace mocked payment flow with real Polkadot transactions for video therapy session bookings
- **Why it matters:** Currently payments are fake. Real payments enable actual therapist onboarding and real-world usage.
- **Who builds it:** [Cesar Angulo] - [CTO] (25 hours) + [Gerry Alvarez] - [Founder] (10 hours for payment UX)
- **Specific deliverables:**
  - Polkadot payment pallet integration (balance transfers)
  - Payment confirmation UI showing transaction hash
  - Receipt generation stored in Arkiv
  - Error handling for failed transactions
- **Success criteria:** User can book 1 video session and pay with real DOT/KSM, payment confirmed on-chain

**Week 4: XX Network Node Stability Fix**

- **Feature:** Fix XX Network node connection issues causing channel sync failures, implement retry logic and connection monitoring
- **Why it matters:** Current blocker prevents reliable encryption. Users can't trust the platform if messages fail to encrypt/sync.
- **Who builds it:** [Cesar Angulo] - [CTO] (20 hours) + [Jesus Camacho] - [Dev assistant] (10 hours for UI indicators)
- **Specific deliverables:**
  - Node connection retry logic (3 retries with exponential backoff)
  - Connection status indicator in UI (connected/disconnected/warning)
  - Channel sync monitoring and auto-recovery
  - Fallback node selection if primary node fails
- **Success criteria:** XX Network connection success rate >95%, users see connection status in UI

### Team Breakdown

**[Gerry Alvarez] - [Founder]** | [50 hrs/week]

- Owns: 
  - Product vision and roadmap alignment
  - Tokenomics design and PSYC token deployment strategy
  - GTM strategy and partnership development
  - UX/UI design direction and user experience optimization
  - Funding and investor relations

**[Cesar Angulo] - [CTO]** | [45 hrs/week]

- Owns: 
  - Substrate runtime development (DID pallet, ChatNFT minting, payment pallet integration)
  - XX Network node connectivity fixes and optimization
  - Marketplace backend logic (anonymization, bid processing)
  - Polkadot transaction integration (payments, NFT minting, marketplace sales)
  - Technical architecture decisions and code reviews

**[Jesus Camacho] - [Dev assistant]** | [20 hrs/week]

- Owns: 
  - Marketplace frontend UI (listing page, bid interface, dataset cards)
  - Payment UI components (transaction status, receipt display)
  - XX Network connection status indicators
  - Mobile-responsive CSS fixes
  - Testing new features and bug fixes
  - Developer documentation updates

### Mentoring & Expertise We Need

**Areas where we need support:**

- **GTM (Go-To-Market)** - Strategy for launching to mental health communities, therapist networks, and research institutions. We need help identifying early adopters and crafting messaging that resonates with privacy-conscious users.
- **Funding** - Seed funding ($50K-$100K) for mainnet deployment costs, security audits ($15K-$30K), and team expansion. Current blockers: can't deploy to mainnet without audit, can't scale team without funding.

**Specific expertise we're looking for:**

- **Substrate pallet development** - We're building DID and ChatNFT pallets but need expert code review on best practices, especially for identity management and NFT metadata handling. Estimated need: 2-3 hours of consultation.
- **Privacy-preserving anonymization** - We need guidance on how to properly anonymize therapy data (removing PII while preserving research value) and ensure compliance. Estimated need: 1-2 hours consultation with privacy engineer.
- **XX Network node operations** - Help troubleshooting node connection issues and understanding optimal node selection strategies. Estimated need: Technical support from XX Network team.

---

## 🎯 WHAT HAPPENS AFTER

**When M2 is done, we plan to...** 

- **Launch closed beta** - Invite 50-100 early adopters to test DID minting, marketplace, and payments on Kusama testnet
- **Security audit preparation** - Complete code documentation and prepare smart contracts for audit (DID pallet, ChatNFT pallet, payment integration)
- **PSYC token design finalization** - Complete tokenomics model and prepare for mainnet deployment (post-audit)
- **Therapist pilot program** - Recruit 5-10 licensed therapists for paid pilot testing of video session booking and payment flow
- **Research institution outreach** - Contact 3-5 universities/research labs to gauge interest in anonymized mental health datasets

**And 6 months out we see our project achieve:**

- **500+ active users** - Users actively engaging in therapy sessions and minting ChatNFTs
- **$50K+ marketplace volume** - Anonymized datasets generating real trading volume on marketplace
- **20+ therapist partnerships** - Network of licensed therapists providing video sessions
- **2+ research institution partnerships** - Academic partnerships for data access
- **Mainnet deployment** - PSYC token and core pallets deployed on Polkadot mainnet (post-audit)
- **Mobile web optimization** - Fully responsive mobile experience (native app is 12+ month goal)

---

## 📊 Success Metrics (30-Day Goals)

### Technical Milestones
- [ ] DID pallet deployed on Kusama testnet, can mint 1 HNFT per wallet
- [ ] ChatNFT minting: user completes therapy session → clicks "Mint NFT" → NFT appears in wallet
- [ ] Marketplace: user lists 1 anonymized dataset, researcher places 1 bid, sale executes on-chain
- [ ] Payment system: user books video session, pays with DOT/KSM, payment confirmed on-chain
- [ ] XX Network: connection success rate >95%, UI shows connection status

### Business Milestones (Post-M2 Beta)
- [ ] 20+ beta users test DID minting and marketplace
- [ ] 5+ therapy sessions completed with real payments
- [ ] 3+ anonymized datasets listed on marketplace
- [ ] 1+ marketplace sale completed (testnet)

### User Experience Milestones
- [ ] Message encryption/decryption <3 seconds
- [ ] XX Network connection status visible in chat UI
- [ ] Payment transaction status clearly displayed
- [ ] Marketplace UI works on mobile browsers

---

## 🔗 Ecosystem Integration Status

### Current Integrations ✅
- **XX Network** - E2E encryption (working, needs node stability)
- **Arkiv** - Decentralized storage (working)
- **Kusama** - NFT minting testnet (working)
- **Polkadot.js** - Wallet integration (working)

### Planned Integrations 🚧
- **Hyperbridge** - Cross-chain interoperability (Week 4)
- **Polkadot DEX** - Data marketplace trading (Post-M2)
- **Kusama Governance** - Community-driven evolution (Post-M2)

---

**Built with ❤️ for the cypherpunk future of mental health**

*PsyChat - Own your data, earn from insights, heal the world*
