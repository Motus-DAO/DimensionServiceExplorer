const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying FractalesNFT with account:', deployer.address);
  
  const nft = await hre.ethers.deployContract('FractalesNFT', [deployer.address]);
  await nft.waitForDeployment();
  const addr = await nft.getAddress();
  
  console.log('FractalesNFT deployed to:', addr);
  console.log('Contract owner:', deployer.address);
  console.log('\nAdd this to your .env.local:');
  console.log(`NEXT_PUBLIC_FRACTALES_NFT_ADDRESS=${addr}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
