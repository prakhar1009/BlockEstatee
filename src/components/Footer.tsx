import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Twitter, Github, Linkedin, Mail, ChevronRight, ExternalLink } from 'lucide-react';
import Button from './ui/Button';

const Footer = () => {
  return (
    <footer className="bg-night-dark text-white">
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="rounded-xl bg-gradient-to-r from-primary-700 to-secondary-700 p-6 sm:p-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:max-w-md">
              <h3 className="text-xl font-bold text-white">Stay updated</h3>
              <p className="mt-2 text-white/80">
                Subscribe to our newsletter for the latest investment opportunities, market insights, and platform updates.
              </p>
            </div>
            <div className="flex-1 md:ml-8">
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 rounded-md bg-white/20 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-white/50" 
                />
                <Button 
                  type="submit" 
                  variant="sunset"
                  icon={<ChevronRight className="h-4 w-4" />}
                  iconPosition="right"
                  glow
                >
                  Subscribe
                </Button>
              </form>
              <p className="mt-2 text-xs text-white/60">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-secondary-500" />
              <span className="ml-2 text-xl font-bold font-display">BlockEstate</span>
            </div>
            <p className="mt-4 text-sm text-white/70">
              A decentralized platform revolutionizing real estate investment through blockchain technology. Fractional ownership, automated payouts, transparent transactions.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-white/70 hover:text-secondary-400 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-white/70 hover:text-secondary-400 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-white/70 hover:text-secondary-400 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-white/70 hover:text-secondary-400 transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/nft-generator" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  NFT Generator
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-secondary-400 transition-colors flex items-center">
                  Whitepaper <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  Developer Tools
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-secondary-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-white/60">&copy; 2025 BlockEstate. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <p className="text-sm text-white/60">Powered by Arbitrum</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;