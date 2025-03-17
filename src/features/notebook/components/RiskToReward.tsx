import { useState } from "react";

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
  max = 10,
  step = 0.5,
}: RiskToRewardProps) {
  const [inputValue, setInputValue] = useState(value);

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

  return (
    <div className="py-3 px-2 flex flex-row items-center gap-4">
      {/* Input Number UI */}
      <div
        className="py-2 inline-block"
      >
        <div className="flex items-center gap-x-1.5">
          {/* Decrease Button */}
          <button
            type="button"
            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-600  text-gray-200 shadow-2xs hover:bg-gray-600 focus:outline-hidden focus:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => adjustRatio("decrease")}
            disabled={value <= min}
          >
            <svg
              className="shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
            </svg>
          </button>

          {/* Input Field */}
          <input
            className="p-0 w-10 bg-transparent border-0 text-gray-200 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
            style={{ MozAppearance: "textfield" }}
            type="number"
            value={inputValue}
            onChange={handleInputChange}
          />

          {/* Increase Button */}
          <button
            type="button"
            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-600  text-gray-200 shadow-2xs hover:bg-gray-600 focus:outline-hidden focus:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => adjustRatio("increase")}
            disabled={value >= max}
          >
            <svg
              className="shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Risk Display */}
      <p className="text-sm font-semibold text-muted-foreground">
        Risk: <span className="text-red-500">1</span> : <span className="text-green-500">{value.toFixed(1)}</span>
      </p>
    </div>
  );
}
