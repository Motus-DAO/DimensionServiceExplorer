/**
 * FractalesNFT Contract ABI
 * Complete ABI for interacting with the FractalesNFT smart contract
 */
export const FRACTALES_NFT_ABI = [
  // ERC721 Standard Functions
  'function balanceOf(address owner) public view returns (uint256)',
  'function ownerOf(uint256 tokenId) public view returns (address)',
  'function safeTransferFrom(address from, address to, uint256 tokenId) public',
  'function transferFrom(address from, address to, uint256 tokenId) public',
  'function approve(address to, uint256 tokenId) public',
  'function getApproved(uint256 tokenId) public view returns (address)',
  'function setApprovalForAll(address operator, bool approved) public',
  'function isApprovedForAll(address owner, address operator) public view returns (bool)',
  
  // ERC721URIStorage Functions
  'function tokenURI(uint256 tokenId) public view returns (string)',
  
  // ERC721Burnable Functions
  'function burn(uint256 tokenId) public',
  
  // Ownable Functions
  'function owner() public view returns (address)',
  'function renounceOwnership() public',
  'function transferOwnership(address newOwner) public',
  
  // FractalesNFT Custom Functions
  'function nextTokenId() public view returns (uint256)',
  'function mintImage(address to, string name, string imageBase64) public returns (uint256)',
  'function publicMint(string name, string imageBase64) external returns (uint256)',
  'function publicMintDataURI(string name, string dataUri) external returns (uint256)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
  'event FractalMinted(uint256 indexed tokenId, address indexed to, string name)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
] as const;

/**
 * Minimal ABI for read-only operations (smaller bundle size)
 */
export const FRACTALES_NFT_READ_ABI = [
  'function nextTokenId() public view returns (uint256)',
  'function tokenURI(uint256 tokenId) public view returns (string)',
  'function ownerOf(uint256 tokenId) public view returns (address)',
  'function balanceOf(address owner) public view returns (uint256)',
] as const;

/**
 * Minimal ABI for minting operations
 */
export const FRACTALES_NFT_MINT_ABI = [
  'function publicMint(string name, string imageBase64) external returns (uint256)',
  'function publicMintDataURI(string name, string dataUri) external returns (uint256)',
] as const;

