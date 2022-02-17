import { useQueryClient, useMutation } from 'react-query';

import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { nftmarketaddress, nftaddress } from '../../../config';
import Market from '../../../contracts/NFTMarket.json';
import {navigate} from '@reach/router';

export default function useBuyNft() {
  const queryClient = useQueryClient();

  const buyNft = async (nft) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );

      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
      const transaction = await contract.createMarketSale(
        nftaddress,
        nft.itemId,
        {
          value: price,
        }
      );
      await transaction.wait();
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  };
  return useMutation(buyNft, {
    onSuccess: async (res, variables, context) => {
      console.log('onSuccess', res, variables, context);
      queryClient.refetchQueries(['market_nfts']);
      queryClient.refetchQueries(['market_nfts', variables?.itemId]);
      queryClient.refetchQueries(['my_nfts']);
      navigate('/Author');
    },
    onError: (err, variables, context) => {
      console.log(err);
    },
  });
}
