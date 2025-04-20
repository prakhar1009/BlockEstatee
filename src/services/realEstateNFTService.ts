import { ethers } from 'ethers';
import axios from 'axios';
import { PropertyData, MintedProperty, RealEstateNFTService } from '../utils/realEstateNFTUtils';

/**
 * Service to interact with the RealEstateNFT contract in the BlockEstate application
 */
export class BlockEstateNFTService {
  private realEstateNFTService: RealEstateNFTService | null = null;
  private static instance: BlockEstateNFTService;
  private isInitialized: boolean = false;
  // Store contract info for potential reinitialization or reference
  private currentContractAddress: string = '';
  private currentContractABI: any = null;

  // Arbitrum Sepolia API key
  private arbiscanApiKey: string = '4YEN1UTUEZ8I8ZBWSZW5NH6ZDFYEUVKQ5U';
  
  private constructor() {}

  public static getInstance(): BlockEstateNFTService {
    if (!BlockEstateNFTService.instance) {
      BlockEstateNFTService.instance = new BlockEstateNFTService();
    }
    return BlockEstateNFTService.instance;
  }

  /**
   * Initialize the service with contract information
   * @param contractAddress Contract address
   * @param contractABI Contract ABI
   * @returns True if initialized successfully
   */
  public initialize(contractAddress: string, contractABI: any): boolean {
    try {
      // Store contract info for reference
      this.currentContractAddress = contractAddress;
      this.currentContractABI = contractABI;
      
      // Create RealEstateNFTService instance
      this.realEstateNFTService = new RealEstateNFTService(
        contractAddress,
        contractABI
      );
      
      this.isInitialized = true;
      console.log('BlockEstateNFTService initialized with contract:', contractAddress);
      return true;
    } catch (error) {
      console.error('Error initializing BlockEstateNFTService:', error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Check if the service is initialized
   * @returns True if initialized
   */
  public isServiceInitialized(): boolean {
    return this.isInitialized && this.realEstateNFTService !== null;
  }
  
  /**
   * Get the current contract address
   * @returns The current contract address
   */
  public getContractAddress(): string {
    return this.currentContractAddress;
  }
  
  /**
   * Get the current contract ABI
   * @returns The current contract ABI
   */
  public getContractABI(): any {
    return this.currentContractABI;
  }

  /**
   * Connect to the contract with a wallet
   * @param privateKey Private key or null to use browser wallet
   * @returns True if connected successfully
   */
  public async connectWallet(privateKey?: string): Promise<boolean> {
    if (!this.isServiceInitialized()) {
      console.error('Service not initialized');
      return false;
    }

    try {
      if (privateKey) {
        // Connect with private key
        return await this.realEstateNFTService!.connect(privateKey);
      } else {
        // Connect with browser wallet
        return await this.realEstateNFTService!.connectWithBrowserWallet();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    }
  }

  /**
   * Get the connected wallet address
   * @returns Connected address or null
   */
  public async getConnectedAddress(): Promise<string | null> {
    if (!this.isServiceInitialized()) {
      console.error('Service not initialized');
      return null;
    }

    return await this.realEstateNFTService!.getConnectedAddress();
  }

  /**
   * Mint a new property NFT
   * @param propertyData Property data
   * @param pinataApiKey Pinata API key for IPFS storage
   * @param pinataSecretKey Pinata secret key
   * @returns Object with transaction hash and token ID
   */
  public async mintProperty(
    propertyData: PropertyData,
    pinataApiKey: string,
    pinataSecretKey: string
  ): Promise<{ success: boolean; txHash: string; tokenId: number }> {
    if (!this.isServiceInitialized()) {
      console.error('Service not initialized');
      return { success: false, txHash: '', tokenId: 0 };
    }

    try {
      const connectedAddress = await this.getConnectedAddress();
      if (!connectedAddress) {
        throw new Error('No connected wallet');
      }

      // Mint property with metadata
      const result = await this.realEstateNFTService!.mintPropertyWithMetadata(
        propertyData,
        connectedAddress,
        pinataApiKey,
        pinataSecretKey
      );

      return {
        success: true,
        txHash: result.txHash,
        tokenId: result.tokenId
      };
    } catch (error) {
      console.error('Error minting property:', error);
      return { success: false, txHash: '', tokenId: 0 };
    }
  }

  /**
   * Get property details
   * @param tokenId Token ID
   * @returns Property details
   */
  public async getPropertyDetails(tokenId: number): Promise<MintedProperty | null> {
    if (!this.isServiceInitialized()) {
      console.error('Service not initialized');
      return null;
    }

    try {
      return await this.realEstateNFTService!.getPropertyDetails(tokenId);
    } catch (error) {
      console.error(`Error getting property details for token ID ${tokenId}:`, error);
      return null;
    }
  }

  /**
   * Get all properties owned by the connected address
   * @returns Array of properties
   */
  public async getMyProperties(): Promise<MintedProperty[]> {
    if (!this.isServiceInitialized()) {
      console.error('Service not initialized');
      return [];
    }

    try {
      const connectedAddress = await this.getConnectedAddress();
      if (!connectedAddress) {
        throw new Error('No connected wallet');
      }

      return await this.realEstateNFTService!.getPropertiesOfOwner(connectedAddress);
    } catch (error) {
      console.error('Error getting my properties:', error);
      return [];
    }
  }

  /**
   * Update property details
   * @param tokenId Token ID
   * @param name New name
   * @param description New description
   * @param location New location
   * @param price New price in ETH
   * @returns True if updated successfully
   */
  public async updateProperty(
    tokenId: number,
    name: string,
    description: string,
    location: string,
    price: number
  ): Promise<boolean> {
    if (!this.isServiceInitialized()) {
      console.error('Service not initialized');
      return false;
    }

    try {
      await this.realEstateNFTService!.updateProperty(
        tokenId,
        name,
        description,
        location,
        price
      );
      return true;
    } catch (error) {
      console.error(`Error updating property ${tokenId}:`, error);
      return false;
    }
  }

  /**
   * Get transaction details using Arbiscan API
   * @param txHash Transaction hash
   * @returns Transaction details
   */
  public async getTransactionDetails(txHash: string): Promise<any> {
    try {
      const response = await axios.get(`https://api-sepolia.arbiscan.io/api`, {
        params: {
          module: 'proxy',
          action: 'eth_getTransactionByHash',
          txhash: txHash,
          apikey: this.arbiscanApiKey
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction details from Arbiscan:', error);
      return null;
    }
  }

  /**
   * Get account balance using Arbiscan API
   * @param address Wallet address
   * @returns Balance in ETH
   */
  public async getAccountBalance(address: string): Promise<string> {
    try {
      const response = await axios.get(`https://api-sepolia.arbiscan.io/api`, {
        params: {
          module: 'account',
          action: 'balance',
          address: address,
          tag: 'latest',
          apikey: this.arbiscanApiKey
        }
      });
      
      if (response.data.status === '1') {
        // Convert wei to ether
        const balanceInWei = response.data.result;
        const balanceInEther = ethers.utils.formatEther(balanceInWei);
        return balanceInEther;
      } else {
        console.error('Arbiscan API error:', response.data.message);
        return '0';
      }
    } catch (error) {
      console.error('Error fetching account balance from Arbiscan:', error);
      return '0';
    }
  }
}

export default BlockEstateNFTService.getInstance();
