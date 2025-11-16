'use client';

import { useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { Package, Clock, CheckCircle, XCircle, AlertCircle, Send, TrendingUp } from 'lucide-react';
import { distributionsApi } from '../lib/api';
import { ethers } from 'ethers';

export default function DistributionsList({ refreshTrigger }) {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [proposing, setProposing] = useState(false);

  useEffect(() => {
    loadDistributions();
  }, [refreshTrigger]);

  const loadDistributions = async () => {
    try {
      const result = await distributionsApi.getAll(50, 0);
      setDistributions(result.data);
    } catch (error) {
      console.error('Failed to load distributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropose = async (id) => {
    setProposing(true);
    try {
      await distributionsApi.propose(id);
      await loadDistributions();
      alert('Transaction proposed to Safe multisig successfully!');
    } catch (error) {
      alert('Failed to propose transaction: ' + (error.response?.data?.error || error.message));
    } finally {
      setProposing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'proposed':
        return <AlertCircle className="text-blue-500" size={20} />;
      case 'executed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300',
      proposed: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
      executing: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300',
      executed: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300',
      failed: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatAmount = (amount) => {
    try {
      return ethers.formatEther(amount);
    } catch {
      return amount;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Loading distributions...</p>
        </div>
      </div>
    );
  }

  if (distributions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl p-16 text-center border border-indigo-100">
        <div className="flex flex-col items-center">
          <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6">
            <Package className="text-indigo-600" size={64} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Distributions Yet</h3>
          <p className="text-gray-600 max-w-md">
            Upload a CSV file to create your first distribution and start sending tokens to your community!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="px-8 py-6 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Distributions</h2>
          </div>
          <div className="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <p className="text-white font-bold text-sm">{distributions.length} Total</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {distributions.map((dist) => (
          <div
            key={dist.id}
            className="p-6 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-indigo-500"
            onClick={() => setSelectedId(selectedId === dist.id ? null : dist.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(dist.status)}
                  <h3 className="text-xl font-bold text-gray-800">{dist.name}</h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-xs font-bold border-2 border-indigo-200">
                    {dist.type}
                  </span>
                  {getStatusBadge(dist.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Token</p>
                    <p className="font-bold text-gray-900 text-lg">{dist.token_symbol}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Recipients</p>
                    <p className="font-bold text-blue-900 text-lg">{dist.total_recipients}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <p className="text-xs font-semibold text-green-600 mb-1">Total Amount</p>
                    <p className="font-bold text-green-900 text-lg">{formatAmount(dist.total_amount)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <p className="text-xs font-semibold text-purple-600 mb-1">Created</p>
                    <p className="font-bold text-purple-900 text-sm">
                      {formatDistance(new Date(dist.created_at), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {dist.safe_tx_hash && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <p className="text-xs text-blue-700 font-bold mb-2">Safe Transaction Hash:</p>
                    <p className="text-xs font-mono text-blue-900 break-all bg-white p-2 rounded-lg">{dist.safe_tx_hash}</p>
                  </div>
                )}
              </div>

              {dist.status === 'pending' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePropose(dist.id);
                  }}
                  disabled={proposing}
                  className="ml-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100"
                >
                  <Send size={18} />
                  Propose to Safe
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
