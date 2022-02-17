import React from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import { navigate } from '@reach/router';

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const slidermain = () => (
  <div className='container'>
    <div className='row align-items-center'>
      <div className='col-md-6'>
        <div className='spacer-single'></div>
        <Reveal
          className='onStep'
          keyframes={fadeInUp}
          delay={0}
          duration={600}
          triggerOnce
        >
          <h6 className=''>
            <span className='text-uppercase color'>Superway Nft Marketplace</span>
          </h6>
        </Reveal>
        <div className='spacer-10'></div>
        <Reveal
          className='onStep'
          keyframes={fadeInUp}
          delay={300}
          duration={600}
          triggerOnce
        >
          <h1 className=''>Discover, Collect and Sell Extraordinary NFTs on a Superway's Marketplace.</h1>
        </Reveal>
        <Reveal
          className='onStep'
          keyframes={fadeInUp}
          delay={600}
          duration={600}
          triggerOnce
        >
          <p className=' lead'>
            NFTs are revolution. Superway is here to help you turn your creativity in to NFTs. Buy, sell and trade exclusively NFTs and digital assets/
          </p>
        </Reveal>
        <div className='spacer-10'></div>
        <Reveal
          className='onStep'
          keyframes={fadeInUp}
          delay={800}
          duration={900}
          triggerOnce
        >
          <div className='d-flex'>
            <span
              onClick={() => navigate('/explore')}
              className='btn-main lead'
            >
              Explore
            </span>

            <span
              onClick={() => navigate('/create2')}
              className='btn-main inline white lead'
              style={{marginLeft: '10px'}}
            >
              Create
            </span>
          </div>
          <div className='mb-sm-30'></div>
        </Reveal>
      </div>
      <div className='col-md-6 xs-hide'>
        <Reveal
          className='onStep'
          keyframes={fadeIn}
          delay={900}
          duration={1500}
          triggerOnce
        >
          <img src='./img/misc/nft.png' className='lazy img-fluid' alt='' />
        </Reveal>
      </div>
    </div>
  </div>
);
export default slidermain;