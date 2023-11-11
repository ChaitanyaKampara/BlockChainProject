import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./Navbar";
import ContentMonetizationAddress from "../contractsData/ContentMonetization-address.json";
import ContentMonetizationABI from "../contractsData/ContentMonetization.json";
import { useState } from "react";
import { ethers } from "ethers";
import { Spinner } from "react-bootstrap";
import "./App.css";
import CreatePost from "./CreatePost";
import Home from "./Home";
import MyPosts from "./MyPosts";

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [blockChain, setBlockChain] = useState({});
  

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0]);
      console.log(accounts[0]);
      await web3Handler();
    });
    loadContracts(signer);
  };

  const loadContracts = async (signer) => {
    const steemBlockchain = new ethers.Contract(
      ContentMonetizationAddress.address,
      ContentMonetizationABI.abi,
      signer
    );
    setBlockChain(steemBlockchain);
    setLoading(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
              }}
            >
              <Spinner animation="border" style={{ display: "flex" }} />
              <p className="mx-3 my-0">Waiting for Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <Home blockChain={blockChain} currentAccount={account} />
                }
              />
              <Route
                path="/create"
                element={
                  <CreatePost blockChain={blockChain} />
                }
              />

              <Route
                path="/myposts"
                element={
                  <MyPosts blockChain={blockChain} currentAccount={account} />
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;