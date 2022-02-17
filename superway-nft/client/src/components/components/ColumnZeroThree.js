import React, { useState } from 'react';
import styled from 'styled-components';
import Clock from './Clock';
import { useMyNfts } from '../hooks/nfts';
import { nftaddress, nftmarketaddress, unit, feePercent } from '../../config';

import NFT from '../../contracts/NFT.json';
import Market from '../../contracts/NFTMarket.json';

import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import dayjs from 'dayjs';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

export default function Responsive() {
  const [height, setHeight] = useState(0);
  const [nftForResale, setNftForResale] = useState(null);
  const { data: nfts, status } = useMyNfts();

  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      setHeight(img.offsetHeight);
    }
  };

  const resaleNft = async (n, newPrice, isAuctionSale, auctionEndDate) => {
    console.log(n, newPrice, isAuctionSale, auctionEndDate);
    const today = dayjs();
    const endDate = dayjs(auctionEndDate);
    const milliseconds = endDate.diff(today);
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const price = ethers.utils.parseUnits(`${Number(newPrice)}`, 'ether');

      /* then list the item for sale on the marketplace */
      let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();
      let transaction = await contract.resaleBoughtItem(
        nftaddress,
        n.tokenId,
        price,
        isAuctionSale,
        milliseconds,
        auctionEndDate,
        {
          value: listingPrice,
        }
      );
      await transaction.wait();
      console.log({ transaction });

      window.open('/', '_self');
    } catch (error) {
      console.log(error.data.message);
      if(error?.data?.message === 'VM Exception while processing transaction: revert ERC721: transfer caller is not owner nor approved') {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        /* next, create the item */
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
        let transaction = await contract.setApprovalAgain();
        resaleNft(n, newPrice, isAuctionSale, auctionEndDate);
      }
      
    }
  };
  return (
    <div className='row'>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'success' && nfts?.length < 1 && <div>No items.</div>}
      {status === 'success' &&
        nfts?.map((nft, index) => (
          <div
            key={index}
            className='d-item col-lg-3 col-md-6 col-sm-6 col-xs-12'
          >
            <div className='nft__item'>
              <div className='spacer-15'></div>
              {/* <div className='de_countdown'>
              <Clock deadline={nft.deadline} />
            </div> */}
              <div className='author_list_pp'>
                <span onClick={() => window.open(nft?.authorLink, '_self')}>
                  <img
                    className='lazy'
                    src={'./img/author/author-7.jpg'}
                    alt=''
                  />
                  <i className='fa fa-check'></i>
                </span>
              </div>
              <div className='nft__item_wrap' style={{ height: `${height}px` }}>
                <Outer>
                  <span onClick={() => window.open(nft?.previewLink, '_self')}>
                    <img
                      onLoad={onImgLoad}
                      src={nft?.image}
                      className='lazy nft__item_preview'
                      alt=''
                    />
                  </span>
                </Outer>
              </div>
              <div className='nft__item_info'>
                <span onClick={() => window.open(nft.nftLink, '_self')}>
                  <h4>{nft?.title}</h4>
                </span>
                <div className='nft__item_price'>
                  {nft?.price} {unit}
                  <span>{nft?.bid}</span>
                </div>
                <div className='nft__item_action'>
                  <span>Bought by you.</span>
                </div>
                
                <div className='row'>
                  <button
                    className='btn-main'
                    style={{ width: '100%' }}
                    onClick={() => setNftForResale(nft)}
                  >
                    Re sell
                  </button>
                </div>
                {/* <div className='nft__item_like'>
                <i className='fa fa-heart'></i>
                <span>{nft?.likes}</span>
              </div> */}
              </div>
              <div className='spacer-10'></div>
            </div>
          </div>
        ))}
      {nftForResale && (
        <ResaleCheckout
          nft={nftForResale}
          onCheckout={(nft, newPrice, isAuctionSale, auctionEndDate) =>
            resaleNft(nft, newPrice, isAuctionSale, auctionEndDate)
          }
          onClose={() => setNftForResale(false)}
        />
      )}
    </div>
  );
}

const ResaleCheckout = ({ nft, onCheckout, onClose }) => {
  const [newPrice, setNewPrice] = useState(Number(nft?.price) || 0);
  const [isAuctionSale, setIsAuctionSale] = useState(false);
  const [auctionEndDate, setAuctionEndDate] = useState(
    dayjs().add(1, 'day').format('YYYY-MM-DD')
  );

  return (
    <div className='checkout' style={{ paddingTop: '100px' }}>
      <div className='maincheckout'>
        <button className='btn-close' onClick={() => onClose()}>
          x
        </button>
        <div className='heading'>
          <h3>Resale item </h3>
        </div>
        <p>
          You are about to list <span className='bold'>{nft?.title}</span> for
          selling.
        </p>

        <h5>Select method</h5>
        <div className='de_tab tab_metho'>
          <select
            className='form-control1'
            onChange={(e) => setIsAuctionSale(e.target.value === '2')}
          >
            <option value='1'>Fixed price</option>
            <option value='2'>Timed auction</option>
          </select>

          {isAuctionSale && (
            <div>
              <div className='row'>
                <div className='col-md-12'>
                  <h5>Expiration date</h5>
                  <input
                    type='date'
                    name='bid_expiration_date'
                    id='bid_expiration_date'
                    className='form-control'
                    min={dayjs().add(1, 'day').format('YYYY-MM-DD')}
                    value={auctionEndDate}
                    onChange={(e) => setAuctionEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='detailcheckout'>
          <div className='listcheckout'>
            <h6>New price ({unit})</h6>
            <input
              type='number'
              className='form-control'
              value={newPrice}
              onChange={(e) => setNewPrice(Math.abs(e.target.value))}
            />
            {(newPrice < 1 || newPrice <= nft?.price) && (
              <div style={{ color: 'red' }}>
                New price should be greater than previous sold price.
              </div>
            )}
          </div>
        </div>
        <div className='spacer-single'></div>

        <div className='heading'>
          <p>Service fee 2.5%</p>
          <div className='subtotal'>
            {newPrice * (feePercent / 100)} {unit}
          </div>
        </div>
        <button
          className='btn-main lead mb-5'
          disabled={newPrice <= Number(nft?.price)}
          onClick={() =>
            onCheckout(nft, newPrice, isAuctionSale, auctionEndDate)
          }
        >
          Re list
        </button>
      </div>
    </div>
  );
};
