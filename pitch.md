# PsyChat — Private Therapy Chat + Kusama Fractales

## One‑Liner
- Privacy‑first therapy chat with XX Network encryption and Arkiv storage, plus a Kusama art module where users mint generative fractal NFTs on Polkadot Hub Testnet.

## What’s Shipping Today
- Therapy chat users own and control session data.
- Arkiv stores chat messages immutably; XX Network provides E2E encryption.
- Deterministic sessions per wallet with merge/dedupe and real‑time updates.
- Kusama “Fractales” gallery: 13 fractal types, on‑chain ERC721 minting via MetaMask.

## Why It Matters
- Data sovereignty for mental health conversations.
- Quantum‑resistant privacy for live communication.
- Kusama track demonstrates creative, therapeutic art minted on-chain.
 - Private E2E session channel between AI and the therapy session identity prevents provider-level user segmentation and raises the value of mental health chat data.

## How It Works (Therapy Chat)
- Connect Polkadot wallet → session ID fixed per wallet (`components/Chat.tsx:100–107`).
- Arkiv:
  - Write attributes: `type`, `polkadotAddress`, `chatBaseKey`, `sessionId`, `role`, `ts` (`lib/hooks/useArkivChat.ts:14–26`).
  - Query by session and subscribe (`lib/hooks/useArkivChat.ts:54–61`, `lib/hooks/useArkivChat.ts:63–87`).
  - Cache per session for instant prefill (`components/Chat.tsx:156–166`, `components/Chat.tsx:224–229`).
- XX Network:
  - WASM init and DM client (`contexts/XXNetworkContext.tsx:89–341`).
  - Identity from Polkadot wallet signature; fallback temporary (`contexts/XXNetworkContext.tsx:242–277`).
  - IndexedDB worker, network follower, channel messaging.

## E2E Session Channels
- Private, session-scoped E2E channel between the AI assistant and the therapy session identity.
- Channel keys are derived client-side; the AI provider cannot segment data by user.
- Persistence control: only the user client writes to Arkiv; AI responses flow through the private channel and are merged client-side.
- Therapist channels: therapist↔user E2E channels with restricted retention; therapist cannot persist channel data.
- Outcome: higher privacy and non-segmentable session data that is more valuable for the user’s mental health chat.

## How It Works (Kusama Fractales)
- Fractales pages under `pages/fractales` render 13 fractal types.
- Users capture base64 image and mint ERC721 via MetaMask on Polkadot Hub Testnet.
- Contract: `contracts/FractalesNFT.sol` (ERC721 + on‑chain metadata).
- Gallery: `components/fractales/MintedGallery.tsx` lists minted NFTs and social actions.

## Demo Script
- Track A — Therapy Chat
  - Connect wallet → send message → Arkiv write → XX encrypted delivery → assistant reply → stable timeline.
- Track B — Kusama Fractales
  - Open `/fractales` → interact with fractal → “Mint NFT” → connect MetaMask → confirm tx → NFT appears in gallery.

## Architecture Snapshot
- Frontend: Next.js.
- Storage: Arkiv entities with TTL and attributes.
- Privacy: XX Network DM client and IndexedDB worker.
- Kusama: ERC721 contract on Polkadot Hub Testnet; MetaMask wallet.

## Differentiators
- Hybrid persistence (Arkiv + XX) for privacy and auditability.
- Deterministic sessions, timestamp ordering, and merge/dedupe for UX quality.
- Kusama art module connects therapy, creativity, and on‑chain minting.

## Setup Notes
- XX WASM assets required in `public/xxdk-wasm/`: `ndf.json`, `dist/bundle.js`, `dist/wasm_exec.js`, `dist/src/xxdk_db.worker.js`.
- Dev: `npm run dev` • Build: `npm run build`.
- MetaMask: add Polkadot Hub Testnet and connect for Fractales minting.

## Milestones
- Open therapist↔user E2E channels with user-controlled retention; therapist cannot persist channel data.
- Ship private AI session channel to prevent provider-level user segmentation.

## Roadmap (Kusama)
- On‑chain likes and tipping for creators.
- Marketplace integration with PsyChat’s data economy.
- Governance hooks for community‑curated collections.

## Links
- Arkiv TypeScript guide: https://arkiv.network/getting-started/typescript
- XX WASM: `xxdk-wasm` and `public/xxdk-wasm/README.md`
- Contract: `contracts/FractalesNFT.sol`

## Speaker Script (3–5 minutes)

### Opening (20s)
- PsyChat is private therapy chat where users own their data.
- We add Kusama’s Fractales art module to turn therapeutic creation into on‑chain NFTs.
- Everything runs with quantum‑resistant E2E privacy on XX Network and immutable session records on Arkiv.

### Problem (25s)
- AI providers segment data by user and centralize logs; mental health needs true confidentiality.
- People lack control over therapy histories, making trust and longitudinal care hard.

### Solution (40s)
- A private, session‑scoped E2E channel between the AI assistant and the therapy session identity.
- Client‑side keys mean providers cannot segment data by user.
- Only the user client decides what to persist on Arkiv; AI replies merge locally.
- Kusama Fractales: creative therapy where users mint generative art as ERC721 on Polkadot Hub Testnet.

### What’s Live (30s)
- Next.js app with Arkiv storage and XX encryption.
- Deterministic session per wallet; stable ordering; real‑time subscriptions and local cache.
- Fractales gallery: 13 fractal types; on‑chain minting via MetaMask.

### Demo Walkthrough (60s)
- Connect Polkadot wallet → session is created.
- Send a message → it’s stored on Arkiv and delivered over XX E2E.
- Assistant replies → merged locally; user controls persistence.
- Switch to Fractales → explore a fractal → click Mint → MetaMask confirms → NFT appears in gallery.

### Why This Wins (30s)
- Privacy: provider cannot build user profiles; data is non‑segmentable.
- Ownership: users control therapy records; therapists get E2E channels without storage rights.
- Utility: creative therapy mints real assets on Kusama.

### Roadmap & Milestones (30s)
- Ship therapist↔user E2E channels with user‑controlled retention; therapist cannot persist data.
- Launch private AI session channels broadly to block provider‑level segmentation.
- Add on‑chain likes/tips, marketplace integration, and governance hooks.

### Ask (20s)
- Support to scale Kusama integration and run privacy pilots with partner therapists.
- Resources: validator grants, community outreach, and UX testing.

### Quick FAQs (bullets)
- Can providers see my chats? No; keys are client‑side and channels are session‑scoped.
- Where is data stored? Arkiv per user; therapist cannot persist channel data.
- Why Kusama? Fast iteration for art/therapy modules; EVM testnet for minting.
- Is this production‑ready? MVP is live; privacy channels expand with the roadmap.
