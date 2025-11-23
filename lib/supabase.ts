import { createClient } from '@supabase/supabase-js';
import { Investment } from '@/types/investment';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://vqjnfvpdrqpjlakefbly.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxam5mdnBkcnFwamxha2VmYmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTc1NjEsImV4cCI6MjA3OTQ5MzU2MX0.GIf1EQwCVYdVZEdIc_7OD2_U3bDKvn4kGFh-v6_09w0';

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');
};

// Create Supabase client
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database table name
const INVESTMENTS_TABLE = 'investments';

// Helper to get user ID (using localStorage for now, can be upgraded to auth later)
const getUserId = (): string => {
  if (typeof window !== 'undefined') {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_id', userId);
    }
    return userId;
  }
  return 'default_user';
};

// Load investments from Supabase
export const loadInvestments = async (): Promise<Investment[]> => {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured. Please set up your environment variables.');
    return [];
  }

  try {
    const userId = getUserId();
    const { data, error } = await supabase
      .from(INVESTMENTS_TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading investments:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      symbol: item.symbol || undefined,
      quantity: item.quantity,
      purchasePrice: item.purchase_price,
      purchaseDate: item.purchase_date,
      currentPrice: item.current_price || undefined,
      currentValue: item.current_value || undefined,
      profitLoss: item.profit_loss || undefined,
      profitLossPercent: item.profit_loss_percent || undefined,
    }));
  } catch (error) {
    console.error('Error loading investments:', error);
    return [];
  }
};

// Save investments to Supabase
export const saveInvestments = async (investments: Investment[]): Promise<void> => {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured. Cannot save investments.');
    return;
  }

  try {
    const userId = getUserId();
    
    // Delete all existing investments for this user
    await supabase
      .from(INVESTMENTS_TABLE)
      .delete()
      .eq('user_id', userId);

    // Insert all investments
    if (investments.length > 0) {
      const investmentsToInsert = investments.map((inv) => ({
        user_id: userId,
        id: inv.id,
        type: inv.type,
        name: inv.name,
        symbol: inv.symbol || null,
        quantity: inv.quantity,
        purchase_price: inv.purchasePrice,
        purchase_date: inv.purchaseDate,
        current_price: inv.currentPrice || null,
        current_value: inv.currentValue || null,
        profit_loss: inv.profitLoss || null,
        profit_loss_percent: inv.profitLossPercent || null,
      }));

      const { error } = await supabase
        .from(INVESTMENTS_TABLE)
        .insert(investmentsToInsert);

      if (error) {
        console.error('Error saving investments:', error);
      }
    }
  } catch (error) {
    console.error('Error saving investments:', error);
  }
};

// Add a single investment
export const addInvestment = async (investment: Investment): Promise<void> => {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured. Cannot add investment.');
    return;
  }

  try {
    const userId = getUserId();
    const { error } = await supabase
      .from(INVESTMENTS_TABLE)
      .insert({
        user_id: userId,
        id: investment.id,
        type: investment.type,
        name: investment.name,
        symbol: investment.symbol || null,
        quantity: investment.quantity,
        purchase_price: investment.purchasePrice,
        purchase_date: investment.purchaseDate,
        current_price: investment.currentPrice || null,
        current_value: investment.currentValue || null,
        profit_loss: investment.profitLoss || null,
        profit_loss_percent: investment.profitLossPercent || null,
      });

    if (error) {
      console.error('Error adding investment:', error);
    }
  } catch (error) {
    console.error('Error adding investment:', error);
  }
};

// Update an investment
export const updateInvestment = async (id: string, updates: Partial<Investment>): Promise<void> => {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured. Cannot update investment.');
    return;
  }

  try {
    const userId = getUserId();
    const updateData: any = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.symbol !== undefined) updateData.symbol = updates.symbol || null;
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.purchasePrice !== undefined) updateData.purchase_price = updates.purchasePrice;
    if (updates.purchaseDate !== undefined) updateData.purchase_date = updates.purchaseDate;
    if (updates.currentPrice !== undefined) updateData.current_price = updates.currentPrice || null;
    if (updates.currentValue !== undefined) updateData.current_value = updates.currentValue || null;
    if (updates.profitLoss !== undefined) updateData.profit_loss = updates.profitLoss || null;
    if (updates.profitLossPercent !== undefined) updateData.profit_loss_percent = updates.profitLossPercent || null;

    const { error } = await supabase
      .from(INVESTMENTS_TABLE)
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating investment:', error);
    }
  } catch (error) {
    console.error('Error updating investment:', error);
  }
};

// Delete an investment
export const deleteInvestment = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured. Cannot delete investment.');
    return;
  }

  try {
    const userId = getUserId();
    const { error } = await supabase
      .from(INVESTMENTS_TABLE)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting investment:', error);
    }
  } catch (error) {
    console.error('Error deleting investment:', error);
  }
};

