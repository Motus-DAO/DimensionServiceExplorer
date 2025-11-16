# Arkiv Track Submission: PsyChat

## 🎯 Project Overview

**PsyChat** is a privacy-first mental health platform that uses **Arkiv** as its core decentralized data layer for storing encrypted therapy session data. The platform demonstrates deep integration with Arkiv's core features: **CRUD operations**, **TTL (Time-To-Live)**, **Queries**, and **Real-time Subscriptions**.

### Live Demo
🔗 **[https://polka-psychat.vercel.app/]** (Add your deployed URL here)

### Repository
🔗 **[https://github.com/Motus-DAO/PolkaPsychat]** (Add your repo URL here)

### Demo Video
🎥 **[https://youtu.be/qcMM_hOH344]** (Add your video link here)

---

## ✅ Deliverables Checklist

- [x] Public live demo link
- [x] Public repo with README: what it does, how to run it, how Arkiv is used
- [ ] 2-3 minute demo video (in progress)

---

## 🏗️ How Arkiv is Used

### 1. **CRUD Operations** ✅

PsyChat uses Arkiv for all therapy data storage:

#### CREATE
- **Messages**: Each therapy message is stored as an entity using `createEntity()`
- **Sessions**: Chat sessions are created using `mutateEntities()` for batch operations
- **Identities**: XX Network encryption identities are stored for user recovery

**Code Location:** `lib/hooks/useArkivChat.ts:14-26`

```typescript
const storeMessage = async (sessionId: string, role: Role, text: string) => {
  const attributes = [
    { key: 'type', value: 'chatMessage' },
    { key: 'polkadotAddress', value: polkadotAddress },
    { key: 'chatBaseKey', value: baseKey },
    { key: 'sessionId', value: sessionId },
    { key: 'role', value: role },
    { key: 'ts', value: String(Date.now()) },
  ];
  return createEntity({ 
    payload: stringToPayload(text), 
    contentType: 'text/plain', 
    attributes, 
    expiresIn: 600 
  });
};
```

#### READ
- **Query Messages**: Retrieve messages for a specific session using attribute filters
- **Query Sessions**: List all therapy sessions for a user
- **Query Identities**: Retrieve stored XX Network encryption identities

**Code Location:** `lib/hooks/useArkivChat.ts:54-61`

```typescript
const getMessagesForSession = async (sessionId: string) => {
  return queryEntities([
    { key: 'type', value: 'chatMessage' },
    { key: 'polkadotAddress', value: polkadotAddress },
    { key: 'sessionId', value: sessionId },
  ]);
};
```

#### UPDATE/DELETE
- **Immutable Design**: Therapy data is immutable (no updates/deletes)
- **TTL-Based Expiration**: Data automatically expires based on TTL settings
- **Privacy-First**: Messages expire after 10 minutes, ensuring ephemeral therapy data

### 2. **TTL (Time-To-Live)** ✅

Strategic TTL design for cost-efficient storage:

| Data Type | TTL | Rationale |
|-----------|-----|-----------|
| **Messages** | 600s (10 min) | Ephemeral therapy data - auto-expires for privacy |
| **Sessions** | 200s (~3.3 min) | Temporary session metadata |
| **Chat Base** | 24 hours | User's chat namespace |
| **XX Identity** | 365 days | Long-term identity storage for recovery |

**Code Location:** `lib/hooks/useArkivChat.ts:25, 43, 98`

**Why This Matters:**
- ✅ **Cost Optimization**: Short TTL for temporary data reduces storage costs
- ✅ **Privacy**: Messages auto-expire after 10 minutes (ephemeral therapy data)
- ✅ **Smart Design**: Different expiration for different data types

### 3. **Queries** ✅

Attribute-based querying with hierarchical structure:

**Query Patterns:**
- Filter by `type` (chatMessage, chatSession, xxIdentity)
- Filter by `polkadotAddress` (user-specific queries)
- Filter by `sessionId` (session-specific messages)
- Filter by `chatBaseKey` (hierarchical grouping)

**Code Location:** `contexts/ArkivContext.tsx:132-147`

```typescript
const queryEntities = async (where: ArkivAttribute[]) => {
  const qb = publicClient.buildQuery();
  const predicates = where.map((c) => eq(c.key, c.value));
  const result = await qb.where(predicates).fetch();
  return result as { entities: any[] };
};
```

**Rich Attribute System:**
- 6+ attributes per entity for flexible querying
- Hierarchical structure via `chatBaseKey`
- Timestamp tracking via `ts` attribute for chronological ordering

### 4. **Real-Time Subscriptions** ✅

Real-time message subscriptions for live therapy sessions:

**Implementation:** `lib/hooks/useArkivChat.ts:63-87`

```typescript
const subscribeMessages = (sessionId: string, onMessage: (entity: any) => void) => {
  const predicates = [
    eq('type', 'chatMessage'), 
    eq('polkadotAddress', polkadotAddress), 
    eq('sessionId', sessionId)
  ];
  
  // Real-time subscription via Arkiv SDK
  if (publicClient && typeof publicClient.subscribe === 'function') {
    const sub = publicClient.subscribe({ where: predicates }, (e: any) => {
      if (e && e.entity) onMessage(e.entity);
    });
    return () => sub?.unsubscribe?.();
  }
  
  // Fallback to polling (only if subscriptions unavailable)
  // ... polling implementation ...
};
```

**Usage:** `components/Chat.tsx:340`

```typescript
useEffect(() => {
  if (!arkivSdkReady || !walletAddress || !activeSessionId) return;
  
  const unsub = arkivChat.subscribeMessages(activeSessionId, async (entity) => {
    // Real-time message received from Arkiv
    // Decrypt and display immediately
  });
  
  return () => unsub();
}, [arkivSdkReady, walletAddress, activeSessionId]);
```

**Features:**
- ✅ Real-time message delivery via Arkiv subscriptions
- ✅ Automatic UI updates when new messages arrive
- ✅ Graceful fallback to polling if subscriptions unavailable
- ✅ Proper cleanup on component unmount

---

## 🚀 How to Run

### Prerequisites
- Node.js 18+
- Polkadot wallet (Polkadot.js, Talisman, or SubWallet)
- Arkiv account (or use testnet)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/psychat.git
cd psychat
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `.env.local`:
```bash
# Arkiv Configuration
NEXT_PUBLIC_ARKIV_ACCOUNT_ADDRESS=0x...  # Your Arkiv account address
NEXT_PUBLIC_ARKIV_PRIVATE_KEY=0x...      # Your private key (optional, for testing)

# AI Provider (for therapy chat)
OPENAI_API_KEY=sk-...  # or XAI_API_KEY=xai-...
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

### Connecting to Arkiv

1. **Connect Polkadot Wallet**
   - Click "Connect Wallet" in the app
   - Select your Polkadot wallet (Polkadot.js, Talisman, etc.)

2. **Arkiv Auto-Connection**
   - Arkiv SDK automatically connects using your Polkadot address
   - RPC endpoint: `https://mendoza.hoodi.arkiv.network/rpc`
   - Network: Mendoza testnet

3. **Start Chatting**
   - Create a new therapy session
   - Messages are automatically stored in Arkiv
   - Real-time subscriptions deliver new messages instantly

---

## 📊 Arkiv Feature Usage Summary

| Feature | Status | Implementation | Use Case |
|---------|--------|----------------|----------|
| **CRUD** | ✅ | `createEntity()`, `mutateEntities()`, `queryEntities()` | Store/retrieve therapy messages and sessions |
| **TTL** | ✅ | Strategic expiration (600s, 200s, 24h, 365d) | Cost-efficient ephemeral data storage |
| **Queries** | ✅ | Attribute-based filtering with `buildQuery()` | Filter messages by session, user, type |
| **Subscriptions** | ✅ | Real-time `subscribe()` for live updates | Instant message delivery in therapy sessions |

---

## 🎯 Track Alignment

### Main Prize Requirements

| Requirement | Status | Evidence |
|-------------|--------|----------|
| **Arkiv is central** | ✅ | Core storage layer for all therapy data |
| **Two or more features** | ✅ | CRUD + TTL + Queries + Subscriptions (4 features) |
| **Pushes Arkiv capabilities** | ✅ | Real-time subscriptions, strategic TTL design, rich attributes |
| **Documentation** | ✅ | This document + runbook + friction points |
| **Working demo** | ✅ | Live demo available |

### Micro Bounty Opportunities

1. **$750: Best real-time usage** ✅
   - Real-time subscriptions for therapy messages
   - Instant UI updates via Arkiv subscriptions
   - Graceful fallback handling

2. **$750: Efficiency of TTL** ✅
   - Strategic TTL design (600s messages, 200s sessions, 24h base, 365d identity)
   - Cost-optimized expiration for different data types
   - Privacy-focused ephemeral data

3. **$750: Best Out of the box submission** ✅
   - Unique use case: Mental health + privacy + blockchain
   - Therapy data storage with quantum-resistant encryption
   - Innovative combination of Arkiv + XX Network + Polkadot

---

## 📁 Project Structure

```
psychat/
├── contexts/
│   └── ArkivContext.tsx          # Arkiv SDK integration
├── lib/
│   └── hooks/
│       └── useArkivChat.ts      # Arkiv chat operations (CRUD, TTL, Queries, Subscriptions)
├── components/
│   └── Chat.tsx                  # Main chat interface using Arkiv
└── ARKIV_RUNBOOK.md             # Setup and troubleshooting guide
└── ARKIV_FRICTION_POINTS.md    # Developer experience feedback
```

---

## 🔗 Resources

- **Arkiv Documentation**: http://sl.sub0.gg/lBr7n
- **TypeScript Getting Started**: http://sl.sub0.gg/7iv4i
- **Arkiv SDK**: `@arkiv-network/sdk`
- **RPC Endpoint**: `https://mendoza.hoodi.arkiv.network/rpc`

---

## 📝 Additional Documentation

- **[ARKIV_RUNBOOK.md](./ARKIV_RUNBOOK.md)** - Setup instructions and troubleshooting
- **[ARKIV_FRICTION_POINTS.md](./ARKIV_FRICTION_POINTS.md)** - Developer experience feedback and suggestions

---

**Built for Arkiv Track - Sub Zero Hackathon**

*PsyChat - Privacy-first mental health platform powered by Arkiv*

