import React, { useState } from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Clock from './Clock';
import { useNfts } from '../hooks/nfts';

import Market from '../../contracts/NFTMarket.json';

import { ethers } from 'ethers';

import { nftaddress, nftmarketaddress, unit } from '../../config';

import Web3Modal from 'web3modal';
import { navigate } from '@reach/router';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

function CustomSlide(sliderProps) {
  const { index, ...props } = sliderProps;
  return <div {...props}></div>;
}

export default function Responsive() {
  const [state, setState] = useState({
    deadline: 'January, 10, 2022',
    deadline1: 'February, 10, 2022',
    deadline2: 'February, 1, 2022',
    height: 0,
  });
  const { data: nfts, status } = useNfts();

  // constructor(props) {
  //     super(props);
  //     this.state = { deadline: "January, 10, 2022", deadline1: "February, 10, 2022", deadline2: "February, 1, 2022", height: 0 };
  //     this.onImgLoad = this.onImgLoad.bind(this);
  //   }
  console.log('nfts', nfts);


  // async function buyNft(nft) {
  //   const web3Modal = new Web3Modal();
  //   const connection = await web3Modal.connect();
  //   const provider = new ethers.providers.Web3Provider(connection);
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  //   const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
  //   const transaction = await contract.createMarketSale(
  //     nftaddress,
  //     nft.itemId,
  //     {
  //       value: price,
  //     }
  //   );
  //   await transaction.wait();
  // }

  const onImgLoad = ({ target: img }) => {
    let currentHeight = state.height;
    if (currentHeight < img.offsetHeight) {
      setState({
        ...state,
        height: img.offsetHeight,
      });
    }
  };

  var settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    adaptiveHeight: 300,
    responsive: [
      {
        breakpoint: 1900,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className='nft'>
      {status === 'success' && (
        <Slider {...settings}>
          {nfts?.map((nft, index) => (
            <CustomSlide className='itm' index={index} key={index}>
              <div className='d-item'>
                <div className='nft__item'>
                  {/* <div className='de_countdown'>
                    <Clock deadline={state.deadline} />
                  </div> */}
                  <div className='author_list_pp'>
                    <span 
                    // onClick={() => window.open('/home1', '_self')}
                    >
                      <img
                        className='lazy'
                        src='./img/author/author-7.jpg'
                        alt=''
                      />
                      <i className='fa fa-check'></i>
                    </span>
                  </div>
                  <div
                    className='nft__item_wrap'
                    style={{ height: `${state.height}px` }}
                  >
                    <Outer>
                      <span>
                        <img
                          src={nft?.image || './img/items/static-1.jpg'}
                          className='lazy nft__item_preview'
                          onLoad={onImgLoad}
                          alt=''
                          // style={{minHeight: '300px', maxHeight: '300px'}}
                        />
                      </span>
                    </Outer>
                  </div>
                  <div className='nft__item_info'>
                    <span
                      onClick={() => navigate(`/nfts/${nft?.itemId}`, '_self')}
                    >
                      <h4>{nft?.title}</h4>
                    </span>
                    {/* <div className='nft__item_price'>
                      {nft?.price} {unit}
                      <span>1/20</span>
                    </div> */}
                    <div className='nft__item_action'>
                      <span>
                        {nft?.price} {unit}
                      </span>
                    </div>
                    {/* <div className='nft__item_like'>
                      <i className='fa fa-heart'></i>
                      <span>50</span>
                    </div> */}
                    <div className='spacer-20'></div>
                  </div>
                </div>
              </div>
            </CustomSlide>
          ))}

          {/* <CustomSlide className='itm' index={2}>
            <div className='d-item'>
              <div className='nft__item'>
                <div className='author_list_pp'>
                  <span onClick={() => window.open('/#', '_self')}>
                    <img
                      className='lazy'
                      src='./img/author/author-10.jpg'
                      alt=''
                    />
                    <i className='fa fa-check'></i>
                  </span>
                </div>
                <div
                  className='nft__item_wrap'
                  style={{ height: `${state.height}px` }}
                >
                  <Outer>
                    <span>
                      <img
                        src='./img/items/static-2.jpg'
                        className='lazy nft__item_preview'
                        onLoad={onImgLoad}
                        alt=''
                      />
                    </span>
                  </Outer>
                </div>
                <div className='nft__item_info'>
                  <span onClick={() => window.open('/#', '_self')}>
                    <h4>Deep Sea Phantasy</h4>
                  </span>
                  <div className='nft__item_price'>
                    0.06 ETH<span>1/22</span>
                  </div>
                  <div className='nft__item_action'>
                    <span onClick={() => window.open('/#', '_self')}>
                      Place a bid
                    </span>
                  </div>
                  <div className='nft__item_like'>
                    <i className='fa fa-heart'></i>
                    <span>80</span>
                  </div>
                </div>
              </div>
            </div>
          </CustomSlide> */}

          {/* <CustomSlide className='itm' index={2}>
              <div className="d-item">
                <div className="nft__item">
                    <div className="author_list_pp">
                        <span onClick={()=> window.open("/#", "_self")}>                                    
                            <img className="lazy" src="./img/author/author-10.jpg" alt=""/>
                            <i className="fa fa-check"></i>
                        </span>
                    </div>
                    <div className="nft__item_wrap" style={{height: `${this.state.height}px`}}>
                      <Outer>
                        <span>
                            <img src="./img/items/static-2.jpg" className="lazy nft__item_preview" onLoad={this.onImgLoad} alt=""/>
                        </span>
                      </Outer>
                    </div>
                    <div className="nft__item_info">
                        <span onClick={()=> window.open("/#", "_self")}>
                            <h4>Deep Sea Phantasy</h4>
                        </span>
                        <div className="nft__item_price">
                            0.06 ETH<span>1/22</span>
                        </div>
                        <div className="nft__item_action">
                            <span onClick={()=> window.open("/#", "_self")}>Place a bid</span>
                        </div>
                        <div className="nft__item_like">
                            <i className="fa fa-heart"></i><span>80</span>
                        </div>                                 
                    </div> 
                </div>
            </div>
            </CustomSlide>

            <CustomSlide className='itm' index={3}>
              <div className="d-item">
                <div className="nft__item">
                    <div className="de_countdown">
                    <Clock deadline={this.state.deadline1} />
                    </div>
                    <div className="author_list_pp">
                        <span onClick={()=> window.open("/#", "_self")}>                                    
                            <img className="lazy" src="./img/author/author-11.jpg" alt=""/>
                            <i className="fa fa-check"></i>
                        </span>
                    </div>
                    <div className="nft__item_wrap" style={{height: `${this.state.height}px`}}>
                      <Outer>
                        <span>
                            <img src="./img//items/static-3.jpg" className="lazy nft__item_preview" onLoad={this.onImgLoad} alt=""/>
                        </span>
                      </Outer>
                    </div>
                    <div className="nft__item_info">
                        <span onClick={()=> window.open("/#", "_self")}>
                            <h4>Rainbow Style</h4>
                        </span>
                        <div className="nft__item_price">
                            0.05 ETH<span>1/11</span>
                        </div>
                        <div className="nft__item_action">
                            <span onClick={()=> window.open("/#", "_self")}>Place a bid</span>
                        </div>
                        <div className="nft__item_like">
                            <i className="fa fa-heart"></i><span>97</span>
                        </div>                                 
                    </div> 
                </div>
            </div>
            </CustomSlide>

            <CustomSlide className='itm' index={4}>
            <div className="d-item">
                <div className="nft__item">
                    <div className="author_list_pp">
                        <span onClick={()=> window.open("/#", "_self")}>                                    
                            <img className="lazy" src="./img/author/author-12.jpg" alt=""/>
                            <i className="fa fa-check"></i>
                        </span>
                    </div>
                    <div className="nft__item_wrap" style={{height: `${this.state.height}px`}}>
                      <Outer>
                        <span>
                            <img src="./img/items/static-4.jpg" className="lazy nft__item_preview" onLoad={this.onImgLoad} alt=""/>
                        </span>
                      </Outer>
                    </div>
                    <div className="nft__item_info">
                        <span onClick={()=> window.open("/#", "_self")}>
                            <h4>Two Tigers</h4>
                        </span>
                        <div className="nft__item_price">
                            0.02 ETH<span>1/15</span>
                        </div>
                        <div className="nft__item_action">
                            <span onClick={()=> window.open("/#", "_self")}>Place a bid</span>
                        </div>
                        <div className="nft__item_like">
                            <i className="fa fa-heart"></i><span>73</span>
                        </div>                                 
                    </div> 
                </div>
            </div>
            </CustomSlide>

            <CustomSlide className='itm' index={5}>
            <div className="d-item">
                <div className="nft__item">
                    <div className="author_list_pp">
                        <span onClick={()=> window.open("/#", "_self")}>                                    
                            <img className="lazy" src="./img/author/author-9.jpg" alt=""/>
                            <i className="fa fa-check"></i>
                        </span>
                    </div>
                    <div className="nft__item_wrap" style={{height: `${this.state.height}px`}}>
                      <Outer>
                        <span>
                            <img src="./img/items/anim-4.webp" className="lazy nft__item_preview" onLoad={this.onImgLoad} alt=""/>
                        </span>
                      </Outer>
                    </div>
                    <div className="nft__item_info">
                        <span onClick={()=> window.open("/#", "_self")}>
                            <h4>The Truth</h4>
                        </span>
                        <div className="nft__item_price">
                            0.06 ETH<span>1/20</span>
                        </div>
                        <div className="nft__item_action">
                            <span onClick={()=> window.open("/#", "_self")}>Place a bid</span>
                        </div>
                        <div className="nft__item_like">
                            <i className="fa fa-heart"></i><span>26</span>
                        </div>                                 
                    </div>
                </div>
            </div>
            </CustomSlide>

            <CustomSlide className='itm' index={6}>
            <div className="d-item">
                <div className="nft__item">
                    <div className="de_countdown">
                      <Clock deadline={this.state.deadline2} />
                    </div>
                    <div className="author_list_pp">
                        <span onClick={()=> window.open("/#", "_self")}>                                    
                            <img className="lazy" src="./img/author/author-2.jpg" alt=""/>
                            <i className="fa fa-check"></i>
                        </span>
                    </div>
                    <div className="nft__item_wrap" style={{height: `${this.state.height}px`}}>
                      <Outer>
                        <span>
                            <img src="./img/items/anim-2.webp" className="lazy nft__item_preview" onLoad={this.onImgLoad} alt=""/>
                        </span>
                      </Outer>
                    </div>
                    <div className="nft__item_info">
                        <span onClick={()=> window.open("/#", "_self")}>
                            <h4>Running Puppets</h4>
                        </span>
                        <div className="nft__item_price">
                            0.03 ETH<span>1/24</span>
                        </div>    
                        <div className="nft__item_action">
                            <span onClick={()=> window.open("/#", "_self")}>Place a bid</span>
                        </div>
                        <div className="nft__item_like">
                            <i className="fa fa-heart"></i><span>45</span>
                        </div>                                  
                    </div> 
                </div>
            </div>
            </CustomSlide> */}
        </Slider>
      )}
    </div>
  );
}
