
import { useQuery } from 'react-query'

import { ethers } from 'ethers';
import axios from 'axios';
import { nftaddress, nftmarketaddress, RPC_URL } from '../../../config';

import NFT from '../../../contracts/NFT.json';
import Market from '../../../contracts/NFTMarket.json';

export default function useFavorites() {
  return useQuery(['market_nfts'], () => getMarketPlaceNfts());
}

const getMarketPlaceNfts = async () => {
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        provider
      );
      const data = await marketContract.fetchMarketItems();

      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
          let item = {
            price,
            itemId: i.itemId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            title: meta.data.title || meta.data.name,
            description: meta.data.description,
            auction: i.auction
          };
          return item;
        })
      );

      return items ? items : []

}