import blockchainService from '../services/blockchainService';
import { ethers } from 'ethers';

/**
 * Initialize wallet connection with WalletConnect and Arbiscan
 * @param provider - WalletConnect provider from Web3Modal
 * @returns Promise<{success: boolean, address?: string, error?: string}>
 */
export const initializeWalletWithProvider = async (
  provider: any
): Promise<{
  success: boolean;
  address?: string;
  error?: string;
}> => {
  try {
    // Connect wallet with WalletConnect
    const connected = await blockchainService.connectWithWalletConnect(provider);
    
    if (!connected) {
      return {
        success: false,
        error: 'Failed to connect wallet with WalletConnect'
      };
    }
    
    // Get the wallet address from the provider
    let address = '';
    if (provider.selectedAddress) {
      address = provider.selectedAddress;
    } else if (window.ethereum?.selectedAddress) {
      address = window.ethereum.selectedAddress;
    }
    
    return {
      success: true,
      address
    };
  } catch (error) {
    console.error('Error initializing wallet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Initialize wallet connection with browser wallet (MetaMask)
 * @param privateKey - Optional private key for wallet connection
 * @returns Promise<{success: boolean, address?: string, error?: string}>
 */
export const initializeWallet = async (
  privateKey?: string
): Promise<{
  success: boolean;
  address?: string;
  error?: string;
}> => {
  try {
    // Connect wallet with browser or private key
    const connected = await blockchainService.connectWallet(privateKey);
    
    if (!connected) {
      return {
        success: false,
        error: 'Failed to connect wallet'
      };
    }
    
    // Get wallet address if connected with browser wallet
    let address = '';
    if (window.ethereum?.selectedAddress) {
      address = window.ethereum.selectedAddress;
    }
    
    return {
      success: true,
      address
    };
  } catch (error) {
    console.error('Error initializing wallet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get account balance using Arbiscan API
 * @param address - Wallet address to check balance for
 * @returns Promise<string> - Balance in ETH
 */
export const getAccountBalance = async (address: string): Promise<string> => {
  try {
    return await blockchainService.getAccountBalance(address);
  } catch (error) {
    console.error('Error getting account balance:', error);
    return '0';
  }
};

/**
 * Get transaction details using Arbiscan API
 * @param txHash - Transaction hash to get details for
 * @returns Promise<any> - Transaction details
 */
export const getTransactionDetails = async (txHash: string): Promise<any> => {
  try {
    return await blockchainService.getTransactionDetails(txHash);
  } catch (error) {
    console.error('Error getting transaction details:', error);
    return null;
  }
};

// Example usage:
// 
// import { initializeWallet, getAccountBalance } from '../utils/walletUtils';
//
// // Connect wallet
// const { success, address, error } = await initializeWallet('YOUR_NOWNODES_API_KEY');
// 
// if (success && address) {
//   // Get balance
//   const balance = await getAccountBalance(address);
//   console.log(`Balance: ${balance} ETH`);
// } else {
//   console.error('Failed to connect wallet:', error);
// }
