# Testing Fractales NFT Minting in Farcaster

This guide will help you test the NFT minting functionality in the Farcaster miniapp.

## Prerequisites

1. **Deploy the Contract**
   ```bash
   npm run hh:deploy
   ```
   This will deploy to Celo Mainnet (or Celo Alfajores testnet if configured).

2. **Set Environment Variables**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_FRACTALES_NFT_ADDRESS=0x... # Your deployed contract address
   NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
   NEXT_PUBLIC_EVM_RPC_URL=https://forno.celo.org
   ```

3. **Build and Deploy Frontend**
   ```bash
   npm run build
   ```
   Deploy to Vercel or your hosting platform.

## Testing Steps

### 1. Open in Farcaster
- Open your miniapp in the Farcaster mobile app
- Navigate to a fractal page (e.g., `/fractales/cosmic`)

### 2. Connect Wallet
- Click "Connect Wallet" in the modal
- Approve the connection in Farcaster
- The wallet should connect automatically if you're already logged in

### 3. Capture Fractal
- Option A: Use "Capture Screen" to take a screenshot
- Option B: Let the system auto-capture the fractal canvas
- The image will be optimized to fit within gas limits

### 4. Mint NFT
- Click "Mint NFT"
- Approve the transaction in Farcaster wallet
- Wait for confirmation
- You'll see the transaction hash (clickable link to CeloScan)

### 5. View in Gallery
- Navigate to `/fractales/gallery`
- Your minted NFT should appear
- View all minted fractals from the contract

## Troubleshooting

### "Contract address missing"
- Make sure `NEXT_PUBLIC_FRACTALES_NFT_ADDRESS` is set in your environment
- Restart your dev server after adding env vars

### "Please connect to Farcaster first"
- Make sure you're running in the Farcaster miniapp environment
- Check that the Farcaster SDK is properly initialized

### "Wallet provider not found"
- Ensure you're in the Farcaster miniapp (not just a browser)
- Check browser console for SDK errors

### "Mint failed: gas estimation failed"
- The image might be too large
- Try capturing a smaller image or using the crop feature
- Check that you have enough CELO for gas

### Transaction Stuck
- Check CeloScan for transaction status
- Make sure you're on the correct network (Celo Mainnet)
- Try increasing gas limit (currently set to 1.5x estimated)

## Contract Functions

### Public Minting
- `publicMint(string name, string imageBase64)` - Mint with base64 image
- `publicMintDataURI(string name, string dataUri)` - Mint with full data URI

### Owner Functions (for testing)
- `mintImage(address to, string name, string imageBase64)` - Owner-only mint

## Gas Optimization

The frontend automatically:
- Crops images to fit within ~6000 bytes
- Optimizes PNG compression
- Estimates gas and adds 50% buffer
- Falls back to 12M gas limit if estimation fails

## Network Configuration

The app is configured for **Celo Mainnet**:
- Chain ID: 42220 (0xA4EC)
- RPC: https://forno.celo.org
- Explorer: https://celoscan.io

To use testnet, update:
- `hardhat.config.js` network settings
- Chain params in `[name].tsx`
- RPC URLs in environment variables

