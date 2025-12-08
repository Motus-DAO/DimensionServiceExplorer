# 🔧 Troubleshooting: Miniapp Not Opening in Farcaster

If your miniapp link opens in Safari instead of Farcaster, here's how to fix it:

## ✅ What We've Fixed

1. **Added Farcaster Meta Tag** - Added `fc:miniapp` meta tag to `_document.tsx`
2. **Manifest is Accessible** - Verified at `/.well-known/farcaster.json`
3. **Correct Format** - Manifest matches Farcaster requirements

## 🚀 Next Steps

### 1. Deploy the Changes

After adding the meta tag, you need to redeploy:

```bash
# Commit and push your changes
git add .
git commit -m "Add Farcaster miniapp meta tag"
git push
```

Vercel will automatically redeploy.

### 2. Wait for Cache to Clear

After deployment, wait 1-2 minutes for:
- Vercel cache to update
- Farcaster's link preview cache to refresh

### 3. Try These Sharing Methods

#### Method A: Direct URL in Cast (Recommended)
1. In Warpcast, compose a new cast
2. Type or paste: `https://dimension-service-explorer.vercel.app`
3. **Don't add any text before the URL** - let it be the first thing
4. Wait for the preview card to appear
5. If preview shows, tap it to open miniapp
6. If no preview, try Method B

#### Method B: Share with Context
```
Check out Dimension Service Explorer! 🌀

https://dimension-service-explorer.vercel.app

Explore fractals, mint NFTs, earn PSY tokens on Celo
```

#### Method C: Use Farcaster's Miniapp Format
If Farcaster has a miniapp registry, you might need to:
1. Register your miniapp at [miniapps.farcaster.xyz](https://miniapps.farcaster.xyz)
2. Get a miniapp ID
3. Share using: `https://farcaster.xyz/miniapps/<your-app-id>`

### 4. Verify Meta Tag is Live

After deployment, check if the meta tag is present:

```bash
curl -s https://dimension-service-explorer.vercel.app | grep -i "fc:miniapp"
```

You should see the meta tag in the HTML.

### 5. Test in Different Ways

- **Mobile Warpcast**: Try on iOS/Android app
- **Web Warpcast**: Try on warpcast.com
- **Direct Link**: Paste URL directly in compose box
- **In Cast**: Click a link in an existing cast

## 🔍 Common Issues

### Issue: Link Still Opens in Browser

**Possible Causes:**
1. **Cache**: Farcaster/Warpcast cached the old link
   - **Fix**: Wait 5-10 minutes, try again
   - Or: Use a different device/browser

2. **Meta Tag Not Deployed**: Changes haven't gone live yet
   - **Fix**: Check deployment status on Vercel
   - Verify meta tag exists: `curl https://dimension-service-explorer.vercel.app | grep fc:miniapp`

3. **Manifest Not Found**: Farcaster can't find the manifest
   - **Fix**: Verify manifest is accessible:
     ```bash
     curl https://dimension-service-explorer.vercel.app/.well-known/farcaster.json
     ```

4. **Not Registered**: Miniapp might need to be registered first
   - **Fix**: Check if Farcaster requires miniapp registration
   - Visit: https://miniapps.farcaster.xyz/docs

### Issue: Preview Card Doesn't Appear

**Possible Causes:**
1. **Link Format**: Make sure URL is on its own line
2. **Cache**: Clear Warpcast cache or wait
3. **Meta Tag**: Ensure meta tag is in HTML head

## 📋 Checklist

Before testing, verify:

- [ ] Meta tag added to `_document.tsx` ✅
- [ ] Changes committed and pushed
- [ ] Vercel deployment successful
- [ ] Manifest accessible at `/.well-known/farcaster.json`
- [ ] Meta tag visible in deployed HTML
- [ ] Waited 2-3 minutes after deployment

## 🧪 Testing Steps

1. **Deploy** your changes
2. **Wait** 2-3 minutes for cache to clear
3. **Open Warpcast** (mobile or web)
4. **Compose** a new cast
5. **Paste** the URL: `https://dimension-service-explorer.vercel.app`
6. **Wait** for preview card (may take 5-10 seconds)
7. **Tap** the preview card
8. **Should open** in Farcaster miniapp view

## 💡 Alternative: Use Farcaster's Miniapp Registry

If direct links don't work, you may need to:

1. **Register** your miniapp with Farcaster
2. **Get** a miniapp ID/slug
3. **Share** using Farcaster's format: `https://farcaster.xyz/miniapps/<your-id>`

Check: https://miniapps.farcaster.xyz/docs/guides/publishing

## 🆘 Still Not Working?

If it still opens in Safari after:
- ✅ Meta tag is deployed
- ✅ Manifest is accessible
- ✅ Waited for cache to clear
- ✅ Tried different sharing methods

Then you may need to:
1. **Register** the miniapp with Farcaster officially
2. **Contact** Farcaster support
3. **Check** Farcaster documentation for latest requirements

---

**Current Status:**
- ✅ Manifest: Accessible and correct format
- ✅ Meta Tag: Added to HTML head
- ⏳ Deployment: Needs to be deployed
- ⏳ Testing: After deployment

**Next Action:** Deploy and test!

