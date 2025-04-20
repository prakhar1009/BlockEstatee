import React, { useState } from 'react';
import WalletConnectButton from '../components/WalletConnectButton';
import blockchainService from '../services/blockchainService';

const WalletConnectDemo: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [txDetails, setTxDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Arbiscan API key
  const arbiscanApiKey = '4YEN1UTUEZ8I8ZBWSZW5NH6ZDFYEUVKQ5U';

  const handleWalletConnect = (address: string, walletBalance: string) => {
    setWalletAddress(address);
    setBalance(walletBalance);
  };

  const handleTxLookup = async () => {
    if (!txHash) {
      setError('Please enter a transaction hash');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setTxDetails(null);
    
    try {
      const details = await blockchainService.getTransactionDetails(txHash);
      setTxDetails(details);
      
      if (!details || details.error) {
        setError('Transaction not found or invalid hash');
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      setError('Error fetching transaction details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Wallet Connection with WalletConnect</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Configuration</h2>
        <p><strong>Arbiscan API Key:</strong> {arbiscanApiKey}</p>
        <p className="text-sm text-gray-600 mt-2">
          This demo uses WalletConnect to connect your wallet and the Arbiscan API to fetch blockchain data.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="text-sm text-gray-600 mb-4">
            Connect your wallet using WalletConnect or your browser wallet (MetaMask).
          </p>
          
          <WalletConnectButton onConnect={handleWalletConnect} />
          
          {walletAddress && (
            <div className="mt-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Connected Address
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md overflow-x-auto">
                  <code className="text-sm break-all">{walletAddress}</code>
                </div>
              </div>
              
              {balance && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Balance
                  </label>
                  <div className="mt-1 p-2 bg-gray-100 rounded-md">
                    <span className="font-semibold">{balance} ETH</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Transaction Lookup</h2>
          <p className="text-sm text-gray-600 mb-4">
            Look up transaction details using the Arbiscan API
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
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
            disabled={isLoading || !txHash}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Look Up Transaction'}
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
        </p>
      </div>
    </div>
  );
};

export default WalletConnectDemo;
