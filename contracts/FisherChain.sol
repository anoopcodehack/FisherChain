// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FisherChain {

    enum Stage { Caught, Auctioned, InTransit, AtRetailer, SoldToConsumer }

    struct Batch {
        uint256 batchId;
        address fisherman;
        string species;
        uint256 quantity;       // in kg
        string catchLocation;   // GPS coords as string
        uint256 catchTimestamp;
        string ipfsHash;        // photo/certificate reference
        uint256 currentPrice;
        address currentOwner;
        Stage currentStage;
    }

    struct Transfer {
        address from;
        address to;
        uint256 price;
        uint256 timestamp;
        Stage stageAtTransfer;
    }

    address public admin;
    uint256 public batchCounter;

    mapping(uint256 => Batch) public batches;
    mapping(uint256 => Transfer[]) public batchHistory;
    mapping(address => bool) public registeredFishermen;

    event CatchRegistered(uint256 indexed batchId, address indexed fisherman, string species, uint256 timestamp);
    event BatchTransferred(uint256 indexed batchId, address indexed from, address indexed to, uint256 price, Stage newStage);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegisteredFisherman() {
        require(registeredFishermen[msg.sender], "Not a registered fisherman");
        _;
    }

    constructor() {
        admin = msg.sender;
        registeredFishermen[msg.sender] = true; // admin can also register as fisherman for testing
    }

    function registerFisherman(address _fisherman) external onlyAdmin {
        registeredFishermen[_fisherman] = true;
    }

    function registerCatch(
        string memory _species,
        uint256 _quantity,
        string memory _catchLocation,
        string memory _ipfsHash,
        uint256 _initialPrice
    ) external onlyRegisteredFisherman returns (uint256) {
        batchCounter++;
        uint256 newBatchId = batchCounter;

        batches[newBatchId] = Batch({
            batchId: newBatchId,
            fisherman: msg.sender,
            species: _species,
            quantity: _quantity,
            catchLocation: _catchLocation,
            catchTimestamp: block.timestamp,
            ipfsHash: _ipfsHash,
            currentPrice: _initialPrice,
            currentOwner: msg.sender,
            currentStage: Stage.Caught
        });

        emit CatchRegistered(newBatchId, msg.sender, _species, block.timestamp);
        return newBatchId;
    }

    function transferBatch(
        uint256 _batchId,
        address _to,
        uint256 _newPrice,
        Stage _newStage
    ) external {
        Batch storage batch = batches[_batchId];
        require(batch.batchId != 0, "Batch does not exist");
        require(batch.currentOwner == msg.sender, "Only current owner can transfer");
        require(uint8(_newStage) > uint8(batch.currentStage), "Stage must move forward");

        batchHistory[_batchId].push(Transfer({
            from: msg.sender,
            to: _to,
            price: _newPrice,
            timestamp: block.timestamp,
            stageAtTransfer: _newStage
        }));

        batch.currentOwner = _to;
        batch.currentPrice = _newPrice;
        batch.currentStage = _newStage;

        emit BatchTransferred(_batchId, msg.sender, _to, _newPrice, _newStage);
    }

    function getBatch(uint256 _batchId) external view returns (Batch memory) {
        require(batches[_batchId].batchId != 0, "Batch does not exist");
        return batches[_batchId];
    }

    function getBatchHistory(uint256 _batchId) external view returns (Transfer[] memory) {
        return batchHistory[_batchId];
    }

    function getTotalBatches() external view returns (uint256) {
        return batchCounter;
    }
}