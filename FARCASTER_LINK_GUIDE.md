# 🔗 How to Get Your Farcaster Miniapp Link

## ✅ What I Found (Based on Official Docs)

After researching the official Farcaster documentation at https://miniapps.farcaster.xyz/docs, here's the correct process:

## 📋 Step-by-Step Process

### 1. Enable Developer Mode
- Go to: **https://farcaster.xyz/~/settings/developer-tools**
- Toggle on **"Developer Mode"**
- This gives you access to publishing tools

### 2. Verify Your Manifest
I've updated your manifest to match Farcaster's official format. It's now at:
- **URL**: `https://dimension-service-explorer.vercel.app/.well-known/farcaster.json`
- **Format**: Uses the `miniapp` object structure as required

### 3. Publish Your Miniapp
1. Open **Developer Tools** in Farcaster (after enabling Developer Mode)
2. Submit your manifest URL: `https://dimension-service-explorer.vercel.app/.well-known/farcaster.json`
3. Follow the publishing process

### 4. Get Your Universal Link
After publishing, you'll get a link in this format:
```
https://farcaster.xyz/miniapps/<app-id>/<app-slug>
```

**To copy it:**
- In Developer Tools: Click the kebab menu (⋮) on your miniapp card → "Copy link to mini app"
- Or in your miniapp: Tap the menu → "Copy link"

## 📚 Official Documentation

- **Getting Started**: https://miniapps.farcaster.xyz/docs/getting-started
- **Publishing Guide**: https://miniapps.farcaster.xyz/docs/guides/publishing
- **URLs Guide**: https://miniapps.farcaster.xyz/docs/guides/urls
- **Developer Tools**: https://farcaster.xyz/~/settings/developer-tools

## 🔄 What I Changed

I updated your manifest from the generic format to Farcaster's required format:
- Changed to use `miniapp` object structure
- Updated field names to match Farcaster's spec (iconUrl, homeUrl, etc.)
- Removed fields that aren't in the official format

## 🎯 Next Steps

1. **Enable Developer Mode** (if not already)
2. **Verify manifest is accessible**: Visit `https://dimension-service-explorer.vercel.app/.well-known/farcaster.json`
3. **Publish through Developer Tools** in Farcaster
4. **Get your Universal Link** after publishing

---

**Note**: The direct URL (`https://dimension-service-explorer.vercel.app`) may work for sharing, but the Universal Link format (`https://farcaster.xyz/miniapps/<app-id>/<app-slug>`) is the official way to share miniapps in Farcaster.


