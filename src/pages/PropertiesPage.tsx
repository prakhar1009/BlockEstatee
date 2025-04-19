import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Percent, Map, AlertCircle } from 'lucide-react';

// Mock data for property listings
const mockProperties = [
  {
    id: 1,
    title: "Luxury Villa in Miami",
    location: "Miami, FL",
    yield: 8.5,
    type: "Residential",
    price: 1000000,
    raised: 780000,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
    status: "Funding"
  },
  {
    id: 2,
    title: "Modern Apartment Complex",
    location: "Austin, TX",
    yield: 7.2,
    type: "Residential",
    price: 3000000,
    raised: 1350000,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    status: "Funding"
  },
  {
    id: 3,
    title: "Commercial Office Space",
    location: "Chicago, IL",
    yield: 9.1,
    type: "Commercial",
    price: 3000000,
    raised: 1800000,
    image: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
    status: "Funding"
  },
  {
    id: 4,
    title: "Waterfront Condominium",
    location: "Seattle, WA",
    yield: 6.8,
    type: "Residential",
    price: 2500000,
    raised: 2500000,
    image: "https://images.unsplash.com/photo-1669071192880-0a94316e6e09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    status: "Funded"
  },
  {
    id: 5,
    title: "Retail Shopping Center",
    location: "Denver, CO",
    yield: 8.3,
    type: "Commercial",
    price: 4500000,
    raised: 3200000,
    image: "https://images.unsplash.com/photo-1601760562234-9814eea6663a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    status: "Funding"
  },
  {
    id: 6,
    title: "Industrial Warehouse Complex",
    location: "Dallas, TX",
    yield: 9.5,
    type: "Industrial",
    price: 5000000,
    raised: 5000000,
    image: "https://images.unsplash.com/photo-1612633501998-813f90599051?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    status: "Funded"
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
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Available Properties
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Browse our curated selection of real estate investment opportunities.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-8 flex flex-col bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-4">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[250px]">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search Properties
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Search by name or location"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Search
              </button>
              
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Reset
              </button>
            </form>
          </div>
          
          {showFilters && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
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
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
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
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="All">All Status</option>
                    <option value="Funding">Funding</option>
                    <option value="Funded">Funded</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div key={property.id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col">
                <div className="h-48 w-full relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-2 right-2 ${property.status === 'Funded' ? 'bg-green-500' : 'bg-blue-500'} text-white px-2 py-1 rounded text-sm font-medium`}>
                    {property.status}
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{property.title}</h3>
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
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow">
            <AlertCircle className="h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Properties Found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search filters to find what you're looking for.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;