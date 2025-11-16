require('dotenv').config();
require('dotenv').config({ path: '.env.local' });
require('@nomicfoundation/hardhat-ethers');

const rawPk = process.env.PRIVATE_KEY || process.env.KUSMA_PRIVATEKEY || process.env.KUSAMA_PRIVATE_KEY || '';
const PRIVATE_KEY = rawPk ? (rawPk.startsWith('0x') ? rawPk : `0x${rawPk}`) : '';

module.exports = {
  solidity: '0.8.28',
  networks: {
    polkadotHubTestnet: {
      url: 'https://testnet-passet-hub-eth-rpc.polkadot.io',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      polkadot: { target: 'evm' }
    }
  }
};
