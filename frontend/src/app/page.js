'use client';

import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import DistributionUploader from '../components/DistributionUploader';
import DistributionsTable from '../components/DistributionsTable';
import SafePanel from '../components/SafePanel';
import AnalyticsPanel from '../components/AnalyticsPanel';
import CommandPalette from '../components/CommandPalette';
import { CommandPaletteContext } from '../contexts/CommandPaletteContext';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { setIsCommandPaletteOpen } = useContext(CommandPaletteContext);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Global keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  return (
    <div className="min-h-screen bg-white">
      <CommandPalette onRefresh={() => setRefreshTrigger(prev => prev + 1)} />

      {/* Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="container py-12">
          <div className="flex items-start justify-between mb-12">
            <div>
              <h1 className="text-display mb-3 font-black tracking-tight">
                LOOPDROP
                <br />
                DISTRIBUTOR
              </h1>
              <p className="text-body text-gray-700 max-w-md">
                Automated token distribution with Safe multisig integration
              </p>
            </div>

            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>⌘K</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border-2 border-black p-6 bg-white hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_#000] transition-all"
            >
              <p className="text-micro text-gray-600 mb-2 font-bold">GAS SAVINGS</p>
              <p className="text-headline font-black">60%+</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border-2 border-black p-6 bg-white hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_#000] transition-all"
            >
              <p className="text-micro text-gray-600 mb-2 font-bold">MAX BATCH</p>
              <p className="text-headline font-black">500</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-2 border-black p-6 bg-white hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_#000] transition-all"
            >
              <p className="text-micro text-gray-600 mb-2 font-bold">SECURITY</p>
              <p className="text-headline font-black">SAFE</p>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content (70%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8 space-y-8"
          >
            <DistributionUploader onSuccess={handleUploadSuccess} />
            <DistributionsTable refreshTrigger={refreshTrigger} />
          </motion.div>

          {/* Right Sidebar (30%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-4 space-y-8"
          >
            <SafePanel />
            <AnalyticsPanel refreshTrigger={refreshTrigger} />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-8 border-black mt-32 bg-white">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-headline font-black mb-4 tracking-tight">
                LOOPDROP
              </h3>
              <p className="text-small text-gray-700 leading-relaxed">
                Automated token distribution system with Safe multisig integration.
                Built for security, efficiency, and scale.
              </p>
            </div>

            <div>
              <h4 className="text-micro font-bold mb-4 uppercase tracking-wider text-gray-600">
                FEATURES
              </h4>
              <ul className="space-y-2 text-small text-gray-700">
                <li className="font-medium">→ Batch Token Distribution</li>
                <li className="font-medium">→ Safe Multisig Security</li>
                <li className="font-medium">→ 60%+ Gas Savings</li>
                <li className="font-medium">→ CSV Upload Support</li>
                <li className="font-medium">→ Complete Audit Trail</li>
              </ul>
            </div>

            <div>
              <h4 className="text-micro font-bold mb-4 uppercase tracking-wider text-gray-600">
                TECH STACK
              </h4>
              <ul className="space-y-2 text-small text-gray-700">
                <li className="font-medium">→ Next.js 14</li>
                <li className="font-medium">→ Safe Protocol Kit</li>
                <li className="font-medium">→ Solidity Smart Contracts</li>
                <li className="font-medium">→ HyperEVM Network</li>
                <li className="font-medium">→ Framer Motion</li>
              </ul>
            </div>
          </div>

          <div className="border-t-4 border-black pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <p className="text-small font-bold text-gray-900">
                  LOOPING COLLECTIVE
                </p>
                <div className="w-1 h-4 bg-black"></div>
                <p className="text-small text-gray-600">
                  Argentina Hack 2025
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="border-2 border-black px-4 py-2 bg-white">
                  <p className="text-micro font-bold uppercase tracking-wider">
                    HACKATHON BUILD
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
