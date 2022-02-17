import React, { useState, useEffect } from 'react';
import Clock from '../components/Clock';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';

import {
  useFetchSingleNft,
  useBuyNft,
  useWithdrawBid,
  usePlaceBid,
  useEndAuction,
  useFetchAuctionInfo,
} from '../hooks/nfts';
import { useFetchSigner } from '../hooks/users';
import {
  ZERO_ADDRESS,
  RPC_URL,
  unit,
  feePercent,
  POLYGONSCAN_URL,
  nftaddress,
} from '../../config';

import { ethers } from 'ethers';
import dayjs from 'dayjs';

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
    border-bottom: solid 1px #dddddd;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
  
`;

const convertBigNumberToNormal = (num) => {
  return ethers.utils.formatEther(num); // ethers.utils.formatUnits(num.toString(), 'ether');
};
const Colection = function (props) {
  const tokenId = props?.tokenId;
  const [openMenu, setOpenMenu] = useState(true);
  const [openMenu1, setOpenMenu1] = useState(false);
  const [previousHighestBid, setPreviousHighestBid] = useState(0);
  const [previousHighestBidder, setPreviousHighestBidder] =
    useState(ZERO_ADDRESS);

  const [showPlaceBidForm, setShowPlaceBidForm] = useState(false);

  const [auctionEndDate, setAuctionEndDate] = useState(null);
  const [bids, setBids] = useState([]);

  const { data: signerAddress } = useFetchSigner();
  const { data: singleNft } = useFetchSingleNft(tokenId);
  const { data: auctionInfo } = useFetchAuctionInfo(singleNft?.auction);
  const { mutate: buyNft } = useBuyNft();
  const { mutate: withdrawBidFunds } = useWithdrawBid();
  const { mutate: placeAuctionBid } = usePlaceBid();
  const { mutate: endAuctionHandler } = useEndAuction();

  console.log({ singleNft, auctionInfo });

  useEffect(() => {
    if (auctionInfo) {
      const { endDate, allBids, highBid, highBidder } = auctionInfo;
      setAuctionEndDate(endDate);
      setPreviousHighestBid(convertBigNumberToNormal(highBid));
      setPreviousHighestBidder(highBidder);
      setBids(allBids);
    }
  }, [auctionInfo]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (acct) => {
        console.log({ acct });
      });
      window.ethereum.on('accountsChanged', (acct) => {
        // window.location.reload();
        console.log({ acct });
      });
    }
  });

  const handleBtnClick = () => {
    // setOpenMenu(!openMenu);
    // setOpenMenu1(false);
    document.getElementById('Mainbtn').classList.add('active');
    // document.getElementById('Mainbtn1').classList.remove('active');
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
    setOpenMenu(false);
    document.getElementById('Mainbtn1').classList.add('active');
    document.getElementById('Mainbtn').classList.remove('active');
  };

  const placeBidHandler = (_auctionAddress, newBidAmount) => {
    placeAuctionBid({ _auctionAddress, newBidAmount });
    setShowPlaceBidForm(false);
  };

  return (
    <div>
      <GlobalStyles />
      <section className='container'>
        {showPlaceBidForm && (
          <PlaceBidCheckout
            nft={singleNft}
            highestBid={previousHighestBid}
            onCheckout={(_auctionAddress, bidAmount) =>
              placeBidHandler(_auctionAddress, bidAmount)
            }
            onClose={() => setShowPlaceBidForm(false)}
          />
        )}
        <div className='row mt-md-5 pt-md-4'>
          <div className='col-md-6 text-center'>
            <img
              src={singleNft?.image || './img/items/big-1.jpg'}
              className='img-fluid img-rounded mb-sm-30'
              alt=''
            />
          </div>
          <div className='col-md-6'>
            <div className='item_info'>
              {singleNft?.auction !== ZERO_ADDRESS && (
                <>
                  Auctions ends in
                  <div className='de_countdown'>
                    {auctionEndDate && (
                      <Clock
                        deadline={dayjs(auctionEndDate)?.format(
                          'MMMM, DD, YYYY'
                        )}
                      />
                    )}
                  </div>
                </>
              )}
              <h2>{singleNft?.title}</h2>
              <p>{singleNft?.description}</p>
              <h6>Seller</h6>
              <div className='item_author'>
                <div className='author_list_pp'>
                  <span>
                    <img
                      className='lazy'
                      src='/img/author/author-7.jpg'
                      alt=''
                    />
                    <i className='fa fa-check'></i>
                  </span>
                </div>
                <div className='author_list_info'>
                  <span>{singleNft?.seller}</span>
                </div>
                {singleNft?.auction !== ZERO_ADDRESS && (
                  <>
                    <div className='spacer-40'></div>
                    <div className=''>
                      <div>
                        <span>
                          Initial price: {singleNft?.price} {unit}
                        </span>
                      </div>
                    </div>
                    {previousHighestBidder !== ZERO_ADDRESS && (
                      <>
                        <div>
                          <span>
                            Highest bid: {previousHighestBid} {unit}
                          </span>
                        </div>
                        <div>
                          <span>Highest bidder: {previousHighestBidder}</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className='spacer-30'></div>
              <div>
                {singleNft?.seller === signerAddress &&
                  singleNft?.auction !== ZERO_ADDRESS && (
                    <>
                      <div
                        className='nft__item_action'
                        onClick={() =>
                          endAuctionHandler({
                            _auctionAddress: singleNft?.auction,
                            tokenId,
                            previousHighestBidder,
                          })
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        <span>End auction</span>
                      </div>
                      <div className='spacer-10'></div>
                    </>
                  )}
                {singleNft?.auction === ZERO_ADDRESS && (
                  <>
                    <div className='mainside'>
                      <button
                        className='btn-main'
                        onClick={() => buyNft(singleNft)}
                      >
                        Buy {singleNft?.price} {unit}
                      </button>
                    </div>
                  </>
                )}
                {singleNft?.auction !== ZERO_ADDRESS &&
                  singleNft?.seller !== signerAddress && (
                    <div className='row'>
                      <div className='mainside'>
                        <button
                          className='btn-main'
                          // onClick={() => placeBidHandler(singleNft?.auction)}
                          onClick={() => setShowPlaceBidForm(true)}
                        >
                          Place a bid
                        </button>
                      </div>
                    </div>
                  )}
                <div className='spacer-20'></div>
                <div className=''>
                  <h4>Proof of authenticity</h4>
                  <div>
                    <a href={singleNft?.image} target='_blank' rel='noreferrer'>
                      View on IPFS:{' '}
                      <i
                        className='fa fa-fw'
                        aria-hidden='true'
                        title='Copy to use external-link'
                      >
                        
                      </i>
                    </a>
                  </div>
                  <div>
                    <a
                      href={`${POLYGONSCAN_URL}/address/${nftaddress}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      View on polygonscan:{' '}
                      <i
                        className='fa fa-fw'
                        aria-hidden='true'
                        title='Copy to use external-link'
                      >
                        
                      </i>
                    </a>
                  </div>
                </div>
              </div>
              <div className='spacer-20'></div>
              {singleNft?.auction !== ZERO_ADDRESS && (
                <div className='de_tab'>
                  <ul className='de_nav'>
                    <li id='Mainbtn' className='active'>
                      <span onClick={handleBtnClick}>Bids</span>
                    </li>
                    {/* <li id='Mainbtn1' className=''>
                      <span onClick={handleBtnClick1}>History</span>
                    </li> */}
                  </ul>

                  <div className='de_tab_content'>
                    {bids?.length < 1 && <p>No bids yet.</p>}
                    {openMenu && (
                      <div className='tab-1 onStep fadeIn'>
                        {bids &&
                          [...bids].reverse()?.map((b, i) => (
                            <div className='p_list' key={i}>
                              <div className='p_list_pp'>
                                <span>
                                  <img
                                    className='lazy'
                                    src='./img/author/author-1.jpg'
                                    alt=''
                                  />
                                  <i className='fa fa-check'></i>
                                </span>
                              </div>
                              <div className='p_list_info'>
                                {b?.[1]}{' '}
                                <b>
                                  {convertBigNumberToNormal(b?.[2])} {unit}
                                </b>
                                {}
                                {i !== 0 && signerAddress === b?.[1] && (
                                  <>
                                    <WithdrawFunds
                                      bidderAddress={b?.[1]}
                                      bidAmount={b?.[2]}
                                      withDrawn={b?.[3]}
                                      signerAddress={signerAddress}
                                      onClick={() =>
                                        withdrawBidFunds({
                                          _auctionAddress: singleNft?.auction,
                                          bidId: b?.[0]?.toNumber(),
                                        })
                                      }
                                    />
                                  </>
                                )}
                                <div className='spacer-10'></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* {openMenu1 && (
                      <div className='tab-2 onStep fadeIn'>
                        <div className='p_list'>
                          <div className='p_list_pp'>
                            <span>
                              <img
                                className='lazy'
                                src='./img/author/author-5.jpg'
                                alt=''
                              />
                              <i className='fa fa-check'></i>
                            </span>
                          </div>
                          <div className='p_list_info'>
                            Bid <b>0.005 ETH</b>
                            <span>
                              by <b>Jimmy Wright</b> at 6/14/2021, 6:40 AM
                            </span>
                          </div>
                        </div>

                        <div className='p_list'>
                          <div className='p_list_pp'>
                            <span>
                              <img
                                className='lazy'
                                src='./img/author/author-1.jpg'
                                alt=''
                              />
                              <i className='fa fa-check'></i>
                            </span>
                          </div>
                          <div className='p_list_info'>
                            Bid accepted <b>0.005 ETH</b>
                            <span>
                              by <b>Monica Lucas</b> at 6/15/2021, 3:20 AM
                            </span>
                          </div>
                        </div>

                        <div className='p_list'>
                          <div className='p_list_pp'>
                            <span>
                              <img
                                className='lazy'
                                src='./img/author/author-2.jpg'
                                alt=''
                              />
                              <i className='fa fa-check'></i>
                            </span>
                          </div>
                          <div className='p_list_info'>
                            Bid <b>0.005 ETH</b>
                            <span>
                              by <b>Mamie Barnett</b> at 6/14/2021, 5:40 AM
                            </span>
                          </div>
                        </div>

                        <div className='p_list'>
                          <div className='p_list_pp'>
                            <span>
                              <img
                                className='lazy'
                                src='./img/author/author-3.jpg'
                                alt=''
                              />
                              <i className='fa fa-check'></i>
                            </span>
                          </div>
                          <div className='p_list_info'>
                            Bid <b>0.004 ETH</b>
                            <span>
                              by <b>Nicholas Daniels</b> at 6/13/2021, 5:03 AM
                            </span>
                          </div>
                        </div>

                        <div className='p_list'>
                          <div className='p_list_pp'>
                            <span>
                              <img
                                className='lazy'
                                src='./img/author/author-4.jpg'
                                alt=''
                              />
                              <i className='fa fa-check'></i>
                            </span>
                          </div>
                          <div className='p_list_info'>
                            Bid <b>0.003 ETH</b>
                            <span>
                              by <b>Lori Hart</b> at 6/12/2021, 12:57 AM
                            </span>
                          </div>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Colection;

const WithdrawFunds = ({
  onClick,
  bidderAddress,
  signerAddress,
  withDrawn,
}) => {
  if (withDrawn) {
    return <div>Bid withdrawn.</div>;
  }
  return !withDrawn && bidderAddress === signerAddress ? (
    <div
      className='nft__item_action'
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <span>Withdraw your funds</span>
    </div>
  ) : (
    <div></div>
  );
};

const PlaceBidCheckout = ({ nft, highestBid, onCheckout, onClose }) => {
  const [bidAmount, setBidAmount] = useState(Number(highestBid) || 0);
  return (
    <div className='checkout'>
      <div className='maincheckout'>
        <button className='btn-close' onClick={() => onClose()}>
          x
        </button>
        <div className='heading'>
          <h3>Place a Bid</h3>
        </div>
        <p>
          You are about to purchase a <span className='bold'>{nft?.title}</span>
        </p>
        <div className='detailcheckout mt-4'>
          <div className='listcheckout'>
            <h6>Your bid ({unit})</h6>
            <input
              type='number'
              className='form-control'
              value={bidAmount}
              onChange={(e) => setBidAmount(Math.abs(e.target.value))}
            />
            {(bidAmount <= Number(highestBid) ||
              bidAmount <= Number(nft?.price)) && (
              <div style={{ color: 'red' }}>
                New bid amount should be greater than previous highest bid and
                initial price
              </div>
            )}
          </div>
        </div>
        <div className='heading mt-3'>
          <p>Previous highest bid</p>
          <div className='subtotal'>
            {highestBid} {unit}
          </div>
        </div>
        <div className='heading'>
          <p>Service fee 2.5%</p>
          <div className='subtotal'>
            {bidAmount * (feePercent / 100)} {unit}
          </div>
        </div>
        <div className='heading'>
          <p>You will pay</p>
          <div className='subtotal'>
            {bidAmount + bidAmount * (feePercent / 100)} {unit}
          </div>
        </div>
        <button
          className='btn-main lead mb-5'
          disabled={
            bidAmount <= Number(highestBid) || bidAmount <= Number(nft?.price)
          }
          onClick={() => onCheckout(nft?.auction, bidAmount)}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};
