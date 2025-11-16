const hre = require('hardhat');

async function main() {
  const nft = await hre.ethers.deployContract('FractalesNFT');
  await nft.waitForDeployment();
  const addr = await nft.getAddress();
  console.log(addr);
}

main().catch((e) => { console.error(e); process.exit(1); });
