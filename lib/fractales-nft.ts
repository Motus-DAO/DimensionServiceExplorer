import { ethers } from 'ethers';

const FRACTALES_NFT_ABI = [
  'function nextTokenId() public view returns (uint256)',
  'function tokenURI(uint256 tokenId) public view returns (string)',
  'function ownerOf(uint256 tokenId) public view returns (address)',
  'function balanceOf(address owner) public view returns (uint256)',
];

export interface FractalNFT {
  tokenId: string;
  name: string;
  image: string;
  description: string;
  owner: string;
  tokenURI: string;
}

/**
 * Parse base64 data URI to extract JSON metadata
 */
function parseDataURI(dataURI: string): any {
  try {
    // Handle data:application/json;base64, format
    if (dataURI.startsWith('data:application/json;base64,')) {
      const base64 = dataURI.replace('data:application/json;base64,', '');
      const jsonString = atob(base64);
      return JSON.parse(jsonString);
    }
    // Handle direct base64
    if (dataURI.startsWith('data:')) {
      const parts = dataURI.split(',');
      if (parts.length > 1) {
        const base64 = parts[1];
        const jsonString = atob(base64);
        return JSON.parse(jsonString);
      }
    }
    return null;
  } catch (error) {
    console.error('Error parsing data URI:', error);
    return null;
  }
}

/**
 * Fetch all NFTs from the FractalesNFT contract
 */
export async function fetchAllNFTs(
  contractAddress: string,
  provider: ethers.Provider
): Promise<FractalNFT[]> {
  try {
    const contract = new ethers.Contract(contractAddress, FRACTALES_NFT_ABI, provider);
    
    // Get total supply
    const nextTokenId = await contract.nextTokenId();
    const totalSupply = Number(nextTokenId);
    
    if (totalSupply === 0) {
      return [];
    }

    // Fetch all tokens
    const nftPromises: Promise<FractalNFT | null>[] = [];
    
    for (let i = 1; i <= totalSupply; i++) {
      nftPromises.push(
        (async () => {
          try {
            const [tokenURI, owner] = await Promise.all([
              contract.tokenURI(i),
              contract.ownerOf(i),
            ]);

            const metadata = parseDataURI(tokenURI);
            
            if (!metadata) {
              return null;
            }

            return {
              tokenId: i.toString(),
              name: metadata.name || `Fractal #${i}`,
              image: metadata.image || '',
              description: metadata.description || 'Fractales generated image',
              owner: owner,
              tokenURI: tokenURI,
            };
          } catch (error) {
            console.error(`Error fetching token ${i}:`, error);
            return null;
          }
        })()
      );
    }

    const results = await Promise.all(nftPromises);
    return results.filter((nft): nft is FractalNFT => nft !== null);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}

/**
 * Fetch NFTs owned by a specific address
 * Note: Since the contract doesn't implement ERC721Enumerable,
 * we fetch all NFTs and filter by owner
 */
export async function fetchNFTsByOwner(
  contractAddress: string,
  ownerAddress: string,
  provider: ethers.Provider
): Promise<FractalNFT[]> {
  try {
    // Fetch all NFTs and filter by owner
    const allNFTs = await fetchAllNFTs(contractAddress, provider);
    return allNFTs.filter(nft => nft.owner.toLowerCase() === ownerAddress.toLowerCase());
  } catch (error) {
    console.error('Error fetching NFTs by owner:', error);
    return [];
  }
}

/**
 * Get provider for the network
 */
export function getProvider(): ethers.Provider | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get from MetaMask or other injected provider
  const ethereum = (window as any).ethereum;
  if (ethereum) {
    return new ethers.BrowserProvider(ethereum);
  }
  
  // Fallback to public RPC (adjust for your network)
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.polkadot.io';
  // Note: This won't work directly for Polkadot, you'd need a different provider
  // For now, we'll rely on injected provider
  
  return null;
}

