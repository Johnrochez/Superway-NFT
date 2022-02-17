import React, { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useFetchSigner } from '../hooks/users';
import { useQueryClient } from 'react-query';

const Wallet = () => {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const queryClient = useQueryClient();
  const { data: signerAddress } = useFetchSigner();
  console.log('data', signerAddress);

  const logOutHandler = async () => {
    localStorage.removeItem('@signer');
    queryClient.invalidateQueries('signer');
  };

  const connectMetamask = async () => {
    const rawMessage = 'I am signing in to MetaMask';
    // configure web3, e.g. with web3Modal or in your case WalletConnect
    const web3Modal = new Web3Modal();
    const web3 = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(web3);

    // const provider = new providers.Web3Provider(web3);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    let signedMessage;
    if (web3.wc) {
      signedMessage = await provider.send('personal_sign', [
        ethers.utils.hexlify(ethers.utils.toUtf8Bytes(rawMessage)),
        address.toLowerCase(),
      ]);
    } else {
      signedMessage = await signer.signMessage(rawMessage);
    }

    const verified = ethers.utils.verifyMessage(rawMessage, signedMessage);
    console.log('verified', verified, rawMessage, signedMessage);
    setConnectedAccount(verified);
    localStorage.setItem('@signer', verified);
    return;
    if (signerAddress) {
      logOutHandler();
    }
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const address = await signer.getAddress();
      localStorage.setItem('@signer', address);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='row'>
      {/* {connectedAccount ? (
        <div>{connectedAccount}</div>
      ) : (
        <button onClick={connectMetamask}>Connect Metamask</button>
      )} */}
      {signerAddress && (
        <div className='mainside'>
          <button className='btn-main' onClick={logOutHandler}>
            Logout
          </button>
        </div>
      )}
      {!signerAddress && (
        <div className='col-lg-3 mb30' onClick={connectMetamask}>
          <span className='box-url'>
            <span className='box-url-label'>Most Popular</span>
            <img src='./img/wallet/1.png' alt='' className='mb20' />
            <h4>Metamask</h4>
            <p>
              Start exploring blockchain applications in seconds. Trusted by
              over 1 million users worldwide.
            </p>
          </span>
        </div>
      )}

      {/* <div className="col-lg-3 mb30">
        <span className="box-url">
            <img src="./img/wallet/2.png" alt="" className="mb20"/>
            <h4>Bitski</h4>
            <p>Bitski connects communities, creators and brands through unique, ownable digital content.</p>
        </span>
    </div>       

    <div className="col-lg-3 mb30">
        <span className="box-url">
            <img src="./img/wallet/3.png" alt="" className="mb20"/>
            <h4>Fortmatic</h4>
            <p>Let users access your Ethereum app from anywhere. No more browser extensions.</p>
        </span>
    </div>    

    <div className="col-lg-3 mb30">
        <span className="box-url">
            <img src="./img/wallet/4.png" alt="" className="mb20"/>
            <h4>WalletConnect</h4>
            <p>Open source protocol for connecting decentralised applications to mobile wallets.</p>
        </span>
    </div>

    <div className="col-lg-3 mb30">
        <span className="box-url">
            <img src="./img/wallet/5.png" alt="" className="mb20"/>
            <h4>Coinbase Wallet</h4>
            <p>The easiest and most secure crypto wallet. ... No Coinbase account required.
            </p>
        </span>
    </div>

    <div className="col-lg-3 mb30">
        <span className="box-url">
            <img src="./img/wallet/6.png" alt="" className="mb20"/>
            <h4>Arkane</h4>
            <p>Make it easy to create blockchain applications with secure wallets solutions.</p>
        </span>
    </div>       

    <div className="col-lg-3 mb30">
        <span className="box-url">
            <img src="./img/wallet/7.png" alt="" className="mb20"/>
            <h4>Authereum</h4>
            <p>Your wallet where you want it. Log into your favorite dapps with Authereum.</p>
        </span>
    </div>    

    <div className="col-lg-3 mb30">
        <span className="box-url">
            <span className="box-url-label">Most Simple</span>
            <img src="./img/wallet/8.png" alt="" className="mb20"/>
            <h4>Torus</h4>
            <p>Open source protocol for connecting decentralised applications to mobile wallets.</p>
        </span>
    </div>                                   */}
    </div>
  );
};
export default Wallet;
