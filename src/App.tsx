import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createWeb3Modal } from '@web3modal/wagmi';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ToastContainer } from 'react-toastify';
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
import Loader from './components/ui/Loader';
import NotificationsProvider from './contexts/NotificationsContext';

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrum],
  [publicProvider()]
);

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: 'YOUR_WEB3MODAL_PROJECT_ID', // Replace with your Web3Modal project ID
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-accent-color': '#6633cc',
    '--w3m-background-color': '#6633cc',
  },
});

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading app resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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