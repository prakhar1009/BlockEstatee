import blockEstateNFTService from '../services/realEstateNFTService';

/**
 * Initialize blockchain services with deployed contract information
 * This should be called early in your application startup
 */
export async function initializeBlockchain(): Promise<boolean> {
  try {
    // Load contract info from JSON file
    const response = await fetch('/contract-info.json');
    if (!response.ok) {
      console.error('Failed to load contract info');
      return false;
    }
    
    const contractInfo = await response.json();
    
    // Initialize the NFT service with contract info
    const initialized = blockEstateNFTService.initialize(
      contractInfo.address,
      contractInfo.abi
    );
    
    if (!initialized) {
      console.error('Failed to initialize BlockEstateNFTService');
      return false;
    }
    
    console.log('Blockchain services initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing blockchain services:', error);
    return false;
  }
}

/**
 * Connect wallet to blockchain services
 * @param privateKey Optional private key (if not using browser wallet)
 * @returns True if connected successfully
 */
export async function connectBlockchainWallet(privateKey?: string): Promise<boolean> {
  try {
    const connected = await blockEstateNFTService.connectWallet(privateKey);
    
    if (!connected) {
      console.error('Failed to connect wallet');
      return false;
    }
    
    const address = await blockEstateNFTService.getConnectedAddress();
    console.log('Connected with address:', address);
    
    return true;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return false;
  }
}
