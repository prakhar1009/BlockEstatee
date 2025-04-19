import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, 
  Upload, 
  Sparkles, 
  Building, 
  X, 
  Check, 
  Loader, 
  ArrowRight,
  Calendar,
  Paintbrush,
  Palette,
  Smile,
  AlertCircle,
  RefreshCw,
  Award,
  Landmark,
  Map,
  DollarSign,
  FileText,
  Home
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import aiService from '../services/aiService';
import blockchainService from '../services/blockchainService';
import Confetti from 'react-confetti';
import { useNotifications } from '../contexts/NotificationsContext';

const NFTGeneratorPage = () => {
  const [step, setStep] = useState(1);
  const [propertyImage, setPropertyImage] = useState<string | null>(null);
  const [nftImage, setNftImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintDetails, setMintDetails] = useState<any>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Form data with additional property details
  const [propertyDetails, setPropertyDetails] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',
    propertyType: 'Residential',
  });

  // AI Generation options
  const [style, setStyle] = useState('Default');
  const [era, setEra] = useState('Not specified');
  const [mood, setMood] = useState('Nostalgic');

  // Example properties
  const exampleProperties = [
    "Luxury beachfront villa with private pool and panoramic ocean views. Features 5 bedrooms, 6 bathrooms, and a large terrace.",
    "Modern downtown loft apartment with floor-to-ceiling windows, industrial design elements, and high-end finishes.",
    "Historic brownstone townhouse with original architectural details, renovated kitchen, and private garden.",
    "Commercial office building in prime business district with 20 units, lobby atrium, and underground parking.",
    "Mountain cabin retreat surrounded by pine trees, featuring stone fireplace and wrap-around deck."
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPropertyImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 1,
  });

  // Build a comprehensive property description for AI
  const buildCompletePropertyDescription = () => {
    let details = `${propertyDetails.name}: ${propertyDetails.description} Located in ${propertyDetails.location}. Value: $${propertyDetails.price}.`;
    
    // Add additional property specifications if available
    const specs = [];
    if (propertyDetails.bedrooms) specs.push(`${propertyDetails.bedrooms} bedrooms`);
    if (propertyDetails.bathrooms) specs.push(`${propertyDetails.bathrooms} bathrooms`);
    if (propertyDetails.squareFeet) specs.push(`${propertyDetails.squareFeet} square feet`);
    if (propertyDetails.yearBuilt) specs.push(`built in ${propertyDetails.yearBuilt}`);
    if (propertyDetails.propertyType) specs.push(`${propertyDetails.propertyType} property`);
    
    if (specs.length > 0) {
      details += ` Specifications: ${specs.join(', ')}.`;
    }
    
    return details;
  };

  const handleGenerateNFT = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      const combinedDescription = buildCompletePropertyDescription();
      console.log('Generating NFT with complete description:', combinedDescription);
      
      const imageUrl = await aiService.generateNFTArt(combinedDescription, style, era, mood);
      
      setNftImage(imageUrl);
      
      addNotification(
        'NFT Generated Successfully',
        'Your property has been transformed into a digital artwork.',
        'success'
      );
      
      setStep(3);
    } catch (error: any) {
      console.error('Error generating NFT:', error);
      setGenerationError(error.message || 'Failed to generate NFT image. Please try again.');
      
      addNotification(
        'Generation Failed',
        'There was an error generating your NFT. Please try again.',
        'error'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetryGeneration = () => {
    setGenerationError(null);
    handleGenerateNFT();
  };

  const handleMintNFT = async () => {
    setIsMinting(true);
    
    try {
      // Connect to blockchain
      await blockchainService.connectToBlockchain();
      
      // Mint the property NFT with enhanced property details
      const mintResponse = await blockchainService.mintPropertyNFT({
        name: propertyDetails.name,
        description: propertyDetails.description,
        location: propertyDetails.location,
        price: Number(propertyDetails.price),
        image: nftImage || '',
        bedrooms: propertyDetails.bedrooms,
        bathrooms: propertyDetails.bathrooms,
        squareFeet: propertyDetails.squareFeet,
        yearBuilt: propertyDetails.yearBuilt,
        propertyType: propertyDetails.propertyType,
        owner: '0x1234567890123456789012345678901234567890' // This would be the user's actual wallet address in production
      });
      
      // Fractionalize the NFT into shares
      const fractionResponse = await blockchainService.fractionalizeNFT(
        mintResponse.tokenId,
        10000, // Total shares
        Number(propertyDetails.price) / 10000 // Price per share
      );
      
      setMintDetails({
        ...mintResponse,
        ...fractionResponse,
        propertyDetails,
        nftImage
      });
      
      setMintSuccess(true);
      
      addNotification(
        'NFT Minted Successfully',
        'Your property NFT has been minted and fractionalized on the blockchain.',
        'success'
      );
      
      setStep(4);
    } catch (error) {
      console.error('Error minting NFT:', error);
      
      addNotification(
        'Minting Failed',
        'There was an error minting your NFT. Please try again.',
        'error'
      );
    } finally {
      setIsMinting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setPropertyImage(null);
    setNftImage(null);
    setPropertyDetails({
      name: '',
      description: '',
      location: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      squareFeet: '',
      yearBuilt: '',
      propertyType: 'Residential',
    });
    setStyle('Default');
    setEra('Not specified');
    setMood('Nostalgic');
    setMintSuccess(false);
    setMintDetails(null);
    setGenerationError(null);
  };

  const useExampleProperty = (index: number) => {
    const example = exampleProperties[index];
    setPropertyDetails({
      ...propertyDetails,
      description: example
    });
    
    // Extract property details from example descriptions
    const bedroomMatch = example.match(/(\d+)\s*bedroom/i);
    const bathroomMatch = example.match(/(\d+)\s*bathroom/i);
    
    if (bedroomMatch) {
      setPropertyDetails(prev => ({...prev, bedrooms: bedroomMatch[1]}));
    }
    
    if (bathroomMatch) {
      setPropertyDetails(prev => ({...prev, bathrooms: bathroomMatch[1]}));
    }
    
    // Set property type based on keywords
    if (example.toLowerCase().includes('villa') || example.toLowerCase().includes('mansion')) {
      setPropertyDetails(prev => ({...prev, propertyType: 'Luxury'}));
    } else if (example.toLowerCase().includes('apartment') || example.toLowerCase().includes('loft')) {
      setPropertyDetails(prev => ({...prev, propertyType: 'Apartment'}));
    } else if (example.toLowerCase().includes('commercial') || example.toLowerCase().includes('office')) {
      setPropertyDetails(prev => ({...prev, propertyType: 'Commercial'}));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-dark to-primary-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="sunset" className="mb-4">NFT Generator</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Transform Properties into Digital Assets
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Create, mint, and fractionalize your property as an NFT on the blockchain
            </p>
          </motion.div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((currentStep) => (
              <React.Fragment key={currentStep}>
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= currentStep 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {step > currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{currentStep}</span>
                  )}
                </div>
                {currentStep < 4 && (
                  <div 
                    className={`w-16 h-1 ${
                      step > currentStep ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-gray-700'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-3xl mx-auto" variant="dark">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-full mr-4">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Property Information</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="flex items-center text-sm font-medium text-white/80 mb-1">
                          <Home className="h-4 w-4 mr-2 text-secondary-400" />
                          Property Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Luxury Villa in Miami"
                          value={propertyDetails.name}
                          onChange={(e) => setPropertyDetails({...propertyDetails, name: e.target.value})}
                        />
                      </div>

                      <div>
                        <label htmlFor="location" className="flex items-center text-sm font-medium text-white/80 mb-1">
                          <Map className="h-4 w-4 mr-2 text-secondary-400" />
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Miami, FL"
                          value={propertyDetails.location}
                          onChange={(e) => setPropertyDetails({...propertyDetails, location: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="flex items-center text-sm font-medium text-white/80 mb-1">
                          <DollarSign className="h-4 w-4 mr-2 text-secondary-400" />
                          Property Value (USD)
                        </label>
                        <input
                          type="number"
                          id="price"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="1000000"
                          value={propertyDetails.price}
                          onChange={(e) => setPropertyDetails({...propertyDetails, price: e.target.value})}
                        />
                      </div>

                      <div>
                        <label htmlFor="propertyType" className="flex items-center text-sm font-medium text-white/80 mb-1">
                          <Landmark className="h-4 w-4 mr-2 text-secondary-400" />
                          Property Type
                        </label>
                        <select
                          id="propertyType"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={propertyDetails.propertyType}
                          onChange={(e) => setPropertyDetails({...propertyDetails, propertyType: e.target.value})}
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Industrial">Industrial</option>
                          <option value="Land">Land</option>
                          <option value="Luxury">Luxury</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Condo">Condo</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label htmlFor="bedrooms" className="block text-sm font-medium text-white/80 mb-1">
                          Bedrooms
                        </label>
                        <input
                          type="number"
                          id="bedrooms"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="3"
                          value={propertyDetails.bedrooms}
                          onChange={(e) => setPropertyDetails({...propertyDetails, bedrooms: e.target.value})}
                        />
                      </div>

                      <div>
                        <label htmlFor="bathrooms" className="block text-sm font-medium text-white/80 mb-1">
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          id="bathrooms"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="2"
                          value={propertyDetails.bathrooms}
                          onChange={(e) => setPropertyDetails({...propertyDetails, bathrooms: e.target.value})}
                        />
                      </div>

                      <div>
                        <label htmlFor="squareFeet" className="block text-sm font-medium text-white/80 mb-1">
                          Square Feet
                        </label>
                        <input
                          type="number"
                          id="squareFeet"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="1500"
                          value={propertyDetails.squareFeet}
                          onChange={(e) => setPropertyDetails({...propertyDetails, squareFeet: e.target.value})}
                        />
                      </div>

                      <div>
                        <label htmlFor="yearBuilt" className="block text-sm font-medium text-white/80 mb-1">
                          Year Built
                        </label>
                        <input
                          type="number"
                          id="yearBuilt"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="2020"
                          value={propertyDetails.yearBuilt}
                          onChange={(e) => setPropertyDetails({...propertyDetails, yearBuilt: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <label htmlFor="description" className="flex items-center text-sm font-medium text-white/80 mb-1">
                          <FileText className="h-4 w-4 mr-2 text-secondary-400" />
                          Property Description
                        </label>
                        <div className="relative">
                          <select
                            className="text-xs bg-gray-800 border border-gray-700 rounded text-white/80 py-1 px-2"
                            onChange={(e) => useExampleProperty(parseInt(e.target.value))}
                          >
                            <option value="">Choose an example...</option>
                            {exampleProperties.map((_, index) => (
                              <option key={index} value={index}>Example {index + 1}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <textarea
                        id="description"
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Be detailed about property features, style, views, amenities, and special characteristics..."
                        value={propertyDetails.description}
                        onChange={(e) => setPropertyDetails({...propertyDetails, description: e.target.value})}
                      />
                      <p className="mt-1 text-xs text-white/60">
                        Detailed descriptions create more accurate and personalized NFT art
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={() => setStep(2)}
                      disabled={!propertyDetails.name || !propertyDetails.location || !propertyDetails.price || !propertyDetails.description}
                      animated
                      glow
                    >
                      Next Step
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-4xl mx-auto" variant="dark">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-full mr-4">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">NFT Design Options</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Property Image</h3>
                      <div 
                        {...getRootProps()} 
                        className={`border-2 border-dashed ${isDragActive ? 'border-primary-500 bg-primary-900/30' : 'border-gray-700'} rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors`}
                      >
                        <input {...getInputProps()} />
                        
                        {propertyImage ? (
                          <div className="relative">
                            <img
                              src={propertyImage}
                              alt="Uploaded property"
                              className="max-h-48 mx-auto rounded-lg"
                            />
                            <button
                              className="absolute top-2 right-2 bg-red-600 rounded-full p-1 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPropertyImage(null);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Upload className="h-10 w-10 text-gray-500 mx-auto" />
                            <p className="text-white/60 text-sm">
                              {isDragActive
                                ? "Drop the file here..."
                                : "Upload a reference image (optional)"}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 p-4 bg-primary-900/50 rounded-lg">
                        <h4 className="font-semibold text-white/90 mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-2 text-secondary-400" />
                          {propertyDetails.name}
                        </h4>
                        <p className="text-white/70 text-sm flex items-center">
                          <Map className="h-3 w-3 mr-1 text-secondary-400" />
                          {propertyDetails.location}
                        </p>
                        <p className="text-white/70 text-sm mt-1 flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-secondary-400" />
                          {Number(propertyDetails.price).toLocaleString()}
                        </p>
                        
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/60">
                          {propertyDetails.bedrooms && (
                            <div>Bedrooms: {propertyDetails.bedrooms}</div>
                          )}
                          {propertyDetails.bathrooms && (
                            <div>Bathrooms: {propertyDetails.bathrooms}</div>
                          )}
                          {propertyDetails.squareFeet && (
                            <div>Size: {propertyDetails.squareFeet} sq ft</div>
                          )}
                          {propertyDetails.yearBuilt && (
                            <div>Built: {propertyDetails.yearBuilt}</div>
                          )}
                          {propertyDetails.propertyType && (
                            <div>Type: {propertyDetails.propertyType}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-white mb-4">Customize NFT Style</h3>
                      
                      <div>
                        <label className="flex items-center text-sm font-medium text-white/80 mb-2">
                          <Paintbrush className="h-4 w-4 mr-2 text-secondary-400" />
                          Art Style
                        </label>
                        <select
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={style}
                          onChange={(e) => setStyle(e.target.value)}
                        >
                          <option value="Default">Default</option>
                          <option value="Watercolor">Watercolor</option>
                          <option value="Oil painting">Oil Painting</option>
                          <option value="Photography">Photography</option>
                          <option value="Anime">Anime</option>
                          <option value="Pixar">Pixar</option>
                          <option value="Vintage film">Vintage Film</option>
                          <option value="Dreamy illustration">Dreamy Illustration</option>
                          <option value="Neon Retrowave">Neon Retrowave</option>
                          <option value="Digital Art">Digital Art</option>
                          <option value="Architectural Rendering">Architectural Rendering</option>
                          <option value="Minimalist">Minimalist</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm font-medium text-white/80 mb-2">
                          <Calendar className="h-4 w-4 mr-2 text-secondary-400" />
                          Era/Decade
                        </label>
                        <select
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={era}
                          onChange={(e) => setEra(e.target.value)}
                        >
                          <option value="Not specified">Not specified</option>
                          <option value="1970s">1970s</option>
                          <option value="1980s">1980s</option>
                          <option value="1990s">1990s</option>
                          <option value="2000s">2000s</option>
                          <option value="2010s">2010s</option>
                          <option value="2020s">2020s</option>
                          <option value="Future">Futuristic</option>
                          <option value="Victorian">Victorian</option>
                          <option value="Mid-century">Mid-century</option>
                          <option value="Art Deco">Art Deco</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm font-medium text-white/80 mb-2">
                          <Smile className="h-4 w-4 mr-2 text-secondary-400" />
                          Emotional Tone
                        </label>
                        <select
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={mood}
                          onChange={(e) => setMood(e.target.value)}
                        >
                          <option value="Default">Default</option>
                          <option value="Warm">Warm</option>
                          <option value="Nostalgic">Nostalgic</option>
                          <option value="Playful">Playful</option>
                          <option value="Serene">Serene</option>
                          <option value="Exciting">Exciting</option>
                          <option value="Magical">Magical</option>
                          <option value="Luxurious">Luxurious</option>
                          <option value="Professional">Professional</option>
                          <option value="Sophisticated">Sophisticated</option>
                          <option value="Futuristic">Futuristic</option>
                        </select>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-primary-800/60 to-secondary-900/60 rounded-lg">
                        <h4 className="font-semibold text-white flex items-center">
                          <Palette className="h-4 w-4 mr-2 text-secondary-400" />
                          StyleGuide
                        </h4>
                        <p className="text-white/70 text-sm mt-2">
                          We'll transform your property into a vibrant digital artwork with neon sunset colors, perfect for the NFT marketplace.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Error message display */}
                  {generationError && (
                    <div className="mb-6 p-4 bg-red-900/40 border border-red-700 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-white">Generation Error</h4>
                          <p className="text-white/80 text-sm mt-1">{generationError}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRetryGeneration}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry with Different Settings
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={handleGenerateNFT}
                      disabled={isGenerating}
                      animated
                      glow
                    >
                      {isGenerating ? (
                        <>
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                          Generating NFT...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Generate NFT
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-4xl mx-auto" variant="dark">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-full mr-4">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Your NFT is Ready</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white/90 mb-2 flex items-center">
                        <Building className="h-5 w-5 mr-2 text-secondary-400" />
                        Property Details
                      </h3>
                      <div className="bg-gradient-to-br from-primary-900/80 to-night-dark rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">{propertyDetails.name}</h4>
                        <p className="text-white/70 text-sm mb-2">{propertyDetails.location}</p>
                        <p className="text-white/70 text-sm mb-3">${Number(propertyDetails.price).toLocaleString()}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-white/70 mb-3">
                          {propertyDetails.bedrooms && (
                            <div>Bedrooms: {propertyDetails.bedrooms}</div>
                          )}
                          {propertyDetails.bathrooms && (
                            <div>Bathrooms: {propertyDetails.bathrooms}</div>
                          )}
                          {propertyDetails.squareFeet && (
                            <div>Area: {propertyDetails.squareFeet} sq ft</div>
                          )}
                          {propertyDetails.yearBuilt && (
                            <div>Year Built: {propertyDetails.yearBuilt}</div>
                          )}
                          {propertyDetails.propertyType && (
                            <div>Type: {propertyDetails.propertyType}</div>
                          )}
                        </div>
                        
                        <p className="text-white/70 text-sm line-clamp-3">{propertyDetails.description}</p>
                      </div>
                      
                      {propertyImage && (
                        <div>
                          <h3 className="text-sm font-medium text-white/70 mb-2 flex items-center">
                            <Image className="h-4 w-4 mr-2 text-secondary-400" />
                            Reference Image
                          </h3>
                          <img
                            src={propertyImage}
                            alt="Original property"
                            className="w-full h-48 object-cover rounded-lg border border-gray-700"
                          />
                        </div>
                      )}
                      
                      <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-2 text-secondary-400" />
                          NFT Details
                        </h4>
                        <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
                          <li>Property Tokenized as NFT on Arbitrum Blockchain</li>
                          <li>Fractionalized into 10,000 tradable shares</li>
                          <li>Initial Share Price: ${(Number(propertyDetails.price) / 10000).toFixed(2)}</li>
                          <li>Art Style: {style}</li>
                          {era !== "Not specified" && <li>Era Influence: {era}</li>}
                          {mood !== "Default" && <li>Mood: {mood}</li>}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white/90 mb-2 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-secondary-400" />
                        AI-Generated NFT
                      </h3>
                      {nftImage && (
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur opacity-75"></div>
                          <img
                            src={nftImage}
                            alt="Generated NFT"
                            className="relative w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="mt-4 bg-gradient-to-br from-primary-900 to-primary-800 p-4 rounded-lg">
                        <p className="text-white text-sm">
                          This AI-generated NFT is ready to be minted on the Arbitrum blockchain. Once minted, it will be fractionalized into tradable shares.
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-white/90 mb-2">Need to regenerate?</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStep(2)}
                          className="w-full justify-center"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Go Back and Change Settings
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={handleMintNFT}
                      disabled={isMinting}
                      animated
                      glow
                    >
                      {isMinting ? (
                        <>
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                          Minting on Blockchain...
                        </>
                      ) : (
                        <>
                          Mint & Fractionalize NFT
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-4xl mx-auto" variant="dark">
                <div className="p-6">
                  {mintSuccess && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}
                  
                  <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Success! Your Property is Now Tokenized</h2>
                    <p className="text-white/80 max-w-2xl mx-auto">
                      Your property has been successfully minted as an NFT and fractionalized into 10,000 tradable shares on the Arbitrum blockchain.
                    </p>
                  </div>

                  {mintDetails && (
                    <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-lg p-6 mb-8">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-secondary-400" />
                        Transaction Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <p className="text-white/60 text-sm">Property Name</p>
                          <p className="text-white font-medium">{mintDetails.propertyDetails.name}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Location</p>
                          <p className="text-white font-medium">{mintDetails.propertyDetails.location}</p>
                        </div>
                        
                        {mintDetails.propertyDetails.bedrooms && (
                          <div>
                            <p className="text-white/60 text-sm">Bedrooms</p>
                            <p className="text-white font-medium">{mintDetails.propertyDetails.bedrooms}</p>
                          </div>
                        )}
                        
                        {mintDetails.propertyDetails.bathrooms && (
                          <div>
                            <p className="text-white/60 text-sm">Bathrooms</p>
                            <p className="text-white font-medium">{mintDetails.propertyDetails.bathrooms}</p>
                          </div>
                        )}
                        
                        {mintDetails.propertyDetails.squareFeet && (
                          <div>
                            <p className="text-white/60 text-sm">Square Feet</p>
                            <p className="text-white font-medium">{mintDetails.propertyDetails.squareFeet}</p>
                          </div>
                        )}
                        
                        {mintDetails.propertyDetails.propertyType && (
                          <div>
                            <p className="text-white/60 text-sm">Property Type</p>
                            <p className="text-white font-medium">{mintDetails.propertyDetails.propertyType}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-white/60 text-sm">Token ID</p>
                          <p className="text-white font-medium">{mintDetails.tokenId}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Total Shares</p>
                          <p className="text-white font-medium">10,000</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Share Price</p>
                          <p className="text-white font-medium">${(Number(mintDetails.propertyDetails.price) / 10000).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Property Value</p>
                          <p className="text-white font-medium">${Number(mintDetails.propertyDetails.price).toLocaleString()}</p>
                        </div>
                        
                        <div className="col-span-2">
                          <p className="text-white/60 text-sm">Transaction Hash</p>
                          <p className="text-white font-medium truncate">{mintDetails.txHash}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-white/60 text-sm">Contract Address</p>
                          <p className="text-white font-medium truncate">{mintDetails.contractAddress}</p>
                        </div>
                      </div>

                      {nftImage && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur opacity-75"></div>
                            <img 
                              src={nftImage} 
                              alt="NFT" 
                              className="relative rounded-lg w-full h-40 object-cover" 
                            />
                          </div>
                          
                          <div className="bg-gradient-to-r from-primary-700/30 to-secondary-700/30 rounded-lg p-4">
                            <h4 className="text-white font-medium mb-2">Next Steps</h4>
                            <ul className="list-disc pl-5 text-white/80 space-y-1 text-sm">
                              <li>Your property NFT is now listed in the marketplace</li>
                              <li>Investors can purchase fractional shares</li>
                              <li>Track ownership and distributions in your dashboard</li>
                              <li>Rental income automatically distributed to shareholders</li>
                              <li>Property management through the platform</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={resetForm}
                    >
                      Tokenize Another Property
                    </Button>
                    <Button
                      variant="gradient"
                      size="lg"
                      href="/dashboard"
                      animated
                      glow
                    >
                      Go to Dashboard
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NFTGeneratorPage;