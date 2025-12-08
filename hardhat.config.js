require('dotenv').config();
require('dotenv').config({ path: '.env.local' });
require('@nomicfoundation/hardhat-ethers');

const rawPk = process.env.PRIVATE_KEY || '';
const PRIVATE_KEY = rawPk ? (rawPk.startsWith('0x') ? rawPk : `0x${rawPk}`) : '';

module.exports = {
  solidity: '0.8.28',
  networks: {
    celo: {
      url: 'https://forno.celo.org',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 42220,
    },
    celoAlfajores: {
      url: 'https://alfajores-forno.celo-testnet.org',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 44787,
    }
  }
};
