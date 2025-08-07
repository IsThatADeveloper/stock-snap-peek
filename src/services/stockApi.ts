// Browser-compatible stock API service using Yahoo Finance via CORS proxy
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const YAHOO_FINANCE_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  floatShares?: number;
  avgVolume?: number;
  companyName?: string;
}

export const getStockData = async (symbol: string): Promise<StockQuote> => {
  try {
    // Use Yahoo Finance for all tickers
    const yahooUrl = `${YAHOO_FINANCE_BASE_URL}/${symbol.toUpperCase()}?interval=1d&range=1d&includePrePost=true`;
    const response = await fetch(
      `${CORS_PROXY}${encodeURIComponent(yahooUrl)}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${symbol}`);
    }
    
    const data = await response.json();
    const result = data.chart?.result?.[0];
    
    if (!result || !result.meta) {
      throw new Error(`No data available for ${symbol}`);
    }
    
    const meta = result.meta;
    const currentPrice = meta.regularMarketPrice || meta.previousClose;
    const previousClose = meta.previousClose;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    const volume = meta.regularMarketVolume || 0;
    
    // Get additional data from Yahoo Finance quote API
    let marketCap = meta.marketCap;
    let floatShares = meta.floatShares;
    let avgVolume = meta.averageDailyVolume10Day;
    let companyName = meta.longName || meta.shortName;
    
    // If some data is missing, try the quote endpoint
    if (!marketCap || !floatShares || !avgVolume) {
      try {
        const quoteUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol.toUpperCase()}?modules=defaultKeyStatistics,price`;
        const quoteResponse = await fetch(
          `${CORS_PROXY}${encodeURIComponent(quoteUrl)}`,
          {
            headers: {
              'Accept': 'application/json',
            }
          }
        );
        
        if (quoteResponse.ok) {
          const quoteData = await quoteResponse.json();
          const keyStats = quoteData.quoteSummary?.result?.[0]?.defaultKeyStatistics;
          const priceData = quoteData.quoteSummary?.result?.[0]?.price;
          
          if (keyStats) {
            marketCap = marketCap || keyStats.marketCap?.raw;
            floatShares = floatShares || keyStats.floatShares?.raw;
            avgVolume = avgVolume || keyStats.averageVolume?.raw;
          }
          
          if (priceData) {
            companyName = companyName || priceData.longName || priceData.shortName;
          }
        }
      } catch (error) {
        console.warn('Failed to fetch additional quote data:', error);
      }
    }
    
    return {
      symbol: symbol.toUpperCase(),
      price: parseFloat(currentPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume,
      marketCap,
      floatShares,
      avgVolume,
      companyName,
    };
    
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error(`Failed to fetch data for ${symbol}. Please check the ticker symbol and try again.`);
  }
};


export const getPopularStocks = () => {
  return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];
};

export const formatNumber = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toLocaleString();
};