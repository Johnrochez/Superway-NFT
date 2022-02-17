import React, { useState } from 'react';
import Clock from '../components/Clock';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';

import { Formik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';

import { nftaddress, nftmarketaddress, unit } from '../../config';

import NFT from '../../contracts/NFT.json';
import Market from '../../contracts/NFTMarket.json';

import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

import { create as ipfsHttpClient } from 'ipfs-http-client';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const createNftSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  price: yup
    .number('Price should be a number')
    .required('Description is required')
    .positive('Price should be positive'),
});

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;

export default function Createpage() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuctionSale, setIsAuctionSale] = useState(false);
  const [auctionEndDate, setAuctionEndDate] = useState(
    dayjs().add(1, 'day').format('YYYY-MM-DD')
  );

  // constructor() {
  //   super();
  //   this.onChange = this.onChange.bind(this);
  //   this.state = {
  //     files: [],
  //   };
  // }

  const onChange = async (e) => {
    var file = e.target.files[0];
    setFile(file);
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log('objectUrl', url);
      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  async function createMarket(values, actions) {
    console.log('formadata', values);

    const { title, description, price } = values;
    if (!title || !fileUrl) return;
    /* first, upload to IPFS */
    setLoading(true);
    const data = JSON.stringify({
      title,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url, price);
    } catch (error) {
      console.log('Error uploading file: ', error);
      setLoading(false);
    }
  }

  async function createSale(url, nftPrice) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    console.log('tx', tx);
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(nftPrice.toString(), 'ether');

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    const today = dayjs();
    const endDate = dayjs(auctionEndDate);
    const miliseconds = endDate.diff(today);

    if (isAuctionSale) {
      transaction = await contract.createMarketItem(
        nftaddress,
        tokenId,
        price,
        true,
        miliseconds,
        // 200,
        auctionEndDate,
        {
          value: listingPrice,
        }
      );
    } else {
      transaction = await contract.createMarketItem(
        nftaddress,
        tokenId,
        price,
        false,
        0,
        '',
        {
          value: listingPrice,
        }
      );
    }

    await transaction.wait();
    setLoading(false);
    window.open('/', '_self');
  }

  const handleShow = () => {
    setIsAuctionSale(false);
    document.getElementById('btn1').classList.add('active');
    document.getElementById('btn2').classList.remove('active');
  };
  const handleShow1 = () => {
    setIsAuctionSale(true);
    document.getElementById('btn1').classList.remove('active');
    document.getElementById('btn2').classList.add('active');
  };

  const initialValues = {
    title: '',
    description: '',
    price: 0,
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={createNftSchema}
        onSubmit={(values, actions) => {
          console.log('alues', values);
          createMarket(values, actions);
        }}
      >
        {({
          values,
          touched,
          errors,
          isValid,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <>
            {/* <GlobalStyles />
            <section
              className='jumbotron breadcumb no-bg'
              style={{
                backgroundImage: `url(${'./img/background/subheader.jpg'})`,
              }}
            >
              <div className='mainbreadcumb'>
                <div className='container'>
                  <div className='row m-10-hor'>
                    <div className='col-12'>
                      <h1 className='text-center'>Create NFT</h1>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}

            <section className='container mt-5'>
              {loading && (
                <div className='skill-bar style-2'>
                  <h5>Loading...</h5>
                  <div className='de-progress'>
                    <div
                      className='progress-bar'
                      style={{ width: `80%` }}
                    ></div>
                  </div>
                </div>
              )}
              <div className='row'>
                <div className='col-lg-7 offset-lg-1 mb-5'>
                  <form
                    id='form-create-item'
                    className='form-border'
                    action='#'
                  >
                    <div className='field-set'>
                      <h5>Upload file</h5>

                      <div className='d-create-file'>
                        <p id='file_name'>PNG, JPG, GIF, WEBP Max 20mb.</p>

                        {file && <p>{file.name}</p>}

                        <div className='browse'>
                          <input
                            type='button'
                            id='get_file'
                            className='btn-main'
                            value='Browse'
                          />
                          <input
                            id='upload_file'
                            type='file'
                            accept='image/png, image/gif, image/jpeg'
                            multiple
                            onChange={onChange}
                          />
                        </div>
                      </div>

                      <div className='spacer-single'></div>

                      <h5>Select method</h5>
                      <div className='de_tab tab_methods'>
                        <ul className='de_nav'>
                          <li id='btn1' className='active' onClick={handleShow}>
                            <span>
                              <i className='fa fa-tag'></i>Fixed price
                            </span>
                          </li>
                          <li id='btn2' onClick={handleShow1}>
                            <span>
                              <i className='fa fa-hourglass-1'></i>Timed auction
                            </span>
                          </li>
                        </ul>

                        <div className='de_tab_content pt-3'>
                          <div id='tab_opt_1'></div>

                          {isAuctionSale && (
                            <div>
                              <div className='spacer-20'></div>

                              <div className='row'>
                                {/* <div className='col-md-6'>
                                <h5>Starting date</h5>
                                <input
                                  type='date'
                                  name='bid_starting_date'
                                  id='bid_starting_date'
                                  className='form-control'
                                  min='1997-01-01'
                                />
                              </div> */}
                                <div className='col-md-6'>
                                  <h5>Expiration date</h5>
                                  <input
                                    type='date'
                                    name='bid_expiration_date'
                                    id='bid_expiration_date'
                                    className='form-control'
                                    min={dayjs()
                                      .add(1, 'day')
                                      .format('YYYY-MM-DD')}
                                    value={auctionEndDate}
                                    onChange={(e) =>
                                      setAuctionEndDate(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <div id='tab_opt_3'></div>
                        </div>
                      </div>

                      <div className='spacer-20'></div>

                      <h5>Title</h5>
                      <input
                        type='text'
                        name='title'
                        id='item_title'
                        className='form-control'
                        placeholder="e.g. 'Crypto Funk"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>{touched.title && errors.title}</p>

                      <div className='spacer-10'></div>

                      <h5>Description</h5>
                      <textarea
                        data-autoresize
                        name='description'
                        id='item_desc'
                        className='form-control'
                        placeholder="e.g. 'This is very limited item'"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      <p>{touched.description && errors.description}</p>

                      <div className='spacer-10'></div>

                      <h5>{isAuctionSale ? 'Initial price' : 'Price'}</h5>
                      <input
                        type='number'
                        name='price'
                        id='item_price'
                        className='form-control'
                        placeholder='enter price for one item (ETH)'
                        value={values.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>{touched.price && errors.price}</p>

                      <div className='spacer-10'></div>

                      <input
                        type='button'
                        id='submit'
                        className='btn-main'
                        value='Create Item'
                        onClick={handleSubmit}
                      />
                    </div>
                  </form>
                </div>

                <div className='col-lg-3 col-sm-6 col-xs-12'>
                  <h5>Preview item</h5>
                  <div className='nft__item m-0'>
                    {isAuctionSale && (
                      <div className='de_countdown'>
                        <Clock
                          deadline={
                            dayjs(auctionEndDate)?.format('MMMM, DD, YYYY') ||
                            'December, 30, 2021'
                          }
                        />
                      </div>
                    )}
                    <div className='author_list_pp'>
                      <span>
                        <img
                          className='lazy'
                          src={'./img/author/author-7.jpg'}
                          alt=''
                        />
                        <i className='fa fa-check'></i>
                      </span>
                    </div>
                    <div className='nft__item_wrap'>
                      <span>
                        <img
                          src={fileUrl || './img/collections/coll-item-3.jpg'}
                          id='get_file_2'
                          className='lazy nft__item_preview'
                          alt=''
                        />
                      </span>
                    </div>
                    <div className='nft__item_info'>
                      <span>
                        <h4>{values?.title || 'Your title here'}</h4>
                      </span>
                      <div className='nft__item_price'>
                        {values?.price || 'Your price here'} {unit}
                      </div>
                      <div className='nft__item_action'>
                        <span>Buy</span>
                      </div>
                      <div className='spacer-10'></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Footer />
          </>
        )}
      </Formik>
    </div>
  );
}
