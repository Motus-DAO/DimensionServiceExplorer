import { useMemo } from 'react';
import { ethers } from 'ethers';
import { FRACTALES_NFT_ABI } from './fractales-nft-abi';

/**
 * Hook to get a FractalesNFT contract instance
 * @param contractAddress The deployed contract address
 * @param signerOrProvider ethers Signer or Provider
 * @returns Contract instance or null
 */
export function useFractalesContract(
  contractAddress: string | null | undefined,
  signerOrProvider: ethers.Signer | ethers.Provider | null
) {
  return useMemo(() => {
    if (!contractAddress || !signerOrProvider) {
      return null;
    }
    try {
      return new ethers.Contract(contractAddress, FRACTALES_NFT_ABI, signerOrProvider);
    } catch (error) {
      console.error('Error creating contract instance:', error);
      return null;
    }
  }, [contractAddress, signerOrProvider]);
}

/**
 * Get contract address from environment variables
 */
export function getContractAddress(): string | null {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_FRACTALES_NFT_ADDRESS || null;
  }
  return process.env.NEXT_PUBLIC_FRACTALES_NFT_ADDRESS || null;
}

