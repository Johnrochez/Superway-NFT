var NFT = artifacts.require('../client/src/contracts/NFT.sol');
var NFTMarket = artifacts.require('../client/src/contracts/NFTMarket.sol');


// module.exports = async function(deployer) {
//   await deployer.deploy(NFTMarket);
//   console.log('market', NFTMarket.address);
//   await deployer.deploy(NFT, NFTMarket.address);


//   // let nft = await deployer.deploy(NFT, market.address);
//   // console.log('nft', nft)

//   // deployer.deploy(NFTMarket).then(() => {
//   //     console.log('MARKET', NFTMarket.address);

//   //   return deployer.deploy(NFT, NFTMarket.address).then(() => {
//   //     console.log('NFT', NFT.address);
//   //   });
//   // });
  
// };

module.exports = (deployer) => {
  deployer.deploy(NFTMarket).then(function () {
    console.log('MARKET INININININININ', NFTMarket.address);
    return deployer.deploy(NFT, NFTMarket.address);
  });
};
