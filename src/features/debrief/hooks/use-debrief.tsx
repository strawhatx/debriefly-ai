
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import { useEffect, useState } from "react";

interface Position {
    id: string;
    date: string;
    score: number;
    time: string;
    entry_date: string;
    closing_date: string;
    symbol: string;
    market: string;
    type: 'LONG' | 'SHORT';
    entry: number;
    exit: number;
    risk: number;
    reward: number;
    outcome: 'WIN' | 'LOSS';
    pnl: number;
    tags: string[];
    strategy: string | null;
}

export const useDebrief = () => {
    const [positions, setPositions] = useState<Position[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [day, setDay] = useState<Date>(new Date());

    const selectedAccount = useTradingAccountStore((state) => state.selected);

    useEffect(() => {
        const fetchTodayStats = async () => {
            setIsLoading(true);
            try {
                const date = day.toISOString().split('T')[0];

                var query = supabase.from('positions')
                    .select(`
                        id, 
                        entry_date, 
                        closing_date,
                        symbol,
                        asset_type,
                        position_type, 
                        fill_price,
                        stop_price, 
                        pnl, 
                        risk, 
                        reward, 
                        strategy,
                        tags,
                        score`)
                    .gte("entry_date", `${date} 00:00:00`)
                    .lte("entry_date", `${date} 23:59:59`);

                if (selectedAccount) {
                    query = query.eq("trading_account_id", selectedAccount);
                }

                const { data, error } = await query;
                if (error) throw error;

                if (error) throw new Error(error.message);
                if (!data) throw new Error('No data received from database');

                setPositions(data.map((position) => ({
                    id: position.id,
                    date: new Date(position.entry_date).toLocaleDateString(),
                    time: new Date(position.entry_date).toLocaleString('en-US', {
                        hour: 'numeric',minute: 'numeric', hour12: true
                    }),
                    entry_date: position.entry_date,
                    closing_date: position.closing_date || '',
                    symbol: position.symbol,
                    market: position.asset_type,
                    type: position.position_type as 'LONG' | 'SHORT',
                    entry: position.fill_price,
                    exit: position.stop_price,
                    strategy: position.strategy,
                    risk: position.risk,
                    reward: position.reward,
                    outcome: position.pnl > 0 ? 'WIN' : 'LOSS',
                    pnl: position.pnl,
                    tags: Array.isArray(position.tags) ? position.tags as string[] : position.tags ? [position.tags as string] : [],
                    score: position.score,
                })));

                setError(null);
            } catch (err) {
                console.error('Error fetching positions:', err);
                setError(err instanceof Error ? err : new Error('Unknown error occurred'));
                setPositions(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodayStats();
    }, [day]);

    return { positions, isLoading, error, setDay, day };
};
