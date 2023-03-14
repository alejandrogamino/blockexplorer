import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockHeight, setBlockHeight] = useState(-1);
  const [blockTimestamp, setBlockTimestamp] = useState();
  const [numTransactions, setNumTransactions] = useState();
  const [gasUsed, setGasUsed] = useState();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState({
    hash: "",
    blockNumber: "",
    from: "",
    to: "",
    value: "",
  });
  const [selectedTransactionHash, setSelectedTransactionHash] = useState("");

  useEffect(() => {
    async function getBlockNumber() {
      const blockHeight = await alchemy.core.getBlockNumber();
      setBlockHeight(blockHeight);
    }
    async function getBlockDetails() {
      const blockDetails = await alchemy.core.getBlockWithTransactions(
        blockHeight
      );
      const timestampDate = new Date(1000 * blockDetails.timestamp);
      setBlockTimestamp(timestampDate.toUTCString());
      setTransactions(blockDetails.transactions);
      setNumTransactions(blockDetails.transactions.length);
      setGasUsed(blockDetails.gasUsed.toString());
    }
    async function getTransaction() {
      const transaction = await alchemy.core.getTransaction(
        selectedTransactionHash
      );
      setSelectedTransaction(transaction);
    }

    if (blockHeight === -1) {
      getBlockNumber();
      getBlockDetails();
    }

    if (
      selectedTransactionHash !== "" &&
      selectedTransaction.hash !== selectedTransactionHash
    ) {
      getTransaction();
    }
  });

  function onTransactionClick(evt) {
    setSelectedTransactionHash(evt.target.value);
  }

  return (
    <div>
      <div className="App">Block Height: {blockHeight}</div>
      <div className="App">Block Timestamp: {blockTimestamp}</div>
      <div className="App">{numTransactions} transactions in this block</div>
      <div className="App">gasUsed: {gasUsed}</div>
      <div>
        <br />
        <br />
        <br />
      </div>
      <div
        id="transactions"
        style={{
          float: "left",
          width: "auto",
          marginLeft: "50px",
          padding: "10px",
          border: "1px #000 solid",
        }}
      >
        <h2>Transactions</h2>
        <ul
          style={{
            listStyle: "none",
            height: "600px",
            overflowY: "scroll",
            marginLeft: "-40px",
          }}
        >
          {transactions.map((item) => (
            <li key={item.hash} style={{ marginBottom: "5px" }}>
              <button onClick={onTransactionClick} value={item.hash}>
                {item.hash}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div
        id="transactionDetail"
        style={{
          float: "left",
          width: "auto",
          marginLeft: "50px",
          padding: "10px",
        }}
      >
        <h2>Transaction Details</h2>
        <ul
          style={{
            listStyle: "none",
            marginLeft: "-40px",
          }}
        >
          <li>
            <strong>Hash:</strong> {selectedTransaction.hash}
          </li>
          <li>
            <strong>Block:</strong> {selectedTransaction.blockNumber}
          </li>
          <li>
            <strong>From:</strong> {selectedTransaction.from}
          </li>
          <li>
            <strong>To:</strong> {selectedTransaction.to}
          </li>
          <li>
            <strong>Value:</strong> {selectedTransaction.value.toString()} wei
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
