import { useCallback, useEffect } from "react";
import "./App.css"
import Web3 from "web3";

import { useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/load-contract";


function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null
  })

  const [accounts,setAccounts] = useState(null)
  const [balance, setBalance] = useState(10)
  const [shouldReload, reload] =useState(false)

  const canConnectToContract = accounts && web3Api.contract
  const reloadEffect = useCallback(() => reload(!shouldReload),[shouldReload])

      
  const setAccountListener = provider => {
    provider.on('accountsChanged', accounts => setAccounts(accounts[0]))
    provider.on('accountsChanged', _ =>  window.location.reload()) //this is much simpler below one is a bit compilcated but better in terms of user experience
    provider.on('chainChanged', _ =>  window.location.reload())
    // provider._jsonRpcConnection.events.on('notification',(payload) =>{
    //   const {method} = payload

    //   if(method === "metamask_unlockStateChanged"){
    //     setAccounts(null)
    //   }
    // })
  }
  useEffect(()=>{
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()


      if(provider){
        const  contract  = await loadContract("Faucet", provider)

        setAccountListener(provider)
        setWeb3Api({
          web3: new Web3(provider),
          provider:provider,
          contract:contract,
          isProviderLoaded: true,
        })
      } else {
        // setWeb3Api({...web3Api,isProviderLoaded:true})
        setWeb3Api((api) =>{
          return{...api,isProviderLoaded:true}
      })
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
        { web3Api.isProviderLoaded ?
          <div className="is-flex is-align-items-center">            

            <span>
              <strong className="mr-2">Account:</strong>
            </span>
            {accounts ?
              <div>{accounts}</div>  :
              !web3Api.provider ?
              <>
              <div className="notification is-warning is-size-7 is-rounderD">
                WALLET IS NOT DETECTED!{` `}
                <a target="_blank" rel="noopener noreferrer" href="https://docs.metamask.io">
                  Install MetaMask
                </a>
              </div>

              </>:
              <button 
                className="button is-small mr-2"
                onClick={() => web3Api.provider.request({method: "eth_requestAccounts"})}
              >
                Connect Wallet
              </button>
              }
            </div> :
            <span>Looking For Web3</span>
          }
          <div className = "balance-view is-size-2 mb-8 mt-8">
            Current Balance: <strong>{balance}</strong> ETH
          </div>

          {!canConnectToContract &&
            <i className = "is-block">
              Connect To Ganache
            </i>
          }

          <button
            disabled={!canConnectToContract} 
            onClick={addFunds}
            className="button is-link mr-2">
            Donate 1eth
            </button>
          <button 
            disabled={!canConnectToContract} 
            className="button is-primary "
            onClick={withdraw}
          >
            Withdraw 0.1 eth
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