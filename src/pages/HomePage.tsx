import React, { useRef } from 'react';
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
    title: "Luxury Villa in Miami",
    location: "Miami, FL",
    yield: 8.5,
    type: "Residential",
    price: 1000000,
    raised: 780000,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
    status: "Funding",
    daysLeft: 15,
    investors: 48,
    featured: true
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
    status: "Funding",
    daysLeft: 23,
    investors: 36
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
    status: "Funding",
    daysLeft: 10,
    investors: 52
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

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.3 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1973&q=80')",
            backgroundAttachment: "fixed"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end opacity-90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="primary" size="md" className="mb-6 backdrop-blur-sm bg-white/20 text-white border border-white/20">
                  Powered by Arbitrum
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                  Invest in Real Estate on the <span className="text-secondary-400">Blockchain</span>
                </h1>
                <p className="mt-6 text-xl sm:text-2xl text-white/90 max-w-xl">
                  Fractional ownership with automated payouts. Low barriers to entry. Global access.
                </p>
                
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
                    href="#how-it-works"
                    variant="ghost"
                    size="lg"
                    icon={<ChevronRight className="h-5 w-5" />}
                    iconPosition="right"
                  >
                    Learn How It Works
                  </Button>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2 lg:pl-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary-500 opacity-20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary-400 opacity-20 rounded-full blur-2xl"></div>
                
                <div className="relative bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">Featured Property</h3>
                      <p className="text-white/80">Miami Luxury Villa</p>
                    </div>
                    <Badge variant="sunset" size="md">8.5% Yield</Badge>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80" 
                      alt="Luxury Villa" 
                      className="w-full h-48 object-cover" 
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/90 font-medium">Funding Progress</span>
                        <span className="text-white">78%</span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full"
                          style={{ width: '78%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-white">
                      <div>
                        <p className="text-white/70 text-xs">Price per Token</p>
                        <p className="font-semibold">$100 USDC</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Total Investors</p>
                        <p className="font-semibold">48 Participants</p>
                      </div>
                    </div>
                    
                    <Button
                      href="/properties/1"
                      variant="gradient"
                      size="md"
                      className="w-full"
                      animated
                      glow
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

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
        className="py-24 bg-gradient-to-br from-night-dark to-primary-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="sunset" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              What Our Investors Say
            </h2>
            <p className="mt-4 text-xl text-white/80 max-w-3xl mx-auto">
              Join thousands of satisfied investors who are building wealth through real estate on BlockEstate
            </p>
          </motion.div>

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
    </div>
  );
};

export default HomePage;