import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import blockchainService from '../services/blockchainService';

// Define props interface
interface WalletConnectButtonProps {
  onConnect?: (address: string, balance: string) => void;
  className?: string;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ 
  onConnect,
  className = 'w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Arbiscan API key is already set in the blockchain service
  const arbiscanApiKey = '4YEN1UTUEZ8I8ZBWSZW5NH6ZDFYEUVKQ5U';

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum?.selectedAddress) {
        const address = window.ethereum.selectedAddress;
        setWalletAddress(address);
        setIsConnected(true);
        
        // Get balance if connected
        if (address) {
          try {
            const balance = await blockchainService.getAccountBalance(address);
            if (onConnect) {
              onConnect(address, balance);
            }
          } catch (error) {
            console.error('Error fetching balance:', error);
          }
        }
      }
    };
    
    checkConnection();
  }, [onConnect]);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // First try connecting with browser wallet (MetaMask)
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Create Web3Provider
          const provider = new ethers.providers.Web3Provider(window.ethereum as any);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          
          setWalletAddress(address);
          setIsConnected(true);
          
          // Get balance
          const balance = await blockchainService.getAccountBalance(address);
          
          if (onConnect) {
            onConnect(address, balance);
          }
        } catch (error) {
          console.error('Error connecting to browser wallet:', error);
          setError('Error connecting to browser wallet. Please try again.');
          
          // Try WalletConnect as fallback
          openWalletConnectModal();
        }
      } else {
        // No browser wallet, use WalletConnect
        openWalletConnectModal();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Error connecting wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const openWalletConnectModal = () => {
    // This would typically use Web3Modal to open WalletConnect
    // Since we can't install new dependencies, we'll show instructions
    setError('Please install the WalletConnect browser extension or use a compatible wallet app to scan a QR code.');
    
    // In a real implementation with Web3Modal:
    // const web3Modal = new Web3Modal({
    //   cacheProvider: true,
    //   providerOptions: {
    //     walletconnect: {
    //       package: WalletConnectProvider,
    //       options: {
    //         infuraId: "YOUR_INFURA_ID",
    //       },
    //     },
    //   },
    // });
    // const provider = await web3Modal.connect();
    // const ethersProvider = new ethers.providers.Web3Provider(provider);
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className={`${className} ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="flex flex-col space-y-2">
          <div className="px-3 py-2 bg-gray-100 rounded-md text-sm font-mono truncate">
            {walletAddress}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
