# Arkiv Integration Runbook

## Quick Start

### 1. Install Arkiv SDK

```bash
npm install @arkiv-network/sdk
```

### 2. Initialize Arkiv Client

```typescript
import { createPublicClient, createWalletClient, http } from '@arkiv-network/sdk';
import { mendoza } from '@arkiv-network/sdk/chains';
import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';

// Public client (for queries and subscriptions)
const publicClient = createPublicClient({
  chain: mendoza,
  transport: http('https://mendoza.hoodi.arkiv.network/rpc')
});

// Wallet client (for creating entities)
const account = privateKeyToAccount('0x...' as `0x${string}`);
const walletClient = createWalletClient({
  chain: mendoza,
  transport: http('https://mendoza.hoodi.arkiv.network/rpc'),
  account
});
```

### 3. Create an Entity

```typescript
import { stringToPayload } from '@arkiv-network/sdk/utils';

const receipt = await walletClient.createEntity({
  payload: stringToPayload('Hello, Arkiv!'),
  contentType: 'text/plain',
  attributes: [
    { key: 'type', value: 'message' },
    { key: 'author', value: 'user123' }
  ],
  expiresIn: 600  // 10 minutes
});

console.log('Entity created:', receipt.entityKey);
```

### 4. Query Entities

```typescript
import { eq } from '@arkiv-network/sdk/query';

const query = publicClient.buildQuery();
const result = await query
  .where([
    eq('type', 'message'),
    eq('author', 'user123')
  ])
  .fetch();

console.log('Found entities:', result.entities);
```

### 5. Subscribe to Real-Time Updates

```typescript
const unsubscribe = publicClient.subscribe(
  { where: [eq('type', 'message')] },
  (event) => {
    console.log('New entity:', event.entity);
  }
);

// Later, to unsubscribe:
unsubscribe();
```

---

## Setup in PsyChat

### Environment Configuration

Create `.env.local`:

```bash
# Required: Arkiv account address
NEXT_PUBLIC_ARKIV_ACCOUNT_ADDRESS=0xYourAccountAddress

# Optional: Private key (for testing only - never commit!)
NEXT_PUBLIC_ARKIV_PRIVATE_KEY=0xYourPrivateKey
```

### Connect to Arkiv

The Arkiv context automatically initializes when the app loads:

1. **Automatic Connection**: If `NEXT_PUBLIC_ARKIV_ACCOUNT_ADDRESS` is set, Arkiv connects automatically
2. **Manual Connection**: Call `arkivConnect()` from `useArkiv()` hook
3. **Wallet Integration**: Arkiv uses Polkadot wallet address for user identification

### Verify Connection

```typescript
import { useArkiv } from '@/contexts/ArkivContext';

function MyComponent() {
  const { isConnected, sdkReady, accountAddress } = useArkiv();
  
  console.log('Connected:', isConnected);
  console.log('SDK Ready:', sdkReady);
  console.log('Account:', accountAddress);
}
```

---

## Common Operations

### Store a Therapy Message

```typescript
import { useArkivChat } from '@/lib/hooks/useArkivChat';

const arkivChat = useArkivChat(polkadotAddress);

// Store a message
const receipt = await arkivChat.storeMessage(
  sessionId,
  'user',
  'Hello, therapist!'
);
```

### Query Messages for a Session

```typescript
const result = await arkivChat.getMessagesForSession(sessionId);
const messages = result.entities.map(entity => {
  // Decode payload
  const payload = entity.payload || entity.payloadBase64;
  const text = Buffer.from(payload, 'base64').toString('utf-8');
  return { text, timestamp: entity.attributes.find(a => a.key === 'ts')?.value };
});
```

### Subscribe to Real-Time Messages

```typescript
useEffect(() => {
  if (!sessionId) return;
  
  const unsubscribe = arkivChat.subscribeMessages(sessionId, (entity) => {
    // Handle new message
    console.log('New message received:', entity);
  });
  
  return () => unsubscribe();
}, [sessionId]);
```

### Store a Chat Session

```typescript
await arkivChat.storeSession({
  sessionId: 'session-123',
  start: Date.now() - 3600000,  // 1 hour ago
  end: Date.now(),
  messageCount: 10,
  encrypted: true
});
```

---

## Troubleshooting

### Issue: "Arkiv SDK not connected"

**Symptoms:**
- Error: `Arkiv SDK not connected - cannot create entity`
- `sdkReady` is `false`

**Solutions:**
1. Check environment variables:
   ```bash
   echo $NEXT_PUBLIC_ARKIV_ACCOUNT_ADDRESS
   ```

2. Verify RPC endpoint is accessible:
   ```bash
   curl https://mendoza.hoodi.arkiv.network/rpc
   ```

3. Manually connect:
   ```typescript
   const { connect } = useArkiv();
   await connect({ accountAddress: '0x...' });
   ```

### Issue: Subscriptions Not Working

**Symptoms:**
- Messages not appearing in real-time
- Falling back to polling

**Solutions:**
1. Check if `publicClient.subscribe` is available:
   ```typescript
   const { publicClient } = useArkiv();
   console.log('Subscribe available:', typeof publicClient?.subscribe === 'function');
   ```

2. Verify RPC connection:
   - Subscriptions require WebSocket support
   - Check network tab for WebSocket connection

3. Check subscription predicates:
   ```typescript
   const predicates = [
     eq('type', 'chatMessage'),
     eq('sessionId', sessionId)
   ];
   console.log('Subscribing with predicates:', predicates);
   ```

### Issue: TTL Not Working

**Symptoms:**
- Entities still queryable after expiration
- TTL seems ignored

**Solutions:**
1. Verify TTL format:
   - TTL is in **seconds** (not milliseconds)
   - Example: `600` = 10 minutes, not `600000`

2. Check entity creation:
   ```typescript
   await createEntity({
     // ...
     expiresIn: 600  // 10 minutes in seconds
   });
   ```

3. Note: Indexer may show expired entities briefly
   - Filter client-side if needed:
   ```typescript
   const now = Math.floor(Date.now() / 1000);
   const validEntities = entities.filter(e => {
     const createdAt = parseInt(e.attributes.find(a => a.key === 'ts')?.value || '0');
     const age = now - createdAt;
     return age < expiresIn;
   });
   ```

### Issue: Query Returns Empty Results

**Symptoms:**
- `queryEntities()` returns `{ entities: [] }`
- No results found

**Solutions:**
1. Verify attributes match exactly:
   ```typescript
   // Check what attributes were stored
   const all = await queryEntities([{ key: 'type', value: 'chatMessage' }]);
   console.log('All messages:', all.entities);
   console.log('First entity attributes:', all.entities[0]?.attributes);
   ```

2. Check attribute key/value format:
   - Keys are case-sensitive
   - Values must match exactly (no extra spaces)

3. Use buildQuery for complex queries:
   ```typescript
   const query = publicClient.buildQuery();
   const result = await query
     .where([eq('type', 'chatMessage')])
     .fetch();
   ```

### Issue: Payload Decoding Errors

**Symptoms:**
- `Failed to decode payload`
- Messages appear as garbled text

**Solutions:**
1. Check payload format:
   ```typescript
   // Encoding
   const payload = stringToPayload('Hello');
   
   // Decoding
   const text = Buffer.from(payload, 'base64').toString('utf-8');
   ```

2. Handle different payload formats:
   ```typescript
   const payload = entity.payload || entity.payloadBase64;
   let text: string;
   
   if (typeof payload === 'string') {
     text = Buffer.from(payload, 'base64').toString('utf-8');
   } else if (payload instanceof Uint8Array) {
     text = new TextDecoder().decode(payload);
   }
   ```

---

## Debugging Tips

### Enable Arkiv Logging

The Arkiv context logs all operations. Check browser console for:
- `[Arkiv] SDK ready`
- `[Arkiv] createEntity`
- `[Arkiv] queryEntities`
- `[Arkiv] subscribe`

### Inspect Stored Entities

```typescript
// Query all entities of a type
const all = await queryEntities([{ key: 'type', value: 'chatMessage' }]);

// Log entity structure
all.entities.forEach(entity => {
  console.log('Entity:', {
    entityKey: entity.entityKey,
    attributes: entity.attributes,
    payloadType: typeof entity.payload,
    payloadLength: entity.payload?.length
  });
});
```

### Test Subscription

```typescript
// Subscribe to all messages
const unsub = publicClient.subscribe(
  { where: [eq('type', 'chatMessage')] },
  (event) => {
    console.log('Subscription event:', event);
  }
);

// Create a test message
await storeMessage('test-session', 'user', 'Test message');

// Should see subscription event in console
```

---

## Performance Optimization

### Batch Operations

Use `mutateEntities()` for multiple creates:

```typescript
await mutateEntities({
  creates: [
    { payload: stringToPayload('Message 1'), /* ... */ },
    { payload: stringToPayload('Message 2'), /* ... */ },
    { payload: stringToPayload('Message 3'), /* ... */ }
  ]
});
```

### Cache Queries

Cache query results locally:

```typescript
const cacheKey = `arkiv_cache_${sessionId}`;
const cached = localStorage.getItem(cacheKey);
if (cached) {
  return JSON.parse(cached);
}

const result = await queryEntities([/* ... */]);
localStorage.setItem(cacheKey, JSON.stringify(result));
return result;
```

### Optimize TTL

Use shorter TTL for temporary data:
- Messages: 600s (10 min) - ephemeral
- Sessions: 200s (~3 min) - temporary metadata
- Base: 24h - user namespace
- Identity: 365d - long-term storage

---

## Security Best Practices

1. **Never commit private keys** to version control
2. **Use environment variables** for sensitive data
3. **Validate user input** before storing
4. **Encrypt sensitive data** before storing (PsyChat uses XX Network encryption)
5. **Use appropriate TTL** for data sensitivity

---

## Next Steps

- Read [ARKIV_FRICTION_POINTS.md](./ARKIV_FRICTION_POINTS.md) for developer experience feedback
- Check [ARKIV_SUBMISSION.md](./ARKIV_SUBMISSION.md) for submission details
- Review Arkiv docs: http://sl.sub0.gg/lBr7n

---

**Questions?** Open an issue or check the Arkiv documentation.

