# Reset XXDK State

The XXDK initialization was failing because of a missing Network Definition File (NDF). This has been fixed.

## What was fixed:

1. ✅ Downloaded the mainnet NDF from `https://elixxir-bins.s3.us-west-1.amazonaws.com/ndf/mainnet.json`
2. ✅ Placed it at `public/xxdk-wasm/ndf.json`
3. ✅ Updated error handling in `XXNetworkContext.tsx` to properly retry on failure
4. ✅ Added better localStorage state management

## To reset and test:

### Option 1: Clear browser state (recommended)
1. Open your browser's Developer Tools (F12)
2. Go to the Application tab (Chrome) or Storage tab (Firefox)
3. Find "Local Storage" → `http://localhost:3002`
4. Delete these keys:
   - `cMixInitialized`
   - `MyDMID`
   - Any keys starting with `xx` or `A1VPYgX9n68`
5. Go to IndexedDB and delete all XXDK-related databases
6. Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+F5 on Windows)

### Option 2: Use browser console
Run this in the browser console:
```javascript
localStorage.clear();
indexedDB.databases().then(dbs => {
  dbs.forEach(db => indexedDB.deleteDatabase(db.name));
});
location.reload();
```

### Option 3: Clear from code
Add this temporarily to your app (then remove it):
```javascript
useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    console.log('Cleared localStorage');
  }
}, []);
```

## Expected behavior after fix:

The console should show:
```
[XX] Init start {hasWindow: true}
[XX] import xxdk-wasm {imported: true}
[XX] Base path set {base: 'http://localhost:3002/xxdk-wasm'}
[XX] InitXXDK ok {methods: [...]}
[XX] NDF fetch status {ok: true, status: 200}
[XX] NDF loaded from /xxdk-wasm/ndf.json {length: 1002800}
[XX] NewCmix start {statePath: 'xx', ndfLength: 1002800}
[XX] NewCmix completed
[XX] LoadCmix ok {netId: ...}
```

## If you still get errors:

1. Check that the NDF file exists:
   ```bash
   ls -lh public/xxdk-wasm/ndf.json
   ```
   Should show a ~979KB file

2. Verify the dev server is serving it:
   Visit http://localhost:3002/xxdk-wasm/ndf.json in your browser
   You should see base64-encoded data starting with `CpPtL`

3. Check Next.js is serving static files correctly - restart the dev server:
   ```bash
   npm run dev
   ```
