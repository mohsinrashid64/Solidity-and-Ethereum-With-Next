import React, { useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import "./App.css";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  });

  const [accounts, setAccounts] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
        });
      } else {
        console.error("Please Install MetaMask");
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccounts(accounts[0]);
    };

    const getBalance = async () => {
      if (accounts) {
        const balance = await web3Api.web3.eth.getBalance(accounts);
        // Convert balance from wei to ether
        const etherBalance = web3Api.web3.utils.fromWei(balance, "ether");
        setBalance(etherBalance);
      }
    };

    web3Api.provider && getAccount();
    accounts && getBalance();
  }, [web3Api.web3, web3Api.provider, accounts]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex align-items">
            <span>
              <strong className="mr-2">Account:</strong>
            </span>
            {accounts ? (
              <span>{accounts}</span>
            ) : (
              <button
                className="button is-small mr-2"
                onClick={() => web3Api.provider.request({ method: "eth_requestAccounts" })}
              >
                Connect Wallet
              </button>
            )}
          </div>

          <div className="balance-view is-size-2 mb-8 mt-8">
            Current Balance: <strong>{balance !== null ? `${balance} ETH` : "Loading..."}</strong>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
