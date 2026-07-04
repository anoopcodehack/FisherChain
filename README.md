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
│   └── libraries/
│       └── BatchLib.sol
│
├── scripts/
│   ├── deploy.js
│   └── seedData.js
│
├── test/
│   └── FisherChain.test.js
│
├── hardhat.config.js
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConnectWallet.jsx
│   │   │   ├── CatchForm.jsx
│   │   │   ├── TransferForm.jsx
│   │   │   ├── BatchCard.jsx
│   │   │   ├── QRGenerator.jsx
│   │   │   └── BatchTimeline.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── FishermanDashboard.jsx
│   │   │   ├── DistributorDashboard.jsx
│   │   │   ├── RetailerDashboard.jsx
│   │   │   ├── ConsumerLookup.jsx
│   │   │   └── AdminPanel.jsx
│   │   │
│   │   ├── contexts/
│   │   │   └── Web3Context.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── contract.js
│   │   │   └── ipfs.js
│   │   │
│   │   ├── App.jsx
│   │   └── index.js
│   │
│   └── package.json
│
├── server/
│   ├── models/
│   │   └── User.js
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
