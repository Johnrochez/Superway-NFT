import { useQueryClient, useMutation } from 'react-query';

import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import NFTAuction from '../../../contracts/NFTAuction.json';

export default function usePlaceBid() {
  const queryClient = useQueryClient();

  const placeBid = async ({_auctionAddress, newBidAmount}) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const price = ethers.utils.parseUnits(newBidAmount.toString(), 'ether');

      const auctionContract = new ethers.Contract(
        _auctionAddress,
        NFTAuction.abi,
        signer
      );
      const res = await auctionContract.bid({ value: price });
      console.log('res', res);
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  };
  return useMutation(placeBid, {
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
