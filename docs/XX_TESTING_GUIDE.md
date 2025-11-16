# XX Network Channel Testing Guide

## What Changed

Fixed the issue where XX Network internal metadata (JSON notifications) was appearing in the chat UI. The system now:

1. **Filters incoming messages** - Only displays messages with `[CHANNEL:...]` prefix (your actual chat messages)
2. **Ignores metadata** - Filters out XX Network notifications, updates, and internal events
3. **Prevents duplicates** - Checks if message already exists before adding to UI
4. **Stores in localStorage** - Messages cached locally for persistence

## Testing Steps

### 1. Initial Setup
```bash
npm run dev
```

### 2. Connect Wallet
- Click "Connect Wallet" 
- Select Polkadot wallet
- Approve connection

### 3. Create Identity
- Click "Create PsyChat Identity"
- Wait for HNFT to be created
- Should see identity card in sidebar

### 4. Start Chat Session
- Type a message in the chat input
- Press Enter or click Send
- Watch for XX Network status indicator

### 5. Verify Channel Creation
Open browser console and look for:
```
[XX] Channel created { channelId: "therapy_...", sessionId: "..." }
[XX] Channels loaded { count: 1 }
```

### 6. Verify Message Sending
After sending a message, check console for:
```
[XX] Sending channel message { channelId: "therapy_...", role: "user", ... }
[XX] Channel message sent
```

### 7. Check XX Network Status
Look for the status indicator at the top of the chat:
```
⟳ XX Network • Syncing... • N msgs • therapy_...
✓ XX Network • Synced • N msgs • therapy_...
```

### 8. Verify Persistence
1. Send 2-3 messages
2. Refresh the page
3. Messages should reload from localStorage
4. Check console for: `[XX] Retrieved messages { channelId: "...", count: N }`

### 9. Check localStorage
Open DevTools > Application > Local Storage:
- `MyDMID` - Your peer identity
- `xx_channels_{walletAddress}` - Channel metadata
- `xx_messages_{walletAddress}` - Message cache
- `psychat_active_session` - Current session ID

### 10. Test AI Response
- Send a question to AI
- AI response should also be stored in XX Network
- Check console for both user and assistant messages being sent

## Expected Behavior

### ✅ Good Signs
- Status shows "Synced" after messages
- Console logs `[XX] Channel message sent`
- Messages persist after refresh
- No JSON metadata in chat UI
- Channel ID visible in status bar

### ❌ Problem Signs
- Status stuck on "Syncing..."
- Console errors like `[XX] Failed to send channel message`
- JSON objects appearing in chat (like before)
- Messages lost after refresh
- Status shows "Sync error"

## Debugging

### Check XX Network Connection
```javascript
// In browser console
localStorage.getItem('MyDMID')  // Should return base64 string
localStorage.getItem('cMixInitialized')  // Should be 'true'
```

### Check Channel State
```javascript
// In browser console
const walletAddr = 'YOUR_WALLET_ADDRESS'
JSON.parse(localStorage.getItem(`xx_channels_${walletAddr}`))
JSON.parse(localStorage.getItem(`xx_messages_${walletAddr}`))
```

### View Raw Received Messages
Check console for:
```
[XX] EventUpdate { msg: "[CHANNEL:{...}]actual message text" }
```

Should NOT see:
```
[XX] EventUpdate { msg: '{"uuid":1,"pubKey":"..."}' }
```

### Clear State (if needed)
```javascript
// Reset XX Network state
localStorage.removeItem('MyDMID')
localStorage.removeItem('cMixInitialized')
localStorage.removeItem('xx_channels_YOUR_WALLET')
localStorage.removeItem('xx_messages_YOUR_WALLET')
// Then refresh page
```

## Architecture Overview

```
User Message
    ↓
1. Display in UI (React state)
    ↓
2. Store in Arkiv (blockchain)
    ↓
3. Format: [CHANNEL:{metadata}]text
    ↓
4. Send via XX Network DM
    ↓
5. Store in localStorage
    ↓
6. Sync to IndexedDB
```

## Message Format

**Sent:**
```
[CHANNEL:{"channelId":"therapy_123","role":"user","timestamp":1234567890}]Hello!
```

**Stored in localStorage:**
```json
{
  "id": "xx_1234567890_abc123",
  "text": "Hello!",
  "role": "user",
  "timestamp": 1234567890,
  "channelId": "therapy_123"
}
```

**Displayed in UI:**
```
Hello!
```

## Performance Expectations

- **Message send**: ~100-200ms
- **XX Network latency**: ~100-150ms (per gateway poll logs)
- **localStorage read**: <10ms
- **Channel creation**: <50ms

## Known Issues

### Issue: JSON metadata in chat
**Status:** ✅ FIXED
**Solution:** Added filter in `useEffect` to ignore non-channel messages

### Issue: Messages not persisting
**Possible Cause:** localStorage full or blocked
**Solution:** Check browser storage quota, clear old data

### Issue: Sync status stuck
**Possible Cause:** XX Network not ready
**Solution:** Check `xxReady` and `channelReady` both true

## Next Steps

1. **Test multi-device sync** - Open in two browsers (future enhancement)
2. **Test large message history** - Send 100+ messages (performance test)
3. **Test session switching** - End session, start new one
4. **Test offline mode** - Disable network, check localStorage works

## Support

If you encounter issues:
1. Check browser console for `[XX]` prefixed logs
2. Verify XX Network status indicator
3. Check localStorage keys exist
4. Review `XX_CHANNEL_ARCHITECTURE.md` for detailed architecture
5. Clear XX Network state and retry
