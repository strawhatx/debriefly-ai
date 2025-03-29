import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import React from "react";

interface SelectProps {
    label: string;
    options: string[];
    value: string | string[]; // Supports single or multiple values
    onChange: (value: string | string[]) => void;
    multiple?: boolean; // Whether the Select supports multiple selections
}

export const Select: React.FC<SelectProps> = ({ label, options, value, onChange, multiple = false }) => {
    const isSelected = (option: string) =>
        multiple && Array.isArray(value) ? value.includes(option) : value === option;

    const handleChange = (option: string) => {
        if (multiple && Array.isArray(value)) {
            if (value.includes(option)) {
                onChange(value.filter((v) => v !== option)); // Remove if already selected
            } else {
                onChange([...value, option]); // Add new selection
            }
        } else {
            onChange(option); // Single selection
        }
    };

    return (
        <Listbox as="div" value={value} onChange={handleChange} multiple={multiple}>
            <div className="relative mt-2 w-64">
                <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-full border border-gray-600 py-1 pr-2 pl-3 text-left text-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6">
                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6 text-gray-400">
                        <span className="block truncate text-sm">
                            {multiple && Array.isArray(value)
                                ? value.length > 0
                                    ? value.join(", ")
                                    : `Select ${label}`
                                : value || `Select ${label}`}
                        </span>
                    </span>
                    <ChevronUpDownIcon
                        aria-hidden="true"
                        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-white sm:size-4"
                    />
                </ListboxButton>

                <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none">
                    {options.map((option) => (
                        <ListboxOption
                            key={option}
                            value={option}
                            className="group relative cursor-default py-2 pr-9 pl-3 select-none text-white data-focus:bg-primary"
                        >
                            <div className="flex items-center text-gray-400">
                                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                                    {option}
                                </span>
                            </div>
                            {isSelected(option) && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary group-not-data-selected:hidden group-data-focus:text-white">
                                    <CheckIcon aria-hidden="true" className="size-5" />
                                </span>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
};