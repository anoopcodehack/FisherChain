# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
📁 Project Structure
fisherchain/
├── contracts/
│   ├── FisherChain.sol
│   ├── AccessControl.sol
│   └── libraries/BatchLib.sol
│
├── scripts/
│   ├── deploy.js              // Hardhat deployment script
│   └── seedData.js            // test data for demo
│
├── test/
│   └── FisherChain.test.js    // Hardhat/Chai contract tests
│
├── hardhat.config.js
│
├── client/                     // React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConnectWallet.jsx
│   │   │   ├── CatchForm.jsx          // fisherman logs catch
│   │   │   ├── TransferForm.jsx       // distributor/retailer transfer
│   │   │   ├── BatchCard.jsx          // display single batch
│   │   │   ├── QRGenerator.jsx        // generates QR per batch
│   │   │   └── BatchTimeline.jsx      // visual chain-of-custody
│   │   │
│   │   ├── pages/
│   │   │   ├── FishermanDashboard.jsx
│   │   │   ├── DistributorDashboard.jsx
│   │   │   ├── RetailerDashboard.jsx
│   │   │   ├── ConsumerLookup.jsx     // public QR scan result page
│   │   │   └── AdminPanel.jsx
│   │   │
│   │   ├── contexts/
│   │   │   └── Web3Context.jsx        // ethers.js provider/contract setup
│   │   │
│   │   ├── utils/
│   │   │   ├── contract.js            // contract ABI + address config
│   │   │   └── ipfs.js                // Pinata/web3.storage upload helper
│   │   │
│   │   ├── App.jsx
│   │   └── index.js
│   │
│   └── package.json
│
├── server/                     // Node/Express backend (optional layer)
│   ├── models/
│   │   └── User.js             // off-chain role/profile data (MongoDB)
│   ├── routes/
│   │   └── auth.js
│   ├── controllers/
│   │   └── authController.js
│   ├── server.js
│   └── package.json
│
├── docs/
│   └── architecture-diagram.png
│
└── README.md
```