import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Building, 
  PieChart, 
  Shield, 
  RefreshCw, 
  Percent, 
  Users, 
  Globe, 
  Coins, 
  Lock, 
  BarChart3, 
  ChevronRight, 
  ArrowRight,
  Database,
  ArrowUpRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PropertyCard from '../components/featured/PropertyCard';

// Mock data for featured properties
const featuredProperties = [
  {
    id: 1,
    title: "Jagran Lakecity University",
    location: "Bhopal, MP",
    yield: 8.5,
    type: "Educational Campus",
    price: 12000000,
    raised: 9000000,
    image: "https://lh3.googleusercontent.com/p/AF1QipNMj4qkotE7gXSCqwbU9iGD9HAIV7wo1ULMDuZk=s1360-w1360-h1020",
    status: "Funding",
    daysLeft: 30,
    investors: 120,
    featured: true
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
    status: "Funding",
    daysLeft: 25,
    investors: 95
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
    status: "Funding",
    daysLeft: 20,
    investors: 85
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
    status: "Funding",
    daysLeft: 15,
    investors: 65
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
    status: "Funding",
    daysLeft: 10,
    investors: 75
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
    status: "Funding",
    daysLeft: 5,
    investors: 90
  }
];

const stats = [
  { title: "Total Value Locked", value: "$42M+", icon: <Database className="h-6 w-6 text-white" />},
  { title: "Global Investors", value: "15,000+", icon: <Globe className="h-6 w-6 text-white" />},
  { title: "Properties Listed", value: "180+", icon: <Building className="h-6 w-6 text-white" />},
  { title: "Average Yield", value: "8.2%", icon: <BarChart3 className="h-6 w-6 text-white" />}
];

const testimonials = [
  {
    quote: "BlockEstate revolutionized how I invest in real estate. The fractional ownership model allowed me to diversify my portfolio with minimal capital.",
    author: "Sarah Johnson",
    title: "Individual Investor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "The transparency and automation provided by BlockEstate's smart contracts have significantly reduced overhead costs for our investment firm.",
    author: "Michael Chen",
    title: "Investment Manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "As an international investor, BlockEstate gave me access to premium U.S. real estate markets that were previously out of reach. Game changer!",
    author: "Elena Vega",
    title: "Global Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const HomePage = () => {
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  
  // State for controlling the modal visibility
  const [showModal, setShowModal] = useState(false);

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.3 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with improved responsiveness */}
      <header className="bg-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">Invest in Real Estate Smarter</h1>
          <p className="mt-4 text-xl text-white/80">Fractional ownership with automated payouts. Low barriers to entry. Global access.</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              href="/properties"
              variant="gradient"
              size="lg"
              icon={<ArrowUpRight className="h-5 w-5" />}
              iconPosition="right"
              animated
              glow
            >
              Explore Properties
            </Button>
            <Button
              onClick={() => setShowModal(true)}
              variant="ghost"
              size="lg"
              icon={<ChevronRight className="h-5 w-5" />}
              iconPosition="right"
            >
              Learn How It Works
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-br from-gradient-start to-gradient-mid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full p-6 flex flex-col items-center text-center" variant="glass">
                  <div className="rounded-full bg-white/10 p-3 mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</h3>
                  <p className="text-white/80 mt-1">{stat.title}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section 
        ref={featuresRef}
        className="py-24 bg-night-dark"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge variant="sunset" className="mb-4">Core Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Revolutionizing Real Estate Investment
            </h2>
            <p className="mt-4 text-xl text-white/80">
              Our platform leverages blockchain technology to transform how you invest in real estate
            </p>
          </motion.div>

          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
          >
            {/* Fractional Ownership */}
            <motion.div variants={fadeIn} className="relative">
              <Card className="p-6 md:p-8 h-full" variant="dark" hover glow>
                <div className="flex flex-col h-full">
                  <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-6">
                    <Coins className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Fractional Ownership via NFTs</h3>
                  <p className="text-white/80 mb-6 flex-grow">
                    Convert real estate properties into NFTs representing shares, allowing users to own fractions of properties starting from just $100. Break down the barriers to real estate investing and build a diversified portfolio.
                  </p>
                  <div>
                    <Link to="/properties" className="text-secondary-400 font-medium flex items-center group">
                      Explore Properties
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 bg-secondary-500/10 rounded-full blur-xl"></div>
              </Card>
            </motion.div>

            {/* Smart Contract Automation */}
            <motion.div variants={fadeIn} className="relative">
              <Card className="p-6 md:p-8 h-full" variant="dark" hover glow>
                <div className="flex flex-col h-full">
                  <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-6">
                    <Lock className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Smart Contract Automation</h3>
                  <p className="text-white/80 mb-6 flex-grow">
                    Automate rent collection, profit distribution, and property management tasks through smart contracts. Enjoy transparent transactions with no middlemen, resulting in lower fees and faster payouts.
                  </p>
                  <div>
                    <Link to="#" className="text-secondary-400 font-medium flex items-center group">
                      Learn About Smart Contracts
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-20 w-20 bg-primary-500/10 rounded-full blur-xl"></div>
              </Card>
            </motion.div>

            {/* Arbitrum Integration */}
            <motion.div variants={fadeIn} className="relative">
              <Card className="p-6 md:p-8 h-full" variant="dark" hover glow>
                <div className="flex flex-col h-full">
                  <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-6">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Arbitrum Integration</h3>
                  <p className="text-white/80 mb-6 flex-grow">
                    Utilize Arbitrum's Layer 2 solution for fast, low-cost transactions, enhancing user experience. Enjoy the security of Ethereum with significantly lower gas fees and faster confirmation times for seamless investing.
                  </p>
                  <div>
                    <Link to="#" className="text-secondary-400 font-medium flex items-center group">
                      Why Arbitrum?
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
                <div className="absolute top-0 left-0 -mt-4 -ml-4 h-20 w-20 bg-primary-500/10 rounded-full blur-xl"></div>
              </Card>
            </motion.div>

            {/* Global Access */}
            <motion.div variants={fadeIn} className="relative">
              <Card className="p-6 md:p-8 h-full" variant="dark" hover glow>
                <div className="flex flex-col h-full">
                  <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-6">
                    <Globe className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Global Access</h3>
                  <p className="text-white/80 mb-6 flex-grow">
                    Enable users from around the world to invest in tokenized real estate with minimal capital. Access premium real estate markets regardless of your location, opening up investment opportunities previously unavailable to international investors.
                  </p>
                  <div>
                    <Link to="/marketplace" className="text-secondary-400 font-medium flex items-center group">
                      Browse Marketplace
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 -mb-4 -mr-4 h-20 w-20 bg-secondary-500/10 rounded-full blur-xl"></div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        id="how-it-works"
        ref={howItWorksRef}
        className="py-24 bg-gradient-to-br from-primary-900 to-night-dark"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="sunset" className="mb-4">Process</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-white/80 max-w-3xl mx-auto">
              BlockEstate makes real estate investment accessible to everyone through blockchain technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Building className="h-8 w-8" />,
                title: "Select a Property",
                description: "Browse our curated selection of high-quality properties and choose ones that match your investment goals.",
                delay: 0
              },
              {
                icon: <Coins className="h-8 w-8" />,
                title: "Purchase Tokens",
                description: "Buy property tokens with as little as $100, instantly becoming a fractional owner with full blockchain verification.",
                delay: 0.2
              },
              {
                icon: <PieChart className="h-8 w-8" />,
                title: "Earn Returns",
                description: "Receive automated rental income and appreciation directly to your wallet through our smart contracts.",
                delay: 0.4
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="relative"
              >
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-4 z-0">
                    <div className="h-1 bg-gradient-to-r from-primary-500 to-secondary-500 w-full mt-4 relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 w-3 h-3 bg-secondary-500 rounded-full"></div>
                    </div>
                  </div>
                )}

                <div className="z-10 relative flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-4 relative">
                    {step.icon}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary-500 text-white text-sm flex items-center justify-center">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/80">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <Button
              href="/properties"
              variant="gradient"
              size="lg"
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="right"
              animated
              glow
            >
              Start Investing
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-night-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <Badge variant="sunset" className="mb-4">Opportunities</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Featured Properties
              </h2>
              <p className="mt-4 text-xl text-white/80">
                Explore our curated selection of high-yield real estate opportunities
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Button
                href="/properties"
                variant="ghost"
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
              >
                View All Properties
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        ref={testimonialsRef}
        className="py-12 bg-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center">What Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="p-6 h-full flex flex-col" variant="glass">
                  <div className="mb-6 flex-grow">
                    <div className="relative">
                      <svg className="h-12 w-12 text-secondary-400 absolute -top-6 -left-6 opacity-50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-lg text-white/80 relative">{testimonial.quote}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                      <img src={testimonial.avatar} alt={testimonial.author} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-bold text-white">{testimonial.author}</h4>
                      <p className="text-sm text-white/60">{testimonial.title}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-secondary-500"></div>
        <div className="absolute inset-0 w-full h-full opacity-20">
          <div className="absolute top-0 -left-24 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-70"></div>
          <div className="absolute bottom-0 -right-24 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-70"></div>
        </div>

        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-0 lg:flex-1"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to invest in real estate?</span>
              <span className="block text-white">Start with as little as $100 today.</span>
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-md">
              Join thousands of investors around the world who are already building wealth through blockchain-powered real estate investments.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex lg:mt-0 lg:flex-shrink-0 lg:ml-8 space-x-4"
          >
            <Button
              href="/properties"
              variant="gradient"
              size="lg"
              className="bg-white text-primary-700 hover:bg-primary-50"
              animated
              glow
            >
              Get Started
            </Button>
            <Button
              href="/dashboard"
              variant="ghost"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10"
            >
              View Dashboard
            </Button>
          </motion.div>
        </div>
      </section>
      {/* Company Information Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-primary-900 to-night-dark text-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">About Block Estate</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-secondary-400">Transforming Real Estate. Empowering Futures.</h3>
                  <p className="text-white/80">
                    At Block Estate, we're reimagining real estate investment through the power of blockchain. 
                    Our mission is to break down barriers and make property ownership more accessible, transparent, 
                    and inclusive for everyone. We're not just building a platform—we're shaping the future of real 
                    estate through decentralization, innovation, and community-driven growth.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-secondary-400">A Visionary Team</h3>
                  <p className="text-white/80">
                    Joining Block Estate means becoming part of a bold and passionate team that's redefining what's 
                    possible in the PropTech space. From blockchain developers to real estate strategists, our people 
                    are united by a shared purpose: to democratize property investment and unlock new opportunities for all.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-secondary-400">At Block Estate, you'll experience:</h3>
                  <ul className="space-y-4">
                    <li className="flex">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-secondary-500 mr-3 mt-0.5">
                        <Users className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">A Culture of Collaboration</h4>
                        <p className="text-white/70 text-sm">
                          We foster an open, inclusive environment where teamwork thrives and every voice counts. 
                          Collaboration isn't just encouraged—it's at the heart of everything we do.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-secondary-500 mr-3 mt-0.5">
                        <Lock className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Empowerment and Ownership</h4>
                        <p className="text-white/70 text-sm">
                          Here, you're trusted to take initiative, lead with ideas, and own your impact. 
                          We believe great things happen when individuals are empowered to drive change.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-secondary-500 mr-3 mt-0.5">
                        <RefreshCw className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Growth and Learning</h4>
                        <p className="text-white/70 text-sm">
                          As the industry evolves, so will you. With hands-on experience, expert mentorship, 
                          and access to cutting-edge blockchain technologies, your growth journey never stops.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-secondary-500 mr-3 mt-0.5">
                        <Globe className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Impactful Work</h4>
                        <p className="text-white/70 text-sm">
                          Be part of something bigger. Your contributions will help revolutionize how people 
                          invest in real estate—making it more secure, more transparent, and more inclusive than ever before.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-secondary-400">Why Block Estate?</h3>
                  <ul className="space-y-4">
                    <li className="flex">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-secondary-500 mr-3 mt-0.5">
                        <Database className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Blockchain-Driven Innovation</h4>
                        <p className="text-white/70 text-sm">
                          We're leading the shift to decentralized property ownership with real-world utility, transparency, and trust.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-secondary-500 mr-3 mt-0.5">
                        <ArrowUpRight className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Limitless Opportunities</h4>
                        <p className="text-white/70 text-sm">
                          Whether you're just starting your career or looking to level up, Block Estate offers a launchpad to thrive, innovate, and lead.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-secondary-500 mr-3 mt-0.5">
                        <Users className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Diverse and Inclusive by Design</h4>
                        <p className="text-white/70 text-sm">
                          We celebrate diverse ideas and backgrounds, creating a workplace where everyone has the freedom to grow and make a difference.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-secondary-500 mr-3 mt-0.5">
                        <Globe className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Real Impact</h4>
                        <p className="text-white/70 text-sm">
                          Your work won't just be seen—it will change how people engage with property investment across the globe.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={() => setShowModal(false)}
                  variant="gradient"
                  size="md"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;