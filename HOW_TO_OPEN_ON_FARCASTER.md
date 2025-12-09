# 🚀 How to Open Dimension Service Explorer on Farcaster

Your miniapp is ready! Here are several ways to access it within the Farcaster ecosystem.

## Method 1: Direct URL in Warpcast (Recommended)

### On Mobile (iOS/Android):
1. Open **Warpcast** app
2. Tap the **compose** button (bottom center)
3. Type or paste the URL: `https://dimension-service-explorer.vercel.app`
4. Warpcast will detect it as a miniapp and show a preview
5. Tap the preview to open the miniapp in fullscreen

### On Desktop/Web:
1. Go to **warpcast.com** in your browser
2. Click **Compose** (or go to any cast input)
3. Paste: `https://dimension-service-explorer.vercel.app`
4. Click the preview card that appears
5. The miniapp will open in a modal/iframe

## Method 2: Share via Cast

### Create a Cast with Your Miniapp:
1. In Warpcast, compose a new cast
2. Include the URL: `https://dimension-service-explorer.vercel.app`
3. Add a description like: "Explore fractals and mint NFTs on Celo! 🌀✨"
4. Post the cast
5. Anyone who clicks the URL in your cast will open the miniapp

### Example Cast:
```
🌀 Dimension Service Explorer is live!

Explore generative art, mint fractals as NFTs, and earn PSY tokens on Celo.

https://dimension-service-explorer.vercel.app

#farcaster #miniapp #web3 #celo #nft
```

## Method 3: Direct Link Sharing

Share this link directly:
```
https://dimension-service-explorer.vercel.app
```

When opened in Warpcast (mobile or web), it will automatically:
- Detect it's a miniapp (via the manifest at `/.well-known/farcaster.json`)
- Show a preview card
- Allow users to open it in fullscreen

## Method 4: Add to Favorites (Mobile)

1. Open the miniapp URL in Warpcast mobile
2. Once the miniapp is open, look for a **bookmark/star** icon
3. Tap it to save to your favorites
4. Access it later from your profile or favorites section

## Method 5: QR Code

1. Generate a QR code for: `https://dimension-service-explorer.vercel.app`
2. Share the QR code in casts or on other platforms
3. Users scan with Warpcast mobile app
4. Miniapp opens automatically

## Testing Your Miniapp

### Quick Test Checklist:
- [ ] Open URL in Warpcast mobile app
- [ ] Open URL in Warpcast web (warpcast.com)
- [ ] Verify user profile loads (FID, username, pfp)
- [ ] Test wallet connection
- [ ] Try minting an NFT (if contract is deployed)
- [ ] Check that manifest is accessible: `https://dimension-service-explorer.vercel.app/.well-known/farcaster.json`

### Verify Manifest:
Visit this URL to confirm your manifest is accessible:
```
https://dimension-service-explorer.vercel.app/.well-known/farcaster.json
```

You should see JSON with your app's metadata.

## Troubleshooting

### Miniapp Not Opening?
1. **Check manifest accessibility**: Visit `/.well-known/farcaster.json` directly
2. **Verify HTTPS**: Miniapps require HTTPS (✅ you're on Vercel)
3. **Clear cache**: Try in incognito/private mode
4. **Check Warpcast version**: Ensure you're on the latest version

### User Data Not Loading?
- The SDK automatically detects Farcaster environment
- User data should load automatically when opened in Warpcast
- Check browser console for any errors

### Wallet Not Connecting?
- Farcaster provides wallet access via `sdk.wallet.getEthereumProvider()`
- Users may need to approve wallet access in Warpcast
- Ensure Celo network is configured in the wallet

## Pro Tips

1. **Share in Channels**: Post your miniapp URL in Farcaster channels for discovery
2. **Create a Frame**: Consider creating a Farcaster Frame that links to your miniapp
3. **Add to Bio**: Add the URL to your Warpcast profile bio
4. **Cross-post**: Share on Twitter/X with the Farcaster link

## What Users Will See

When users open your miniapp:
1. **Splash screen** (briefly) - automatically hidden by SDK
2. **Your app** loads with Farcaster user context
3. **User profile** appears in header (if connected)
4. **Wallet** is accessible via Farcaster SDK
5. **Full app experience** - explore fractals, mint NFTs, etc.

## Next Steps

1. ✅ **Test it yourself** - Open the URL in Warpcast
2. ✅ **Share with friends** - Post a cast with the URL
3. ✅ **Get feedback** - See how users interact with it
4. ✅ **Iterate** - Add features based on usage

---

**Your Miniapp URL**: `https://dimension-service-explorer.vercel.app`

**Ready to share!** 🎉


