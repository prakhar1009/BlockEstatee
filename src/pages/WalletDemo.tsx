import React, { useState, useEffect } from 'react';
import { initializeWallet, getAccountBalance, getTransactionDetails } from '../utils/walletUtils';
import blockchainService from '../services/blockchainService';

const WalletDemo: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [txHash, setTxHash] = useState<string>('');
  const [txDetails, setTxDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // NOWNodes API key - you would typically get this from environment variables
  // For this demo, we'll hardcode it
  const nowNodesApiKey = ''; // Add your NOWNodes API key here

  // Arbiscan API key is already configured in the blockchain service
  const arbiscanApiKey = '4YEN1UTUEZ8I8ZBWSZW5NH6ZDFYEUVKQ5U';

  useEffect(() => {
    // Display the configured Arbiscan API key
    console.log('Using Arbiscan API key:', arbiscanApiKey);
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Initialize wallet connection
      const result = await initializeWallet(nowNodesApiKey);
      
      if (result.success && result.address) {
        setWalletAddress(result.address);
        setIsConnected(true);
        setSuccessMessage('Wallet connected successfully!');
        
        // Get account balance
        const balanceResult = await getAccountBalance(result.address);
        setBalance(balanceResult);
      } else {
        setError(result.error || 'Failed to connect wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Error connecting wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTxLookup = async () => {
    if (!txHash) {
      setError('Please enter a transaction hash');
      return;
    }
    
    setError(null);
    setTxDetails(null);
    
    try {
      const details = await getTransactionDetails(txHash);
      setTxDetails(details);
      
      if (!details || details.error) {
        setError('Transaction not found or invalid hash');
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      setError('Error fetching transaction details');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Wallet Connection Demo</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Configuration</h2>
        <p><strong>Arbiscan API Key:</strong> {arbiscanApiKey}</p>
        <p><strong>NOWNodes API Key:</strong> {nowNodesApiKey ? 'Configured' : 'Not configured'}</p>
        {!nowNodesApiKey && (
          <p className="text-red-600 text-sm mt-2">
            Please add your NOWNodes API key in the code to enable wallet connection
          </p>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          
          {!isConnected ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting || !nowNodesApiKey}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Connected Address
                </label>
                <div className="p-3 bg-gray-100 rounded-md overflow-x-auto">
                  <code className="text-sm break-all">{walletAddress}</code>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance
                </label>
                <div className="p-3 bg-gray-100 rounded-md">
                  <span className="text-lg font-semibold">{balance} ETH</span>
                </div>
              </div>
              
              <div className="text-green-600 text-sm">
                ✓ Connected to Arbitrum network via NOWNodes
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Transaction Lookup</h2>
          <p className="text-sm text-gray-600 mb-4">
            Look up transaction details using Arbiscan API
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Hash
            </label>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Enter transaction hash"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <button
            onClick={handleTxLookup}
            disabled={!txHash}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
          >
            Look Up Transaction
          </button>
          
          {txDetails && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Transaction Details</h3>
              <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-xs">
                {JSON.stringify(txDetails, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>
          This demo uses the Arbiscan API key <code>{arbiscanApiKey}</code> to fetch blockchain data.
          Make sure to add your NOWNodes API key to enable wallet connection.
        </p>
      </div>
    </div>
  );
};

export default WalletDemo;
