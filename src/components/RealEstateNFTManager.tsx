import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import blockEstateNFTService from '../services/realEstateNFTService';
import { MintedProperty, PropertyData } from '../utils/realEstateNFTUtils';
import { connectBlockchainWallet } from '../utils/initBlockchain';
import Loader from './ui/Loader';

interface RealEstateNFTManagerProps {
  onPropertySelected?: (property: MintedProperty) => void;
}

const RealEstateNFTManager: React.FC<RealEstateNFTManagerProps> = ({ onPropertySelected }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [properties, setProperties] = useState<MintedProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [mintingProperty, setMintingProperty] = useState(false);
  const [newProperty, setNewProperty] = useState<PropertyData>({
    name: '',
    description: '',
    location: '',
    price: 0.1,
    squareFootage: 1000,
    yearBuilt: 2023,
    propertyType: 'Residential',
    imageUrl: ''
  });

  // Connect wallet on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Check if wallet is already connected
  const checkConnection = async () => {
    try {
      const address = await blockEstateNFTService.getConnectedAddress();
      if (address) {
        setIsConnected(true);
        setWalletAddress(address);
        loadProperties();
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    setLoading(true);
    try {
      const connected = await connectBlockchainWallet();
      if (connected) {
        const address = await blockEstateNFTService.getConnectedAddress();
        setIsConnected(true);
        setWalletAddress(address);
        toast.success('Wallet connected successfully');
        loadProperties();
      } else {
        toast.error('Failed to connect wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Error connecting wallet');
    } finally {
      setLoading(false);
    }
  };

  // Load properties owned by the connected address
  const loadProperties = async () => {
    setLoading(true);
    try {
      const myProperties = await blockEstateNFTService.getMyProperties();
      setProperties(myProperties);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Error loading properties');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for new property form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'squareFootage' || name === 'yearBuilt' 
        ? parseFloat(value) 
        : value
    }));
  };

  // Handle property minting
  const handleMintProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.warning('Please connect your wallet first');
      return;
    }
    
    setMintingProperty(true);
    try {
      // For demo purposes, we're using placeholder values for Pinata keys
      // In a real app, these would come from environment variables
      const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY || 'YOUR_PINATA_API_KEY';
      const pinataSecretKey = import.meta.env.VITE_PINATA_SECRET_KEY || 'YOUR_PINATA_SECRET_KEY';
      
      const result = await blockEstateNFTService.mintProperty(
        newProperty,
        pinataApiKey,
        pinataSecretKey
      );
      
      if (result.success) {
        toast.success(`Property minted successfully with token ID: ${result.tokenId}`);
        // Reset form
        setNewProperty({
          name: '',
          description: '',
          location: '',
          price: 0.1,
          squareFootage: 1000,
          yearBuilt: 2023,
          propertyType: 'Residential',
          imageUrl: ''
        });
        // Reload properties
        loadProperties();
      } else {
        toast.error('Failed to mint property');
      }
    } catch (error) {
      console.error('Error minting property:', error);
      toast.error('Error minting property');
    } finally {
      setMintingProperty(false);
    }
  };

  // Select a property
  const handleSelectProperty = (property: MintedProperty) => {
    if (onPropertySelected) {
      onPropertySelected(property);
    }
  };

  return (
    <div className="bg-night-light rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Real Estate NFT Manager</h2>
      
      {/* Wallet Connection */}
      <div className="mb-8 p-4 bg-night-medium rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">Wallet Connection</h3>
        
        {!isConnected ? (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div>
            <div className="mb-2">
              <span className="text-gray-300 font-medium">Connected Address:</span>
              <div className="mt-1 p-2 bg-night-dark rounded-md overflow-x-auto">
                <code className="text-sm text-gray-200">{walletAddress}</code>
              </div>
            </div>
            
            <button
              onClick={loadProperties}
              disabled={loading}
              className="mt-2 py-2 px-4 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Properties'}
            </button>
          </div>
        )}
      </div>
      
      {/* Property List */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-white">Your Properties</h3>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader size="medium" color="primary" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center p-8 bg-night-medium rounded-lg">
            <p className="text-gray-300">No properties found. Mint your first property below!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((property) => (
              <div 
                key={property.tokenId} 
                className="bg-night-medium p-4 rounded-lg cursor-pointer hover:bg-night-dark transition-colors"
                onClick={() => handleSelectProperty(property)}
              >
                <h4 className="text-lg font-semibold text-white">{property.name}</h4>
                <p className="text-gray-300 text-sm mb-2">{property.location}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{property.propertyType}</span>
                  <span className="text-primary-400 font-medium">{property.price} ETH</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <span>Token ID: {property.tokenId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Mint New Property Form */}
      <div className="bg-night-medium p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">Mint New Property</h3>
        
        <form onSubmit={handleMintProperty}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Property Name</label>
              <input
                type="text"
                name="name"
                value={newProperty.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-night-dark border border-gray-700 rounded-md text-white"
                placeholder="Luxury Villa"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={newProperty.location}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-night-dark border border-gray-700 rounded-md text-white"
                placeholder="Miami, FL"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Price (ETH)</label>
              <input
                type="number"
                name="price"
                value={newProperty.price}
                onChange={handleInputChange}
                required
                min="0.001"
                step="0.001"
                className="w-full p-2 bg-night-dark border border-gray-700 rounded-md text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Property Type</label>
              <select
                name="propertyType"
                value={newProperty.propertyType}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-night-dark border border-gray-700 rounded-md text-white"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Land">Land</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Square Footage</label>
              <input
                type="number"
                name="squareFootage"
                value={newProperty.squareFootage}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full p-2 bg-night-dark border border-gray-700 rounded-md text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Year Built</label>
              <input
                type="number"
                name="yearBuilt"
                value={newProperty.yearBuilt}
                onChange={handleInputChange}
                required
                min="1800"
                max={new Date().getFullYear()}
                className="w-full p-2 bg-night-dark border border-gray-700 rounded-md text-white"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={newProperty.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full p-2 bg-night-dark border border-gray-700 rounded-md text-white"
              placeholder="Beautiful luxury villa with ocean view..."
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={newProperty.imageUrl}
              onChange={handleInputChange}
              required
              className="w-full p-2 bg-night-dark border border-gray-700 rounded-md text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <button
            type="submit"
            disabled={mintingProperty || !isConnected}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {mintingProperty ? 'Minting...' : 'Mint Property NFT'}
          </button>
          
          {!isConnected && (
            <p className="mt-2 text-yellow-400 text-sm text-center">
              Please connect your wallet to mint properties
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RealEstateNFTManager;
