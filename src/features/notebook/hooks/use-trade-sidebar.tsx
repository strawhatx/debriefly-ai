import { supabase } from "@/integrations/supabase/client";
import useTradeStore from "@/store/trade";
import { useEffect, useState } from "react";

export const useTradeSidebar = () => {
    const [trades, setTrades] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc");

    const setTrade = useTradeStore((state) => state.update);
    const selectedTrade = useTradeStore((state) => state.selected);

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        const fetchTrades = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from("positions")
                .select("id,symbol,position_type,pnl,fees,quantity,fill_price,stop_price,entry_date")
                .eq("user_id", user.id)
                .order("entry_date", { ascending: sortOrder === "asc" });

            if (error) {
                console.error(error);
                return;
            }

            setTrades(data);
            if (!selectedTrade && data.length > 0) setTrade(data[0]);
        };

        fetchTrades();
    }, [sortOrder]);

    return {
        trades,
        sortOrder,
        setSortOrder,
        setTrade,
        selectedTrade,
        formatDate
    };
};
