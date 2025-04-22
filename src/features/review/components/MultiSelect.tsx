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
    values: string[]; // Supports single value only (shadcn Select does not support multiple values out of the box)
    onValueChange: (value: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, values, onValueChange }) =>  {
  return (
      <ShadcnMultiSelect
        options={options}
        onValueChange={onValueChange}
        defaultValue={values}
        placeholder="Select frameworks"
        variant="inverted"
        className="text-sm"
        animation={0}
        maxCount={1}
      />
  );
}