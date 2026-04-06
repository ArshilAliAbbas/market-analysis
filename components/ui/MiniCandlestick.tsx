import { cn } from "@/lib/utils";

export interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
}

interface MiniCandlestickProps {
  data: CandleData[];
  height?: number;
  width?: number;
  className?: string;
}

export function MiniCandlestick({ data, height = 40, width = 100, className }: MiniCandlestickProps) {
  if (!data || data.length === 0) return null;

  // Calculate min and max for scaling
  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const priceRange = maxPrice - minPrice || 1; // avoid division by zero

  // Scaling helpers
  const scaleY = (val: number) => height - ((val - minPrice) / priceRange) * height;
  
  const candleWidth = width / data.length;
  const padding = candleWidth * 0.2; // space between candles
  const actualCandleWidth = candleWidth - padding;

  return (
    <svg 
      width="100%" 
      height="100%"
      viewBox={`0 0 ${width} ${height}`} 
      preserveAspectRatio="none" 
      className={cn("overflow-visible", className)}
    >
      {data.map((candle, i) => {
        const isBullish = candle.close >= candle.open;
        const color = isBullish ? "#10B981" : "#EF4444"; // matched to our theme
        
        const x = i * candleWidth + (padding / 2);
        
        // Wick coordinates
        const wickTop = scaleY(candle.high);
        const wickBottom = scaleY(candle.low);
        
        // Body coordinates
        const bodyTop = scaleY(Math.max(candle.open, candle.close));
        const bodyBottom = scaleY(Math.min(candle.open, candle.close));
        const bodyHeight = Math.max(1, bodyBottom - bodyTop);

        return (
          <g key={i} className="transition-all duration-300 ease-in-out">
            {/* Wick */}
            <line 
              x1={x + actualCandleWidth / 2} 
              y1={wickTop} 
              x2={x + actualCandleWidth / 2} 
              y2={wickBottom} 
              stroke={color} 
              strokeWidth="0.5" 
              opacity="0.7"
            />
            {/* Body */}
            <rect 
              x={x} 
              y={bodyTop} 
              width={actualCandleWidth} 
              height={bodyHeight} 
              fill={color} 
              stroke={color}
              strokeWidth="0.5"
            />
          </g>
        );
      })}
    </svg>
  );
}
