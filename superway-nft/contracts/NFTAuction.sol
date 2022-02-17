pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTAuction {
    using Counters for Counters.Counter;
    Counters.Counter private totalReturns;

    address payable public beneficiary;
    uint public auctionEndTime;
    string public auctionEndDate;


    address public highestBidder;
    uint public highestBid;

    mapping(address => uint) public pendingReturns;
    mapping(uint => Bid) public bids;


    bool ended = false;

    event highestBidIncrease(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    struct Bid{uint id; address bidder; uint amount; bool withdrawn;}

    constructor(uint _biddingTime, string memory _auctionEndDate, address payable _beneficiary) {
      beneficiary = _beneficiary;
      auctionEndTime = block.timestamp + _biddingTime;
      auctionEndDate = _auctionEndDate;
    }

    modifier onlyNotOwner {
    if (msg.sender == beneficiary) {
      revert("Owner cannot bid.");
    }
    _;
    }

    function getAllBids() public view returns (Bid[] memory) {
      uint itemCount = totalReturns.current();
      Bid[] memory items = new Bid[](itemCount);
      uint currentIndex = 0;

      for (uint i = 0; i < itemCount; i++) {
        uint currentId = i + 1;
        Bid storage currentItem = bids[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
    }
    return items;
    }

    function bid() onlyNotOwner public payable {
      if(block.timestamp > auctionEndTime) {
        revert("The auction has already ended.");
      }
      if(msg.value <= highestBid) {
        revert("There is already a higher or equal bid.");
      }
      if(highestBid != 0) {
        pendingReturns[highestBidder] += highestBid;
      }
      highestBidder = msg.sender;
      highestBid = msg.value;
      totalReturns.increment();
      uint256 bidId = totalReturns.current();
      bids[bidId] = Bid(bidId, highestBidder, highestBid, false);
      emit highestBidIncrease(msg.sender, msg.value);
    }


    function withdraw(uint _bidId) public returns (bool) {
      uint amount = pendingReturns[msg.sender];
      if(amount > 0) {
        pendingReturns[msg.sender] = 0;
        bids[_bidId].withdrawn = true;
      } else {
        revert("No pending returns.");
      }

      if(!payable(msg.sender).send(amount)) {
        pendingReturns[msg.sender] = amount;
        return false;
      }
      return true;
    }
    function auctionEnd() public {
      if(block.timestamp < auctionEndTime) {
        revert("Auction has not ended yet.");
      }
      if(ended) {
        revert("Auction has already ended, auction ended called already.");
      }
      ended = true;
      emit AuctionEnded(highestBidder, highestBid);
      beneficiary.transfer(highestBid);
    }


}