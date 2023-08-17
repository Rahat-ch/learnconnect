import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.1',
  },
  networks: {
    polygon: {
      url: "https://rpc.ankr.com/polygon",
      accounts: ["83ad2579e0162864ba0b48f217bdaba43c6020a79fcbe456fe736c524bbaa8d5"],
    },
  },
  etherscan: {
    apiKey: {
     "base": "TJTXV9XQWFS8MYUPTZVM5TDWWUGHHHF3C9",
     polygon: "4Y4Q9JH8J1XWV4RTG5JSED36MR26VDT1P2",
    },
    customChains: [
      {
        network: "base-goerli",
        chainId: 84531,
        urls: {
         apiURL: "https://api-goerli.basescan.org/api",
         browserURL: "https://goerli.basescan.org"
        }
      }
    ]
  },
  defaultNetwork: 'hardhat',
};

export default config;