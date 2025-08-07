import yahooFinance from 'yahoo-finance2';

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
    // Get quote data
    const quote = await yahooFinance.quote(symbol);
    
    // Get additional statistics if available
    let statsData;
    
    try {
      statsData = await yahooFinance.quoteSummary(symbol, { 
        modules: ['summaryDetail', 'defaultKeyStatistics'] 
      });
    } catch (error) {
      console.warn('Could not fetch additional stats for', symbol, error);
    }

    const price = quote.regularMarketPrice || 0;
    const previousClose = quote.regularMarketPreviousClose || price;
    const change = price - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol: quote.symbol || symbol,
      price,
      change,
      changePercent,
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap,
      floatShares: statsData?.defaultKeyStatistics?.floatShares,
      avgVolume: quote.averageDailyVolume3Month || quote.averageDailyVolume10Day,
      companyName: quote.longName || quote.shortName,
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error(`Failed to fetch data for ${symbol}. Please check the ticker symbol and try again.`);
  }
};

export const getHistoricalData = async (symbol: string, period: string = '1mo') => {
  try {
    const result = await yahooFinance.historical(symbol, {
      period1: getDateFromPeriod(period),
      period2: new Date(),
      interval: '1d'
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw new Error(`Failed to fetch historical data for ${symbol}`);
  }
};

const getDateFromPeriod = (period: string): Date => {
  const now = new Date();
  switch (period) {
    case '1d':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '1w':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '1mo':
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case '3mo':
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    case '1y':
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    default:
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  }
};