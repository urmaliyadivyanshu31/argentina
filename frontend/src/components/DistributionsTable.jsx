'use client';

import { useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import { SkeletonTable } from './ui/Skeleton';
import { distributionsApi } from '../lib/api';
import { ethers } from 'ethers';

export default function DistributionsTable({ refreshTrigger }) {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [proposing, setProposing] = useState(null);

  useEffect(() => {
    loadDistributions();
  }, [refreshTrigger]);

  const loadDistributions = async () => {
    try {
      const result = await distributionsApi.getAll(50, 0);
      setDistributions(result.data);
    } catch (error) {
      toast.error('Failed to load distributions');
      console.error('Failed to load distributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropose = async (id, name) => {
    setProposing(id);
    const loadingToast = toast.loading(`Proposing "${name}" to Safe...`);

    try {
      await distributionsApi.propose(id);
      await loadDistributions();
      toast.success('Transaction proposed to Safe', {
        id: loadingToast,
        description: 'Awaiting multisig approval',
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error('Failed to propose transaction', {
        id: loadingToast,
        description: errorMsg,
      });
    } finally {
      setProposing(null);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'executed':
        return 'success';
      case 'failed':
        return 'error';
      case 'proposed':
      case 'executing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatAmount = (amount) => {
    try {
      return ethers.formatEther(amount);
    } catch {
      return amount;
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (loading) {
    return (
      <div className="border-4 border-black bg-white p-0">
        <div className="bg-black text-white p-6 border-b-4 border-black">
          <h2 className="text-title font-black uppercase tracking-tight">
            DISTRIBUTIONS
          </h2>
        </div>
        <div className="p-6">
          <SkeletonTable rows={5} cols={5} />
        </div>
      </div>
    );
  }

  if (distributions.length === 0) {
    return (
      <div className="border-4 border-black bg-white p-0">
        {/* Header */}
        <div className="bg-black text-white p-6 border-b-4 border-black">
          <h2 className="text-title font-black uppercase tracking-tight">
            DISTRIBUTIONS
          </h2>
        </div>

        {/* Empty State */}
        <div className="p-16 text-center">
          <div className="inline-block border-4 border-black p-8 mb-6 bg-white">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-title font-bold mb-3 uppercase tracking-tight">
            NO DISTRIBUTIONS YET
          </h3>
          <p className="text-small text-gray-600 max-w-md mx-auto">
            Upload a CSV file to create your first distribution
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-4 border-black bg-white p-0 shadow-[8px_8px_0_#000]">
      <div className="bg-black text-white p-6 border-b-4 border-black">
        <div className="flex items-center justify-between">
          <h2 className="text-title font-black uppercase tracking-tight">
            DISTRIBUTIONS
          </h2>
          <span className="text-micro text-white font-bold">
            {distributions.length} TOTAL
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Token</th>
              <th>Recipients</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {distributions.map((dist, index) => (
                <motion.tr
                  key={dist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setExpandedId(expandedId === dist.id ? null : dist.id)}
                  className="cursor-pointer"
                >
                  <td className="font-medium">{dist.name}</td>
                  <td>
                    <span className="text-micro text-gray-600">
                      {dist.type}
                    </span>
                  </td>
                  <td>
                    <span className="text-mono text-small">{dist.token_symbol}</span>
                  </td>
                  <td className="text-center">{dist.total_recipients}</td>
                  <td>
                    <Badge variant={getStatusVariant(dist.status)}>
                      {dist.status}
                    </Badge>
                  </td>
                  <td className="text-small text-gray-600">
                    {formatDistance(new Date(dist.created_at), new Date(), {
                      addSuffix: true,
                    })}
                  </td>
                  <td>
                    {dist.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePropose(dist.id, dist.name);
                        }}
                        loading={proposing === dist.id}
                        disabled={proposing !== null}
                      >
                        Propose
                      </Button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expandedId && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 bg-gray-50 overflow-hidden"
          >
            {(() => {
              const dist = distributions.find((d) => d.id === expandedId);
              if (!dist) return null;

              return (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-micro text-gray-600 mb-1">TOKEN ADDRESS</p>
                      <button
                        onClick={() => copyToClipboard(dist.token_address, 'Address')}
                        className="text-mono text-small hover:text-black transition-colors"
                      >
                        {truncateAddress(dist.token_address)}
                      </button>
                    </div>
                    <div>
                      <p className="text-micro text-gray-600 mb-1">TOTAL AMOUNT</p>
                      <p className="text-small font-medium">
                        {formatAmount(dist.total_amount)} {dist.token_symbol}
                      </p>
                    </div>
                    <div>
                      <p className="text-micro text-gray-600 mb-1">RECIPIENTS</p>
                      <p className="text-small font-medium">{dist.total_recipients}</p>
                    </div>
                    <div>
                      <p className="text-micro text-gray-600 mb-1">STATUS</p>
                      <Badge variant={getStatusVariant(dist.status)}>
                        {dist.status}
                      </Badge>
                    </div>
                  </div>

                  {dist.safe_tx_hash && (
                    <div>
                      <p className="text-micro text-gray-600 mb-1">SAFE TX HASH</p>
                      <button
                        onClick={() => copyToClipboard(dist.safe_tx_hash, 'Transaction hash')}
                        className="text-mono text-small hover:text-black transition-colors"
                      >
                        {dist.safe_tx_hash}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
