import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, signMessage }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    // Create a message to sign
  const message = `Send ${sendAmount} to ${recipient}`;
  
  // Sign the message using the signMessage function passed as a prop
  const signature = signMessage(message);

  try {
    const {
      data: { balance },
    } = await server.post(`send`, {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
      signature: signature, // Send the signature to the server
      message: message      // Optionally, send the original message for verification
    });
    setBalance(balance);
  } catch (ex) {
    alert(ex.response.data.message);
  }
}

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
