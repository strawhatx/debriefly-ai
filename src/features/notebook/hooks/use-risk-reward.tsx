import { useEffect, useState } from "react";

export const useRiskReward = (value: number, onChange: (value: number) => void, min: number, max: number, step: number) => {
    
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      setInputValue(value);
    }, [value]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = parseFloat(e.target.value);
      if (isNaN(newValue)) return;
  
      newValue = Math.max(min, Math.min(max, newValue));
      setInputValue(newValue);
      onChange(newValue);
    };
  
    const adjustRatio = (direction: "increase" | "decrease") => {
      const newValue =
        direction === "increase"
          ? Math.min(value + step, max)
          : Math.max(value - step, min);
      setInputValue(newValue);
      onChange(newValue);
    };
    return {
        inputValue,
        handleInputChange,
        adjustRatio
    }
};
