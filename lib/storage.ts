import { Investment } from '@/types/investment';

const STORAGE_KEY = 'investracker_investments';

export const saveInvestments = (investments: Investment[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(investments));
  }
};

export const loadInvestments = (): Investment[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Error parsing investments:', e);
        return [];
      }
    }
  }
  return [];
};

export const addInvestment = (investment: Investment): void => {
  const investments = loadInvestments();
  investments.push(investment);
  saveInvestments(investments);
};

export const updateInvestment = (id: string, updates: Partial<Investment>): void => {
  const investments = loadInvestments();
  const index = investments.findIndex(inv => inv.id === id);
  if (index !== -1) {
    investments[index] = { ...investments[index], ...updates };
    saveInvestments(investments);
  }
};

export const deleteInvestment = (id: string): void => {
  const investments = loadInvestments();
  const filtered = investments.filter(inv => inv.id !== id);
  saveInvestments(filtered);
};

