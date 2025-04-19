import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Sliders, 
  RefreshCcw, 
  PieChart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import { motion } from 'framer-motion';

// Mock data for marketplace listings
const mockListings = [
  {
    id: 1,
    propertyId: 1,
    title: "Luxury Villa in Miami",
    tokenId: "#12345",
    price: 120,
    originalPrice: 100,
    quantity: 10,
    totalValue: 1200,
    seller: "0x1a2b...3c4d",
    tokenSymbol: "MIVIL",
    yield: 8.5,
    change: 20,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
    listedSince: "2025-04-10",
    expiresIn: 3,
  },
  {
    id: 2,
    propertyId: 2,
    title: "Modern Apartment Complex",
    tokenId: "#45678",
    price: 90,
    originalPrice: 100,
    quantity: 20,
    totalValue: 1800,
    seller: "0x5e6f...7g8h",
    tokenSymbol: "APRTX",
    yield: 7.2,
    change: -10,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    listedSince: "2025-04-08",
    expiresIn: 5,
  },
  {
    id: 3,
    propertyId: 3,
    title: "Commercial Office Space",
    tokenId: "#78901",
    price: 110,
    originalPrice: 100,
    quantity: 15,
    totalValue: 1650,
    seller: "0x9i0j...1k2l",
    tokenSymbol: "COFSP",
    yield: 9.1,
    change: 10,
    image: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
    listedSince: "2025-04-05",
    expiresIn: 7,
  },
  {
    id: 4,
    propertyId: 4,
    title: "Waterfront Condominium",
    tokenId: "#23456",
    price: 95,
    originalPrice: 100,
    quantity: 25,
    totalValue: 2375,
    seller: "0x3m4n...5o6p",
    tokenSymbol: "WFCON",
    yield: 6.8,
    change: -5,
    image: "https://images.unsplash.com/photo-1669071192880-0a94316e6e09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    listedSince: "2025-04-02",
    expiresIn: 2,
  },
  {
    id: 5,
    propertyId: 5,
    title: "Retail Shopping Center",
    tokenId: "#56789",
    price: 115,
    originalPrice: 100,
    quantity: 30,
    totalValue: 3450,
    seller: "0x7q8r...9s0t",
    tokenSymbol: "RTCTR",
    yield: 8.3,
    change: 15,
    image: "https://images.unsplash.com/photo-1601760562234-9814eea6663a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    listedSince: "2025-03-30",
    expiresIn: 4,
  },
  {
    id: 6,
    propertyId: 6,
    title: "Industrial Warehouse Complex",
    tokenId: "#89012",
    price: 105,
    originalPrice: 100,
    quantity: 40,
    totalValue: 4200,
    seller: "0x1u2v...3w4x",
    tokenSymbol: "INDWH",
    yield: 9.5,
    change: 5,
    image: "https://images.unsplash.com/photo-1612633501998-813f90599051?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    listedSince: "2025-03-25",
    expiresIn: 1,
  }
];

// Market stats
const marketStats = {
  totalVolume: 24750,
  totalListings: 28,
  totalSold: 156,
  averagePrice: 107,
  averageYield: 8.2,
  topGainer: {
    title: "Luxury Villa in Miami",
    change: 20
  },
  topLoser: {
    title: "Modern Apartment Complex",
    change: -10
  }
};

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 200]);
  const [yieldFilter, setYieldFilter] = useState<[number, number]>([0, 15]);
  const [sortBy, setSortBy] = useState('newest');
  const [listings, setListings] = useState(mockListings);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterListings();
  };

  const filterListings = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filtered = mockListings.filter(listing => {
        const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              listing.tokenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              listing.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesPrice = listing.price >= priceFilter[0] && listing.price <= priceFilter[1];
        const matchesYield = listing.yield >= yieldFilter[0] && listing.yield <= yieldFilter[1];
        
        return matchesSearch && matchesPrice && matchesYield;
      });
      
      // Sort listings
      const sorted = [...filtered].sort((a, b) => {
        switch(sortBy) {
          case 'newest':
            return new Date(b.listedSince).getTime() - new Date(a.listedSince).getTime();
          case 'oldest':
            return new Date(a.listedSince).getTime() - new Date(b.listedSince).getTime();
          case 'price_high':
            return b.price - a.price;
          case 'price_low':
            return a.price - b.price;
          case 'yield_high':
            return b.yield - a.yield;
          case 'yield_low':
            return a.yield - b.yield;
          default:
            return 0;
        }
      });
      
      setListings(sorted);
      setLoading(false);
      setPage(1); // Reset to first page on filter change
    }, 500);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPriceFilter([0, 200]);
    setYieldFilter([0, 15]);
    setSortBy('newest');
    setListings(mockListings);
    setPage(1);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const currentListings = listings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  useEffect(() => {
    filterListings();
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-dark to-primary-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-white font-display"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            NFT Marketplace
          </motion.h1>
          <motion.p 
            className="mt-4 text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Buy and sell property tokens on our decentralized marketplace with instant transactions.
          </motion.p>
        </div>

        {/* Market Stats */}
        <div className="mt-10">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-4" variant="dark">
              <h3 className="text-sm font-medium text-white/70">Total Volume</h3>
              <p className="mt-1 text-2xl font-semibold text-white">${marketStats.totalVolume.toLocaleString()}</p>
            </Card>
            <Card className="p-4" variant="dark">
              <h3 className="text-sm font-medium text-white/70">Active Listings</h3>
              <p className="mt-1 text-2xl font-semibold text-white">{marketStats.totalListings}</p>
            </Card>
            <Card className="p-4" variant="dark">
              <h3 className="text-sm font-medium text-white/70">Average Price</h3>
              <p className="mt-1 text-2xl font-semibold text-white">${marketStats.averagePrice}</p>
            </Card>
            <Card className="p-4" variant="dark">
              <h3 className="text-sm font-medium text-white/70">Average Yield</h3>
              <p className="mt-1 text-2xl font-semibold text-white">{marketStats.averageYield}%</p>
            </Card>
          </motion.div>
          
          <motion.div 
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-4 bg-gradient-to-r from-primary-900 to-primary-800" variant="dark">
              <div className="flex items-center">
                <div className="rounded-full bg-green-500/20 p-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white/70">Top Gainer</h3>
                  <p className="text-lg font-semibold text-white">{marketStats.topGainer.title}</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                    +{marketStats.topGainer.change}%
                  </span>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-r from-primary-900 to-primary-800" variant="dark">
              <div className="flex items-center">
                <div className="rounded-full bg-red-500/20 p-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white/70">Top Loser</h3>
                  <p className="text-lg font-semibold text-white">{marketStats.topLoser.title}</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
                    {marketStats.topLoser.change}%
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-10">
          <Card className="bg-night-light overflow-hidden" variant="dark">
            <div className="p-6">
              <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[250px]">
                  <label htmlFor="search" className="block text-sm font-medium text-white/80 mb-1">
                    Search Marketplace
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-white/50" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="w-full px-4 py-2 pl-10 bg-night-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Search by property, token ID, or symbol"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowFilters(!showFilters)}
                    icon={<Filter className="h-4 w-4" />}
                  >
                    Filters
                  </Button>
                </div>
                
                <div>
                  <label htmlFor="sort-by" className="block text-sm font-medium text-white/80 mb-1">
                    Sort By
                  </label>
                  <select
                    id="sort-by"
                    name="sort-by"
                    className="w-full px-4 py-2 bg-night-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="yield_high">Yield: High to Low</option>
                    <option value="yield_low">Yield: Low to High</option>
                  </select>
                </div>
                
                <div className="ml-auto flex space-x-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    glow
                  >
                    Search
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetFilters}
                    icon={<RefreshCcw className="h-4 w-4" />}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </div>
            
            {showFilters && (
              <div className="px-6 py-4 bg-primary-900/50 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="price-range" className="block text-sm font-medium text-white/80">
                        Price Range (USDC)
                      </label>
                      <span className="text-sm text-white/70">
                        ${priceFilter[0]} - ${priceFilter[1]}
                      </span>
                    </div>
                    <div className="mt-2 px-2">
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="10"
                        value={priceFilter[1]}
                        onChange={(e) => setPriceFilter([priceFilter[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="yield-range" className="block text-sm font-medium text-white/80">
                        Yield Range (%)
                      </label>
                      <span className="text-sm text-white/70">
                        {yieldFilter[0]}% - {yieldFilter[1]}%
                      </span>
                    </div>
                    <div className="mt-2 px-2">
                      <input
                        type="range"
                        min="0"
                        max="15"
                        step="0.5"
                        value={yieldFilter[1]}
                        onChange={(e) => setYieldFilter([yieldFilter[0], parseFloat(e.target.value)])}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="gradient"
                    size="sm"
                    icon={<Sliders className="h-4 w-4" />}
                    onClick={filterListings}
                    glow
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Listings */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Available Listings</h2>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader size="large" color="primary" />
            </div>
          ) : currentListings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full flex flex-col" variant="sunset" hover glow>
                      <div className="relative">
                        <Link to={`/properties/${listing.propertyId}`}>
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-night-dark to-transparent opacity-60"></div>
                        </Link>
                        <div className="absolute top-3 right-3">
                          <Badge
                            variant={listing.change > 0 ? 'success' : 'danger'}
                            size="md"
                          >
                            {listing.change > 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {listing.change > 0 ? '+' : ''}{listing.change}%
                          </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="primary">{listing.tokenSymbol}</Badge>
                            <span className="text-xs text-gray-300">{listing.tokenId}</span>
                          </div>
                          <Link to={`/properties/${listing.propertyId}`}>
                            <h3 className="text-lg font-semibold text-white hover:text-secondary-300 transition-colors">
                              {listing.title}
                            </h3>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="p-4 flex-grow flex flex-col bg-gradient-to-br from-night-dark to-primary-900">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <PieChart className="h-4 w-4 text-secondary-400 mr-1" />
                            <span className="text-sm font-medium text-white">{listing.yield}% yield</span>
                          </div>
                          <div className="text-sm text-white/60">
                            Tokens: {listing.quantity}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                          <div className="text-sm text-white/60 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {listing.expiresIn === 1 ? 'Expires today' : `Expires in ${listing.expiresIn} days`}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-white/60">
                              <span className="line-through">${listing.originalPrice}</span>
                            </p>
                            <p className="text-lg font-bold text-secondary-400">${listing.price} USDC</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button
                            variant="gradient"
                            size="md"
                            fullWidth
                            animated
                            glow
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage(page => Math.max(page - 1, 1))}
                      disabled={page === 1}
                      icon={<ChevronLeft className="h-4 w-4" />}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`h-8 w-8 rounded-md flex items-center justify-center ${
                            page === pageNum 
                              ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white' 
                              : 'bg-night-light border border-gray-700 text-white/70 hover:bg-primary-900'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage(page => Math.min(page + 1, totalPages))}
                      disabled={page === totalPages}
                      icon={<ChevronRight className="h-4 w-4" />}
                      iconPosition="right"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <Card className="p-10 text-center" variant="dark">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-night-light mb-4">
                <Search className="h-8 w-8 text-white/40" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No Listings Found</h3>
              <p className="text-white/60 max-w-md mx-auto">
                We couldn't find any listings matching your filters. Try adjusting your search criteria or explore other options.
              </p>
              <Button
                variant="gradient"
                className="mt-6"
                onClick={resetFilters}
                animated
                glow
              >
                Reset Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;