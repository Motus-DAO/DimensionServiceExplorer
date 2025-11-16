const hre = require('hardhat');

async function main() {
  const addr = process.env.FRACTALES_NFT_ADDRESS;
  const name = process.env.FRAC_NAME || 'Fractal';
  const to = process.env.MINT_TO;
  const imageBase64 = process.env.IMAGE_BASE64 || '';
  if (!addr || !imageBase64) throw new Error('Missing FRACTALES_NFT_ADDRESS or IMAGE_BASE64');
  const [signer] = await hre.ethers.getSigners();
  const recipient = to || (await signer.getAddress());
  const abi = ['function mintImage(address to, string name, string imageBase64) public returns (uint256)'];
  const nft = new hre.ethers.Contract(addr, abi, signer);
  const tx = await nft.mintImage(recipient, name, imageBase64);
  const rec = await tx.wait();
  console.log(rec.transactionHash);
}

main().catch((e) => { console.error(e); process.exit(1); });

