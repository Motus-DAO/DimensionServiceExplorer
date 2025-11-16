# PsyChat – Arkiv/XX Chat Persistence Troubleshooting

## What You Observed
- After sending a message, a “new history” appears and older messages seem to disappear; a few minutes later, the real history returns
- Messages render as base64 blobs or unreadable bytes like `Ro3TKfkHEQ==` or long strings
- XX identity appears to change across reloads; you want your wallet to be the single source of identity and data persistence
- Arkiv shows `Connected` but `Txs: 0` intermittently while you expect on-chain writes to be visible immediately

## Why It Happens
- Indexer delay: Arkiv queries briefly return partial snapshots after a write; the full set returns only after indexing finalizes
- Overwrite vs merge: If the UI replaces in‑memory messages with the latest snapshot, fresh sends “disappear” until the full snapshot arrives
- Placeholder encryption: Messages stored as base64 without consistent decode/decrypt render as gibberish in the browser
- Identity fallback: If `xxIdentity` is not read from Arkiv, a new identity can be generated on every reload

## How The System Works
- Arkiv SDK v0.4.4 on Mendoza
  - Connect: `contexts/ArkivContext.tsx:72–101`
  - Write: `walletClient.createEntity` for `chatMessage` and `chatSession` (components/Chat.tsx:500–503, 582–585, 780–787)
  - Query: `publicClient.buildQuery().where([...]).fetch()` (contexts/ArkivContext.tsx:132–147)
  - Read payload: `publicClient.getEntity(entityKey)` (lib/hooks/useArkivChat.ts:53–70)
- XX identity persisted to Arkiv
  - Store/read: `lib/hooks/useArkivChat.ts:63–71, 75–94`
  - Init uses Arkiv identity first; derive from wallet signature if missing; then persist (contexts/XXNetworkContext.tsx:244–274)

## Immediate Fixes
- Merge history results, don’t overwrite
  - components/Chat.tsx:194–201 merges on‑chain messages into `messages` (dedupe by id); preserves optimistic sends
  - components/Chat.tsx:241–279 merges on Arkiv SDK ready
- Gate reloads
  - Only reload when `arkivSdkReady` and not during an active send, avoiding transient snapshots
- Decode base64 reliably in the browser
  - Use `atob` + UTF‑8 decode (components/Chat.tsx:151–169, 246–259) to show readable text immediately
- Persist XX identity on Arkiv
  - Read from Arkiv first; if missing, derive from wallet signature; write once and reuse

## Recommended Hardening
- Store plaintext until XX encryption pipeline is complete
  - Disable `encryptForArkiv` in send paths and store readable text directly for immediate display
- Subscribe to Arkiv entity events
  - Use `publicClient.subscribeEntityEvents` to append new writes in real time and eliminate indexer latency for display
- Add `ts` attributes to `chatMessage`
  - Include `ts=<ms>` on write; sort history by `ts` for stable ordering across devices
- Identity only via wallet signature
  - Remove random identity fallback in production; `xxIdentity` should always be derived once and persisted to Arkiv

## Verification Steps
- Identity stability
  - Copy XX ID and refresh; confirm `pubkeyBase64` remains the same for the same wallet (token rotates; that’s normal)
- Write → Read
  - Send; confirm `[Arkiv] createEntity` logs with `entityKey` and `txHash` (contexts/ArkivContext.tsx:114–118)
  - Reload; confirm messages show readable text; no flicker/deletion
- SDK/session readiness
  - Ensure `[Arkiv] SDK ready` before sending
  - If wallet session expired, you’ll be re‑prompted for a signature; approve to persist writes

## Known Symptoms & Causes
- “New history appears then real data returns”
  - Arkiv indexer returns partial snapshots right after a write; merge fixes flicker; subscription removes delay entirely
- “Base64 blobs like `Ro3TKfkHEQ==`”
  - Placeholder encryption stores base64; decode to UTF‑8 or store plaintext
- “Identity changes on reload”
  - Identity not read from Arkiv; fix by persisting `xxIdentity` on-chain and reusing it

## Code References
- Arkiv connect & write: `contexts/ArkivContext.tsx:72–101`, `components/Chat.tsx:500–503, 582–585`
- Arkiv query & payload fetch: `contexts/ArkivContext.tsx:132–147`, `lib/hooks/useArkivChat.ts:53–70`
- History merge: `components/Chat.tsx:194–201`, `components/Chat.tsx:241–279`
- XX identity persistence: `lib/hooks/useArkivChat.ts:63–71, 75–94`, `contexts/XXNetworkContext.tsx:244–274`

## Next Actions
- Switch Arkiv writes to plaintext for immediate readability
- Add Arkiv live subscription listener to eliminate indexing delay
- Enforce identity derivation from wallet signature only and persist once to Arkiv
- Keep wallet session alive or re‑prompt signature before any write

