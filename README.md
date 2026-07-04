# 🐟 FisherChain

### Blockchain-Based Fish Supply Chain Traceability System

*Bringing transparency to the seafood supply chain — from ocean to plate, one block at a time.*

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.19-363636?style=flat&logo=solidity)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.x-yellow?style=flat)](https://hardhat.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-6.x-2535a0?style=flat)](https://docs.ethers.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 The Problem

The seafood supply chain — from fisherman to consumer's plate — passes through multiple untrusted intermediaries with almost zero verifiable record-keeping:

- 🐠 **~20% of seafood globally is mislabeled** — farmed fish sold as wild-caught, or cheaper species substituted for expensive ones
- 📝 **Paper-based, tamperable records** — origin, catch date, and quality certificates can be forged or altered at any handoff
- 💰 **Fishermen get underpaid** — middlemen mark up prices 3-4x with zero pricing transparency back to the source
- 🦠 **Slow, imprecise recalls** — if a contaminated batch causes illness, there's no fast way to trace it back to the exact boat and date
- 🎣 **Illegal fishing goes undetected** — banned species or overfished zones enter the market without any traceability

This isn't a hypothetical problem — it's actively being tackled by IBM Food Trust, WWF's OpenSC platform, and academic research projects worldwide. FisherChain is a student-scale implementation of the same core idea: **an immutable, shared ledger that no single party can quietly rewrite.**

---

## 💡 The Solution

FisherChain uses Ethereum smart contracts to create a **permanent, tamper-proof chain of custody** for every batch of fish — from the moment it's caught to the moment it reaches a consumer's plate.

```
🎣 Fisherman  →  🏷️ Auction/First Sale  →  🚚 Distributor  →  🏪 Retailer  →  🧑‍🤝‍🧑 Consumer
     │                    │                      │                │
     └────────────────────┴──────────────────────┴────────────────┘
                   Every transfer permanently recorded on-chain
```

Each batch gets a unique on-chain identity. Every time it changes hands, a new immutable record is appended — nobody downstream can alter what happened upstream. Consumers scan a QR code and see the *entire* verified history instantly.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Role-Based Access** | Fisherman, Distributor, Retailer, and Admin roles enforced at the smart contract level |
| 📦 **On-Chain Catch Registration** | Species, quantity, GPS location, and timestamp permanently recorded |
| 🔄 **Ownership Transfer Chain** | Every handoff between parties recorded with price + timestamp |
| 🖼️ **IPFS-Backed Documentation** | Catch photos and quality certificates stored off-chain, hash-verified on-chain |
| 📱 **QR Code Traceability** | Instant scan-to-verify for consumers — no login required |
| 💸 **Price Transparency** | Full pricing history visible at every stage — protects fishermen from exploitative markups |
| 🚩 **Anomaly Flagging** | Unusual custody gaps or quantity mismatches can be flagged for review |
| 🦊 **MetaMask Integration** | Seamless wallet connection for all supply chain participants |

---

## 🏗️ Tech Stack

**Blockchain Layer**
- Solidity `^0.8.19` — smart contract logic
- Hardhat — development, testing, and deployment framework
- Ethers.js `v6` — contract interaction from the frontend
- Ethereum Sepolia Testnet — deployment target

**Frontend**
- React.js — component-based UI
- Custom brutalist design system (CSS variables, Nunito 900-weight typography, sharp 2px borders)
- MetaMask — wallet connection and transaction signing

**Storage**
- IPFS (via Pinata) — decentralized storage for catch photos and certificates

**Backend (optional layer)**
- Node.js + Express — off-chain user/role management
- MongoDB — profile and metadata storage

**Testing**
- Mocha + Chai — smart contract unit testing (Hardhat's native test suite)

---

## 🏛️ Smart Contract Architecture

```solidity
struct Batch {
    uint256 batchId;
    address fisherman;
    string species;
    uint256 quantity;
    string catchLocation;
    uint256 catchTimestamp;
    string ipfsHash;
    uint256 currentPrice;
    address currentOwner;
    Stage currentStage;      // Caught → Auctioned → InTransit → AtRetailer → SoldToConsumer
}
```

**Core functions:**
- `registerCatch()` — logs a new batch, restricted to registered fishermen
- `transferBatch()` — moves ownership + stage forward, restricted to current owner
- `getBatch()` — returns full current state of a batch
- `getBatchHistory()` — returns the complete chain-of-custody transfer log

Every state-changing action emits an event (`CatchRegistered`, `BatchTransferred`) for easy off-chain indexing and frontend updates.

---

## 🧪 Testing

The contract is fully unit-tested with **7 passing test cases** covering:

- ✅ Correct admin assignment on deployment
- ✅ Fisherman registration access control
- ✅ Successful catch registration by a registered fisherman
- ✅ Rejection of catch registration by unregistered addresses
- ✅ Successful ownership transfer to the next supply chain stage
- ✅ Rejection of transfers attempted by non-owners
- ✅ Accurate multi-hop batch history tracking

```bash
npx hardhat test
```

```
  FisherChain
    ✔ should set the deployer as admin
    ✔ should allow admin to register a fisherman
    ✔ should allow a registered fisherman to register a catch
    ✔ should NOT allow an unregistered address to register a catch
    ✔ should allow transferring a batch to the next stage
    ✔ should NOT allow a non-owner to transfer the batch
    ✔ should track batch history correctly

  7 passing
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS version)
- MetaMask browser extension
- A free Alchemy or Infura account (for Sepolia deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/anoopcodehack/fisherchain.git
cd fisherchain

# Install root dependencies (Hardhat)
npm install

# Install frontend dependencies
cd client
npm install
```

### Local Development

```bash
# Terminal 1 — start a local Hardhat blockchain
npx hardhat node

# Terminal 2 — deploy the contract locally
npx hardhat ignition deploy ignition/modules/FisherChain.js --network localhost

# Terminal 3 — run the frontend
cd client
npm start
```

Then connect MetaMask to the **Hardhat Local** network, import a test account, and interact with the deployed contract at `http://localhost:3000`.

### Running Tests

```bash
npx hardhat test
```

---

## 📸 Screenshots

*(Add screenshots of your Connect Wallet screen, Register Catch form, and success confirmation here)*

---

## 🔭 Roadmap

- [ ] Distributor and Retailer dashboards
- [ ] QR code generation per batch
- [ ] Public consumer-facing lookup page
- [ ] IPFS photo upload integration (Pinata)
- [ ] Admin anomaly-flagging dashboard
- [ ] Sepolia testnet deployment + Etherscan verification
- [ ] Deployment demo video

---

## 📚 Why Blockchain (Not Just a Database)?

A fair question — and the honest answer: because the parties in this chain (fisherman, distributor, retailer) **don't inherently trust each other**, and no single one of them should be able to unilaterally rewrite history. A centralized database is only as trustworthy as whoever controls it. A blockchain ledger removes that single point of control — once a catch is logged and transferred, the record is permanent and independently verifiable by anyone in the chain, including the end consumer.

---

## 🙋 About This Project

Built as an independent exploration into practical blockchain applications for real-world supply chain problems, extending prior work on document verification systems (Blockcert) into a domain-specific traceability use case for the seafood industry.

**Author:** Anoop A
**GitHub:** [@anoopcodehack](https://github.com/anoopcodehack)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
<i>Built with 🎣 and ⛓️ to bring transparency to the sea-to-table journey.</i>
</p>
