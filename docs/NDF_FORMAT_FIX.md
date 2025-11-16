# NDF Format Fix

## The Problem

You were getting this error:
```
Failed to create new cmix: invalid character 'C' looking for beginning of value
```

## Root Cause

The NDF (Network Definition File) format confusion:

1. **What we have:** NDF file from AWS is **base64-encoded protobuf data**
2. **What we were passing:** The base64 string directly
3. **What WASM expects:** **Uint8Array** of the decoded protobuf bytes

## The Solution

The NDF must be:
1. Downloaded as base64 string from `https://elixxir-bins.s3.us-west-1.amazonaws.com/ndf/mainnet.json`
2. Decoded from base64 to bytes: `Buffer.from(base64String, 'base64')`
3. Converted to Uint8Array: `new Uint8Array(buffer)`
4. Passed to `XX.NewCmix(ndfUint8Array, ...)`

## Code Changes

### Before (WRONG):
```typescript
const ndfBase64 = await (await fetch('/xxdk-wasm/ndf.json')).text();
await XX.NewCmix(ndfBase64, ...);  // ❌ Passing base64 string
```

### After (CORRECT):
```typescript
const ndfBase64 = await (await fetch('/xxdk-wasm/ndf.json')).text();
const ndfBytes = Buffer.from(ndfBase64.trim(), 'base64');
const ndfUint8Array = new Uint8Array(ndfBytes);
await XX.NewCmix(ndfUint8Array, ...);  // ✅ Passing Uint8Array
```

## NDF File Format

```
public/ndf.json (1MB base64) 
    ↓ decode base64
Buffer (751KB binary)
    ↓ convert
Uint8Array (751KB)
    ↓ pass to
XX.NewCmix()
```

The decoded data is **protobuf format** (not pure JSON), which contains:
- Binary protobuf headers (`\n��-`)
- Embedded JSON data with network configuration
- Gateway information, certificates, cryptographic groups, etc.

## Expected Console Output

After this fix, you should see:
```
[XX] NDF loaded as Uint8Array {length: 751807}
[XX] NewCmix start {statePath: 'xx', ndfLength: 751807, ndfType: 'Uint8Array'}
INFO NewCmix(dir: xx)
[XX] NewCmix completed
```

NOT:
```
[XX] Init error Error: invalid character 'C' looking for beginning of value
```

## Testing

1. Clear localStorage (important!):
   ```javascript
   localStorage.clear();
   indexedDB.databases().then(dbs => dbs.forEach(db => indexedDB.deleteDatabase(db.name)));
   location.reload();
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

3. Watch console for "NDF loaded as Uint8Array"

## Technical Details

- **File size:** ~1MB base64 → ~751KB decoded
- **Format:** Protobuf with embedded JSON
- **Encoding:** Base64 (for transmission) → Uint8Array (for WASM)
- **Why Uint8Array?** Go WASM bindings expect binary data, not strings
