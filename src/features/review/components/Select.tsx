import React from "react";
import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectProps {
    options: string[];
    value: string; // Supports single value only (shadcn Select does not support multiple values out of the box)
    onChange: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange }) => {
    return (
        <div className="relative w-full">
            <ShadcnSelect value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full border-gray-600">
                    <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </ShadcnSelect>
        </div>
    );
};