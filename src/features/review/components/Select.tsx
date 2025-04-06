import React from "react";

interface SelectProps {
    label: string;
    options: string[];
    value: string | string[]; // Supports single or multiple values
    onChange: (value: string | string[]) => void;
    multiple?: boolean; // Whether the Select supports multiple selections
}

export const Select: React.FC<SelectProps> = ({ label, options, value, onChange, multiple = false }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        if (multiple) {
            onChange(selectedOptions);
        } else {
            onChange(selectedOptions[0]);
        }
    };

    return (
        <div className="relative mt-2 w-full">
            <label className="block text-sm text-gray-400 mb-1">{label}</label>
            <select
                className="grid w-full cursor-default grid-cols-1 rounded-full border border-gray-600 py-1 pr-2 pl-3 text-left text-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6 bg-gray-800"
                value={Array.isArray(value) ? value : [value]} // Ensure value is an array for multiple select
                onChange={handleChange}
                multiple={multiple}
            >
                {!multiple && <option value="">{`Select ${label}`}</option>}
                {options.map((option) => (
                    <option key={option} value={option} className="text-gray-400">
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};