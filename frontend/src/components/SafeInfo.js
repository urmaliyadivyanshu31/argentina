'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Key, CheckCircle2 } from 'lucide-react';
import { safeApi } from '../lib/api';

export default function SafeInfo() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSafeInfo();
  }, []);

  const loadSafeInfo = async () => {
    try {
      const result = await safeApi.getInfo();
      setInfo(result.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load Safe info');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-8 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-yellow-900 text-lg mb-2">Safe Configuration Needed</h3>
            <p className="text-sm text-yellow-800">
              Configure your Safe multisig wallet in the environment variables to enable transaction proposals.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
          <Shield className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Safe Multisig
          </h2>
          <p className="text-xs text-gray-500 font-medium">Secure Wallet Protection</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 mb-2">Safe Address</p>
          <p className="font-mono text-sm text-gray-900 break-all bg-white p-3 rounded-lg border border-gray-300">{info.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border-2 border-blue-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users size={20} className="text-white" />
              </div>
              <p className="text-xs font-bold text-blue-700">Owners</p>
            </div>
            <p className="text-3xl font-black text-blue-900">{info.owners?.length || 0}</p>
          </div>

          <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-green-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <Key size={20} className="text-white" />
              </div>
              <p className="text-xs font-bold text-green-700">Threshold</p>
            </div>
            <p className="text-3xl font-black text-green-900">{info.threshold || 0}</p>
          </div>
        </div>

        {info.owners && info.owners.length > 0 && (
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Owner Addresses
            </p>
            <div className="space-y-2">
              {info.owners.map((owner, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl font-mono text-xs break-all border border-gray-200 hover:border-indigo-300 transition-colors duration-200">
                  <span className="text-indigo-600 font-bold mr-2">#{index + 1}</span>
                  <span className="text-gray-800">{owner}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" size={20} />
            <p className="text-sm font-bold text-green-800">
              {info.threshold} of {info.owners?.length} signatures required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
