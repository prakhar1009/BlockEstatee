import React, { useState } from 'react';
import { useAccount, useBalance, useNetwork, useEnsName } from 'wagmi';
import { Link } from 'react-router-dom';
import { Wallet, ArrowRightLeft, Clock, Send, CreditCard, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const WalletPage = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { chain } = useNetwork();
  const { data: ensName } = useEnsName({ address });
  const [showingSendModal, setShowingSendModal] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  // Mock transaction data
  const transactions = [
    { id: 1, type: 'received', amount: '0.5 ETH', from: '0x1234...7890', to: 'You', date: '2025-04-10 14:30', status: 'completed' },
    { id: 2, type: 'sent', amount: '0.2 ETH', from: 'You', to: '0xabcd...ef01', date: '2025-04-08 09:15', status: 'completed' },
    { id: 3, type: 'sent', amount: '1.0 ETH', from: 'You', to: '0x9876...5432', date: '2025-04-05 17:45', status: 'pending' },
    { id: 4, type: 'received', amount: '0.8 ETH', from: '0x5678...1234', to: 'You', date: '2025-04-01 11:20', status: 'completed' },
  ];

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would connect to blockchain
    alert(`Transaction initiated: ${amount} ETH to ${recipientAddress}`);
    setShowingSendModal(false);
    setRecipientAddress('');
    setAmount('');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <Wallet className="h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Connect Your Wallet</h1>
            <p className="mt-2 text-gray-500 max-w-md text-center">
              Please connect your wallet to view your balance and transactions.
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
        <h1 className="text-3xl font-bold text-gray-900">Your Wallet</h1>
        <p className="mt-2 text-gray-600">Manage your crypto assets and transactions</p>

        {/* Wallet Overview */}
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-xl font-semibold">Wallet Address</h2>
                <div className="mt-2 flex items-center">
                  <span className="text-lg font-mono">
                    {ensName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '')}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(address || '');
                      alert('Address copied to clipboard');
                    }}
                    className="ml-2 p-1 rounded-md bg-white bg-opacity-20 hover:bg-opacity-30"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-blue-100">
                  Connected to {chain?.name || 'Unknown Network'}
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex flex-col items-end">
                <h2 className="text-xl font-semibold">Balance</h2>
                <p className="text-3xl font-bold">
                  {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
                </p>
                <p className="text-blue-100">
                  Estimated value: ${balance ? (parseFloat(balance.formatted) * 3000).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setShowingSendModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Swap
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Buy
              </button>
            </div>
          </div>
        </div>

        {/* Asset List */}
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Assets</h3>
          </div>
          <div className="bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value (USD)
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold">ETH</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Ethereum</div>
                          <div className="text-sm text-gray-500">ETH</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'} ETH
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${balance ? (parseFloat(balance.formatted) * 3000).toFixed(2) : '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setShowingSendModal(true)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Send
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Swap
                      </button>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-600 font-bold">ARB</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Arbitrum</div>
                          <div className="text-sm text-gray-500">ARB</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">150.0000 ARB</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">$225.00</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        Send
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        Swap
                      </button>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-bold">USDC</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">USD Coin</div>
                          <div className="text-sm text-gray-500">USDC</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">500.0000 USDC</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">$500.00</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        Send
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        Swap
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
          </div>
          <div className="bg-white overflow-hidden">
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From/To
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.type === 'received' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {tx.type === 'received' ? 'Received' : 'Sent'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tx.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tx.type === 'received' ? (
                            <span>From: {tx.from}</span>
                          ) : (
                            <span>To: {tx.to}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {tx.status === 'completed' ? (
                            <span className="inline-flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Completed
                            </span>
                          ) : tx.status === 'pending' ? (
                            <span className="inline-flex items-center text-yellow-600">
                              <Clock className="h-4 w-4 mr-1" />
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-600">
                              <XCircle className="h-4 w-4 mr-1" />
                              Failed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center">
                <AlertCircle className="h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Transactions</h3>
                <p className="mt-1 text-gray-500">You haven't made any transactions yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Send Modal */}
        {showingSendModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Send className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Send Tokens
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Send tokens to another wallet address.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSendSubmit} className="mt-5">
                    <div className="mb-4">
                      <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                        Recipient Address
                      </label>
                      <input
                        type="text"
                        id="recipient"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="0x..."
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                        Token
                      </label>
                      <select
                        id="token"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option>ETH</option>
                        <option>ARB</option>
                        <option>USDC</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          id="amount"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                          step="0.0001"
                          min="0.0001"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">ETH</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Available Balance:</span>
                        <span className="text-gray-900">
                          {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'} ETH
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-500">Estimated Gas Fee:</span>
                        <span className="text-gray-900">~0.0005 ETH</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowingSendModal(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;