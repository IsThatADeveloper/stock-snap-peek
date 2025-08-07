import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StockSearchProps {
  onSearch: (ticker: string) => void;
  isLoading: boolean;
}

export const StockSearch = ({ onSearch, isLoading }: StockSearchProps) => {
  const [ticker, setTicker] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.trim().toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="Enter stock ticker (e.g., AAPL, TSLA, GOOGL)..."
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="pl-12 pr-24 h-14 text-lg font-medium bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
        />
        <Button
          type="submit"
          disabled={!ticker.trim() || isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
};