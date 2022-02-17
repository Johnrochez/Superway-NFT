import { useQueryClient, useMutation } from 'react-query';

import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { nftmarketaddress, nftaddress } from '../../../config';
import NFTAuction from '../../../contracts/NFTAuction.json';
import Market from '../../../contracts/NFTMarket.json';

export default function useEndAuction() {
  const queryClient = useQueryClient();

  const endAuction = async ({
    _auctionAddress,
    tokenId,
    previousHighestBidder,
  }) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const auctionContract = new ethers.Contract(
        _auctionAddress,
        NFTAuction.abi,
        signer
      );
      const endAuction = await auctionContract.auctionEnd();
      console.log('endAuction', endAuction);
      try {
        const nftMarket = new ethers.Contract(
          nftmarketaddress,
          Market.abi,
          signer
        );
        const transferRes = await nftMarket.transferAsset(
          nftaddress,
          tokenId,
          previousHighestBidder
        );
        console.log('transferRes', transferRes);
      } catch (error) {
        console.log(error);
      }
      return true;
    } catch (error) {
      console.log(error.data.message);
      const {message} = error?.data;
      alert(message);
    }
    return false;
  };
  return useMutation(endAuction, {
    onSuccess: async (res, variables, context) => {
      console.log('onSuccess', res, variables, context);
      queryClient.refetchQueries(['market_nfts']);
      queryClient.refetchQueries(['market_nfts', variables?.itemId]);
      queryClient.refetchQueries(['my_nfts']);
    },
    onError: (err, variables, context) => {
      console.log(err);
    },
  });
}
