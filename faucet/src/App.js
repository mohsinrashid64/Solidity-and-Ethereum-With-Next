import { useEffect } from "react";
import "./App.css"
import Web3 from "web3";

import { useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider'

function App() {



  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null
  })

  const[accounts,setAccounts] = useState(null)

  useEffect(()=>{
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()

      if(provider){
        setWeb3Api({
          web3: new Web3(provider),
          provider
        })
      } else {
        console.error("Please Install MetaMask")
      }
    }
    loadProvider()
  },[])

  useEffect(()=>{
    const getAccount = async () =>{
        const accounts = await web3Api.web3.eth.getAccounts();
        setAccounts(accounts[0])
    }
    web3Api.web3 && getAccount()
  },[web3Api.web3])

  return (
    <>
      <div className = "faucet-wrapper">
        <div className = "faucet">
        <div className="is-flex align-items">            

          <span>
            <strong className="mr-2">Account:</strong>
          </span>
          {accounts ?
            <span>{accounts}</span>  :
             <button 
              className="button is-small mr-2"
              onClick={() => web3Api.provider.request({method: "eth_requestAccounts"})}
             >
              Connect Wallet
             </button>
            }
          </div>
          {accounts}
          <div className = "balance-view is-size-2 mb-8 mt-8">
            Current Balance: <strong>10</strong> ETH
          </div>

          <button className="button is-link mr-2">Donate</button>
          <button className="button is-primary ">Withdraw</button>
        </div> 
      </div> 
    </>
    
  );
}

export default App;
