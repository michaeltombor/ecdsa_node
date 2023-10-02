const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');

app.use(cors());
app.use(express.json());

const balances = {
  "025f042630fc5d7b05b7c87b151b09fa07f09fcf1a025d1d30512003864d60cc47": 100,
  "0214eeb3d274b17081c229d656ca1967cb4bb9a291f85d0af98ef6a1b97cd07217": 50,
  "02b066969240c947a85463b70b4316a758b396af44086d0fa3b19042f9bc07188b": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO get a signature from the client-side application CHECK
  // recover the public address from the signature. this will be the sender
  // we want only the person with the private key to be able to send funds
  //derive address from signature on the server
  console.log('received data:', req.body);
  
  const { sender, recipient, amount, signature, message } = req.body;
  //recover public address from the signature: 
  const messageHash = toHex(secp.keccak256(message));
  const publicKey = secp.secp256k1.recover(messageHash, signature);
  const recoveredAddress = toHex(secp.secp256k1.getPublicKey(publicKey)); 

  if(recoveredAddress !== sender) {
    return res.status(400),send({message:"Invalid signature!"});
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
 