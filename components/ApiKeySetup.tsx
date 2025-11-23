'use client';

import { useState, useEffect } from 'react';

export default function ApiKeySetup() {
  const [alphaVantageKey, setAlphaVantageKey] = useState('');
  const [showSetup, setShowSetup] = useState(false);

  // Load existing keys
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAlphaVantageKey(localStorage.getItem('alpha_vantage_api_key') || '');
    }
  }, []);

  const saveKeys = () => {
    if (typeof window !== 'undefined') {
      if (alphaVantageKey) {
        localStorage.setItem('alpha_vantage_api_key', alphaVantageKey);
        alert('API key saved! You can now update stock prices.');
      } else {
        alert('Please enter an API key.');
        return;
      }
      setShowSetup(false);
      window.location.reload();
    }
  };

  if (!showSetup) {
    return (
      <button
        onClick={() => setShowSetup(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
      >
        Configure API Keys
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Configure Alpha Vantage API Key</h2>
        <p className="text-sm text-gray-600 mb-4">
          Alpha Vantage supports NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) symbols.
        </p>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Alpha Vantage API Key (Required)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Get your free API key at: <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">alphavantage.co/support/#api-key</a>
            </p>
            <p className="text-xs text-gray-500 mb-2">
              Free tier: 5 API calls per minute, 500 calls per day
            </p>
            <input
              type="text"
              value={alphaVantageKey}
              onChange={(e) => setAlphaVantageKey(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Alpha Vantage API key"
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm font-semibold text-blue-900 mb-2">NSE Symbol Format:</p>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Use NSE symbols directly: <code className="bg-blue-100 px-1 rounded">RELIANCE</code>, <code className="bg-blue-100 px-1 rounded">TCS</code>, <code className="bg-blue-100 px-1 rounded">INFY</code></li>
              <li>Or use explicit format: <code className="bg-blue-100 px-1 rounded">NSE:RELIANCE</code></li>
              <li>For BSE: <code className="bg-blue-100 px-1 rounded">BSE:500325</code></li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveKeys}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Save Keys
          </button>
          <button
            onClick={() => setShowSetup(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

