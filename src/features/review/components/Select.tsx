import React from "react";
import { cn } from "@/utils/utils";

interface SelectProps {
    options: string[];
    value: string | null;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    disabled = false,
    className,
    placeholder = "Select one"
}) => {
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    }, [onChange]);

    // Ensure value is always defined
    const selectedValue = value || "";

    return (
        <div className="relative w-full">
            <select
                value={selectedValue}
                onChange={handleChange}
                disabled={disabled}
                className={cn(
                    "w-full h-10 px-3 py-2 text-sm",
                    "bg-gray-800 text-white",
                    "border border-gray-600 rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "appearance-none",
                    className
                )}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                        className="bg-gray-800 text-white"
                    >
                        {option}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    );
};