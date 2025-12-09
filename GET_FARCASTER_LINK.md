# 🔗 How to Get Your Farcaster Miniapp Link

Based on the official Farcaster documentation at https://miniapps.farcaster.xyz/docs, here's the correct process:

## 📋 Prerequisites

Before getting your link, ensure:

- ✅ Your app is deployed to a public URL (e.g., `https://dimension-service-explorer.vercel.app`)
- ✅ Your manifest is accessible at `https://your-domain.com/.well-known/farcaster.json`
- ✅ Your manifest follows Farcaster's format (see below)
- ✅ You have a Farcaster account

## 🚀 Steps to Get Your Farcaster Link

### Step 1: Enable Developer Mode

1. **Log in to Farcaster** (mobile or desktop)
2. **Navigate to Developer Tools Settings**:
   - Go to: https://farcaster.xyz/~/settings/developer-tools
   - Or: Settings → Developer Tools in your Farcaster client
3. **Toggle on "Developer Mode"**
   - This gives you access to:
     - Creating manifests
     - Previewing your miniapp
     - Viewing analytics
     - Publishing tools

### Step 2: Verify Your Manifest Format

Your manifest at `/.well-known/farcaster.json` should follow Farcaster's format. Based on the docs, it may need to be structured differently. Check the official format at:

**Manifest Documentation**: https://miniapps.farcaster.xyz/docs/guides/manifest-vs-embed

Your current manifest structure might need adjustment. The official format typically includes:
- `miniapp` object with version, name, iconUrl, homeUrl, etc.
- Or it might use a different structure

### Step 3: Publish Your Miniapp

1. **Access Developer Tools** in Farcaster (after enabling Developer Mode)
2. **Submit/Publish Your Miniapp**:
   - Use the Developer Tools interface
   - Provide your manifest URL: `https://dimension-service-explorer.vercel.app/.well-known/farcaster.json`
   - Follow the publishing guide: https://miniapps.farcaster.xyz/docs/guides/publishing

### Step 4: Get Your Universal Link

After publishing, Farcaster will assign:
- **App ID**: A unique identifier
- **App Slug**: A kebab-case version of your app name

Your link will be in the format:
```
https://farcaster.xyz/miniapps/<app-id>/<app-slug>
```

**To access your link:**
1. Go to the **Developers page** in Farcaster
2. Find your miniapp card
3. Click the **kebab menu** (three dots) in the top-right
4. Select **"Copy link to mini app"**

Or within your miniapp:
1. Open your miniapp
2. Tap the **top-right kebab menu**
3. Select **"Copy link"**

## 📚 Official Documentation Links

- **Getting Started**: https://miniapps.farcaster.xyz/docs/getting-started
- **Publishing Guide**: https://miniapps.farcaster.xyz/docs/guides/publishing
- **Manifest vs Embed**: https://miniapps.farcaster.xyz/docs/guides/manifest-vs-embed
- **URLs Guide**: https://miniapps.farcaster.xyz/docs/guides/urls
- **Developer Tools Settings**: https://farcaster.xyz/~/settings/developer-tools

## 🔍 Current Status

Your app setup:
- ✅ **Deployed URL**: `https://dimension-service-explorer.vercel.app`
- ✅ **Manifest Location**: `https://dimension-service-explorer.vercel.app/.well-known/farcaster.json`
- ⚠️ **Manifest Format**: May need to match Farcaster's official format (check docs)
- ⏳ **Developer Mode**: Need to enable in Farcaster settings
- ⏳ **Publishing**: Need to publish through Developer Tools

## 🎯 Next Actions

1. **Enable Developer Mode**:
   - Visit: https://farcaster.xyz/~/settings/developer-tools
   - Toggle on Developer Mode

2. **Verify Manifest Format**:
   - Check: https://miniapps.farcaster.xyz/docs/guides/manifest-vs-embed
   - Update your manifest if needed to match official format

3. **Publish Your Miniapp**:
   - Use Developer Tools in Farcaster
   - Follow: https://miniapps.farcaster.xyz/docs/guides/publishing

4. **Get Your Link**:
   - After publishing, copy the Universal Link from Developer Tools
   - Format: `https://farcaster.xyz/miniapps/<app-id>/<app-slug>`

## 💡 Alternative: Direct URL (May Work Without Registration)

You can also try sharing your direct URL:
```
https://dimension-service-explorer.vercel.app
```

If Farcaster detects your manifest correctly, it may open as a miniapp even without the official Universal Link format. However, the Universal Link format is recommended for better integration.

## 🆘 Troubleshooting

If you can't find the Developer Tools or Publishing options:

1. **Verify Developer Mode is enabled**: Check settings again
2. **Check Farcaster version**: Ensure you're on the latest version
3. **Review documentation**: https://miniapps.farcaster.xyz/docs
4. **Contact Farcaster**: Ask in Farcaster community or Discord

---

**Key Resources:**
- Official Docs: https://miniapps.farcaster.xyz/docs
- Developer Tools: https://farcaster.xyz/~/settings/developer-tools
- Publishing Guide: https://miniapps.farcaster.xyz/docs/guides/publishing
