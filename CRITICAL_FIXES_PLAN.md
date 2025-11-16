# CRITICAL FIXES PLAN

## Current Broken State
1. **Messages don't persist after localStorage clear** - should load from Arkiv blockchain
2. **XX Network identity regenerates every time** - should be stored in Arkiv and retrieved
3. **Old messages don't decrypt** - need to handle plaintext vs encrypted
4. **Arkiv SDK might not be connected when loading messages**

---

## Root Causes

### Issue 1: Messages Not Persisting
**Problem**: When localStorage is cleared, messages disappear even though they're in Arkiv blockchain
**Root Cause**: 
- ArkivContext fallback: If `sdkPublicClient` is null, it reads from localStorage instead of blockchain
- The SDK clients (`sdkWalletClient`, `sdkPublicClient`) might not be initialized when Chat component loads messages

**Files**:
- `contexts/ArkivContext.tsx` lines 152-167 (queryEntities fallback)
- `components/Chat.tsx` lines 137-235 (loadHistory effect)

### Issue 2: XX Network Identity Not Persisting
**Problem**: XX Network pubkey changes every page reload, can't decrypt old messages
**Root Cause**:
- XX DM identity stored in localStorage `xx_dm_identity_{address}` (XXNetworkContext.tsx line 281)
- Should be stored in Arkiv blockchain so it survives localStorage clear
- Should be derived deterministically from wallet signature OR stored/retrieved from Arkiv

**Files**:
- `contexts/XXNetworkContext.tsx` lines 200-207, 280-285 (DM identity generation/storage)

### Issue 3: Encryption/Decryption Logic
**Problem**: Old plaintext messages appear broken, encrypted messages might not decrypt
**Root Cause**:
- Messages stored before encryption are plaintext
- Decryption logic tries to decrypt everything
- XX Network identity changing means encryption key changes

**Files**:
- `contexts/XXNetworkContext.tsx` lines 427-474 (encrypt/decrypt functions)
- `components/Chat.tsx` lines 162-182 (decryption on load)

---

## Fix Plan (In Order)

### FIX 1: Store XX Network Identity in Arkiv ⚡ CRITICAL
**Goal**: XX Network DM identity must persist in Arkiv, tied to wallet address

**Steps**:
1. Create `storeXXIdentity()` in `useArkivChat.ts`
   - Store XX DM identity base64 in Arkiv with attribute `type: 'xxIdentity'`
   - Tied to `polkadotAddress`

2. Create `getXXIdentity()` in `useArkivChat.ts`
   - Query Arkiv for identity by wallet address
   - Return null if not found

3. Modify `XXNetworkContext.tsx` DM identity logic:
   - First try to load from Arkiv (via new function)
   - If not found, generate new identity
   - Store new identity in Arkiv
   - Keep localStorage as cache only

**Expected Result**: Same wallet = same XX identity = can decrypt all messages

---

### FIX 2: Ensure Arkiv SDK is Connected Before Reading
**Goal**: Never fall back to localStorage for reading messages

**Steps**:
1. Add `sdkReady` state to ArkivContext
   - Set to true when both `sdkPublicClient` and `sdkWalletClient` are created
   - Export in context

2. Modify `Chat.tsx` loadHistory effect:
   - Wait for `isArkivConnected` AND `sdkReady` before loading
   - Add dependency on `sdkReady`

3. Add loading indicator in Chat UI while Arkiv connects

**Expected Result**: Messages always load from blockchain, never from localStorage fallback

---

### FIX 3: Smart Encryption Detection
**Goal**: Handle both plaintext (old) and encrypted (new) messages

**Steps**:
1. Modify decryption logic in `Chat.tsx`:
   - Try to decrypt
   - If decryption produces garbage/fails, assume plaintext
   - If decryption succeeds, use decrypted text
   - If XX not ready, display as-is

2. Add encryption marker to new messages:
   - Prefix encrypted messages with `ENC:` in Arkiv
   - Check for prefix before attempting decryption

**Expected Result**: Old plaintext messages display fine, new encrypted messages decrypt properly

---

### FIX 4: Remove localStorage Dependencies
**Goal**: localStorage only for temporary caching, never for source of truth

**What Stays in localStorage**:
- XX Network state path (per wallet)
- cMix initialization flag
- Active session ID (UI state)
- HNFT mock data (temporary)

**What Moves to Arkiv**:
- ✅ Messages (already there)
- ✅ Sessions (already there)
- ⚡ XX Network DM identity (TO BE ADDED)

**What Gets Removed**:
- ❌ Don't use localStorage as fallback for messages
- ❌ Don't use localStorage as fallback for XX identity

---

## Implementation Order

1. **FIRST**: Fix XX Identity storage in Arkiv (FIX 1)
2. **SECOND**: Ensure Arkiv SDK ready before loading (FIX 2)
3. **THIRD**: Smart encryption detection (FIX 3)
4. **FOURTH**: Clean up localStorage fallbacks (FIX 4)

---

## Testing Checklist

After all fixes:
- [ ] Send message with wallet A
- [ ] Clear localStorage completely
- [ ] Reload page
- [ ] Connect wallet A again
- [ ] Messages should appear (decrypted if encrypted, plaintext if old)
- [ ] XX Network pubkey should be same as before localStorage clear
- [ ] Send another message - should encrypt with same key
- [ ] Switch to wallet B - should generate NEW XX identity
- [ ] Switch back to wallet A - should load same XX identity from Arkiv

---

## Files to Modify

1. `lib/hooks/useArkivChat.ts` - Add XX identity storage functions
2. `contexts/XXNetworkContext.tsx` - Use Arkiv for identity persistence
3. `contexts/ArkivContext.tsx` - Add sdkReady state, prevent localStorage fallback
4. `components/Chat.tsx` - Wait for Arkiv ready, smart decryption
