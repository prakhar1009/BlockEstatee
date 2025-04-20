import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Building, Map, DollarSign, Percent, Users, Calendar, Clock, Landmark, AlertCircle } from 'lucide-react';

// Mock property data
const mockProperties = [
  {
    id: 1,
    title: "Jagran Lakecity University",
    description: "A prestigious private university campus in Bhopal, offering world-class education and modern infrastructure. The campus is spread across lush green landscapes and features state-of-the-art academic buildings, hostels, and sports facilities.",
    location: "Bhopal, MP",
    address: "Chandanpura, Mugaliyachap, Near Ratibad, Bhopal, MP 462044",
    longitude: 76.9139,
    latitude: 23.2599,
    yield: 8.5,
    rentalYield: 5.2,
    appreciationYield: 3.3,
    type: "Educational Campus",
    price: 12000000,
    raised: 9000000,
    unitPrice: 100,
    totalUnits: 120000,
    availableUnits: 30000,
    propertySize: 52000,
    bedrooms: 0,
    bathrooms: 24,
    yearBuilt: 2010,
    propertyManager: "JLU Property Management",
    fundingDeadline: "2025-06-30",
    expectedIncome: 1020000,
    image: "https://lh3.googleusercontent.com/p/AF1QipNMj4qkotE7gXSCqwbU9iGD9HAIV7wo1ULMDuZk=s1360-w1360-h1020",
    galleryImages: [
      "https://www.jlu.edu.in/wp-content/uploads/2020/03/jlu-campus-1.jpg",
      "https://www.jlu.edu.in/wp-content/uploads/2020/03/jlu-library.jpg",
      "https://www.jlu.edu.in/wp-content/uploads/2020/03/jlu-auditorium.jpg"
    ],
    status: "Funding"
  },
  {
    id: 2,
    title: "Singapore Business Park",
    description: "Singapore Business Park is a premium commercial development offering world-class office spaces and amenities. Located in a strategic business district, it features modern architecture, sustainable design, and cutting-edge technology infrastructure. This investment opportunity provides exposure to the growing commercial real estate sector in one of Asia's most dynamic business hubs.",
    location: "Singapore",
    address: "25 Business Park Drive, Singapore 138568",
    longitude: 103.7767,
    latitude: 1.3521,
    yield: 7.8,
    rentalYield: 5.2,
    appreciationYield: 2.6,
    type: "Business Park",
    price: 15000000,
    raised: 11000000,
    unitPrice: 150,
    totalUnits: 100000,
    availableUnits: 26667,
    propertySize: 750000,
    bedrooms: 0,
    bathrooms: 48,
    yearBuilt: 2018,
    propertyManager: "Singapore Commercial Properties Ltd.",
    fundingDeadline: "2025-07-15",
    expectedIncome: 1170000,
    image: "https://lh3.googleusercontent.com/p/AF1QipOWG4LxpLNGPtHNdr8oC9PSXH3nZ7fOMKtgRiYP=s1360-w1360-h1020",
    galleryImages: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    ],
    status: "Funding"
  },
  {
    id: 3,
    title: "DB Mall",
    description: "DB Mall is one of the premier shopping destinations in Bhopal, offering a mix of retail, entertainment, and dining options. The mall features premium brands, a multiplex cinema, food court, and modern amenities. This investment opportunity provides exposure to the growing retail sector in central India.",
    location: "Bhopal, MP",
    address: "Zone-I, Maharana Pratap Nagar, Bhopal, MP 462011",
    longitude: 77.4354,
    latitude: 23.2315,
    yield: 7.8,
    rentalYield: 5.2,
    appreciationYield: 2.6,
    type: "Commercial Mall",
    price: 8000000,
    raised: 5000000,
    unitPrice: 80,
    totalUnits: 100000,
    availableUnits: 37500,
    propertySize: 320000,
    bedrooms: 0,
    bathrooms: 24,
    yearBuilt: 2010,
    propertyManager: "DB Mall Management Services",
    fundingDeadline: "2025-05-30",
    expectedIncome: 624000,
    image: "https://helptravelindia.com/wp-content/uploads/2024/05/DB-City-Mall-Bhopal-Madhya-Pradesh.jpg",
    galleryImages: [
      "https://www.dbmall.in/wp-content/uploads/2020/03/db-mall-interior-1.jpg",
      "https://www.dbmall.in/wp-content/uploads/2020/03/db-mall-food-court.jpg",
      "https://www.dbmall.in/wp-content/uploads/2020/03/db-mall-atrium.jpg"
    ],
    status: "Funding"
  },
  {
    id: 4,
    title: "Exotica Farm House",
    description: "Exotica Farm House is a luxurious countryside retreat offering a perfect blend of natural beauty and modern amenities. Set amidst lush greenery, this property features elegant villas, organic gardens, recreational facilities, and panoramic views. This investment opportunity provides exposure to the growing luxury farm house market, catering to those seeking weekend getaways and sustainable living options.",
    location: "Bhopal, MP",
    address: "Sehore Road, 15 km from Bhopal, MP 462038",
    longitude: 77.3219,
    latitude: 23.1815,
    yield: 8.2,
    rentalYield: 5.5,
    appreciationYield: 2.7,
    type: "Luxury Farm House",
    price: 7500000,
    raised: 5200000,
    unitPrice: 125,
    totalUnits: 60000,
    availableUnits: 18400,
    propertySize: 250000,
    bedrooms: 12,
    bathrooms: 14,
    yearBuilt: 2021,
    propertyManager: "Exotica Luxury Properties",
    fundingDeadline: "2025-06-15",
    expectedIncome: 615000,
    image: "https://lh3.googleusercontent.com/p/AF1QipPdcgU9Yap_LpnuyT8MXABOcA8F5VVJjD-0WrWM=s1360-w1360-h1020",
    galleryImages: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    ],
    status: "Funding"
  },
  {
    id: 5,
    title: "NRK Business Park",
    description: "NRK Business Park is a premium commercial development in Indore, offering modern office spaces for businesses of all sizes. The property features state-of-the-art infrastructure, sustainable design elements, dedicated parking, high-speed connectivity, and 24/7 security, making it an ideal investment in one of India's fastest-growing business hubs.",
    location: "Indore, MP",
    address: "Scheme No. 54, AB Road, Indore, MP 452010",
    longitude: 75.8936,
    latitude: 22.7196,
    yield: 8.9,
    rentalYield: 6.1,
    appreciationYield: 2.8,
    type: "Business Park",
    price: 10500000,
    raised: 8000000,
    unitPrice: 105,
    totalUnits: 100000,
    availableUnits: 23810,
    propertySize: 380000,
    bedrooms: 0,
    bathrooms: 28,
    yearBuilt: 2018,
    propertyManager: "NRK Commercial Properties",
    fundingDeadline: "2025-06-15",
    expectedIncome: 934500,
    image: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB9T79ceP2e9b4UBgNjqjHfgbMxSDShB15fMf-iP6T06ZnXq1JghR5fEjCY7xkRPzeBwPEsEhRkNQvvs43mZ9mWVlFYtuWJa3Up-MAgbiusoxYwbrvVyljs2MNe2AMB8-kaxIEwNlw=s1360-w1360-h1020",
    galleryImages: [
      "https://www.nrkbusinesspark.com/wp-content/uploads/2020/03/nrk-business-park-lobby.jpg",
      "https://www.nrkbusinesspark.com/wp-content/uploads/2020/03/nrk-business-park-office-space.jpg",
      "https://www.nrkbusinesspark.com/wp-content/uploads/2020/03/nrk-business-park-conference-room.jpg"
    ],
    status: "Funding"
  },
  {
    id: 6,
    title: "Lakeside Villa",
    description: "Lakeside Villa is a luxurious residential development in Indore, offering premium villas with modern amenities and scenic lake views. The property features spacious layouts, private gardens, smart home technology, community clubhouse, swimming pool, and 24-hour security. This investment opportunity provides exposure to the high-end residential real estate market in one of India's fastest-growing cities.",
    location: "Indore, MP",
    address: "Lakeside Township, Rau-Pithampur Road, Indore, MP 453331",
    longitude: 75.7849,
    latitude: 22.6797,
    yield: 9.2,
    rentalYield: 6.4,
    appreciationYield: 2.8,
    type: "Luxury Villa",
    price: 13000000,
    raised: 11000000,
    unitPrice: 130,
    totalUnits: 100000,
    availableUnits: 15385,
    propertySize: 350000,
    bedrooms: 24,
    bathrooms: 28,
    yearBuilt: 2022,
    propertyManager: "Lakeside Property Management",
    fundingDeadline: "2025-05-30",
    expectedIncome: 1196000,
    image: "https://thearowanavilla.com/assets/img/gallery/gallery-1.jpg",
    galleryImages: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    ],
    status: "Funding"
  }
];

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [expectedReturns, setExpectedReturns] = useState(0);
  const { isConnected } = useAccount();

  useEffect(() => {
    // In a real app, you would fetch the property data from blockchain or API
    const fetchedProperty = mockProperties.find(p => p.id === Number(id));
    
    if (fetchedProperty) {
      setProperty(fetchedProperty);
      // Calculate expected returns based on investment amount
      calculateReturns(investmentAmount, fetchedProperty.yield);
    }
    
    setLoading(false);
  }, [id]);

  const calculateReturns = (amount: number, yieldPercentage: number) => {
    const returns = (amount * yieldPercentage) / 100;
    setExpectedReturns(returns);
  };

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    setInvestmentAmount(amount);
    if (property) {
      calculateReturns(amount, property.yield);
    }
  };

  const handleInvest = () => {
    // In a real app, this would interact with smart contracts
    alert(`Investment of $${investmentAmount} initiated. Connect your wallet to complete the transaction.`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Property Not Found</h1>
            <p className="mt-2 text-gray-500">The property you're looking for doesn't exist or has been removed.</p>
            <Link to="/properties" className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Property Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-96 w-full relative">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {property.status}
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                <div className="mt-2 flex items-center text-gray-600">
                  <Map className="h-5 w-5 mr-2" />
                  <span>{property.address}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">${property.price.toLocaleString()}</div>
                <div className="text-sm text-blue-600">Total Property Value</div>
                <div className="mt-2 flex items-center">
                  <Percent className="h-5 w-5 mr-1 text-blue-600" />
                  <span className="text-lg font-semibold text-blue-700">{property.yield}% Expected Yield</span>
                </div>
              </div>
            </div>

            {/* Funding Progress */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700">Funding Progress</h3>
                <span className="text-blue-600 font-medium">{Math.round((property.raised / property.price) * 100)}% Funded</span>
              </div>
              <div className="mt-2 relative pt-1">
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                  <div 
                    style={{ width: `${(property.raised / property.price) * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 rounded-full"
                  ></div>
                </div>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span>${property.raised.toLocaleString()} raised</span>
                <span>${property.price.toLocaleString()} goal</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>Unit Price</span>
                </div>
                <div className="text-lg font-semibold">${property.unitPrice}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Available Units</span>
                </div>
                <div className="text-lg font-semibold">{property.availableUnits.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <Building className="h-4 w-4 mr-1" />
                  <span>Property Size</span>
                </div>
                <div className="text-lg font-semibold">{property.propertySize} sq ft</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Deadline</span>
                </div>
                <div className="text-lg font-semibold">{new Date(property.fundingDeadline).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('financials')}
                    className={`${
                      activeTab === 'financials'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                  >
                    Financials
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`${
                      activeTab === 'documents'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                  >
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`${
                      activeTab === 'gallery'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                  >
                    Gallery
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Property Overview</h3>
                    <p className="mt-4 text-gray-600">{property.description}</p>
                    
                    <h4 className="mt-8 text-lg font-semibold text-gray-900">Property Details</h4>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Property Type</span>
                        <span className="font-medium">{property.type}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Year Built</span>
                        <span className="font-medium">{property.yearBuilt}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Bedrooms</span>
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Bathrooms</span>
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Property Size</span>
                        <span className="font-medium">{property.propertySize} sq ft</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Property Manager</span>
                        <span className="font-medium">{property.propertyManager}</span>
                      </div>
                    </div>
                    
                    <h4 className="mt-8 text-lg font-semibold text-gray-900">Location</h4>
                    <div className="mt-4 bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                      <Map className="h-8 w-8 text-gray-400" />
                      <span className="ml-2 text-gray-500">Interactive map would be here</span>
                    </div>
                  </div>
                )}

                {activeTab === 'financials' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Financial Details</h3>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Returns Breakdown</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Rental Yield</span>
                            <span className="font-semibold text-blue-700">{property.rentalYield}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Appreciation Yield</span>
                            <span className="font-semibold text-blue-700">{property.appreciationYield}%</span>
                          </div>
                          <div className="pt-2 border-t border-blue-200 flex justify-between items-center">
                            <span className="font-medium text-gray-800">Total Expected Yield</span>
                            <span className="font-bold text-blue-700">{property.yield}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Investment Details</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Property Value</span>
                            <span className="font-semibold">${property.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Units</span>
                            <span className="font-semibold">{property.totalUnits.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Price Per Unit</span>
                            <span className="font-semibold">${property.unitPrice}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Expected Annual Income</span>
                            <span className="font-semibold">${property.expectedIncome.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Investment Calculator</h4>
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="mb-4">
                          <label htmlFor="investment-amount" className="block text-sm font-medium text-gray-700">
                            Investment Amount
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              id="investment-amount"
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                              placeholder="0.00"
                              min={property.unitPrice}
                              step={property.unitPrice}
                              value={investmentAmount}
                              onChange={handleInvestmentChange}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">USD</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Units Received</div>
                            <div className="text-xl font-bold text-gray-900">{Math.floor(investmentAmount / property.unitPrice)}</div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Expected Annual Return</div>
                            <div className="text-xl font-bold text-blue-700">${expectedReturns.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Legal Documents</h3>
                    <p className="mt-4 text-gray-600">
                      Review all legal documents related to this property investment opportunity.
                    </p>
                    
                    <div className="mt-6 space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-md mr-4">
                            <Landmark className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Property Deed</h4>
                            <p className="text-sm text-gray-500">PDF Document - 2.3 MB</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Download
                        </button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-md mr-4">
                            <Landmark className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Investment Agreement</h4>
                            <p className="text-sm text-gray-500">PDF Document - 1.5 MB</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Download
                        </button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-md mr-4">
                            <Landmark className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Property Valuation Report</h4>
                            <p className="text-sm text-gray-500">PDF Document - 3.8 MB</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Download
                        </button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-md mr-4">
                            <Landmark className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Smart Contract Audit</h4>
                            <p className="text-sm text-gray-500">PDF Document - 1.1 MB</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Property Gallery</h3>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.galleryImages.map((image: string, index: number) => (
                        <div key={index} className="rounded-lg overflow-hidden h-64">
                          <img src={image} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="rounded-lg overflow-hidden h-64">
                        <img src={property.image} alt="Main Property" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Investment Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900">Invest in this Property</h3>
              
              <div className="mt-6">
                <label htmlFor="investment-amount-side" className="block text-sm font-medium text-gray-700">
                  How much would you like to invest?
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="investment-amount-side"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3 border"
                    placeholder="0.00"
                    min={property.unitPrice}
                    step={property.unitPrice}
                    value={investmentAmount}
                    onChange={handleInvestmentChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">USD</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Minimum investment: ${property.unitPrice}
                </p>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Units Received</span>
                    <span className="font-semibold">{Math.floor(investmentAmount / property.unitPrice)}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Expected Annual Return</span>
                    <span className="font-semibold text-blue-600">${expectedReturns.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ownership Percentage</span>
                    <span className="font-semibold">
                      {((Math.floor(investmentAmount / property.unitPrice) / property.totalUnits) * 100).toFixed(4)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">Investment Timeline</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start mb-4">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700 font-medium">Funding Deadline</p>
                      <p className="text-sm text-gray-600">
                        {new Date(property.fundingDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700 font-medium">First Payout Expected</p>
                      <p className="text-sm text-gray-600">
                        30 days after funding completion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                {isConnected ? (
                  <button
                    onClick={handleInvest}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Invest Now
                  </button>
                ) : (
                  <button
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Connect Wallet to Invest
                  </button>
                )}
                <p className="mt-2 text-xs text-gray-500 text-center">
                  By investing, you agree to the terms and conditions of the investment agreement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;