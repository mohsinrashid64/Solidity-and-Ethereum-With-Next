import { useEffect } from "react";
import "./App.css"
import Web3 from "web3";

import { useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/load-contract";
function App() {



  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  })

  const[accounts,setAccounts] = useState(null)
  const [balance, setBalance] = useState(10)

  useEffect(()=>{
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()
      const  contract  = await loadContract("Faucet", provider)

      
      if(provider){
        setWeb3Api({
          web3: new Web3(provider),
          provider:provider,
          contract:contract
        })
      } else {
        console.error("Please Install MetaMask")
      }
    }
    loadProvider()
  },[])

  useEffect(()=>{
    const loadBalance = async () => {
      const {contract, web3} = web3Api
      console.log("Yoman",web3Api.contract.address)
      const _balance = await web3.eth.getBalance(contract.address)
      console.log("balance",_balance)
      setBalance(parseInt(_balance))
    }
    web3Api.contract && loadBalance()
  },[web3Api])


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
          <div className = "balance-view is-size-2 mb-8 mt-8">
            Current Balance: <strong>{balance}</strong> ETH
          </div>


          <button className="button is-link mr-2">Donate</button>
          <button className="button is-primary ">Withdraw</button>
        </div> 
      </div> 
    </>
    
  );
}

export default App;
