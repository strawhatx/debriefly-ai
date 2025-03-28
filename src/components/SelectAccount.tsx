import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronsUpDownIcon, User } from "lucide-react";
import React from "react";

type TradingAccount = {
    id: string;
    account_name: string;
};

export const SelectAccount = () => {
    const account = useTradingAccountStore((state) => state.selected);
    const setAccount = useTradingAccountStore((state) => state.update);

    const { data: tradingAccounts, error, isLoading } = useQuery<TradingAccount[]>({
        queryKey: ["tradingAccounts"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("trading_accounts")
                .select("id,account_name");
            if (error) {
                console.error("Error fetching trading accounts:", error);
                return [];
            }
            return data || [];
        },
    });

    const accountOptions = React.useMemo(() => {
        if (!tradingAccounts) return [];
        return tradingAccounts.map((acct) => ({
            id: acct.id,
            name: acct.account_name,
        }));
    }, [tradingAccounts]);

    if (error) {
        return <div className="text-red-500">Failed to load accounts. Please try again later.</div>;
    }

    return (
        <Listbox as="div" value={account} onChange={setAccount}>
            <div className="relative w-full">
                <ListboxButton className="grid w-full rounded-md cursor-default py-1 pr-2 pl-3 text-left text-white sm:text-sm/6">
                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6 text-gray-400">
                        <User className="w-4" />
                        <span className="block truncate">
                            {isLoading ? "Loading..." : account ? accountOptions.find((opt) => opt.id === account)?.name || "Select Account" : "Select Account"}
                        </span>
                    </span>
                    <ChevronsUpDownIcon aria-hidden="true" className="col-start-1 row-start-1 size-5 self-center justify-self-end text-white sm:size-4" />
                </ListboxButton>

                <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none">
                    <ListboxOption key="All" value="all" className="group relative cursor-default py-2 pr-9 pl-3 select-none text-white data-focus:bg-primary">
                        <div className="flex items-center text-gray-400">
                            <User className="w-2.5 h-2.5" />
                            <span className="ml-3 block truncate text-xs font-normal group-data-selected:font-semibold">All</span>
                        </div>
                    </ListboxOption>
                    {accountOptions.map((acct) => (
                        <ListboxOption key={acct.id} value={acct.id} className="group relative cursor-default py-2 pr-9 pl-3 select-none text-white data-focus:bg-primary">
                            <div className="flex items-center text-gray-400">
                                <User className="w-2.5 h-2.5" />
                                <span className="ml-3 block text-xs truncate font-normal group-data-selected:font-semibold">{acct.name}</span>
                            </div>
                            
                            {account === acct.id && (
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

