'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Button from './ui/Button';
import Input from './ui/Input';
import { distributionsApi } from '../lib/api';

export default function DistributionUploader({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'LOOPDROP',
    tokenAddress: '0x00fdbc53719604d924226215bc871d55e40a1009',
    tokenSymbol: 'LOOP',
  });
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      toast.success(`File selected: ${selectedFile.name}`);
    } else {
      toast.error('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    if (!formData.name || !formData.tokenAddress || !formData.tokenSymbol) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Creating distribution...');

    try {
      const result = await distributionsApi.uploadCSV(file, formData);

      toast.success('Distribution created successfully', {
        id: loadingToast,
        description: `${result.data?.recipientCount || 0} recipients added`,
      });

      setFile(null);
      setFormData({
        name: '',
        type: 'LOOPDROP',
        tokenAddress: '0x00fdbc53719604d924226215bc871d55e40a1009',
        tokenSymbol: 'LOOP',
      });

      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Upload failed';
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-4 border-black bg-white p-0 shadow-[8px_8px_0_#000]">
      {/* Form Header */}
      <div className="bg-black text-white p-6 border-b-4 border-black">
        <div className="flex items-center justify-between">
          <h2 className="text-title font-black uppercase tracking-tight">
            CREATE DISTRIBUTION
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => distributionsApi.downloadTemplate()}
            className="!bg-white !text-black !border-white"
          >
            ↓ TEMPLATE
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Distribution Name */}
        <div>
          <Input
            label="Distribution Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Q1 2025 LOOP REWARDS"
            required
          />
        </div>

        {/* Type + Token Symbol in Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="label">Distribution Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input"
            >
              <option value="LOOPDROP">LOOPDROP</option>
              <option value="LOYALTY">LOYALTY REWARDS</option>
            </select>
          </div>

          <div>
            <Input
              label="Token Symbol"
              type="text"
              value={formData.tokenSymbol}
              onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value })}
              placeholder="LOOP"
              required
            />
          </div>
        </div>

        {/* Token Address */}
        <div>
          <Input
            label="Token Address"
            type="text"
            value={formData.tokenAddress}
            onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })}
            placeholder="0x..."
            className="text-mono text-small"
            required
          />
        </div>

        {/* File Upload - BRUTAL */}
        <div>
          <label className="label mb-4">CSV File Upload</label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-4 p-12 text-center cursor-pointer
              transition-all duration-200
              ${
                dragActive
                  ? 'border-black bg-black text-white transform -translate-x-1 -translate-y-1'
                  : file
                  ? 'border-black bg-white'
                  : 'border-gray-900 bg-white hover:border-black'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
            />

            {file ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="space-y-3"
              >
                <div className="inline-block border-4 border-black p-3 bg-white">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-body font-bold">{file.name}</p>
                <p className="text-small text-gray-600">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className={`inline-block border-4 p-4 ${dragActive ? 'border-white' : 'border-black'}`}>
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-body font-bold mb-2">
                    {dragActive ? 'DROP FILE HERE' : 'CLICK OR DRAG CSV'}
                  </p>
                  <p className="text-small text-gray-600">
                    CSV files only • Max 500 recipients
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={!file}
          className="w-full !text-body"
        >
          {loading ? 'CREATING...' : 'CREATE DISTRIBUTION'}
        </Button>
      </form>

      {/* Bottom Stripe */}
      <div className="bg-gray-100 border-t-4 border-black px-8 py-4">
        <div className="flex items-center justify-between text-small">
          <p className="text-gray-600">
            <span className="font-bold text-black">{file ? '1' : '0'}</span> file selected
          </p>
          <p className="text-gray-600">
            Ready to distribute to <span className="font-bold text-black">up to 500</span> recipients
          </p>
        </div>
      </div>
    </div>
  );
}
