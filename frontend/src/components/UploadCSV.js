'use client';

import { useState } from 'react';
import { Upload, Download, CheckCircle, XCircle, Loader, FileText } from 'lucide-react';
import { distributionsApi } from '../lib/api';

export default function UploadCSV({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'LOOPDROP',
    tokenAddress: '0x00fdbc53719604d924226215bc871d55e40a1009', // LOOP token default
    tokenSymbol: 'LOOP'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!formData.name || !formData.tokenAddress || !formData.tokenSymbol) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await distributionsApi.uploadCSV(file, formData);
      setSuccess(true);

      // Reset form
      setTimeout(() => {
        setFile(null);
        setFormData({
          name: '',
          type: 'LOOPDROP',
          tokenAddress: '0x00fdbc53719604d924226215bc871d55e40a1009',
          tokenSymbol: 'LOOP'
        });
        setSuccess(false);

        if (onSuccess) {
          onSuccess(result.data);
        }
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
            <FileText className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Upload Distribution
          </h2>
        </div>
        <button
          onClick={() => distributionsApi.downloadTemplate()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Download size={16} />
          Template
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Distribution Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Distribution Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
            placeholder="e.g., LOOP Q1 2025 Rewards"
            required
          />
        </div>

        {/* Distribution Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 cursor-pointer"
          >
            <option value="LOOPDROP">LoopDrop</option>
            <option value="LOYALTY">Loyalty Rewards</option>
          </select>
        </div>

        {/* Token Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Token Address
          </label>
          <input
            type="text"
            value={formData.tokenAddress}
            onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm transition-all duration-200 hover:border-gray-300"
            placeholder="0x..."
            required
          />
        </div>

        {/* Token Symbol */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Token Symbol
          </label>
          <input
            type="text"
            value={formData.tokenSymbol}
            onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
            placeholder="LOOP"
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            CSV File
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className={`flex items-center justify-center gap-3 w-full px-6 py-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                file
                  ? 'border-green-400 bg-green-50 hover:bg-green-100'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
            >
              {file ? (
                <>
                  <CheckCircle size={24} className="text-green-500" />
                  <span className="text-gray-700 font-medium">{file.name}</span>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-gray-600 font-medium">Click to upload CSV file</span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 animate-shake">
            <XCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 animate-bounce">
            <CheckCircle size={20} />
            <span className="font-medium">Distribution created successfully!</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:scale-100"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            <>
              <Upload size={20} />
              Create Distribution
            </>
          )}
        </button>
      </form>
    </div>
  );
}
