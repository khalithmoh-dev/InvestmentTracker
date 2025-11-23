import axios from 'axios';
import { PriceData } from '@/types/investment';

// Free API endpoints
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const ALPHA_VANTAGE_API = 'https://www.alphavantage.co/query';

// Get USD to INR conversion rate
const getUSDToINR = async (): Promise<number> => {
  try {
    // Using a free exchange rate API
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', { timeout: 5000 });
    if (response.data?.rates?.INR) {
      return response.data.rates.INR;
    }
  } catch (error) {
    console.warn('Error fetching exchange rate, using fallback:', error);
  }
  // Fallback rate (approximate)
  return 83;
};

// Get crypto price from CoinGecko in INR (free, no API key needed)
export const getCryptoPrice = async (symbol: string): Promise<PriceData | null> => {
  try {
    // Map common symbols to CoinGecko IDs
    const symbolMap: { [key: string]: string } = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'BNB': 'binancecoin',
      'ADA': 'cardano',
      'SOL': 'solana',
      'XRP': 'ripple',
      'DOGE': 'dogecoin',
      'DOT': 'polkadot',
      'MATIC': 'matic-network',
      'LTC': 'litecoin',
    };

    const coinId = symbolMap[symbol.toUpperCase()] || symbol.toLowerCase();
    
    // Try to get price in INR directly
    let response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: 'inr',
      },
    });

    if (response.data[coinId]?.inr) {
      return {
        price: response.data[coinId].inr,
        currency: 'INR',
      };
    }

    // Fallback: Get USD price and convert to INR
    response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: 'usd',
      },
    });

    if (response.data[coinId]?.usd) {
      const usdToInr = await getUSDToINR();
      return {
        price: response.data[coinId].usd * usdToInr,
        currency: 'INR',
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    return null;
  }
};

// Get stock price in INR using Alpha Vantage API (supports NSE symbols)
export const getStockPrice = async (symbol: string): Promise<PriceData | null> => {
  const symbolUpper = symbol.toUpperCase();
  
  // Get API key from environment or localStorage
  const getApiKey = (key: string, storageKey: string): string | null => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) return stored;
    }
    return process.env[key] || null;
  };

  const alphaVantageKey = getApiKey('NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY', 'alpha_vantage_api_key');
  
  if (!alphaVantageKey) {
    console.warn('Alpha Vantage API key not configured. Please add your free API key.');
    return null;
  }

  try {
    // Format symbol for Alpha Vantage
    // For NSE: Use format "NSE:SYMBOL" or just "SYMBOL" (Alpha Vantage auto-detects)
    // For BSE: Use format "BSE:SYMBOL"
    // For US stocks: Just use symbol
    let formattedSymbol = symbolUpper;
    
    // If symbol doesn't contain exchange prefix, assume it's NSE for Indian stocks
    // Users can also explicitly use "NSE:RELIANCE" or "BSE:500325" format
    if (!symbolUpper.includes(':') && !symbolUpper.includes('.')) {
      // Check if it looks like an Indian stock (NSE format: 2-20 chars, usually uppercase)
      // For now, we'll try with NSE prefix first
      formattedSymbol = `NSE:${symbolUpper}`;
    }

    // Try Alpha Vantage GLOBAL_QUOTE endpoint
    try {
      const response = await axios.get(ALPHA_VANTAGE_API, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: formattedSymbol,
          apikey: alphaVantageKey,
        },
        timeout: 10000,
      });
      
      // Check for API limit message
      if (response.data?.['Note']) {
        console.warn('Alpha Vantage API limit reached. Please wait a minute.');
        return null;
      }
      
      if (response.data?.['Global Quote']?.['05. price']) {
        const priceStr = response.data['Global Quote']['05. price'];
        const price = parseFloat(priceStr);
        
        if (price && price > 0) {
          // Alpha Vantage returns prices in the stock's native currency
          // For NSE stocks, it should already be in INR
          // But let's check the currency from the response
          const currency = response.data['Global Quote']['08. currency'] || 'INR';
          
          if (currency === 'INR') {
            // Already in INR, return directly
            return {
              price: price,
              currency: 'INR',
            };
          } else {
            // Convert from USD to INR if needed
            const usdToInr = await getUSDToINR();
            return {
              price: price * usdToInr,
              currency: 'INR',
            };
          }
        }
      }
    } catch (e: any) {
      // If NSE: prefix fails, try without prefix
      if (formattedSymbol.startsWith('NSE:') && e.response?.status !== 429) {
        try {
          const response = await axios.get(ALPHA_VANTAGE_API, {
            params: {
              function: 'GLOBAL_QUOTE',
              symbol: symbolUpper, // Try without NSE prefix
              apikey: alphaVantageKey,
            },
            timeout: 10000,
          });
          
          if (response.data?.['Note']) {
            console.warn('Alpha Vantage API limit reached.');
            return null;
          }
          
          if (response.data?.['Global Quote']?.['05. price']) {
            const priceStr = response.data['Global Quote']['05. price'];
            const price = parseFloat(priceStr);
            
            if (price && price > 0) {
              const currency = response.data['Global Quote']['08. currency'] || 'INR';
              
              if (currency === 'INR') {
                return {
                  price: price,
                  currency: 'INR',
                };
              } else {
                const usdToInr = await getUSDToINR();
                return {
                  price: price * usdToInr,
                  currency: 'INR',
                };
              }
            }
          }
        } catch (e2: any) {
          console.warn('Alpha Vantage API failed:', e2.message || 'Unknown error');
        }
      } else if (e.response?.status === 429) {
        console.warn('Alpha Vantage API rate limit reached. Please wait.');
      } else {
        console.warn('Alpha Vantage API failed:', e.message || 'Unknown error');
      }
    }

    console.error('Failed to fetch stock price for symbol:', symbolUpper);
    return null;
    
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return null;
  }
};

// Get gold price per gram in INR (using free APIs with fallbacks)
export const getGoldPrice = async (): Promise<PriceData | null> => {
  try {
    // Try using a free gold price API
    // Option 1: Try metals.live (if available) - returns price per ounce
    try {
      const response = await axios.get('https://api.metals.live/v1/spot/gold', { timeout: 5000 });
      if (response.data && Array.isArray(response.data) && response.data[0]?.price) {
        const pricePerOunceUSD = response.data[0].price;
        // Convert ounce to gram (1 ounce = 31.1035 grams)
        const pricePerGramUSD = pricePerOunceUSD / 31.1035;
        // Convert USD to INR
        const usdToInr = await getUSDToINR();
        return {
          price: pricePerGramUSD * usdToInr,
          currency: 'INR',
        };
      }
    } catch (e) {
      // Continue to next option
    }

    // Option 2: Use CoinGecko for gold (they have precious metals)
    try {
      const response = await axios.get(`${COINGECKO_API}/simple/price`, {
        params: {
          ids: 'pax-gold',
          vs_currencies: 'inr',
        },
        timeout: 5000,
      });
      if (response.data?.['pax-gold']?.inr) {
        // PAX Gold is 1:1 with gold, price is per token (1 token = 1 fine troy ounce)
        // Convert ounce to gram (1 ounce = 31.1035 grams)
        const pricePerGram = response.data['pax-gold'].inr / 31.1035;
        return {
          price: pricePerGram,
          currency: 'INR',
        };
      }
      
      // Fallback: Get USD price and convert
      const usdResponse = await axios.get(`${COINGECKO_API}/simple/price`, {
        params: {
          ids: 'pax-gold',
          vs_currencies: 'usd',
        },
        timeout: 5000,
      });
      if (usdResponse.data?.['pax-gold']?.usd) {
        const pricePerOunceUSD = usdResponse.data['pax-gold'].usd;
        const pricePerGramUSD = pricePerOunceUSD / 31.1035;
        const usdToInr = await getUSDToINR();
        return {
          price: pricePerGramUSD * usdToInr,
          currency: 'INR',
        };
      }
    } catch (e) {
      // Continue to fallback
    }

    // Fallback: Use a reasonable estimate in INR per gram
    // Approximate: Gold is around 2000 USD per ounce = ~64 USD per gram = ~5300 INR per gram
    console.warn('Using fallback gold price. Consider setting up a free API key for more accurate prices.');
    return {
      price: 5300, // Approximate gold price per gram in INR (fallback)
      currency: 'INR',
    };
  } catch (error) {
    console.error('Error fetching gold price:', error);
    // Ultimate fallback
    return {
      price: 5300, // Approximate gold price per gram in INR
      currency: 'INR',
    };
  }
};

