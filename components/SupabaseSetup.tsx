'use client';

import { useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function SupabaseSetup() {
  const [showSetup, setShowSetup] = useState(false);

  // Check if Supabase is configured
  const configured = isSupabaseConfigured();

  if (configured) {
    return null; // Don't show setup if already configured
  }

  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-yellow-900 mb-2">
            ⚠️ Supabase Not Configured
          </h3>
          <p className="text-sm text-yellow-800 mb-3">
            Your app needs Supabase to store data in the cloud. Set it up in 5 minutes (completely free).
          </p>
          <button
            onClick={() => setShowSetup(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm font-medium"
          >
            View Setup Instructions
          </button>
        </div>
      </div>

      {showSetup && (
        <div className="mt-4 pt-4 border-t border-yellow-300">
          <div className="bg-white rounded p-4 space-y-4">
            <h4 className="font-bold text-gray-900">Quick Setup Guide:</h4>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-700">1. Create Supabase Account (Free)</p>
                <p className="text-gray-600">Visit <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">supabase.com</a> and sign up (takes 1 minute)</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">2. Create New Project</p>
                <p className="text-gray-600">Click "New Project", choose a name, set password, and create</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">3. Get API Keys</p>
                <p className="text-gray-600">Go to Settings → API, copy Project URL and anon/public key</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">4. Set Up Database</p>
                <p className="text-gray-600">Go to SQL Editor, run the SQL from <code className="bg-gray-100 px-1 rounded">supabase-setup.sql</code> file</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">5. Add Environment Variables</p>
                <p className="text-gray-600">Create <code className="bg-gray-100 px-1 rounded">.env.local</code> file with:</p>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
{`SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key`}
                </pre>
              </div>

              <div>
                <p className="font-semibold text-gray-700">6. Restart App</p>
                <p className="text-gray-600">Restart your dev server: <code className="bg-gray-100 px-1 rounded">npm run dev</code></p>
              </div>
            </div>

            <button
              onClick={() => setShowSetup(false)}
              className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

