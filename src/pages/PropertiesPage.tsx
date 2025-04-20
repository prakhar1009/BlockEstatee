import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Percent, Map, AlertCircle } from 'lucide-react';

// Mock data for properties
const mockProperties = [
  {
    id: 1,
    title: "Jagran Lakecity University",
    location: "Bhopal, MP",
    yield: 8.5,
    type: "Educational Campus",
    price: 12000000,
    raised: 9000000,
    image: "https://lh3.googleusercontent.com/p/AF1QipNMj4qkotE7gXSCqwbU9iGD9HAIV7wo1ULMDuZk=s1360-w1360-h1020",
    status: "Funding"
  },
  {
    id: 2,
    title: "Singapore Business Park",
    location: "Singapore",
    yield: 7.8,
    type: "Business Park",
    price: 15000000,
    raised: 11000000,
    image: "https://lh3.googleusercontent.com/p/AF1QipOWG4LxpLNGPtHNdr8oC9PSXH3nZ7fOMKtgRiYP=s1360-w1360-h1020",
    status: "Funding"
  },
  {
    id: 3,
    title: "DB Mall",
    location: "Bhopal, MP",
    yield: 7.8,
    type: "Commercial Mall",
    price: 8000000,
    raised: 5000000,
    image: "https://helptravelindia.com/wp-content/uploads/2024/05/DB-City-Mall-Bhopal-Madhya-Pradesh.jpg",
    status: "Funding"
  },
  {
    id: 4,
    title: "Exotica Farm House",
    location: "Bhopal, MP",
    yield: 8.2,
    type: "Luxury Farm House",
    price: 7500000,
    raised: 5200000,
    image: "https://lh3.googleusercontent.com/p/AF1QipPdcgU9Yap_LpnuyT8MXABOcA8F5VVJjD-0WrWM=s1360-w1360-h1020",
    status: "Funding"
  },
  {
    id: 5,
    title: "NRK Business Park",
    location: "Indore, MP",
    yield: 8.9,
    type: "Business Park",
    price: 10500000,
    raised: 8000000,
    image: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB9T79ceP2e9b4UBgNjqjHfgbMxSDShB15fMf-iP6T06ZnXq1JghR5fEjCY7xkRPzeBwPEsEhRkNQvvs43mZ9mWVlFYtuWJa3Up-MAgbiusoxYwbrvVyljs2MNe2AMB8-kaxIEwNlw=s1360-w1360-h1020",
    status: "Funding"
  },
  {
    id: 6,
    title: "Lakeside Villa",
    location: "Indore, MP",
    yield: 9.2,
    type: "Luxury Villa",
    price: 13000000,
    raised: 11000000,
    image: "https://thearowanavilla.com/assets/img/gallery/gallery-1.jpg",
    status: "Funding"
  }
];

const PropertiesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [minYield, setMinYield] = useState(0);
  const [properties, setProperties] = useState(mockProperties);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter properties based on search term, property type and min yield
    const filtered = mockProperties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = propertyType === 'All' || property.type === propertyType;
      const matchesYield = property.yield >= minYield;
      
      return matchesSearch && matchesType && matchesYield;
    });
    
    setProperties(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPropertyType('All');
    setMinYield(0);
    setProperties(mockProperties);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Properties</h1>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search" className="w-full md:w-1/2 p-2 border rounded" />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Search</button>
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="bg-blue-500 text-white p-2 rounded">Filters</button>
        </form>
        {showFilters && (
          <div className="bg-white p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="property-type" className="block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <select
                  id="property-type"
                  name="property-type"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Educational Campus">Educational Campus</option>
                  <option value="Commercial Mall">Commercial Mall</option>
                  <option value="Shopping Mall">Shopping Mall</option>
                  <option value="Business Park">Business Park</option>
                  <option value="Luxury Villa">Luxury Villa</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="min-yield" className="block text-sm font-medium text-gray-700">
                  Minimum Yield (%)
                </label>
                <input
                  type="number"
                  name="min-yield"
                  id="min-yield"
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  placeholder="0"
                  min="0"
                  max="15"
                  value={minYield}
                  onChange={(e) => setMinYield(Number(e.target.value))}
                />
              </div>
              
              <div className="flex items-end">
                <button 
                  type="button" 
                  onClick={resetFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <div key={property.id} className="bg-white p-4 rounded-lg shadow">
              <img src={property.image} alt={property.title} className="w-full h-40 object-cover rounded" />
              <h2 className="text-xl font-bold mt-2">{property.title}</h2>
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {property.type}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span className="flex items-center">
                  <Map className="h-4 w-4 mr-1" />
                  {property.location}
                </span>
                <span className="flex items-center">
                  <Percent className="h-4 w-4 mr-1" />
                  {property.yield}% Yield
                </span>
              </div>
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: `${(property.raised / property.price) * 100}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                    ></div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span>${(property.raised / 1000000).toFixed(1)}M raised</span>
                  <span>${(property.price / 1000000).toFixed(1)}M goal</span>
                </div>
              </div>
              <div className="px-6 pb-6">
                <Link
                  to={`/properties/${property.id}`}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;