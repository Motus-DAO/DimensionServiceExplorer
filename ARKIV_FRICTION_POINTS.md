# Arkiv Developer Experience: Friction Points & Suggestions

## Overview

This document captures our experience building PsyChat with Arkiv, including what worked well, what was challenging, and suggestions for improving the developer experience.

**Project:** PsyChat - Mental health platform using Arkiv for decentralized storage  
**Track:** Arkiv Main Track ($10k)  
**Date:** Sub Zero Hackathon 2024

---

## ✅ What Worked Well

### 1. **TypeScript SDK Integration**

The TypeScript SDK is well-structured and type-safe:

```typescript
import { createPublicClient, createWalletClient } from '@arkiv-network/sdk';
import { eq } from '@arkiv-network/sdk/query';
```

**Strengths:**
- ✅ Clear module structure
- ✅ Good TypeScript types
- ✅ Easy to import and use

### 2. **Query Builder Pattern**

The query builder is intuitive:

```typescript
const query = publicClient.buildQuery();
const result = await query
  .where([eq('type', 'chatMessage')])
  .fetch();
```

**Strengths:**
- ✅ Fluent API design
- ✅ Easy to compose predicates
- ✅ Type-safe predicates

### 3. **TTL System**

TTL is straightforward and works as expected:

```typescript
await createEntity({
  payload: data,
  expiresIn: 600  // 10 minutes
});
```

**Strengths:**
- ✅ Simple API
- ✅ Flexible expiration times
- ✅ Cost-efficient for ephemeral data

---

## ⚠️ Friction Points & Issues

### 1. **Subscription API Inconsistency**

**Issue:**
The subscription API is not clearly documented, and the method signature varies:

```typescript
// What we expected:
publicClient.subscribeEntityEvents({ where: predicates }, callback);

// What actually works:
publicClient.subscribe({ where: predicates }, callback);
```

**Impact:**
- Confusion about correct API
- Had to inspect SDK source to find correct method
- Fallback to polling when unsure

**Reproduction:**
1. Try to use `subscribeEntityEvents` (not found)
2. Check SDK types (unclear)
3. Inspect source code to find `subscribe` method

**Workaround:**
```typescript
// Check if subscribe exists
if (publicClient && typeof publicClient.subscribe === 'function') {
  const sub = publicClient.subscribe({ where: predicates }, callback);
}
```

**Suggestion:**
- Document subscription API clearly
- Provide TypeScript types for subscription methods
- Add examples in docs showing subscription usage

---

### 2. **Payload Encoding/Decoding Complexity**

**Issue:**
Payload format is inconsistent between create and query:

```typescript
// Creating: Use stringToPayload()
const payload = stringToPayload('Hello');

// Querying: Get different formats
const entity = await queryEntities([...]);
const payload = entity.payload || entity.payloadBase64;  // Which one?
```

**Impact:**
- Need to handle multiple payload formats
- Decoding logic is complex
- Easy to introduce bugs

**Reproduction:**
1. Create entity with `stringToPayload()`
2. Query entity
3. Try to decode payload - format varies

**Workaround:**
```typescript
// Handle multiple formats
let text: string;
if (typeof payload === 'string') {
  text = Buffer.from(payload, 'base64').toString('utf-8');
} else if (payload instanceof Uint8Array) {
  text = new TextDecoder().decode(payload);
}
```

**Suggestion:**
- Standardize payload format (always Uint8Array or always base64 string)
- Provide utility functions: `encodePayload()`, `decodePayload()`
- Document payload format in entity response

---

### 3. **TTL Timing Discrepancy**

**Issue:**
Entities may still be queryable briefly after TTL expiration:

```typescript
// Create with 600s TTL
await createEntity({ expiresIn: 600, ... });

// Wait 600s
await sleep(600000);

// Still queryable (should be expired)
const result = await queryEntities([...]);
// result.entities still contains expired entity
```

**Impact:**
- Need client-side filtering for accurate expiration
- Confusion about when data actually expires
- Potential privacy concerns if relying on TTL

**Reproduction:**
1. Create entity with short TTL (e.g., 60s)
2. Wait for TTL to expire
3. Query entities - expired entity may still appear

**Workaround:**
```typescript
// Filter client-side
const now = Math.floor(Date.now() / 1000);
const valid = entities.filter(e => {
  const ts = parseInt(e.attributes.find(a => a.key === 'ts')?.value || '0');
  return (now - ts) < expiresIn;
});
```

**Suggestion:**
- Document TTL behavior (indexer delay)
- Provide `isExpired()` utility function
- Consider adding expiration timestamp to entity response

---

### 4. **Error Messages Could Be More Helpful**

**Issue:**
Generic error messages don't help debug:

```typescript
// Error: "Arkiv SDK not connected"
// But what's wrong? Missing account? RPC down? Network issue?
```

**Impact:**
- Hard to debug connection issues
- Need to check multiple things manually
- Slows development

**Reproduction:**
1. Try to create entity without connecting
2. Get generic error message
3. Need to check: account, RPC, network, SDK state

**Suggestion:**
- More specific error messages:
  - "Arkiv SDK not initialized - call connect() first"
  - "RPC endpoint unreachable - check network"
  - "Account not set - provide accountAddress"
- Add error codes for programmatic handling
- Provide troubleshooting guide in error messages

---

### 5. **SDK Initialization Requires Manual Setup**

**Issue:**
SDK initialization is verbose:

```typescript
const publicClient = createPublicClient({
  chain: mendoza,
  transport: http('https://mendoza.hoodi.arkiv.network/rpc')
});

const account = privateKeyToAccount('0x...');
const walletClient = createWalletClient({
  chain: mendoza,
  transport: http('https://mendoza.hoodi.arkiv.network/rpc'),
  account
});
```

**Impact:**
- Boilerplate code in every project
- Easy to misconfigure
- Hard to switch between testnet/mainnet

**Suggestion:**
- Provide helper: `createArkivClient({ network: 'mendoza', account })`
- Auto-detect network from environment
- Default RPC endpoints per network

---

### 6. **Query Attribute Format Inconsistency**

**Issue:**
Different ways to specify query attributes:

```typescript
// Method 1: Array of objects
queryEntities([
  { key: 'type', value: 'chatMessage' }
]);

// Method 2: Using eq() predicate
query.where([eq('type', 'chatMessage')]).fetch();
```

**Impact:**
- Confusion about which method to use
- Inconsistent code patterns
- Hard to know which is "correct"

**Suggestion:**
- Standardize on one approach (prefer query builder)
- Deprecate array format or make it alias to query builder
- Update all examples to use query builder

---

### 7. **Missing Subscription Event Types**

**Issue:**
Subscription events lack TypeScript types:

```typescript
publicClient.subscribe({ where: predicates }, (event: any) => {
  // event type is 'any' - no type safety
  if (event?.entity) { ... }
});
```

**Impact:**
- No type safety for subscription callbacks
- Need to manually check event structure
- Easy to introduce runtime errors

**Suggestion:**
- Define `SubscriptionEvent` type
- Include event types: `EntityCreated`, `EntityExpired`, etc.
- Export types from SDK

---

## 💡 Suggestions for Improvement

### 1. **Better Documentation**

**Current State:**
- Basic getting started guides
- Missing advanced examples
- Subscription API not clearly documented

**Suggestions:**
- Add comprehensive API reference
- Include subscription examples
- Add troubleshooting section
- Provide common patterns/recipes

### 2. **Developer Tools**

**Suggestions:**
- Arkiv Explorer (like Etherscan) for viewing entities
- CLI tool for testing queries/subscriptions
- Browser extension for debugging
- React hooks library (like `useArkiv()`)

### 3. **SDK Improvements**

**Suggestions:**
- Standardize payload format
- Add utility functions (`encodePayload`, `decodePayload`, `isExpired`)
- Better error messages with codes
- Simplified initialization helpers
- Type-safe subscription events

### 4. **Testing Tools**

**Suggestions:**
- Testnet faucet for free test tokens
- Mock SDK for unit testing
- Integration test helpers
- Example test suite

---

## 📊 Developer Experience Score

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Documentation** | 6/10 | Good basics, missing advanced topics |
| **TypeScript Support** | 8/10 | Good types, some gaps (subscriptions) |
| **API Design** | 7/10 | Query builder is great, some inconsistencies |
| **Error Messages** | 5/10 | Generic errors, need more context |
| **Examples** | 6/10 | Basic examples, need more patterns |
| **Developer Tools** | 4/10 | Limited tooling, need explorer/CLI |
| **Overall** | **6.5/10** | Solid foundation, needs polish |

---

## 🎯 Priority Recommendations

### High Priority
1. **Document subscription API** - Critical for real-time apps
2. **Standardize payload format** - Reduces bugs
3. **Better error messages** - Speeds up debugging

### Medium Priority
4. **Add utility functions** - Reduces boilerplate
5. **Type-safe subscription events** - Improves DX
6. **Simplified initialization** - Easier onboarding

### Low Priority
7. **Developer tools** - Nice to have
8. **Testing helpers** - Useful for teams

---

## 🏆 What We Built Despite Friction

Despite these friction points, we successfully built:

- ✅ **Real-time therapy chat** with Arkiv subscriptions
- ✅ **Strategic TTL design** for cost-efficient storage
- ✅ **Rich attribute system** for flexible querying
- ✅ **CRUD operations** for all therapy data
- ✅ **Production-ready integration** with error handling

**Conclusion:** Arkiv is a powerful platform with a solid foundation. With improved documentation and some API polish, it could be even more developer-friendly.

---

## 📝 Additional Notes

### What We'd Build Next

If we had more time, we'd add:
- Analytics dashboard using Arkiv queries
- Advanced query patterns (date ranges, aggregations)
- Cross-entity filters
- Batch subscription management

### Community Feedback

We'd love to see:
- More examples in the docs
- Community Discord/Slack for questions
- Regular office hours with Arkiv team
- Hackathon-specific resources

---

**Thank you to the Arkiv team for building this platform!** 🚀

*This feedback is provided to help improve Arkiv's developer experience for future builders.*

