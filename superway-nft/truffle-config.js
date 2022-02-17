const path = require("path");   
const HDWalletProvider = require('@truffle/hdwallet-provider');
// create a file at the root of your project and name it .env -- there you can set process variables
// like the mnemomic and Infura project key below. Note: .env is ignored by git to keep your private information safe
// require('dotenv').config();
// const mnemonic = process.env['MNEMONIC'];

const infuraUrl =
  'YOUR INFURA URL';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
  networks: {
    develop: {
      port: 7545,
      host: '127.0.0.1',
      network_id: '*', // Match any network id
    },
    //polygon Infura testnet
    mumbai_testnet: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: [
            'YOUR ACCOUNT PRIVATE KEY',
          ],
          providerOrUrl: infuraUrl,
        }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 80001,
    },
  },
  compilers: {
    solc: {
      version: '0.8.10',
    },
  },
};
