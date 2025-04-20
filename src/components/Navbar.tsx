import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { 
  Building, 
  Home, 
  PieChart, 
  Wallet, 
  Menu, 
  X, 
  Bell, 
  Store, 
  User, 
  Sparkles,
  Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { useNotifications } from '../contexts/NotificationsContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const location = useLocation();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleConnectWallet = () => {
    connect();
    setIsOpen(false);
  };

  const handleDisconnectWallet = () => {
    disconnect();
    setIsOpen(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markAllAsRead();
    }
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { path: '/properties', label: 'Properties', icon: <Building className="h-5 w-5" /> },
    { path: '/marketplace', label: 'Marketplace', icon: <Store className="h-5 w-5" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <PieChart className="h-5 w-5" /> },
    { path: '/real-estate-nft', label: 'NFT Properties', icon: <Landmark className="h-5 w-5" /> },
    { path: '/nft-generator', label: 'NFT Generator', icon: <Sparkles className="h-5 w-5" /> },
  ];

  const navClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${isScrolled 
      ? 'bg-night-dark/90 backdrop-blur-md shadow-md py-2' 
      : 'bg-night-dark/60 backdrop-blur-md py-3'}
  `;

  return (
    <div className="h-16 sm:h-20">
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Building className="h-8 w-8 text-gradient-mid" />
                <span className="ml-2 text-xl font-bold text-white font-display">BlockEstate</span>
              </Link>
              <div className="hidden lg:ml-10 lg:flex lg:space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium 
                    ${location.pathname === link.path 
                      ? 'text-secondary-400 border-b-2 border-secondary-500' 
                      : 'text-white/80 hover:text-white border-b-2 border-transparent hover:border-white/30'}`}
                  >
                    {link.icon}
                    <span className="ml-1">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              {isConnected && (
                <div className="relative">
                  <button
                    className="p-1 rounded-full text-white/80 hover:text-white focus:outline-none"
                    onClick={toggleNotifications}
                  >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-secondary-500 ring-2 ring-night-dark" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-night-light rounded-md shadow-lg overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-gray-700">
                          <h3 className="text-sm font-medium text-white">Notifications</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-700">
                              {notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`p-4 hover:bg-primary-900 cursor-pointer ${!notification.read ? 'bg-primary-900/50' : ''}`}
                                  onClick={() => handleNotificationClick(notification.id)}
                                >
                                  <div className="flex items-start">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white">{notification.title}</p>
                                      <p className="text-sm text-white/70">{notification.message}</p>
                                      <p className="text-xs text-white/50 mt-1">
                                        {new Date(notification.timestamp).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-white/50">
                              No notifications
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {isConnected ? (
                <div className="flex items-center">
                  <Link to="/wallet" className="p-1 rounded-full text-white/80 hover:text-white">
                    <Wallet className="h-6 w-6" />
                  </Link>
                  <div className="relative ml-3">
                    <div>
                      <Link to="/profile" className="flex items-center space-x-3 bg-primary-800/50 p-1 rounded-full hover:bg-primary-800">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-primary-700 border border-primary-600">
                          <div className="h-full w-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-white">
                            {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : ''}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDisconnectWallet();
                            }}
                            className="ml-2 text-xs"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => connect()}
                  variant="gradient"
                  size="sm"
                  icon={<Wallet className="h-4 w-4" />}
                  animated
                  glow
                >
                  Connect Wallet
                </Button>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-white hover:bg-primary-800 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden bg-night-light border-b border-gray-700"
            >
              <div className="pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      location.pathname === link.path
                        ? 'border-secondary-500 text-secondary-400 bg-primary-900/50'
                        : 'border-transparent text-white/70 hover:bg-primary-800 hover:border-white/30 hover:text-white'
                    }`}
                    onClick={toggleMenu}
                  >
                    <div className="flex items-center">
                      {link.icon}
                      <span className="ml-2">{link.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                {isConnected ? (
                  <div className="flex flex-col space-y-3 px-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-primary-700 border border-primary-600">
                        <div className="h-full w-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">
                          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                        </div>
                        <Link
                          to="/wallet"
                          className="text-sm font-medium text-secondary-400 hover:text-secondary-300"
                          onClick={toggleMenu}
                        >
                          View Wallet
                        </Link>
                      </div>
                    </div>
                    <div>
                      <Button
                        onClick={handleDisconnectWallet}
                        variant="outline"
                        size="sm"
                        fullWidth
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4">
                    <Button
                      onClick={handleConnectWallet}
                      variant="gradient"
                      fullWidth
                      icon={<Wallet className="h-5 w-5" />}
                      glow
                    >
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;