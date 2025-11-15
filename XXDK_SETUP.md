# XX Network WASM Integration - Fixed

## Problem Summary

Your XXDK initialization was failing with a **nil pointer dereference** error. The root cause was:

```
panic: runtime error: invalid memory address or nil pointer dereference
[signal 0xb code=0x0 addr=0x0 pc=0x0]
```

This happened in `DecodeGroups()` because the **Network Definition File (NDF)** was missing or empty.

## What Was Fixed

### 1. ✅ Added Network Definition File (NDF)
- Downloaded mainnet NDF from `https://elixxir-bins.s3.us-west-1.amazonaws.com/ndf/mainnet.json`
- Placed at `public/ndf.json` (979KB)
- Also placed at `node_modules/xxdk-wasm/ndf.json`

### 2. ✅ Improved Error Handling in `XXNetworkContext.tsx`
- Added proper localStorage state management
- Added error recovery (clears localStorage on failure)
- Added NDF fallback paths
- Added better error messages

### 3. ✅ Created Auto-Setup Script
- `scripts/setup-xxdk.js` - automatically downloads NDF on `npm install`
- Added to `package.json` as postinstall script

### 4. ✅ Added Debug Component
- `components/XXDebugStatus.tsx` - shows XX Network connection status

## Quick Start

### 1. Clear Browser State (Important!)

Your browser has cached the broken initialization. You MUST clear it:

**Option A: Browser DevTools**
```
1. Open DevTools (F12)
2. Application tab → Local Storage → http://localhost:3002
3. Delete all keys (especially `cMixInitialized` and `MyDMID`)
4. Application tab → IndexedDB → Delete all XXDK databases
5. Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
```

**Option B: Browser Console**
```javascript
localStorage.clear();
indexedDB.databases().then(dbs => {
  dbs.forEach(db => indexedDB.deleteDatabase(db.name));
});
location.reload();
```

### 2. Restart Dev Server

```bash
npm run dev
```

### 3. Verify NDF is Loading

Check the console for:
```
[XX] NDF fetch status (primary) {ok: true, status: 200}
[XX] NDF loaded {length: 1002800}
[XX] NewCmix start {statePath: 'xx', ndfLength: 1002800}
```

**NOT THIS:**
```
[XX] NDF fetch status {ok: false, status: 404}  ← BAD!
[XX] NDF not found, using empty {}              ← BAD!
```

## Architecture

### File Structure
```
PolkaPsychat/
├── contexts/
│   └── XXNetworkContext.tsx     (Fixed)
├── components/
│   └── XXDebugStatus.tsx        (New - optional)
├── scripts/
│   └── setup-xxdk.js            (New - auto-downloads NDF)
├── public/
│   ├── ndf.json                 (New - 979KB)
│   └── xxdk-wasm/               (symlink to node_modules)
│       └── ndf.json             (New - 979KB)
└── node_modules/
    └── xxdk-wasm/
        └── ndf.json             (New - 979KB)
```

### NDF Loading Flow
1. Try `/xxdk-wasm/ndf.json` (via symlink)
2. Fallback to `/ndf.json` (direct)
3. Fallback to `process.env.NEXT_PUBLIC_XX_NDF_JSON`
4. Throw error if none found

## Using the Debug Component

Add to your layout or page (temporary, for debugging):

```tsx
import { XXDebugStatus } from '@/components/XXDebugStatus';

export default function Layout({ children }) {
  return (
    <>
      {children}
      {process.env.NODE_ENV === 'development' && <XXDebugStatus />}
    </>
  );
}
```

## Expected Console Output (Success)

```
[XX] Init start {hasWindow: true}
[XX] import xxdk-wasm {imported: true}
[XX] Base path set {base: 'http://localhost:3002/xxdk-wasm'}
[LOG] Log level for console set to DEBUG
[LOG] Log level for console set to INFO
INFO xxDK Logger web worker version: v0.1.0
[XX] InitXXDK ok {methods: Array(30)}
[XX] NDF fetch status (primary) {ok: true, status: 200}
[XX] NDF loaded {length: 1002800}
[XX] NewCmix start {statePath: 'xx', ndfLength: 1002800}
INFO NewCmix(dir: xx)
[XX] NewCmix completed
[XX] LoadCmix ok {netId: ...}
[XX] DM identity generated
[XX] DM client ready
```

## Troubleshooting

### Problem: Still getting "NDF not found"
**Solution:** 
```bash
# Re-download NDF
npm run setup-xxdk

# Verify it exists
ls -lh public/ndf.json
# Should show: 979K

# Test it's served correctly
curl http://localhost:3002/ndf.json | head -c 100
# Should show: CpPtL... (base64 data)
```

### Problem: "All buffer buckets are full"
**Solution:** This is a warning, not an error. It's normal during initialization.

### Problem: Still getting nil pointer error
**Solution:**
```bash
# 1. Clear localStorage (see above)
# 2. Delete the state directory
rm -rf .next
# 3. Restart
npm run dev
```

### Problem: NDF is too old
**Solution:**
```bash
# Download fresh NDF
npm run setup-xxdk
```

## Manual Testing

```bash
# 1. Download NDF manually
curl -o public/ndf.json https://elixxir-bins.s3.us-west-1.amazonaws.com/ndf/mainnet.json

# 2. Verify size
ls -lh public/ndf.json
# Should be ~979KB

# 3. Check it's base64
head -c 100 public/ndf.json
# Should start with: CpPtL
```

## Environment Variables (Optional)

You can also provide the NDF via environment variable:

```env
# .env.local
NEXT_PUBLIC_XX_NDF_JSON=CpPtL...  # Full base64 NDF string
```

⚠️ **Warning:** The NDF is ~1MB, so this is not recommended for most use cases.

## Comparison with Reference Implementation

Your implementation is based on the [xxdk-examples/reactjs](https://github.com/xxfoundation/xxdk-examples/tree/master/reactjs/app) but with these improvements:

1. ✅ Better error handling
2. ✅ Automatic NDF setup
3. ✅ Multiple fallback paths
4. ✅ Recovery from failed initialization
5. ✅ Integration with Polkadot wallet

## Next Steps

1. **Clear browser state** (most important!)
2. **Restart dev server**
3. **Check console logs**
4. If successful, you should see "DM client ready"
5. You can now send messages via `sendDirectMessage()`

## Support

If you still have issues:
1. Check that `/ndf.json` returns base64 data
2. Check browser console for detailed errors
3. Check that localStorage is cleared
4. Try in an incognito window
