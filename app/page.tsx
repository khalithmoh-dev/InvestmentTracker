'use client';

import { useState, useEffect } from 'react';
import { Investment } from '@/types/investment';
import { loadInvestments, saveInvestments, addInvestment, deleteInvestment } from '@/lib/supabase';
import { updateInvestmentPrices, formatCurrency } from '@/lib/utils';
import InvestmentForm from '@/components/InvestmentForm';
import InvestmentCard from '@/components/InvestmentCard';
import ApiKeySetup from '@/components/ApiKeySetup';
import SupabaseSetup from '@/components/SupabaseSetup';

export default function Home() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const loaded = await loadInvestments();
        setInvestments(loaded);
      } catch (error) {
        console.error('Error loading investments:', error);
      }
    };
    loadData();
  }, []);

  const handleAddInvestment = async (investment: Investment) => {
    try {
      if (editingInvestment) {
        // Update existing investment
        const updated = investments.map(inv => 
          inv.id === investment.id ? investment : inv
        );
        setInvestments(updated);
        await saveInvestments(updated);
      } else {
        // Add new investment
        await addInvestment(investment);
        setInvestments([...investments, investment]);
      }
      setShowForm(false);
      setEditingInvestment(undefined);
    } catch (error) {
      console.error('Error saving investment:', error);
      alert('Error saving investment. Please try again.');
    }
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setShowForm(true);
  };

  const handleDeleteInvestment = async (id: string) => {
    if (confirm('Are you sure you want to delete this investment?')) {
      try {
        await deleteInvestment(id);
        setInvestments(investments.filter(inv => inv.id !== id));
      } catch (error) {
        console.error('Error deleting investment:', error);
        alert('Error deleting investment. Please try again.');
      }
    }
  };

  const handleUpdatePrices = async () => {
    setLoading(true);
    try {
      const updated = await updateInvestmentPrices(investments);
      setInvestments(updated);
      await saveInvestments(updated);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error updating prices:', error);
      alert('Error updating prices. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const totalInvested = investments.reduce(
    (sum, inv) => {
      // For cash, purchasePrice is the total amount
      if (inv.type === 'cash') {
        return sum + inv.purchasePrice;
      }
      return sum + inv.quantity * inv.purchasePrice;
    },
    0
  );

  const totalCurrentValue = investments.reduce(
    (sum, inv) => {
      // For cash, value is always the purchasePrice (no market fluctuations)
      if (inv.type === 'cash') {
        return sum + inv.purchasePrice;
      }
      return sum + (inv.currentValue ?? inv.quantity * inv.purchasePrice);
    },
    0
  );

  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Investracker</h1>
          <p className="text-gray-600">Track your investments in Gold, Stocks, Crypto, and Cash</p>
        </header>

        <SupabaseSetup />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Invested</p>
            <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Current Value</p>
            <p className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total P&L</p>
            <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfitLoss)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total P&L %</p>
            <p className={`text-2xl font-bold ${totalProfitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfitLossPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6 flex-wrap items-center">
          <button
            onClick={() => {
              setEditingInvestment(undefined);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            + Add Investment
          </button>
          <button
            onClick={handleUpdatePrices}
            disabled={loading || investments.length === 0}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Prices'}
          </button>
          <ApiKeySetup />
          {lastUpdated && (
            <p className="text-sm text-gray-600 self-center">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Investments Grid */}
        {investments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No investments yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Your First Investment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investments.map((investment) => (
              <InvestmentCard
                key={investment.id}
                investment={investment}
                onDelete={handleDeleteInvestment}
                onEdit={handleEditInvestment}
              />
            ))}
          </div>
        )}

        {showForm && (
          <InvestmentForm
            onSave={handleAddInvestment}
            onCancel={() => {
              setShowForm(false);
              setEditingInvestment(undefined);
            }}
            investment={editingInvestment}
          />
        )}
      </div>
    </main>
  );
}

