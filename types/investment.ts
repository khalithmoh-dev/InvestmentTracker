export type InvestmentType = 'gold' | 'stocks' | 'crypto' | 'cash';

export interface Investment {
  id: string;
  type: InvestmentType;
  name: string;
  symbol?: string; // For stocks and crypto
  quantity: number;
  purchasePrice: number;
  purchaseDate: string; // ISO date string
  currentPrice?: number;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercent?: number;
}

export interface PriceData {
  price: number;
  currency: string;
}

