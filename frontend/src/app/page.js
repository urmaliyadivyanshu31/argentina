'use client';

import { useState } from 'react';
import UploadCSV from '../components/UploadCSV';
import DistributionsList from '../components/DistributionsList';
import SafeInfo from '../components/SafeInfo';
import { Package, Shield, Zap, Users } from 'lucide-react';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Package size={40} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                LoopDrop Distributor
              </h1>
              <p className="text-xl text-indigo-100 mt-2">
                Secure batch token distribution with Safe multisig
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Zap className="text-yellow-300" size={24} />
                <div>
                  <p className="text-3xl font-bold">60%+</p>
                  <p className="text-sm text-indigo-100">Gas Savings</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Shield className="text-green-300" size={24} />
                <div>
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-sm text-indigo-100">Secure</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Users className="text-blue-300" size={24} />
                <div>
                  <p className="text-3xl font-bold">500</p>
                  <p className="text-sm text-indigo-100">Max Recipients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Safe Info */}
          <div className="lg:col-span-1 space-y-8">
            <UploadCSV onSuccess={handleUploadSuccess} />
            <SafeInfo />
          </div>

          {/* Right Column - Distributions List */}
          <div className="lg:col-span-2">
            <DistributionsList refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
          <h3 className="text-3xl font-bold mb-8 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h4 className="font-bold mb-2 text-lg">Upload CSV</h4>
              <p className="text-indigo-100 text-sm">Download template and fill with recipient addresses</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h4 className="font-bold mb-2 text-lg">Validate</h4>
              <p className="text-indigo-100 text-sm">System checks addresses, amounts, and duplicates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h4 className="font-bold mb-2 text-lg">Propose to Safe</h4>
              <p className="text-indigo-100 text-sm">Create multisig transaction for team approval</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <span className="text-3xl font-bold">4</span>
              </div>
              <h4 className="font-bold mb-2 text-lg">Execute</h4>
              <p className="text-indigo-100 text-sm">Distribute tokens to all recipients instantly</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Built for <span className="font-semibold text-indigo-600">Looping Collective</span> •
            Powered by <span className="font-semibold text-purple-600">Safe Multisig</span> •
            Secured by <span className="font-semibold text-pink-600">Smart Contracts</span>
          </p>
        </div>
      </div>
    </main>
  );
}
