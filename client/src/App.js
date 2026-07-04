import ConnectWallet from "./components/ConnectWallet";

function App() {
  const handleConnected = (signer, address) => {
    console.log("Connected as:", address);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>FisherChain</h1>
      <ConnectWallet onConnected={handleConnected} />
    </div>
  );
}

export default App;
