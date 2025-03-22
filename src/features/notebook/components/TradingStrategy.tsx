'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import { Tag } from 'lucide-react'

interface TradingStrategyProps {
    strategy: string;
    onChange: (value: string) => void;
}

// Available emotion tags
const allStrategies = [
    "BREAKOUT", "PULLBACK", "REVERSALS", "TREND FOLLOWING",
    "RANGE TRADING", "SCALPING", "MOMENTUM", "SWING TRADING", "ORDER BLOCK", "FVG"
];

export const TradingStrategy = ({ strategy, onChange }: TradingStrategyProps) => {
    return (
        <div className="py-3 px-2"><p className="text-sm text-gray-400">Trade Strategy</p>
            <div className="flex">
            
                <Listbox as="div" value={strategy} onChange={onChange}>
                    <div className="relative mt-2 w-64">
                        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-full border border-gray-600 py-1 pr-2 pl-3 text-left text-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6">
                            <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6 text-gray-400">
                                <Tag className="w-3" />
                                <span className="block truncate text-sm">{ strategy ? strategy : "Add Strategy" }</span>
                            </span>
                            <ChevronUpDownIcon aria-hidden="true" className="col-start-1 row-start-1 size-5 self-center justify-self-end text-white sm:size-4" />
                        </ListboxButton>

                        <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none">
                            {allStrategies.map((strat) => (
                                <ListboxOption key={strat} value={strat} className="group relative cursor-default py-2 pr-9 pl-3 select-none text-white data-focus:bg-primary">
                                    <div className="flex items-center text-gray-400">
                                        <Tag className="w-4" />
                                        <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{strat}</span>
                                    </div>
                                    {strategy === strat && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary group-not-data-selected:hidden group-data-focus:text-white">
                                            <CheckIcon aria-hidden="true" className="size-5" />
                                        </span>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </Listbox>
            </div>
        </div>
    );
}
