import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface RiskToRewardProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function RiskToReward({
  value,
  onChange,
  min = 0.5,
  max = 5,
  step = 0.5,
}: RiskToRewardProps) {
  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newRatio = Math.max(min, Math.min(max, (offsetX / rect.width) * max));
    onChange(parseFloat(newRatio.toFixed(1)));
  };

  const adjustRatio = (direction: 'increase' | 'decrease') => {
    const newValue = direction === 'increase' 
      ? Math.min(value + step, max)
      : Math.max(value - step, min);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <div
        className="relative w-full h-4 rounded-lg overflow-hidden bg-muted cursor-pointer"
        onMouseDown={handleDrag}
      >
        <div className="absolute top-0 left-0 h-full bg-red-500" style={{ width: "20%" }} />
        <div 
          className="absolute top-0 left-[20%] h-full bg-green-500" 
          style={{ width: `${(value / (1 + value)) * 100}%` }} 
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Risk 1 : Reward {value.toFixed(1)} ({value.toFixed(1)} RRR)
      </p>
      <div className="flex gap-2">
        <Button 
          onClick={() => adjustRatio('decrease')} 
          variant="outline"
          disabled={value <= min}
        >
          - RRR
        </Button>
        <Button 
          onClick={() => adjustRatio('increase')} 
          variant="default"
          disabled={value >= max}
        >
          + RRR
        </Button>
      </div>
    </div>
  );
}
