/*-----------------------------------------------------------
 @Filename:         index.js
 @Copyright Author: Yogesh Kulkarni @encode hackathon 2022
 @Date:             25/05/2022
 @Description: Front end UI for the Read/Write contract
-------------------------------------------------------------*/

import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { hasEthereum } from '/utils/ethereum'
import ReadWrite from '/src/artifacts/contracts/ReadWrite.sol/ReadWrite.json'

export default function Home() {
  const [message, setMessageState] = useState('')
  const [newMessage, setNewMessageState] = useState('')
  const [newUpdateMessage, setNewUpdateMessageState] = useState('')
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('')
  const newMessageInputRef = useRef();

  // If wallet is already connected...
  useEffect( () => {
    if(! hasEthereum()) {
      setConnectedWalletAddressState(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" rel="noopener noreferrer" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>)
      return
    }
    async function setConnectedWalletAddress() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      try {
        const signerAddress = await signer.getAddress()
        setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`)
      } catch {
        setConnectedWalletAddressState('No wallet connected')
        return;
      }
    }
    setConnectedWalletAddress();
  },[])
  
  // Request access to MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' } )
  }

  // Call smart contract, fetch current value
  async function fetchMessage() {
    if ( ! hasEthereum() ) {
      setConnectedWalletAddressState(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" rel="noopener noreferrer" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      )
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_POLYGON_READWRITE_ADDRESS, ReadWrite.abi, provider)
    try {
      const data = await contract.getMessage()
      setMessageState(data)
    } catch(error) {
      console.log(error)
    }
  }

  // Call smart contract, set new value
  async function setMessage() {
    if ( ! hasEthereum() ) {
      setConnectedWalletAddressState(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" rel="noopener noreferrer" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      )
      return
    }
    if(! newMessage ) {
      setNewMessageState('Add a new message first!.')
      return
    }
    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`)
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_POLYGON_READWRITE_ADDRESS, ReadWrite.abi, signer)
    const transaction = await contract.setMessage(newMessage)
    await transaction.wait()
    setNewUpdateMessageState(`New Message:"${newMessage}" 
                              Old message: "${message}"`)
    newMessageInputRef.current.value = ''
    setNewMessageState('')
  }

  return (
    <div className="max-w-lg mt-36 mx-auto text-center px-4">
      <Head>
        <title>EncodeHackathon</title>
        <meta name="description" content="UI for the Read/Write smart contract." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="space-y-8">
          { ! process.env.NEXT_PUBLIC_POLYGON_READWRITE_ADDRESS ? (
            <p className="text-md">
              Please add deployed address to the <pre>NEXT_PUBLIC_POLYGON_READWRITE_ADDRESS</pre> environment variable.
            </p>
          ) : (
           <>
            <h1 className="text-4xl font-semibold mb-8">
              Encode Polygon Hackathon 2022
            </h1>
            <h2 className="text-1xl font-semibold mb-8 text-gray-600 italic">
              Dapp to Read-Write Smart Contract
            </h2>
            <div className="space-y-8">
                <div className="flex flex-col space-y-4">
                  <input
                    className="border p-4 w-100 text-center"
                    placeholder="A fetched message will show here"
                    value={message}
                    disabled
                  />
                  <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md w-full"
                      onClick={fetchMessage}
                    >
                      Fetch a message from Polygon
                    </button>
                </div>
                <div className="space-y-8">
                  <div className="flex flex-col space-y-4">
                    <input
                      className="border p-4 text-center"
                      onChange={ e => setNewMessageState(e.target.value)}
                      placeholder="Write a new Message String"
                      ref={newMessageInputRef}
                    />
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md"
                      onClick={setMessage}
                    >
                      Set new Message on Polygon
                    </button>
                    <div className="h-2">
                      { newUpdateMessage && <span className="text-sm text-gray-500 italic">{newUpdateMessage}</span> }
                    </div>
                  </div>
                </div>
                <div className="h-4">
                  { connectedWalletAddress && <p className="text-md">{connectedWalletAddress}</p> }
                </div>
            </div>
          </>
          )}
        </main>
      <footer className="mt-20">
        <a
          href="https://github.com/cpucortexm/ReadWritePolygon/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          Read the docs
        </a>
        <a> Author: Yogesh K (yogidk@gmail.com)</a>
      </footer>
    </div>
  )
}
