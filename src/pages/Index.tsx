import { useState } from "react";
import { StockSearch } from "@/components/StockSearch";
import { StockCard } from "@/components/StockCard";
import { getStockData, StockQuote } from "@/services/yahooFinance";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, BarChart3, DollarSign } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const Index = () => {
  const [stockData, setStockData] = useState<StockQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (ticker: string) => {
    setIsLoading(true);
    try {
      const data = await getStockData(ticker);
      setStockData(data);
      toast({
        title: "Stock data fetched successfully",
        description: `Retrieved data for ${ticker}`,
      });
    } catch (error) {
      toast({
        title: "Error fetching stock data",
        description: error instanceof Error ? error.message : "Failed to fetch stock data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="relative pt-16 pb-12 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-secondary/40" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            StockSnap
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Professional stock analysis dashboard with real-time Yahoo Finance data. 
            Get comprehensive insights including free float, volume analysis, and live market data.
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-bullish" />
              Real-time Prices
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              Volume Analysis
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 text-accent" />
              Free Float Data
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        {/* Search Section */}
        <section className="mb-12">
          <StockSearch onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg text-muted-foreground">Fetching stock data...</span>
          </div>
        )}

        {/* Stock Data Display */}
        {stockData && !isLoading && (
          <section className="max-w-4xl mx-auto">
            <StockCard data={stockData} />
          </section>
        )}

        {/* Welcome Message when no data */}
        {!stockData && !isLoading && (
          <section className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Ready to analyze stocks?
              </h2>
              <p className="text-muted-foreground">
                Enter any stock ticker symbol above to get comprehensive market data, 
                including real-time prices, volume analysis, and free float information.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-4 mt-16">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Powered by Yahoo Finance API. Data provided for informational purposes only.</p>
          <p className="mt-2">© 2024 StockSnap. Built with modern web technologies.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;