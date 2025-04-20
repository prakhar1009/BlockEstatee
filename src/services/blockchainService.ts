import { ethers } from 'ethers';
import axios from 'axios';
import contractInfo from '../../contract-info.json';

// Define window.ethereum for TypeScript using Record<string, unknown>
declare global {
  interface Window {
    ethereum?: Record<string, unknown>;
  }
}

// BlockchainService for NFT minting with WalletConnect integration
class BlockchainService {
  private static instance: BlockchainService;
  private provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;
  private wallet: ethers.Wallet | null = null;
  private isConnected: boolean = false;
  // This variable will be used in future WalletConnect integration
  private walletConnectProvider: any = null;
  private contract: ethers.Contract | null = null;
  
  // Arbiscan API key
  private arbiscanApiKey: string = '4YEN1UTUEZ8I8ZBWSZW5NH6ZDFYEUVKQ5U';
  // This variable will be used in future WalletConnect integration
  private walletConnectProjectId: string = '';
  
  // Real contract address for RealEstateNFT
  private contractAddress: string = '0x94394298B24D07aa531e94279330a0Ee535B1399';
  // Arbitrum Sepolia RPC URL
  private rpcUrl: string = 'https://sepolia-rollup.arbitrum.io/rpc';
  
  private constructor() {}

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  // Set WalletConnect Project ID
  public setWalletConnectProjectId(projectId: string): void {
    this.walletConnectProjectId = projectId;
    console.log('WalletConnect Project ID has been set');
  }

  // Connect to wallet using WalletConnect
  public async connectWallet(privateKey?: string): Promise<boolean> {
    try {
      // If private key is provided, create wallet with Arbitrum Sepolia provider
      if (privateKey) {
        this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
        this.wallet = new ethers.Wallet(privateKey);
        this.signer = this.wallet.connect(this.provider);
        console.log('Connected with private key wallet to Arbitrum Sepolia');
      } else {
        // Try to connect to browser wallet (MetaMask, etc.)
        if (window.ethereum) {
          try {
            // Type assertion for ethereum as any to access methods safely
            const ethereum = window.ethereum as any;
            
            await ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.providers.Web3Provider(ethereum);
            this.signer = this.provider.getSigner();
            console.log('Connected with browser wallet');
            
            // Switch to Arbitrum Sepolia if needed
            try {
              // Arbitrum Sepolia Chain ID
              const arbitrumSepoliaChainId = "0x66eee";
              await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: arbitrumSepoliaChainId }],
              });
            } catch (switchError: any) {
              // This error code indicates that the chain has not been added to MetaMask
              if (switchError.code === 4902) {
                try {
                  await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: "0x66eee",
                        chainName: 'Arbitrum Sepolia Testnet',
                        nativeCurrency: {
                          name: 'ETH',
                          symbol: 'ETH',
                          decimals: 18,
                        },
                        rpcUrls: [this.rpcUrl],
                        blockExplorerUrls: ['https://sepolia-explorer.arbitrum.io/'],
                      },
                    ],
                  });
                } catch (addError) {
                  console.error('Error adding Arbitrum Sepolia chain to wallet:', addError);
                }
              }
              console.error('Error switching to Arbitrum Sepolia:', switchError);
            }
          } catch (walletError) {
            console.error('Error connecting to browser wallet:', walletError);
            return false;
          }
        } else {
          // Use wagmi/web3modal for WalletConnect
          console.log('No browser wallet found. Please use the WalletConnect modal to connect.');
          return false;
        }
      }

      // Check connection and initialize contract
      if (this.provider && this.signer) {
        const network = await this.provider.getNetwork();
        console.log(`Connected to ${network.name} (chainId: ${network.chainId})`);
        
        // Initialize the contract with ABI from contract-info.json
        this.contract = new ethers.Contract(
          this.contractAddress,
          contractInfo.abi,
          this.signer
        );
        
        // Get the connected address
        try {
          const address = await this.signer.getAddress();
          console.log(`Connected with address: ${address}`);
        } catch (error) {
          console.warn('Could not get signer address:', error);
        }
        
        this.isConnected = true;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      this.isConnected = false;
      return false;
    }
  }
  
  // Connect wallet with WalletConnect (to be used with Web3Modal)
  public async connectWithWalletConnect(provider: any): Promise<boolean> {
    try {
      if (!provider) {
        console.error('WalletConnect provider is not provided');
        return false;
      }
      
      this.walletConnectProvider = provider;
      const web3Provider = new ethers.providers.Web3Provider(provider);
      this.provider = web3Provider;
      this.signer = web3Provider.getSigner();
      
      // Check connection
      const network = await this.provider.getNetwork();
      console.log(`Connected to ${network.name} (chainId: ${network.chainId})`);
      
      // Initialize the contract with ABI from contract-info.json
      if (this.signer) {
        this.contract = new ethers.Contract(
          this.contractAddress,
          contractInfo.abi,
          this.signer
        );
      
        // Get the connected address
        const address = await this.signer.getAddress();
        console.log(`Connected with address: ${address}`);
        
        this.isConnected = true;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error connecting with WalletConnect:', error);
      this.isConnected = false;
      return false;
    }
  }

  // Connect to Arbitrum blockchain
  public async connectToBlockchain(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        const connected = await this.connectWallet();
        if (!connected) {
          console.error('Failed to connect wallet');
          return false;
        }
      }
      
      console.log('Connected to Arbitrum Sepolia blockchain');
      return true;
    } catch (error) {
      console.error('Error connecting to blockchain:', error);
      return false;
    }
  }

  // Get transaction details using Arbiscan API
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

  // Get account balance using Arbiscan API
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

  // Mint a property NFT using the real contract
  public async mintPropertyNFT(
    propertyData: {
      name: string;
      description: string;
      location: string;
      price: number;
      image: string;
      owner: string;
    }
  ): Promise<{
    success: boolean;
    txHash: string;
    tokenId: number;
  }> {
    try {
      console.log('Minting property NFT with data:', propertyData);
      
      if (!this.contract || !this.signer) {
        await this.connectToBlockchain();
        if (!this.contract || !this.signer) {
          throw new Error('Contract not initialized or signer not available');
        }
      }
      
      // Convert price from ETH to Wei
      const priceInWei = ethers.utils.parseEther(propertyData.price.toString());
      
      // Default values for additional parameters
      const squareFootage = 2000; // Default square footage
      const yearBuilt = new Date().getFullYear(); // Current year
      const propertyType = "Residential"; // Default type
      
      console.log('Sending mint transaction...');
      
      // Mint the property using the contract
      const tx = await this.contract.mintProperty(
        propertyData.owner, // Recipient address
        propertyData.name,
        propertyData.description,
        propertyData.location,
        priceInWei,
        squareFootage,
        yearBuilt,
        propertyType,
        propertyData.image // URI for the token metadata
      );
      
      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Find the PropertyMinted event to get the token ID
      const propertyMintedEvent = receipt.events?.find(
        (event: any) => event.event === 'PropertyMinted'
      );
      
      const tokenId = propertyMintedEvent?.args?.tokenId?.toNumber() || 0;
      
      return {
        success: true,
        txHash: tx.hash,
        tokenId: tokenId
      };
    } catch (error) {
      console.error('Error minting property NFT:', error);
      return {
        success: false,
        txHash: '',
        tokenId: 0
      };
    }
  }

  // Fractionalize an NFT using the real contract
  public async fractionalizeNFT(
    tokenId: number,
    totalShares: number,
    pricePerShare: number
  ): Promise<{
    success: boolean;
    txHash: string;
    contractAddress: string;
  }> {
    try {
      console.log(`Fractionalizing NFT ${tokenId} into ${totalShares} shares at ${pricePerShare} per share`);
      
      if (!this.contract || !this.signer) {
        await this.connectToBlockchain();
        if (!this.contract || !this.signer) {
          throw new Error('Contract not initialized or signer not available');
        }
      }
      
      // Currently the actual contract may not have fractionalization implemented
      // This is just a placeholder for when that functionality is added
      // In the meantime, it will simulate the response
      
      // Simulate blockchain transaction delay
      return new Promise((resolve) => {
        setTimeout(() => {
          // Generate random transaction hash and contract address
          const txHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
          const contractAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
          
          resolve({
            success: true,
            txHash,
            contractAddress
          });
        }, 3000);
      });
    } catch (error) {
      console.error('Error fractionalizing NFT:', error);
      return {
        success: false,
        txHash: '',
        contractAddress: ''
      };
    }
  }

  // Simulate purchasing shares in a property
  public async purchaseShares(
    contractAddress: string,
    shares: number,
    pricePerShare: number,
    buyer: string
  ): Promise<{
    success: boolean;
    txHash: string;
  }> {
    console.log(`Purchasing ${shares} shares at ${pricePerShare} each from contract ${contractAddress} by ${buyer}`);
    
    // Simulate blockchain transaction delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate random transaction hash
        const txHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        
        resolve({
          success: true,
          txHash
        });
      }, 2000);
    });
  }

  // Get property details from the blockchain
  public async getPropertyDetails(tokenId: number): Promise<any> {
    try {
      console.log(`Getting details for property token ${tokenId}`);
      
      if (!this.contract) {
        await this.connectToBlockchain();
        if (!this.contract) {
          throw new Error('Contract not initialized');
        }
      }
      
      // Call the contract to get property details
      const propertyDetails = await this.contract.getPropertyDetails(tokenId);
      
      // Format the response
      return {
        name: propertyDetails.name,
        description: propertyDetails.description,
        location: propertyDetails.location,
        price: ethers.utils.formatEther(propertyDetails.price),
        owner: propertyDetails.owner,
        squareFootage: propertyDetails.squareFootage.toNumber(),
        yearBuilt: propertyDetails.yearBuilt.toNumber(),
        propertyType: propertyDetails.propertyType,
        createdAt: new Date(propertyDetails.createdAt.toNumber() * 1000).toISOString(),
        isActive: propertyDetails.isActive,
        isFractionalized: propertyDetails.isFractionalized,
        fractionalizationContract: propertyDetails.fractionalizationContract
      };
    } catch (error) {
      console.error('Error getting property details:', error);
      return null;
    }
  }
}

export default BlockchainService.getInstance();