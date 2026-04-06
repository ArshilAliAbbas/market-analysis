import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Risk calculation utility
export function calculateRisk({
  accountBalance,
  riskPercent,
  entryPrice,
  stopLossPrice,
  takeProfitPrice
}: {
  accountBalance: number;
  riskPercent: number;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
}) {
  if (entryPrice <= 0 || stopLossPrice <= 0) {
    return { riskAmount: 0, positionSize: 0, riskRewardRatio: 0 };
  }

  const riskAmount = accountBalance * (riskPercent / 100);
  const stopLossDistance = Math.abs(entryPrice - stopLossPrice);

  if (stopLossDistance === 0) {
    return { riskAmount, positionSize: 0, riskRewardRatio: 0 };
  }

  const positionSize = riskAmount / stopLossDistance;
  const riskRewardRatio = Math.abs(takeProfitPrice - entryPrice) / stopLossDistance;

  return {
    riskAmount,
    positionSize,
    riskRewardRatio
  };
}
