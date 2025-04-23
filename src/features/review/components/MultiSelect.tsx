// src/app/page.tsx

"use client";

import React from "react";
import { MultiSelect as ShadcnMultiSelect } from "@/components/ui/multi-select";

interface Option { 
    value: string;
    label: string; 
    //icon: React.ElementType | undefined;
}

interface MultiSelectProps {
    options: Option[];
    values: string[] | undefined; // Allow undefined to handle optional values
    onValueChange: (value: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, values, onValueChange }) =>  {
  // Ensure values is always an array, even when undefined
  const safeValues = values || [];
  
  return (
      <ShadcnMultiSelect
        options={options}
        onValueChange={onValueChange}
        defaultValue={safeValues}
        placeholder="Select frameworks"
        variant="inverted"
        className="text-sm"
        animation={0}
        maxCount={1}
      />
  );
}