import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createWeb3Modal } from '@web3modal/wagmi';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import DashboardPage from './pages/DashboardPage';
import WalletPage from './pages/WalletPage';
import MarketplacePage from './pages/MarketplacePage';
import ProfilePage from './pages/ProfilePage';
import NFTGeneratorPage from './pages/NFTGeneratorPage';
import RealEstateNFTPage from './pages/RealEstateNFTPage';
import Loader from './components/ui/Loader';
import NotificationsProvider from './contexts/NotificationsContext';

// Import blockchain initialization
import { initializeBlockchain } from './utils/initBlockchain';

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrum, arbitrumSepolia], // Add Arbitrum Sepolia for testnet
  [publicProvider()]
);

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

// Get WalletConnect project ID from environment variables
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_WEB3MODAL_PROJECT_ID';

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: walletConnectProjectId,
  chains,
  themeMode: 'dark',
  // Type assertion for the entire themeVariables object to avoid TypeScript errors
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-accent-color': '#6633cc',
    '--w3m-background-color': '#6633cc',
  } as Record<string, string>,
});

function App() {
  const [loading, setLoading] = useState(true);
  // Using blockchainInitialized state to track blockchain initialization status
  const [blockchainInitialized, setBlockchainInitialized] = useState(false);

  useEffect(() => {
    // Initialize app and blockchain services
    const initApp = async () => {
      try {
        // Initialize blockchain services
        const initialized = await initializeBlockchain();
        setBlockchainInitialized(initialized);
        
        if (initialized) {
          console.log('Blockchain services initialized successfully');
        } else {
          console.warn('Blockchain services initialization failed');
          toast.warning('Blockchain services initialization failed. Some features may not work properly.');
        }
        
        // Finish loading after initialization
        setLoading(false);
      } catch (error) {
        console.error('Error during app initialization:', error);
        setLoading(false);
        toast.error('Error initializing the application');
      }
    };

    initApp();
  }, []);
  
  // Log blockchain initialization status when it changes
  useEffect(() => {
    if (blockchainInitialized) {
      console.log('Blockchain features are now available');
    }
  }, [blockchainInitialized]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-night-dark to-primary-900">
        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-30 blur-3xl"></div>
          <Loader size="large" color="primary" />
        </div>
      </div>
    );
  }

  return (
    <WagmiConfig config={config}>
      <NotificationsProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-night-dark to-primary-900">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/nft-generator" element={<NFTGeneratorPage />} />
                <Route path="/real-estate-nft" element={<RealEstateNFTPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </Router>
      </NotificationsProvider>
    </WagmiConfig>
  );
}

export default App;