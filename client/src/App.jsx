import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  
  function signMessage(message, privateKey) {
    const messageHash = toHex(secp.keccak256(message));
    const signature = secp.secp256k1.sign(messageHash, privateKey);
    return signature;
  }

  return (
    <div className="app">
      <Wallet
        balance={balance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        
      />
      <Transfer setBalance={setBalance} address={address} signMessage={signMessage} />
    </div>
  );
}

export default App;
