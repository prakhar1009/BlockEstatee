import React, { useState } from 'react';
import { toast } from 'react-toastify';
import RealEstateNFTManager from '../components/RealEstateNFTManager';
import { MintedProperty } from '../utils/realEstateNFTUtils';
import blockEstateNFTService from '../services/realEstateNFTService';

const RealEstateNFTPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<MintedProperty | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  // Handle property selection
  const handlePropertySelected = (property: MintedProperty) => {
    setSelectedProperty(property);
    // Clear transaction history when selecting a new property
    setTransactionHistory([]);
  };

  // Look up transaction details for the selected property
  const lookupTransactionDetails = async () => {
    if (!selectedProperty) return;
    
    setLoadingTx(true);
    try {
      // This is a placeholder - in a real implementation, you would get the
      // transaction hash from the property's creation event
      const txHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      const txDetails = await blockEstateNFTService.getTransactionDetails(txHash);
      
      if (txDetails) {
        setTransactionHistory([txDetails]);
        toast.success('Transaction details retrieved');
      } else {
        toast.warning('No transaction details found');
      }
    } catch (error) {
      console.error('Error looking up transaction:', error);
      toast.error('Error retrieving transaction details');
    } finally {
      setLoadingTx(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Real Estate NFTs</h1>
          <p className="text-gray-300 text-lg">
            Mint, manage, and view your real estate property NFTs on the Arbitrum Sepolia testnet
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main NFT Manager */}
          <div className="lg:col-span-2">
            <RealEstateNFTManager onPropertySelected={handlePropertySelected} />
          </div>
          
          {/* Property Details */}
          <div>
            <div className="bg-night-light rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6 text-white">Property Details</h2>
              
              {selectedProperty ? (
                <div>
                  <div className="mb-4 p-4 bg-night-medium rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-2">{selectedProperty.name}</h3>
                    <p className="text-gray-300 mb-4">{selectedProperty.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-gray-400 text-sm">Location</span>
                        <p className="text-white">{selectedProperty.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Price</span>
                        <p className="text-primary-400 font-semibold">{selectedProperty.price} ETH</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Property Type</span>
                        <p className="text-white">{selectedProperty.propertyType}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Size</span>
                        <p className="text-white">{selectedProperty.squareFootage} sq ft</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Year Built</span>
                        <p className="text-white">{selectedProperty.yearBuilt}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Token ID</span>
                        <p className="text-white">{selectedProperty.tokenId}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-gray-400 text-sm">Owner</span>
                      <p className="text-xs text-white break-all font-mono bg-night-dark p-2 rounded mt-1">
                        {selectedProperty.owner}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={lookupTransactionDetails}
                        disabled={loadingTx}
                        className="py-2 px-4 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
                      >
                        {loadingTx ? 'Loading...' : 'View Blockchain Data'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Transaction History */}
                  {transactionHistory.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Transaction History</h3>
                      <div className="bg-night-medium p-4 rounded-lg">
                        <pre className="text-xs text-gray-300 overflow-x-auto">
                          {JSON.stringify(transactionHistory[0], null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 bg-night-medium rounded-lg">
                  <p className="text-gray-300">Select a property to view details</p>
                </div>
              )}
            </div>
            
            <div className="bg-night-light rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-white">About Blockchain Integration</h2>
              <div className="text-gray-300 space-y-3">
                <p>
                  This page demonstrates integration with the Arbitrum Sepolia testnet for real estate NFTs.
                </p>
                <p>
                  The smart contract used is <code className="bg-night-medium px-1 py-0.5 rounded">RealEstateNFT</code>, 
                  which implements the ERC-721 standard for non-fungible tokens.
                </p>
                <p>
                  Properties are represented as NFTs with metadata including location, price, 
                  square footage, and other details.
                </p>
                <p className="text-yellow-400 text-sm">
                  Note: This is running on a testnet. No real assets are being traded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateNFTPage;
