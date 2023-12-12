import { useCallback, useEffect } from "react";
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

  const [accounts,setAccounts] = useState(null)
  const [balance, setBalance] = useState(10)
  const [shouldReload, reload] =useState(false)

  const reloadEffect = useCallback(() => reload(!shouldReload),[shouldReload])

      
  const setAccountListener = provider => {
    provider.on('accountsChanged', accounts => setAccounts(accounts[0]))
  }
  useEffect(()=>{
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()
      const  contract  = await loadContract("Faucet", provider)


      if(provider){
        setAccountListener(provider)
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
      setBalance(web3.utils.fromWei(_balance,"ether"))
    }
    web3Api.contract && loadBalance()
  },[web3Api, shouldReload])


  useEffect(()=>{
    const getAccount = async () =>{
        const accounts = await web3Api.web3.eth.getAccounts();
        setAccounts(accounts[0])
    }
    web3Api.web3 && getAccount()
  },[web3Api.web3])

  const addFunds = useCallback(async () => {
    const {contract, web3} = web3Api
    await contract.addFunds({
      from: accounts,
      value: web3.utils.toWei("1", "ether")
    })

    reloadEffect()
  },[accounts,web3Api, reloadEffect])

  const withdraw = async () => {
    const {contract, web3} = web3Api
    const withdrawAmount = web3.utils.toWei("0.09","ether")
    await contract.withdraw(withdrawAmount,{
      from:accounts
    })
    reloadEffect()
  }

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


          <button 
            onClick={addFunds}
            className="button is-link mr-2">
            Donate 1eth
            </button>
          <button 
           className="button is-primary "
           onClick={withdraw}
          >
            Withdraw
            </button>
        </div> 
      </div> 
    </>
    
  );
}

export default App;


/*
truffle migrate --reset
truffle console

const instance = await Faucet.deployed();
result = await instance.test3()
result.toString()
instance.emitLog()

instance.addFunds({from:accounts[0],value:"2000000000000000000"})
instance.addFunds({from:accounts[1],value:"2000000000000000000"})

instance.test1({from:accounts[0]})

instance.withdraw("500000000000000000",{from:accounts[1]})

instance.getFunderAtIndex(0)
instance.getAllFunders()

*/