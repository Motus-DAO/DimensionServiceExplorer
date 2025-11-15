# XX Network Channel-Based Messaging Architecture

## Overview

PsyChat now uses **XX Network as a decentralized database** for therapy chat sessions, leveraging E2E encrypted messaging with a **channel-based architecture**. Each user has one main peer identity, and each therapy session maps to a unique channel.

## Architecture

### Main Components

1. **Main Peer Identity** (`MyDMID`)
   - One DM identity per user stored in `localStorage`
   - Generated via `GenerateChannelIdentity()`
   - Used for all XX Network communications
   - Stored as base64-encoded Uint8Array

2. **Therapy Channels**
   - Each therapy session creates a unique channel
   - Channel ID format: `therapy_${sessionId}`
   - Maps `sessionId → channelId` for session tracking
   - Metadata stored in `localStorage` as `xx_channels_${walletAddress}`

3. **Message Storage**
   - Messages stored locally in `localStorage` as `xx_messages_${walletAddress}`
   - Also sent via XX Network DM (E2E encrypted)
   - Messages tagged with metadata: `[CHANNEL:{channelId, role, timestamp}]text`
   - IndexedDB backing via `NewDMClientWithIndexedDb()`

### Data Flow

```
User sends message
  ↓
1. Store in UI state (React)
  ↓
2. Store in Arkiv (blockchain)
  ↓
3. Send via XX Network channel (E2E encrypted)
  ↓
4. Store in localStorage (local cache)
  ↓
5. Sync to XX Network IndexedDB (persistent)
```

## API

### XXNetworkContext

#### Types

```typescript
interface XXMessage {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  timestamp: number;
  channelId: string;
}

interface XXChannel {
  channelId: string;
  sessionId: string;
  createdAt: number;
  messageCount: number;
}
```

#### Functions

**`createTherapyChannel(sessionId: string): Promise<string>`**
- Creates or retrieves a therapy channel for a session
- Returns channelId
- Idempotent (safe to call multiple times for same session)

**`sendChannelMessage(channelId: string, role: 'user' | 'assistant', text: string): Promise<boolean>`**
- Sends a message to a specific channel
- Messages are E2E encrypted via XX Network
- Returns true on success

**`getChannelMessages(channelId: string): Promise<XXMessage[]>`**
- Retrieves all messages for a channel
- Returns messages from localStorage cache
- Messages are decrypted automatically

**`getTherapyChannel(sessionId: string): string | null`**
- Looks up channel ID for a given session
- Returns null if no channel exists

**`channelReady: boolean`**
- Indicates if channel system is initialized
- `true` when localStorage loaded and XX Network ready

## Usage in Chat.tsx

### Initialization

```typescript
// Load or create channel when session starts
useEffect(() => {
  if (xxReady && channelReady && createTherapyChannel && activeSessionId) {
    const channelId = await createTherapyChannel(activeSessionId);
    setXXChannelId(channelId);
    
    // Load message history
    const messages = await getChannelMessages(channelId);
    // ... display messages
  }
}, [activeSessionId, xxReady, channelReady]);
```

### Sending Messages

```typescript
// User message
const success = await sendChannelMessage(xxChannelId, 'user', userText);

// AI response
const success = await sendChannelMessage(xxChannelId, 'assistant', aiText);
```

### Status Indicator

```typescript
<XXChannelStatus
  ready={xxReady && channelReady}
  channelId={xxChannelId}
  syncStatus={xxSyncStatus}  // 'idle' | 'syncing' | 'synced' | 'error'
  messageCount={messages.length}
/>
```

## Storage Locations

### localStorage Keys

- `MyDMID` - User's main DM identity (base64)
- `cMixInitialized` - XX Network initialization flag
- `xx_channels_${walletAddress}` - Channel metadata map
- `xx_messages_${walletAddress}` - Message cache map
- `psychat_active_session` - Current active session ID

### IndexedDB

- Database: `xx` (via XX Network SDK)
- Managed by `NewDMClientWithIndexedDb()`
- Contains encrypted messages from XX Network
- Worker path: `/xxdk-wasm/xxdk_db.worker.js`

## Security Model

### Encryption

- **E2E Encryption**: All messages encrypted via XX Network
- **Local Encryption**: XX Network uses DatabaseCipher with password
- **Metadata**: Channel routing metadata prepended to messages
- **Privacy**: Messages only readable by user's peer identity

### Data Ownership

- User owns their DM identity private key
- Messages stored locally (user-controlled)
- XX Network provides decentralized backup
- Arkiv provides blockchain immutability

## Single Chat Optimization

Since PsyChat users manage only **1 therapy chat** per session:

1. **One active channel** at a time
2. **Simplified UI** - no channel switching needed
3. **Session-bound channels** - channel lifecycle tied to session
4. **Automatic channel creation** - no manual channel management

## Future Enhancements

### Multi-Channel Support
- Support multiple concurrent therapy sessions
- Channel list UI
- Channel switching

### XX Network Native Storage
- Remove localStorage dependency
- Query messages directly from XX Network IndexedDB
- Real-time sync across devices

### Advanced Features
- Message reactions
- Typing indicators
- Read receipts
- Message threading

## Troubleshooting

### Channel not created
- Check `xxReady` and `channelReady` are both `true`
- Verify `createTherapyChannel()` is called with valid sessionId
- Check browser console for `[XX] Channel created` log

### Messages not syncing
- Verify XX Network connection (check status indicator)
- Check `syncStatus` - should be 'synced' not 'error'
- Verify `xxChannelId` is set
- Check localStorage keys exist

### Messages lost after refresh
- Check localStorage hasn't been cleared
- Verify `walletAddress` is consistent
- Check `xx_messages_${walletAddress}` key exists

### Performance issues
- localStorage can store ~10MB per domain
- Consider pagination for large message counts
- IndexedDB has higher limits (50MB+)

## References

- XX Network SDK: https://xxnetwork.wiki/
- XXDK WASM: `xxdk-wasm` npm package
- DM Client API: `NewDMClientWithIndexedDb()`
- NDF (Network Definition File): `/xxdk-wasm/ndf.json`
