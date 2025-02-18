import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  CreditCard, 
  Link as LinkIcon,
  Upload,
  Edit,
  Check,
  AlertTriangle
} from 'lucide-react';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    dailySession: true,
    weeklyPerformance: true,
    betaUpdates: false,
    psychologyTips: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'connections', label: 'Trading Accounts', icon: LinkIcon }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-400">
          Manage your profile, notifications, and trading connections
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 font-medium rounded-t-lg transition-colors
              ${activeTab === tab.id 
                ? 'text-emerald-400 border-b-2 border-emerald-400' 
                : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-3 gap-8">
            {/* Profile Picture */}
            <div className="col-span-1">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                    Change Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="col-span-2">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-6">Personal Details</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Trader"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                      Change Password
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
            <div className="space-y-6">
              {[
                {
                  id: 'dailySession',
                  title: 'Daily Session Summary',
                  description: 'Receive a daily email with your trading performance and behavioral insights'
                },
                {
                  id: 'weeklyPerformance',
                  title: 'Weekly Performance Report',
                  description: 'Get detailed weekly analysis of your trading patterns and strategy effectiveness'
                },
                {
                  id: 'betaUpdates',
                  title: 'Beta Features & Updates',
                  description: 'Be the first to know about new features and improvements'
                },
                {
                  id: 'psychologyTips',
                  title: 'Psychology Insights',
                  description: 'Receive personalized trading psychology tips based on your behavior patterns'
                }
              ].map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({
                      ...prev,
                      [item.id]: !prev[item.id as keyof typeof notifications]
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${notifications[item.id as keyof typeof notifications] 
                        ? 'bg-emerald-600' 
                        : 'bg-gray-600'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${notifications[item.id as keyof typeof notifications] 
                          ? 'translate-x-6' 
                          : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-emerald-400 font-medium">Pro Plan</span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-400">
                    Your subscription renews on April 15, 2024
                  </p>
                </div>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium">
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-400">Expires 12/24</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded">
                    Default
                  </span>
                </div>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                  + Add Payment Method
                </button>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6">Billing History</h2>
              <div className="space-y-4">
                {[
                  { date: 'Mar 15, 2024', amount: '$29.00', status: 'Paid' },
                  { date: 'Feb 15, 2024', amount: '$29.00', status: 'Paid' },
                  { date: 'Jan 15, 2024', amount: '$29.00', status: 'Paid' }
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-gray-400">{invoice.amount}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Check className="w-4 h-4" />
                        {invoice.status}
                      </span>
                      <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trading Accounts */}
        {activeTab === 'connections' && (
          <div className="space-y-6">
            {/* CSV Upload */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6">Import Trade History</h2>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">
                  Drag and drop your CSV file here, or
                </p>
                <button className="text-emerald-400 hover:text-emerald-300 font-medium">
                  browse files
                </button>
              </div>
            </div>

            {/* Connected Platforms */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6">Connected Platforms</h2>
              <div className="space-y-4">
                {[
                  {
                    name: 'TradingView',
                    status: 'coming-soon',
                    icon: 'https://www.tradingview.com/static/images/favicon.ico'
                  },
                  {
                    name: 'Binance',
                    status: 'coming-soon',
                    icon: 'https://public.bnbstatic.com/static/images/common/favicon.ico'
                  },
                  {
                    name: 'MetaTrader',
                    status: 'coming-soon',
                    icon: 'https://www.metatrader4.com/i/favicon.ico'
                  }
                ].map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={platform.icon}
                        alt={platform.name}
                        className="w-8 h-8 rounded"
                      />
                      <div>
                        <p className="font-medium">{platform.name}</p>
                        <p className="text-sm text-gray-400">
                          {platform.status === 'coming-soon' 
                            ? 'Integration coming soon' 
                            : 'Connected'
                          }
                        </p>
                      </div>
                    </div>
                    <button
                      disabled={platform.status === 'coming-soon'}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      {platform.status === 'coming-soon' && (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                      {platform.status === 'coming-soon' ? 'Coming Soon' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;