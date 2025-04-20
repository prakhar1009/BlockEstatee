import React, { useState, useEffect } from 'react';
import blockchainService from '../services/blockchainService';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // NOWNodes API key - this would typically come from environment variables
  const nowNodesApiKey = '';
  
  // Arbiscan API key is already set in the blockchain service
  
  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum?.selectedAddress) {
        setWalletAddress(window.ethereum.selectedAddress);
        setIsConnected(true);
        
        if (onConnect) {
          onConnect(window.ethereum.selectedAddress);
        }
      }
    };
    
    checkConnection();
  }, [onConnect]);
  
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Connect using NOWNodes
      const connected = await blockchainService.connectWithNOWNodes(nowNodesApiKey);
      
      if (connected) {
        // Get the wallet address
        const provider = new (window as any).ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        setWalletAddress(address);
        setIsConnected(true);
        
        // Get account balance using Arbiscan API
        const balanceResult = await blockchainService.getAccountBalance(address);
        setBalance(balanceResult);
        
        if (onConnect) {
          onConnect(address);
        }
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Error connecting wallet. Please make sure you have MetaMask installed and try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div>
          <div className="mb-2">
            <span className="font-medium">Connected Address:</span>
            <div className="mt-1 p-2 bg-gray-100 rounded-md overflow-x-auto">
              <code className="text-sm">{walletAddress}</code>
            </div>
          </div>
          
          {balance && (
            <div className="mb-2">
              <span className="font-medium">Balance:</span>
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                <span className="text-lg font-semibold">{balance} ETH</span>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-sm text-green-600">
            ✓ Connected to Arbitrum network via NOWNodes
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        Using Arbiscan API for blockchain data
      </div>
    </div>
  );
};

export default WalletConnect;
