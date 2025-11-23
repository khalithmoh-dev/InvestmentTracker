import express, { Request, Response } from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase';

const router = express.Router();

// Get user ID from request (for now using header, can be upgraded to auth)
const getUserId = (req: Request): string => {
  return req.headers['x-user-id'] as string || 'default_user';
};

// Get all investments
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const userId = getUserId(req);
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const investments = (data || []).map((item: any) => ({
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

    res.json(investments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new investment
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const userId = getUserId(req);
    const investment = req.body;

    const { data, error } = await supabase
      .from('investments')
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
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      id: data.id,
      type: data.type,
      name: data.name,
      symbol: data.symbol || undefined,
      quantity: data.quantity,
      purchasePrice: data.purchase_price,
      purchaseDate: data.purchase_date,
      currentPrice: data.current_price || undefined,
      currentValue: data.current_value || undefined,
      profitLoss: data.profit_loss || undefined,
      profitLossPercent: data.profit_loss_percent || undefined,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update investment
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const userId = getUserId(req);
    const { id } = req.params;
    const updates = req.body;

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

    const { data, error } = await supabase
      .from('investments')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      id: data.id,
      type: data.type,
      name: data.name,
      symbol: data.symbol || undefined,
      quantity: data.quantity,
      purchasePrice: data.purchase_price,
      purchaseDate: data.purchase_date,
      currentPrice: data.current_price || undefined,
      currentValue: data.current_value || undefined,
      profitLoss: data.profit_loss || undefined,
      profitLossPercent: data.profit_loss_percent || undefined,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete investment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const userId = getUserId(req);
    const { id } = req.params;

    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk update investments (for price updates)
router.post('/bulk', async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const userId = getUserId(req);
    const investments = req.body;

    // Delete all existing investments for this user
    await supabase
      .from('investments')
      .delete()
      .eq('user_id', userId);

    // Insert all investments
    if (investments.length > 0) {
      const investmentsToInsert = investments.map((inv: any) => ({
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
        .from('investments')
        .insert(investmentsToInsert);

      if (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

