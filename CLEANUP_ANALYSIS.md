# PsyChat Farcaster Mini App - Cleanup & Migration Analysis

## 🎯 Project Goals
- Deploy as Farcaster Mini App
- Migrate from Polkadot to **Celo Mainnet**
- Use **PSY ERC20 token** for creators economy
- Store likes for fractales NFTs
- Make the project leaner and focused

---

## ✅ What's NEEDED for Farcaster Mini App

### 1. Core Dependencies (Keep)
- ✅ `next` (14.0.0) - Framework
- ✅ `react` & `react-dom` - UI library
- ✅ `ethers` (6.13.2) - For Celo/EVM interactions
- ✅ `@openzeppelin/contracts` - Smart contract standards
- ✅ `framer-motion` - Animations
- ✅ `tailwindcss` - Styling
- ✅ `react-icons` - Icons

### 2. Farcaster Integration (Add)
- ⚠️ **MISSING**: `@farcaster/miniapp-sdk` - Required for Farcaster integration
- ⚠️ **MISSING**: Manifest file at `public/.well-known/farcaster.json`
- ⚠️ **MISSING**: SDK initialization in `_app.tsx` (call `sdk.actions.ready()`)

### 3. Core Features (Keep)
- ✅ Fractales gallery (`pages/fractales/`)
- ✅ NFT minting functionality
- ✅ UI components (HoloPanel, HoloButton, etc.)
- ✅ Fractal HTML files in `fractales/` directory

---

## ❌ What to REMOVE (Polkadot-Specific)

### 1. Dependencies to Remove
```json
{
  "@arkiv-network/sdk": "^0.4.4",           // ❌ Remove - Polkadot storage
  "@polkadot/extension-dapp": "^0.62.4",    // ❌ Remove - Polkadot wallets
  "polkadot-api": "^1.20.5",                // ❌ Remove - Polkadot API
  "xxdk-wasm": "^0.3.22"                     // ❌ Remove - XX Network (Polkadot)
}
```

### 2. Contexts to Update/Remove
- ❌ `contexts/PolkadotWalletContext.tsx` - Replace with Celo/EVM wallet
- ✅ `contexts/ArkivContext.tsx` - **KEEP & UPDATE** (works with Celo/EVM, use for likes storage!)
- ❌ `contexts/HyperbridgeContext.tsx` - Cross-chain not needed
- ✅ `contexts/FractalCaptureContext.tsx` - **KEEP** (used for fractales)
- ✅ `contexts/GridDistortionContext.tsx` - **KEEP** (UI effect)

### 3. Components to Remove/Update
- ❌ `components/ClientWalletButton.tsx` - Uses Polkadot wallet, needs Celo replacement
- ❌ `components/TokenAMM.tsx` - Check if Polkadot-specific
- ❌ All chat components (`components/chat/*`) - These use Arkiv/XX Network
  - `ChatTerminal.tsx`
  - `ChatHeader.tsx`
  - `ChatNFTList.tsx`
  - `HNFTIdentityCard.tsx`
  - `HNFTMintingFlow.tsx`
  - `XXChannelStatus.tsx`
  - etc.

### 4. Hooks/Libraries to Remove
- ❌ `lib/hooks/useArkivChat.ts` - Arkiv-specific
- ❌ `lib/encrypted-data-storage.ts` - If XX Network-specific
- ✅ `lib/fractales-nft.ts` - **KEEP** (needs update for Celo)
- ✅ `lib/hooks/use3DTilt.ts` - **KEEP** (UI utility)
- ✅ `lib/hooks/useScrollReveal.ts` - **KEEP** (UI utility)

### 5. Scripts to Update
- ❌ `scripts/setup-xxdk.js` - Remove (XX Network setup)
- ✅ `scripts/deploy.js` - **UPDATE** for Celo mainnet
- ✅ `scripts/mint-fractal.js` - **UPDATE** for Celo mainnet

### 6. Files/Directories to Remove
- ❌ `public/xxdk-wasm/` - XX Network WASM files
- ❌ `public/ndf*.json` - XX Network config files
- ❌ `psychat-polkadot/` directory (if exists)
- ❌ `contracts/FractalesNFT.sol` - **UPDATE** for Celo (or keep if EVM-compatible)

### 7. Pages to Remove/Update
- ❌ Main chat/therapy pages (if using Arkiv/XX Network)
- ✅ `pages/fractales/` - **KEEP** (core feature)
- ✅ `pages/index.tsx` - **UPDATE** (remove Polkadot references)

---

## 💾 Storage Solution for Likes - Using Arkiv (RECOMMENDED)

### ✅ **USE ARKIV** - Already Integrated & EVM-Compatible!

**Why Arkiv is Perfect:**
- ✅ **Already integrated** in your project
- ✅ **EVM-compatible** - Works with Celo mainnet
- ✅ **Decentralized storage** - On-chain data layer
- ✅ **Query capabilities** - Can aggregate like counts
- ✅ **TTL support** - Optional expiration for likes
- ✅ **Low cost** - Efficient gas usage
- ✅ **Structured data** - Store attributes (tokenId, userAddress, timestamp)

### Implementation with Arkiv

**Store a Like:**
```typescript
import { useArkiv } from '@/contexts/ArkivContext';

const { createEntity, queryEntities, eq } = useArkiv();

// Store a like
const storeLike = async (tokenId: string, userAddress: string) => {
  await createEntity({
    payload: new TextEncoder().encode(`like:${tokenId}:${userAddress}`),
    contentType: 'text/plain',
    attributes: [
      { key: 'type', value: 'fractalLike' },
      { key: 'tokenId', value: tokenId },
      { key: 'userAddress', value: userAddress },
      { key: 'timestamp', value: String(Date.now()) },
    ],
    expiresIn: undefined, // Permanent likes, or set TTL if needed
  });
};

// Check if user already liked
const hasLiked = async (tokenId: string, userAddress: string) => {
  const result = await queryEntities([
    { key: 'type', value: 'fractalLike' },
    { key: 'tokenId', value: tokenId },
    { key: 'userAddress', value: userAddress },
  ]);
  return result.entities.length > 0;
};

// Get like count for a token
const getLikeCount = async (tokenId: string) => {
  const result = await queryEntities([
    { key: 'type', value: 'fractalLike' },
    { key: 'tokenId', value: tokenId },
  ]);
  return result.entities.length;
};

// Get all likes for a user
const getUserLikes = async (userAddress: string) => {
  const result = await queryEntities([
    { key: 'type', value: 'fractalLike' },
    { key: 'userAddress', value: userAddress },
  ]);
  return result.entities.map(e => e.attributes.find(a => a.key === 'tokenId')?.value);
};
```

### Update ArkivContext for Celo

**Current:** Uses `mendoza` testnet chain
**Update:** Configure for Celo mainnet (or keep mendoza if it supports Celo)

```typescript
// In ArkivContext.tsx, update the connect function:
import { celo } from '@arkiv-network/sdk/chains'; // If available
// OR use custom chain config for Celo

const connect = async (config?: { accountAddress?: string; privateKey?: string }) => {
  // ... existing code ...
  
  // Update RPC endpoint for Celo mainnet
  const publicClient = createPublicClient({ 
    chain: celo, // or custom Celo chain config
    transport: http('https://forno.celo.org') // Celo mainnet RPC
  });
  
  const walletClient = createWalletClient({ 
    chain: celo,
    transport: http('https://forno.celo.org'),
    account 
  });
  
  // ... rest of code ...
};
```

### Benefits of Using Arkiv for Likes

1. **No Smart Contract Needed** - Store directly in Arkiv
2. **Queryable** - Easy to get counts, check if liked, etc.
3. **Decentralized** - On-chain storage with Web3 guarantees
4. **Cost-Effective** - Lower gas than custom smart contract
5. **Flexible** - Can add metadata (timestamp, PSY rewards, etc.)
6. **Already Set Up** - Just need to update for Celo network

### Integration with PSY Token

You can store PSY reward information in the same like entity:
```typescript
attributes: [
  { key: 'type', value: 'fractalLike' },
  { key: 'tokenId', value: tokenId },
  { key: 'userAddress', value: userAddress },
  { key: 'psyReward', value: '0.1' }, // Optional PSY reward amount
  { key: 'timestamp', value: String(Date.now()) },
]
```

### 🎯 **FINAL RECOMMENDATION: Use Arkiv**
- Leverage existing integration
- Works with Celo (EVM-compatible)
- No need for separate smart contract
- Simple query interface
- Can integrate PSY rewards easily

---

## 📋 Cleanup Checklist

### Phase 1: Remove Polkadot Dependencies
- [ ] Remove `@arkiv-network/sdk` from package.json
- [ ] Remove `@polkadot/extension-dapp` from package.json
- [ ] Remove `polkadot-api` from package.json
- [ ] Remove `xxdk-wasm` from package.json
- [ ] Remove `scripts/setup-xxdk.js`
- [ ] Remove `postinstall` script that runs setup-xxdk

### Phase 2: Update/Remove Polkadot Contexts
- [ ] Delete `contexts/PolkadotWalletContext.tsx`
- [ ] **UPDATE** `contexts/ArkivContext.tsx` - Configure for Celo mainnet (keep it!)
- [ ] Delete `contexts/HyperbridgeContext.tsx`
- [ ] Update `pages/_app.tsx` - Keep ArkivProvider, remove others

### Phase 3: Remove Chat Components
- [ ] Delete `components/chat/` directory
- [ ] Delete `components/ClientWalletButton.tsx` (or update for Celo)
- [ ] Remove chat-related imports from pages

### Phase 4: Remove XX Network Files
- [ ] Delete `public/xxdk-wasm/` directory
- [ ] Delete `public/ndf*.json` files
- [ ] Delete `lib/hooks/useArkivChat.ts`
- [ ] Delete `lib/encrypted-data-storage.ts` (if XX-specific)

### Phase 5: Update for Celo
- [ ] Update `hardhat.config.js` for Celo mainnet
- [ ] Update `contracts/FractalesNFT.sol` (if needed for Celo)
- [ ] Create Celo wallet context (replace Polkadot one)
- [ ] Update `lib/fractales-nft.ts` for Celo RPC
- [ ] Update environment variables for Celo

### Phase 6: Add Farcaster Integration
- [ ] Install `@farcaster/miniapp-sdk`
- [ ] Create `public/.well-known/farcaster.json`
- [ ] Add SDK initialization in `_app.tsx`
- [ ] Update wallet integration to use Farcaster SDK

### Phase 7: Implement Likes Storage with Arkiv
- [ ] Create `lib/hooks/useArkivLikes.ts` hook for likes
- [ ] Update `MintedGallery.tsx` to use Arkiv for likes (replace localStorage)
- [ ] Implement like/unlike functionality with Arkiv
- [ ] Add PSY token integration for rewards (store in Arkiv attributes)

---

## 🔧 Files That Need Updates

### 1. `package.json`
- Remove Polkadot dependencies
- Add `@farcaster/miniapp-sdk`
- Update scripts

### 2. `pages/_app.tsx`
- **KEEP** ArkivProvider (update for Celo)
- Remove HyperbridgeProvider
- Add Farcaster SDK initialization
- Add Celo wallet provider

### 3. `hardhat.config.js`
- Update network config for Celo mainnet
- Remove Polkadot Hub Testnet config

### 4. `components/fractales/MintedGallery.tsx`
- Replace localStorage likes with Arkiv storage
- Use `useArkivLikes` hook (to be created)
- Integrate PSY token rewards (store in Arkiv attributes)

### 5. `lib/fractales-nft.ts`
- Update RPC endpoint to Celo
- Update contract address handling

### 6. `contracts/FractalesNFT.sol`
- Verify EVM compatibility (should work on Celo)
- Consider adding likes functionality directly

---

## 🚀 Next Steps

1. **Review this analysis** and confirm approach
2. **Start Phase 1** - Remove dependencies
3. **Create Celo wallet context** to replace Polkadot
4. **Implement likes storage** (recommend hybrid approach)
5. **Add Farcaster SDK** integration
6. **Test on Celo testnet** before mainnet

---

## 📊 Estimated Size Reduction

**Before:**
- Dependencies: ~15 Polkadot-related packages
- Contexts: 3 Polkadot-specific contexts
- Components: ~10 chat/Polkadot components
- Total: ~500KB+ of unused code

**After:**
- Dependencies: Only Farcaster SDK + Celo
- Contexts: 1 Celo wallet context
- Components: Focused on fractales only
- Total: ~50% smaller bundle size

---

## ❓ Questions to Resolve

1. **Do you want to keep any chat/therapy features?** (Currently uses Arkiv/XX Network)
2. **PSY token contract address?** (Need to deploy or use existing?)
3. **Arkiv network config:** Does Arkiv support Celo mainnet directly, or need custom chain config?
4. **Fractales NFT contract:** Deploy new on Celo or migrate existing?
5. **Arkiv account:** Do you have an Arkiv account/private key for Celo mainnet?

