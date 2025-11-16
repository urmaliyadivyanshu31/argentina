'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';
import { distributionsApi } from '../lib/api';

export default function AnalyticsPanel({ refreshTrigger }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [refreshTrigger]);

  const loadAnalytics = async () => {
    try {
      const result = await distributionsApi.getAll(100, 0);
      const distributions = result.data || [];

      // Calculate stats
      const total = distributions.length;
      const byStatus = distributions.reduce((acc, d) => {
        acc[d.status] = (acc[d.status] || 0) + 1;
        return acc;
      }, {});

      const byType = distributions.reduce((acc, d) => {
        acc[d.type] = (acc[d.type] || 0) + 1;
        return acc;
      }, {});

      const totalRecipients = distributions.reduce(
        (sum, d) => sum + (d.total_recipients || 0),
        0
      );

      setStats({
        total,
        byStatus,
        byType,
        totalRecipients,
        chartData: [
          {
            name: 'PENDING',
            value: byStatus.pending || 0,
          },
          {
            name: 'PROPOSED',
            value: byStatus.proposed || 0,
          },
          {
            name: 'EXECUTED',
            value: byStatus.executed || 0,
          },
        ],
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="border-4 border-black bg-white p-0 shadow-[8px_8px_0_#000]">
        <div className="bg-black text-white p-6 border-b-4 border-black">
          <h3 className="text-title font-black uppercase tracking-tight">
            ANALYTICS
          </h3>
        </div>
        <div className="p-6 space-y-3">
          <Skeleton height="80px" />
          <Skeleton height="120px" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="border-4 border-black bg-white p-0 shadow-[8px_8px_0_#000]">
      <div className="bg-black text-white p-6 border-b-4 border-black">
        <h3 className="text-title font-black uppercase tracking-tight">
          ANALYTICS
        </h3>
      </div>

      <div className="p-6">

      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-gray-200 p-4 rounded"
          >
            <p className="text-micro text-gray-600 mb-1">TOTAL</p>
            <p className="text-headline">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="border border-gray-200 p-4 rounded"
          >
            <p className="text-micro text-gray-600 mb-1">RECIPIENTS</p>
            <p className="text-headline">{stats.totalRecipients}</p>
          </motion.div>
        </div>

        {/* Status Distribution Chart */}
        {stats.total > 0 && (
          <div>
            <p className="text-micro text-gray-600 mb-3">DISTRIBUTION BY STATUS</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={stats.chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#737373' }}
                />
                <YAxis hide />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === stats.chartData.length - 1 ? '#000000' : '#e5e5e5'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Type Breakdown */}
        <div>
          <p className="text-micro text-gray-600 mb-2">BY TYPE</p>
          <div className="space-y-2">
            {Object.entries(stats.byType).map(([type, count], index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded"
              >
                <span className="text-small">{type}</span>
                <span className="text-small font-medium">{count}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div>
          <p className="text-micro text-gray-600 mb-2">BY STATUS</p>
          <div className="space-y-2">
            {Object.entries(stats.byStatus).map(([status, count], index) => (
              <motion.div
                key={status}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded"
              >
                <span className="text-small capitalize">{status}</span>
                <span className="text-small font-medium">{count}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
