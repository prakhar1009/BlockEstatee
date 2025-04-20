import { ethers } from 'ethers';
import axios from 'axios';

// Interface for property data
export interface PropertyData {
  name: string;
  description: string;
  location: string;
  price: number; // in ETH
  squareFootage: number;
  yearBuilt: number;
  propertyType: string;
  imageUrl: string;
}

// Interface for minted property
export interface MintedProperty {
  tokenId: number;
  owner: string;
  name: string;
  description: string;
  location: string;
  price: string; // in ETH
  squareFootage: number;
  yearBuilt: number;
  propertyType: string;
  createdAt: Date;
  isActive: boolean;
  isFractionalized: boolean;
  fractionalizationContract: string;
}

/**
 * Class to interact with the RealEstateNFT contract
 */
export class RealEstateNFTService {
  private provider: ethers.providers.Provider;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract;
  private _contractAddress: string; // Using underscore to indicate it's a private backing field
  private isConnected: boolean = false;

  /**
   * Constructor
   * @param contractAddress The address of the deployed RealEstateNFT contract
   * @param contractABI The ABI of the RealEstateNFT contract
   * @param provider Optional provider, defaults to Arbitrum Sepolia
   */
  constructor(
    contractAddress: string,
    contractABI: any,
    provider?: ethers.providers.Provider
  ) {
    // Store contract address
    this._contractAddress = contractAddress;
    
    // Use provided provider or default to Arbitrum Sepolia
    this.provider = provider || new ethers.providers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc');
    
    // Initialize contract with provider (read-only)
    this.contract = new ethers.Contract(contractAddress, contractABI, this.provider);
  }
  
  /**
   * Get the contract address
   * @returns The contract address
   */
  public getContractAddress(): string {
    return this._contractAddress;
  }

  /**
   * Connect with a signer (wallet)
   * @param signerOrPrivateKey Signer or private key
   * @returns True if connected successfully
   */
  public async connect(signerOrPrivateKey: ethers.Signer | string): Promise<boolean> {
    try {
      if (typeof signerOrPrivateKey === 'string') {
        // Connect with private key
        this.signer = new ethers.Wallet(signerOrPrivateKey, this.provider);
      } else {
        // Connect with provided signer
        this.signer = signerOrPrivateKey;
      }
      
      // Connect contract with signer for write operations
      this.contract = this.contract.connect(this.signer);
      this.isConnected = true;
      
      return true;
    } catch (error) {
      console.error('Error connecting to RealEstateNFT contract:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Connect with browser wallet (MetaMask)
   * @returns True if connected successfully
   */
  public async connectWithBrowserWallet(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        console.error('No browser wallet found');
        return false;
      }
      
      // Fix the type issue with window.ethereum.request
      await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      
      return await this.connect(signer);
    } catch (error) {
      console.error('Error connecting with browser wallet:', error);
      return false;
    }
  }

  /**
   * Check if connected to the contract
   * @returns True if connected
   */
  public isContractConnected(): boolean {
    return this.isConnected && this.signer !== null;
  }

  /**
   * Get the connected wallet address
   * @returns The connected wallet address or null if not connected
   */
  public async getConnectedAddress(): Promise<string | null> {
    if (!this.isContractConnected() || !this.signer) {
      return null;
    }
    
    try {
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Error getting connected address:', error);
      return null;
    }
  }

  /**
   * Create metadata for a property NFT
   * @param property Property data
   * @returns Metadata object
   */
  private createMetadata(property: PropertyData): any {
    return {
      name: property.name,
      description: property.description,
      image: property.imageUrl,
      attributes: [
        { trait_type: 'Location', value: property.location },
        { trait_type: 'Price', value: property.price, display_type: 'number' },
        { trait_type: 'Square Footage', value: property.squareFootage, display_type: 'number' },
        { trait_type: 'Year Built', value: property.yearBuilt, display_type: 'number' },
        { trait_type: 'Property Type', value: property.propertyType }
      ]
    };
  }

  /**
   * Upload metadata to IPFS (using Pinata or similar service)
   * @param metadata Metadata object
   * @param pinataApiKey Pinata API key
   * @param pinataSecretKey Pinata secret key
   * @returns IPFS URI
   */
  public async uploadMetadataToIPFS(
    metadata: any,
    pinataApiKey: string,
    pinataSecretKey: string
  ): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretKey
          }
        }
      );
      
      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw error;
    }
  }

  /**
   * Mint a new property NFT
   * @param property Property data
   * @param recipient Address to receive the NFT
   * @param tokenURI Token URI (IPFS or HTTP)
   * @returns Object with transaction hash and token ID
   */
  public async mintPropertyNFT(
    property: PropertyData,
    recipient: string,
    tokenURI: string
  ): Promise<{ txHash: string; tokenId: number }> {
    if (!this.isContractConnected()) {
      throw new Error('Not connected to contract');
    }
    
    try {
      // Convert price from ETH to wei
      const priceInWei = ethers.utils.parseEther(property.price.toString());
      
      // Mint the property NFT
      const tx = await this.contract.mintProperty(
        recipient,
        property.name,
        property.description,
        property.location,
        priceInWei,
        property.squareFootage,
        property.yearBuilt,
        property.propertyType,
        tokenURI
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Find the PropertyMinted event to get the token ID
      const propertyMintedEvent = receipt.events.find((event: any) => event.event === 'PropertyMinted');
      const tokenId = propertyMintedEvent.args.tokenId.toNumber();
      
      return {
        txHash: tx.hash,
        tokenId
      };
    } catch (error) {
      console.error('Error minting property NFT:', error);
      throw error;
    }
  }

  /**
   * Mint a property NFT with metadata
   * @param property Property data
   * @param recipient Address to receive the NFT
   * @param pinataApiKey Pinata API key
   * @param pinataSecretKey Pinata secret key
   * @returns Object with transaction hash and token ID
   */
  public async mintPropertyWithMetadata(
    property: PropertyData,
    recipient: string,
    pinataApiKey: string,
    pinataSecretKey: string
  ): Promise<{ txHash: string; tokenId: number }> {
    // Create metadata
    const metadata = this.createMetadata(property);
    
    // Upload metadata to IPFS
    const tokenURI = await this.uploadMetadataToIPFS(metadata, pinataApiKey, pinataSecretKey);
    
    // Mint the property NFT
    return await this.mintPropertyNFT(property, recipient, tokenURI);
  }

  /**
   * Get property details
   * @param tokenId Token ID
   * @returns Property details
   */
  public async getPropertyDetails(tokenId: number): Promise<MintedProperty> {
    try {
      const property = await this.contract.getPropertyDetails(tokenId);
      
      return {
        tokenId,
        owner: property.owner,
        name: property.name,
        description: property.description,
        location: property.location,
        price: ethers.utils.formatEther(property.price),
        squareFootage: property.squareFootage.toNumber(),
        yearBuilt: property.yearBuilt.toNumber(),
        propertyType: property.propertyType,
        createdAt: new Date(property.createdAt.toNumber() * 1000),
        isActive: property.isActive,
        isFractionalized: property.isFractionalized,
        fractionalizationContract: property.fractionalizationContract
      };
    } catch (error) {
      console.error(`Error getting property details for token ID ${tokenId}:`, error);
      throw error;
    }
  }

  /**
   * Get all properties owned by an address
   * @param owner Owner address
   * @returns Array of properties
   */
  public async getPropertiesOfOwner(owner: string): Promise<MintedProperty[]> {
    try {
      // Get token IDs owned by the address
      const tokenIds = await this.contract.getPropertiesOfOwner(owner);
      
      // Get details for each property
      const properties: MintedProperty[] = [];
      for (const tokenId of tokenIds) {
        const property = await this.getPropertyDetails(tokenId.toNumber());
        properties.push(property);
      }
      
      return properties;
    } catch (error) {
      console.error(`Error getting properties of owner ${owner}:`, error);
      throw error;
    }
  }

  /**
   * Update property details
   * @param tokenId Token ID
   * @param name New name
   * @param description New description
   * @param location New location
   * @param price New price in ETH
   * @returns Transaction hash
   */
  public async updateProperty(
    tokenId: number,
    name: string,
    description: string,
    location: string,
    price: number
  ): Promise<string> {
    if (!this.isContractConnected()) {
      throw new Error('Not connected to contract');
    }
    
    try {
      // Convert price from ETH to wei
      const priceInWei = ethers.utils.parseEther(price.toString());
      
      // Update the property
      const tx = await this.contract.updateProperty(
        tokenId,
        name,
        description,
        location,
        priceInWei
      );
      
      // Wait for transaction to be mined (we need to wait but don't use the receipt)
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error(`Error updating property ${tokenId}:`, error);
      throw error;
    }
  }

  /**
   * Update property image
   * @param tokenId Token ID
   * @param imageURI New image URI
   * @returns Transaction hash
   */
  public async updatePropertyImage(tokenId: number, imageURI: string): Promise<string> {
    if (!this.isContractConnected()) {
      throw new Error('Not connected to contract');
    }
    
    try {
      const tx = await this.contract.updatePropertyImage(tokenId, imageURI);
      // Wait for transaction to be mined (we need to wait but don't use the receipt)
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error(`Error updating property image for token ID ${tokenId}:`, error);
      throw error;
    }
  }

  /**
   * Get total number of properties
   * @returns Total number of properties
   */
  public async getTotalProperties(): Promise<number> {
    try {
      const total = await this.contract.getTotalProperties();
      return total.toNumber();
    } catch (error) {
      console.error('Error getting total properties:', error);
      throw error;
    }
  }

  /**
   * Check if a property is verified
   * @param tokenId Token ID
   * @returns True if verified
   */
  public async isPropertyVerified(tokenId: number): Promise<boolean> {
    try {
      return await this.contract.isPropertyVerified(tokenId);
    } catch (error) {
      console.error(`Error checking if property ${tokenId} is verified:`, error);
      throw error;
    }
  }
}

// Helper function to load contract info from JSON file
export async function loadContractInfo(path: string): Promise<{ address: string; abi: any }> {
  try {
    const response = await fetch(path);
    return await response.json();
  } catch (error) {
    console.error('Error loading contract info:', error);
    throw error;
  }
}

// Example usage:
/*
// Load contract info
const contractInfo = await loadContractInfo('/contract-info.json');

// Initialize service
const realEstateNFTService = new RealEstateNFTService(
  contractInfo.address,
  contractInfo.abi
);

// Connect with browser wallet (MetaMask)
await realEstateNFTService.connectWithBrowserWallet();

// Mint a property
const property = {
  name: "Luxury Villa",
  description: "Beautiful villa with ocean view",
  location: "Miami, FL",
  price: 2.5, // 2.5 ETH
  squareFootage: 4500,
  yearBuilt: 2020,
  propertyType: "Residential",
  imageUrl: "https://ipfs.io/ipfs/QmXxxx..." // Replace with your image URL
};

const result = await realEstateNFTService.mintPropertyWithMetadata(
  property,
  "0xYourAddress",
  "YOUR_PINATA_API_KEY",
  "YOUR_PINATA_SECRET_KEY"
);

console.log(`Property minted with token ID: ${result.tokenId}`);
console.log(`Transaction hash: ${result.txHash}`);
*/
