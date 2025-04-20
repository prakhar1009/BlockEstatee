const { ethers } = require("ethers");
require('dotenv').config();

async function main() {
  // Get private key from environment variables
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("Please set your PRIVATE_KEY in a .env file");
    process.exit(1);
  }

  // Get contract address from environment variables or command line
  const contractAddress = process.env.CONTRACT_ADDRESS || process.argv[2];
  if (!contractAddress) {
    console.error("Please set your CONTRACT_ADDRESS in a .env file or provide it as a command line argument");
    process.exit(1);
  }

  // Arbitrum Sepolia RPC URL
  const rpcUrl = process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc";
  
  // Connect to the network
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const signer = wallet.connect(provider);

  console.log(`Connected to Arbitrum Sepolia with account: ${wallet.address}`);
  console.log(`Account balance: ${ethers.utils.formatEther(await wallet.getBalance())} ETH`);

  // Load the contract ABI
  const contractInfo = require('../contract-info.json');
  const realEstateNFT = new ethers.Contract(contractAddress, contractInfo.abi, signer);

  // Property details for minting
  const propertyDetails = {
    recipient: wallet.address, // The address that will receive the NFT
    name: "Luxury Villa in Miami",
    description: "Beautiful 5-bedroom luxury villa with ocean view and private pool",
    location: "Miami, Florida",
    price: ethers.utils.parseEther("2.5"), // 2.5 ETH
    squareFootage: 4500,
    yearBuilt: 2020,
    propertyType: "Residential",
    tokenURI: "https://ipfs.io/ipfs/QmXxxx..." // Replace with your actual IPFS URI for metadata
  };

  console.log("Minting property NFT with the following details:");
  console.log(JSON.stringify(propertyDetails, null, 2));

  // Mint the property NFT
  console.log("Minting...");
  const tx = await realEstateNFT.mintProperty(
    propertyDetails.recipient,
    propertyDetails.name,
    propertyDetails.description,
    propertyDetails.location,
    propertyDetails.price,
    propertyDetails.squareFootage,
    propertyDetails.yearBuilt,
    propertyDetails.propertyType,
    propertyDetails.tokenURI
  );

  console.log(`Transaction hash: ${tx.hash}`);
  console.log("Waiting for confirmation...");
  
  // Wait for the transaction to be mined
  const receipt = await tx.wait(2);
  
  // Find the PropertyMinted event
  const propertyMintedEvent = receipt.events.find(event => event.event === 'PropertyMinted');
  const tokenId = propertyMintedEvent.args.tokenId.toString();
  
  console.log(`Success! Property NFT minted with token ID: ${tokenId}`);
  console.log(`Owner: ${await realEstateNFT.ownerOf(tokenId)}`);
  
  // Get and display the property details
  const property = await realEstateNFT.getPropertyDetails(tokenId);
  console.log("Property details:");
  console.log({
    name: property.name,
    description: property.description,
    location: property.location,
    price: ethers.utils.formatEther(property.price) + " ETH",
    owner: property.owner,
    squareFootage: property.squareFootage.toString(),
    yearBuilt: property.yearBuilt.toString(),
    propertyType: property.propertyType,
    createdAt: new Date(property.createdAt.toNumber() * 1000).toISOString(),
    isActive: property.isActive,
    isFractionalized: property.isFractionalized
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
