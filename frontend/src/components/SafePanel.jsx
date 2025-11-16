'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';
import { safeApi } from '../lib/api';

export default function SafePanel() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSafeInfo();
  }, []);

  const loadSafeInfo = async () => {
    try {
      const result = await safeApi.getInfo();
      setInfo(result.data);
    } catch (err) {
      // Silent fail - Safe configuration is optional
      console.log('Safe not configured:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  if (loading) {
    return (
      <div className="border-4 border-black bg-white p-0">
        <div className="bg-black text-white p-6 border-b-4 border-black">
          <h3 className="text-title font-black uppercase tracking-tight">
            SAFE MULTISIG
          </h3>
        </div>
        <div className="p-6 space-y-3">
          <Skeleton height="60px" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton height="80px" />
            <Skeleton height="80px" />
          </div>
        </div>
      </div>
    );
  }

  if (!info) {
    return null; // Don't show anything if Safe is not configured
  }

  return (
    <div className="border-4 border-black bg-white p-0 shadow-[8px_8px_0_#000]">
      <div className="bg-black text-white p-6 border-b-4 border-black">
        <h3 className="text-title font-black uppercase tracking-tight">
          SAFE MULTISIG
        </h3>
        <p className="text-micro text-gray-400 mt-1">SECURE WALLET PROTECTION</p>
      </div>

      <div className="p-6">

      <div className="space-y-4">
        {/* Safe Address */}
        <div>
          <p className="text-micro text-gray-600 mb-2">SAFE ADDRESS</p>
          <button
            onClick={() => copyToClipboard(info.address, 'Address')}
            className="w-full text-left p-3 bg-gray-50 border border-gray-200 rounded text-mono text-small hover:border-black transition-colors"
          >
            {truncateAddress(info.address)}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ borderColor: 'var(--color-black)' }}
            className="border border-gray-200 p-4 rounded"
          >
            <p className="text-micro text-gray-600 mb-2">OWNERS</p>
            <p className="text-headline">{info.owners?.length || 0}</p>
          </motion.div>

          <motion.div
            whileHover={{ borderColor: 'var(--color-black)' }}
            className="border border-gray-200 p-4 rounded"
          >
            <p className="text-micro text-gray-600 mb-2">THRESHOLD</p>
            <p className="text-headline">{info.threshold || 0}</p>
          </motion.div>
        </div>

        {/* Owner Addresses */}
        {info.owners && info.owners.length > 0 && (
          <div>
            <p className="text-micro text-gray-600 mb-2">OWNER ADDRESSES</p>
            <div className="space-y-2">
              {info.owners.map((owner, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => copyToClipboard(owner, `Owner ${index + 1}`)}
                  className="w-full text-left p-2 bg-gray-50 border border-gray-200 rounded hover:border-black transition-colors"
                >
                  <span className="text-micro text-gray-500 mr-2">#{index + 1}</span>
                  <span className="text-mono text-small">{truncateAddress(owner)}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Signature Requirement */}
        <div className="p-4 bg-gray-50 border-2 border-black">
          <p className="text-small text-center font-medium">
            <span className="font-bold text-black">{info.threshold}</span>
            <span className="text-gray-700"> OF </span>
            <span className="font-bold text-black">{info.owners?.length}</span>
            <span className="text-gray-700"> SIGNATURES REQUIRED</span>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
