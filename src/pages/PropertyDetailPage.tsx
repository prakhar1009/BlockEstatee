import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Building, Map, DollarSign, Percent, Users, Calendar, Clock, Landmark, AlertCircle } from 'lucide-react';

// Mock property data
const mockProperties = [
  {
    id: 1,
    title: "Luxury Villa in Miami",
    description: "This stunning luxury villa in Miami offers an exceptional investment opportunity with strong rental demand year-round. The property features 5 bedrooms, 6 bathrooms, a private pool, and is located just minutes from the beach.",
    location: "Miami, FL",
    address: "123 Ocean Drive, Miami, FL 33139",
    longitude: -80.1918,
    latitude: 25.7617,
    yield: 8.5,
    rentalYield: 5.2,
    appreciationYield: 3.3,
    type: "Residential",
    price: 1000000,
    raised: 780000,
    unitPrice: 100,
    totalUnits: 10000,
    availableUnits: 2200,
    propertySize: 5200,
    bedrooms: 5,
    bathrooms: 6,
    yearBuilt: 2018,
    propertyManager: "Luxury Homes Management",
    fundingDeadline: "2025-06-30",
    expectedIncome: 85000,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    ],
    status: "Funding"
  },
  // Additional mock properties would be here...
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