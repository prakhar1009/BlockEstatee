import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';
import { PieChart, Wallet, Building, LineChart, ArrowUpRight, ArrowDownRight, Clock, Users, AlertCircle } from 'lucide-react';

// Mock user portfolio data
const mockPortfolio = {
  totalInvested: 5200,
  totalValue: 5850,
  totalProfit: 650,
  profitPercentage: 12.5,
  properties: [
    {
      id: 1,
      title: "Luxury Villa in Miami",
      location: "Miami, FL",
      invested: 3000,
      currentValue: 3450,
      profit: 450,
      profitPercentage: 15,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
      units: 30,
      ownership: 0.3
    },
    {
      id: 3,
      title: "Commercial Office Space",
      location: "Chicago, IL",
      invested: 2200,
      currentValue: 2400,
      profit: 200,
      profitPercentage: 9.1,
      image: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
      units: 22,
      ownership: 0.07
    }
  ],
  transactions: [
    { id: 1, type: "Purchase", property: "Luxury Villa in Miami", amount: 3000, date: "2025-01-15", status: "Completed" },
    { id: 2, type: "Dividend", property: "Luxury Villa in Miami", amount: 65, date: "2025-02-15", status: "Completed" },
    { id: 3, type: "Purchase", property: "Commercial Office Space", amount: 2200, date: "2025-02-20", status: "Completed" },
    { id: 4, type: "Dividend", property: "Luxury Villa in Miami", amount: 65, date: "2025-03-15", status: "Completed" },
    { id: 5, type: "Dividend", property: "Commercial Office Space", amount: 50, date: "2025-03-20", status: "Completed" },
    { id: 6, type: "Dividend", property: "Luxury Villa in Miami", amount: 65, date: "2025-04-15", status: "Pending" }
  ]
};

const DashboardPage = () => {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('portfolio');

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <Wallet className="h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Connect Your Wallet</h1>
            <p className="mt-2 text-gray-500 max-w-md text-center">
              Please connect your wallet to view your dashboard and manage your real estate investments.
            </p>
            <button
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your real estate investments and track your returns</p>

        {/* Portfolio Summary */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Wallet className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Invested</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">${mockPortfolio.totalInvested.toLocaleString()}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <LineChart className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Current Value</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">${mockPortfolio.totalValue.toLocaleString()}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Properties</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{mockPortfolio.properties.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <PieChart className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Profit</dt>
                    <dd className="flex items-center">
                      <div className="text-lg font-medium text-gray-900">${mockPortfolio.totalProfit.toLocaleString()}</div>
                      <span className="ml-2 flex items-center text-sm font-medium text-green-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        {mockPortfolio.profitPercentage}%
                      </span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`${
                  activeTab === 'portfolio'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
              >
                My Portfolio
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('voting')}
                className={`${
                  activeTab === 'voting'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Governance
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {activeTab === 'portfolio' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Properties</h2>
                
                {mockPortfolio.properties.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {mockPortfolio.properties.map((property) => (
                      <div key={property.id} className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <img 
                              src={property.image} 
                              alt={property.title} 
                              className="h-full w-48 object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-900">{property.title}</h3>
                              {property.profitPercentage > 0 ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <ArrowUpRight className="h-3 w-3 mr-1" />
                                  {property.profitPercentage}%
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <ArrowDownRight className="h-3 w-3 mr-1" />
                                  {Math.abs(property.profitPercentage)}%
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{property.location}</p>
                            
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Invested</p>
                                <p className="text-sm font-medium text-gray-900">${property.invested.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Current Value</p>
                                <p className="text-sm font-medium text-gray-900">${property.currentValue.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Units Owned</p>
                                <p className="text-sm font-medium text-gray-900">{property.units}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Ownership</p>
                                <p className="text-sm font-medium text-gray-900">{property.ownership}%</p>
                              </div>
                            </div>
                            
                            <div className="mt-5">
                              <Link
                                to={`/properties/${property.id}`}
                                className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded text-blue-600 bg-white hover:bg-blue-50"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
                    <Building className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Properties Yet</h3>
                    <p className="mt-1 text-gray-500">Browse available properties to start investing.</p>
                    <Link
                      to="/properties"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Browse Properties
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
                
                {mockPortfolio.transactions.length > 0 ? (
                  <div className="mt-6 bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Property
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {mockPortfolio.transactions.map((transaction) => (
                            <tr key={transaction.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(transaction.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  transaction.type === 'Purchase' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {transaction.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {transaction.property}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${transaction.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  transaction.status === 'Completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {transaction.status === 'Completed' ? (
                                    <>✓ {transaction.status}</>
                                  ) : (
                                    <><Clock className="h-3 w-3 mr-1" /> {transaction.status}</>
                                  )}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
                    <AlertCircle className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Transactions Yet</h3>
                    <p className="mt-1 text-gray-500">Once you invest in properties, your transactions will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'voting' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Governance & Voting</h2>
                <p className="mt-2 text-gray-600">
                  As a property owner, you have voting rights on important decisions related to your investments.
                </p>
                
                <div className="mt-6 bg-white overflow-hidden shadow-sm rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Active Proposals</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Vote on current proposals for properties you own.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Property Renovation Approval</h4>
                          <p className="text-sm text-gray-500">Luxury Villa in Miami</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            2 days left
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Proposal to approve $50,000 for renovations to increase property value and rental income.
                        </p>
                      </div>
                      <div className="mt-4 flex">
                        <div className="relative flex-grow pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-600">
                            <span>65% Yes</span>
                            <span>35% No</span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                            Vote
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Property Manager Change</h4>
                          <p className="text-sm text-gray-500">Commercial Office Space</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            5 days left
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Proposal to change the property management company to improve service quality and reduce costs.
                        </p>
                      </div>
                      <div className="mt-4 flex">
                        <div className="relative flex-grow pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div style={{ width: "48%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-600">
                            <span>48% Yes</span>
                            <span>52% No</span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                            Vote
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-white overflow-hidden shadow-sm rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Past Proposals</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Review the outcomes of previous governance votes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Annual Budget Approval</h4>
                          <p className="text-sm text-gray-500">Luxury Villa in Miami</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Approved
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Annual budget for property maintenance and operations.
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>78% participation • 92% Yes • 8% No</span>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Rental Rate Increase</h4>
                          <p className="text-sm text-gray-500">Commercial Office Space</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Rejected
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Proposal to increase rental rates by 15% for all tenants.
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>82% participation • 38% Yes • 62% No</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;