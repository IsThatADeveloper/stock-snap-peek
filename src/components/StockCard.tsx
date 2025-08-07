import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";
import { formatNumber } from "@/services/stockApi";

interface StockData {
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

interface StockCardProps {
  data: StockData;
}

export const StockCard = ({ data }: StockCardProps) => {
  const isPositive = data.change >= 0;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              {data.symbol}
              {isPositive ? (
                <TrendingUp className="h-5 w-5 text-bullish" />
              ) : (
                <TrendingDown className="h-5 w-5 text-bearish" />
              )}
            </CardTitle>
            {data.companyName && (
              <p className="text-sm text-muted-foreground mt-1">{data.companyName}</p>
            )}
          </div>
          <Badge variant={isPositive ? "default" : "destructive"} className="text-sm">
            {isPositive ? "+" : ""}{data.changePercent.toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center p-4 bg-secondary/50 rounded-lg">
            <DollarSign className="h-6 w-6 text-primary mb-2" />
            <div className="text-2xl font-bold text-foreground">
              ${data.price.toFixed(2)}
            </div>
            <div className={`text-sm font-medium ${isPositive ? 'text-bullish' : 'text-bearish'}`}>
              {isPositive ? "+" : ""}{data.change.toFixed(2)}
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 bg-secondary/50 rounded-lg">
            <Activity className="h-6 w-6 text-accent mb-2" />
            <div className="text-xl font-bold text-foreground">
              {formatNumber(data.volume)}
            </div>
            <div className="text-xs text-muted-foreground">Volume</div>
          </div>

          {data.marketCap && (
            <div className="flex flex-col items-center text-center p-4 bg-secondary/50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-neutral mb-2" />
              <div className="text-xl font-bold text-foreground">
                {formatNumber(data.marketCap)}
              </div>
              <div className="text-xs text-muted-foreground">Market Cap</div>
            </div>
          )}

          {data.floatShares && (
            <div className="flex flex-col items-center text-center p-4 bg-secondary/50 rounded-lg">
              <Activity className="h-6 w-6 text-primary mb-2" />
              <div className="text-xl font-bold text-foreground">
                {formatNumber(data.floatShares)}
              </div>
              <div className="text-xs text-muted-foreground">Free Float</div>
            </div>
          )}
        </div>

        {data.avgVolume && (
          <div className="pt-4 border-t border-border/30">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Volume</span>
              <span className="text-sm font-medium text-foreground">
                {formatNumber(data.avgVolume)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Volume vs Average</span>
              <span className={`text-sm font-medium ${
                data.volume > data.avgVolume ? 'text-bullish' : 'text-bearish'
              }`}>
                {((data.volume / data.avgVolume - 1) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};