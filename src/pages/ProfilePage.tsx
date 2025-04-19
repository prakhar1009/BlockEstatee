import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { 
  User, 
  Edit, 
  Key, 
  Shield, 
  Bell, 
  Settings, 
  LogOut, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle,
  Calendar
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationsContext';

const tabVariants = {
  active: {
    borderColor: 'rgb(79, 70, 229)',
    color: 'rgb(79, 70, 229)',
    backgroundColor: 'rgb(238, 242, 255)',
  },
  inactive: {
    borderColor: 'transparent',
    color: 'rgb(107, 114, 128)',
    backgroundColor: 'transparent',
  },
};

const ProfilePage = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('profile');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addNotification } = useNotifications();

  const mockPrivateKey = "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z";

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-5 w-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const handleSaveProfile = () => {
    addNotification(
      'Profile Updated',
      'Your profile information has been successfully updated.',
      'success'
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    addNotification(
      'Copied to Clipboard',
      'The information has been copied to your clipboard.',
      'info'
    );
  };

  const toggleShowPrivateKey = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center">
              <div className="rounded-full bg-gray-100 mx-auto h-20 w-20 flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h1>
              <p className="text-gray-600 mb-6">
                Please connect your wallet to access your profile settings and manage your account.
              </p>
              <Button variant="primary" size="lg">
                Connect Wallet
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-t-xl text-white p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <div className="bg-white rounded-full p-2 mb-4 sm:mb-0">
                <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-500" />
                </div>
              </div>
              <div className="sm:ml-6 flex flex-col items-center sm:items-start">
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-primary-100 mt-1">Manage your account settings and preferences</p>
                <div className="mt-4 flex items-center">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ''}
                  </span>
                  <button 
                    className="ml-2 p-1 rounded-full bg-white/10 hover:bg-white/20"
                    onClick={() => copyToClipboard(address || '')}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-300" />
                    ) : (
                      <Copy className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-b-xl overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto py-3 px-4">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-lg mr-4 border-2"
                    onClick={() => setActiveTab(tab.id)}
                    variants={tabVariants}
                    animate={activeTab === tab.id ? 'active' : 'inactive'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first-name"
                          className="input mt-1"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last-name"
                          className="input mt-1"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="input mt-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        className="input mt-1"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Brief description about yourself for your public profile.
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleSaveProfile}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <Card className="p-5 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 flex items-center">
                            <Key className="h-5 w-5 mr-2 text-primary-500" />
                            Your Private Key
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Keep this key secret. Anyone with your private key can access your wallet.
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={toggleShowPrivateKey}
                            className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                          >
                            {showPrivateKey ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(mockPrivateKey)}
                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 ml-2"
                          >
                            <Copy className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="bg-gray-100 p-3 rounded-md font-mono text-sm break-all">
                          {showPrivateKey ? mockPrivateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-5 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-primary-500" />
                            Two-Factor Authentication
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Add an extra layer of security to your account.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="warning">Not Enabled</Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          Enable 2FA
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="p-5 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-primary-500" />
                            Recent Login Activity
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Review your recent account activity for security purposes.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-800">Arbitrum Network Login</p>
                            <p className="text-xs text-gray-500">IP: 192.168.1.1</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">April 15, 2025</p>
                            <p className="text-xs text-gray-500">10:15 AM</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-800">Metamask Connection</p>
                            <p className="text-xs text-gray-500">IP: 192.168.1.1</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">April 14, 2025</p>
                            <p className="text-xs text-gray-500">3:45 PM</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <p className="text-sm font-medium text-gray-800">New Device Login</p>
                            <p className="text-xs text-gray-500">IP: 42.125.18.3</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">April 10, 2025</p>
                            <p className="text-xs text-gray-500">9:20 AM</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                      <div className="mt-3 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Investment Updates</p>
                            <p className="text-xs text-gray-500">Receive updates on your property investments</p>
                          </div>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input type="checkbox" id="investment-updates" className="sr-only" defaultChecked />
                            <div className="block h-6 bg-gray-200 rounded-full w-10"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Property Listings</p>
                            <p className="text-xs text-gray-500">Get notified about new property listings</p>
                          </div>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input type="checkbox" id="property-listings" className="sr-only" defaultChecked />
                            <div className="block h-6 bg-gray-200 rounded-full w-10"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Dividend Payments</p>
                            <p className="text-xs text-gray-500">Get notified when you receive dividend payments</p>
                          </div>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input type="checkbox" id="dividend-payments" className="sr-only" defaultChecked />
                            <div className="block h-6 bg-gray-200 rounded-full w-10"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">App Notifications</h3>
                      <div className="mt-3 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Price Alerts</p>
                            <p className="text-xs text-gray-500">Notify me when token prices change significantly</p>
                          </div>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input type="checkbox" id="price-alerts" className="sr-only" defaultChecked />
                            <div className="block h-6 bg-gray-200 rounded-full w-10"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Governance Proposals</p>
                            <p className="text-xs text-gray-500">Get notified about new governance proposals</p>
                          </div>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input type="checkbox" id="governance-proposals" className="sr-only" defaultChecked />
                            <div className="block h-6 bg-gray-200 rounded-full w-10"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">System Updates</p>
                            <p className="text-xs text-gray-500">Receive notifications about platform updates</p>
                          </div>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input type="checkbox" id="system-updates" className="sr-only" />
                            <div className="block h-6 bg-gray-200 rounded-full w-10"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="primary">
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Display Preferences</h3>
                      <div className="mt-3">
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                          Theme
                        </label>
                        <select
                          id="theme"
                          name="theme"
                          className="select mt-1"
                          defaultValue="light"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System Default</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Language & Region</h3>
                      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                            Language
                          </label>
                          <select
                            id="language"
                            name="language"
                            className="select mt-1"
                            defaultValue="en"
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                            Currency
                          </label>
                          <select
                            id="currency"
                            name="currency"
                            className="select mt-1"
                            defaultValue="usd"
                          >
                            <option value="usd">USD ($)</option>
                            <option value="eur">EUR (€)</option>
                            <option value="gbp">GBP (£)</option>
                            <option value="jpy">JPY (¥)</option>
                            <option value="eth">ETH (Ξ)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        Account Actions
                      </h3>
                      <div className="mt-4 space-y-3">
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto text-left"
                          icon={<Edit className="h-4 w-4" />}
                        >
                          Export Account Data
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto text-left"
                          icon={<LogOut className="h-4 w-4" />}
                        >
                          Sign Out from All Devices
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto text-left text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;