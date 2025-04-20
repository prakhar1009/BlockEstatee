const { ethers } = require("ethers");
require('dotenv').config();

async function main() {
  // Get private key from environment variables
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("Please set your PRIVATE_KEY in a .env file");
    process.exit(1);
  }

  // Arbitrum Sepolia RPC URL
  const rpcUrl = process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc";
  
  // Connect to the network
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const signer = wallet.connect(provider);

  console.log(`Deploying contracts with the account: ${wallet.address}`);
  console.log(`Account balance: ${ethers.utils.formatEther(await wallet.getBalance())} ETH`);

  // Deploy the RealEstateNFT contract
  const RealEstateNFT = await ethers.getContractFactory("RealEstateNFT", signer);
  
  // Set the constructor parameters
  const name = "BlockEstate Properties";
  const symbol = "BEP";
  const baseTokenURI = "https://api.blockestate.com/metadata/";
  
  console.log("Deploying RealEstateNFT...");
  const realEstateNFT = await RealEstateNFT.deploy(name, symbol, baseTokenURI);
  
  await realEstateNFT.deployed();
  
  console.log(`RealEstateNFT deployed to: ${realEstateNFT.address}`);
  console.log(`Transaction hash: ${realEstateNFT.deployTransaction.hash}`);
  
  // Wait for 5 confirmations
  console.log("Waiting for confirmations...");
  await realEstateNFT.deployTransaction.wait(5);
  console.log("Confirmed!");
  
  // Verify contract on Arbiscan (optional)
  console.log(`To verify the contract on Arbiscan:
  npx hardhat verify --network arbitrumSepolia ${realEstateNFT.address} "${name}" "${symbol}" "${baseTokenURI}"
  `);

  // Save contract address and ABI to a file
  const fs = require("fs");
  const contractInfo = {
    address: realEstateNFT.address,
    abi: JSON.parse(realEstateNFT.interface.format("json"))
  };
  
  fs.writeFileSync(
    "./contract-info.json",
    JSON.stringify(contractInfo, null, 2)
  );
  console.log("Contract information saved to contract-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
