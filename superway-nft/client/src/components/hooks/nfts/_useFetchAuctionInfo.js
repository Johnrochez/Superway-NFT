import { useQuery } from 'react-query';

import { ethers } from 'ethers';
import { RPC_URL, ZERO_ADDRESS } from '../../../config';
import NFTAuction from '../../../contracts/NFTAuction.json';


export default function useFetchAuctionInfo(_auctionAddress) {
  return useQuery(
    ['auction_info', _auctionAddress],
    () => getAuctionInfo(_auctionAddress),
    {
      enabled: _auctionAddress !== undefined && _auctionAddress !== ZERO_ADDRESS,
    }
  );
}

const getAuctionInfo = async (_auctionAddress) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    const auctionContract = new ethers.Contract(
      _auctionAddress,
      NFTAuction.abi,
      provider
    );
    const highBid = await auctionContract.highestBid();
    const highBidder = await auctionContract.highestBidder();

    const endDate = await auctionContract.auctionEndDate();
    const allBids = await auctionContract.getAllBids();
    return { allBids, highBidder, highBid, endDate };
  } catch (error) {
    console.log(error);
    return null;
  }
  return null;
};
