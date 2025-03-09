import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronsUpDownIcon, User } from "lucide-react";

export const SelectAccount = () => {
    const account = useTradingAccountStore((state) => state.selected);
    const setAccount = useTradingAccountStore((state) => state.update);

    const { data: tradingAccounts } = useQuery({
        queryKey: ["tradingAccounts"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("trading_accounts")
                .select("id,account_name");
            if (error) throw error;
            return data;
        },
    });

    return (
        <Listbox as="div" value={account} onChange={setAccount}>
            <div className="relative w-64">
                <ListboxButton className="grid w-full rounded-md cursor-default grid-cols-1 bg-gray-800 border border-gray-600 py-1.5 pr-2 pl-3 text-left text-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6">
                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6 text-gray-400">
                        <User className="w-4" />
                        <span className="block truncate">Select Account</span>
                    </span>
                    <ChevronsUpDownIcon aria-hidden="true" className="col-start-1 row-start-1 size-5 self-center justify-self-end text-white sm:size-4" />
                </ListboxButton>

                <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none">
                    <ListboxOption key="All" value="all" className="group relative cursor-default py-2 pr-9 pl-3 select-none text-white data-focus:bg-primary">
                        <div className="flex items-center text-gray-400">
                            <User className="w-4" />
                            <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">All</span>
                        </div>
                    </ListboxOption>
                    {tradingAccounts.map((acct) => (
                        <ListboxOption key={acct.id} value={acct.id} className="group relative cursor-default py-2 pr-9 pl-3 select-none text-white data-focus:bg-primary">
                            <div className="flex items-center text-gray-400">
                                <User className="w-4" />
                                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{acct.account_name}</span>
                            </div>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
};

