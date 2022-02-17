const NFTMarket = artifacts.require('NFTMarket.sol');
const NFT = artifacts.require('NFT.sol');

contract('NFTMarket', () => {
  let nftMarket = null;
  let nft = null;
  before(async () => {
    nftMarket = await NFTMarket.deployed();
    console.log(nftMarket.address);
    nft = await NFT.deployed(nftMarket.address);
    console.log(nft.address);
  });

  it('Should deploy the contract properly', async () => {
    assert.ok(nftMarket.address);
    assert.ok(nft.address);
  });

  it('Should fetch market items', async () => {
    const items = await nftMarket.fetchMarketItems();
    // console.log(items);
  });

  it('Should mint and add an item to marketplace', async () => {
    const url = 'testing url';
    let tokenId = await nft.createToken(url);
    // console.log('transaction', tokenId);
    const listingPrice = await nftMarket.getListingPrice();
    const tx = await nftMarket.createMarketItem(
      nft.address,
      1,
      12,
      false,
      0,
      '',
      { value: listingPrice }
    );

    // let tx = await transaction.wait();
    // console.log('tx', tx);
    // let event = tx.events[0];
    // let value = event.args[2];
    // let tokenId = value.toNumber();
    // console.log(tokenId);
  });
  it('Should fetch market item by id', async () => {
    const item = await nftMarket.getItemByID(1);
    assert(Number(item[0]) === 1);
  });
  it('Should buy the item and transfer the ownership', async () => {
    const item = await nftMarket.getItemByID(1);
    const sale = await nftMarket.createMarketSale(nft.address, item.itemId, {value: item.price});
    // console.log(sale);
  });
  it('Should have changed item to sold', async () => {
    const item = await nftMarket.getItemByID(1);
    assert(item.sold === true);
  });
  it('Should resale the bought item', async () => {
    const listingPrice = await nftMarket.getListingPrice();
    await nftMarket.resaleBoughtItem(nft.address, 1, 13, false, 0, "22-10-2022", {
      value: listingPrice,
    });
    const item = await nftMarket.getItemByID(1);
    console.log(item);
    assert(item.sold === false);
  });
  it('Should fetch market items again!', async () => {
    const items = await nftMarket.fetchMarketItems();
    console.log(items);
  });
  
  it('Should buy the item again!', async () => {
    const item = await nftMarket.getItemByID(1);
    const sale = await nftMarket.createMarketSale(nft.address, item.itemId, {
      value: item.price,
    });
    // console.log(sale);
  });
  it('Should resale the bought in auction item', async () => {
    const listingPrice = await nftMarket.getListingPrice();
    await nftMarket.resaleBoughtItem(
      nft.address,
      1,
      13,
      true,
      200,
      '22-10-2022',
      {
        value: listingPrice,
      }
    );
    const item = await nftMarket.getItemByID(1);
    console.log(item);
    assert(item.sold === false);
  });
  it('Should fetch market items again!', async () => {
    const items = await nftMarket.fetchMarketItems();
    console.log(items);
  });
  
});
