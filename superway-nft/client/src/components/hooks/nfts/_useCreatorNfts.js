import { useQuery } from 'react-query';

import { ethers } from 'ethers';
import axios from 'axios';
import { nftaddress, nftmarketaddress } from '../../../config';

import NFT from '../../../contracts/NFT.json';
import Market from '../../../contracts/NFTMarket.json';
import Web3Modal from 'web3modal';

export default function useCreatorNfts() {
  return useQuery(['creator_nfts'], () => getCreatorNfts());
}

const getCreatorNfts = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  const marketContract = new ethers.Contract(
    nftmarketaddress,
    Market.abi,
    signer
  );
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const data = await marketContract.fetchItemsCreated();

  const items = await Promise.all(
    data.map(async (i) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
        title: meta.data.title || meta.data.name,
        description: meta.data.description,
      };
      return item;
    })
  );
  return items ? items : [];
};
