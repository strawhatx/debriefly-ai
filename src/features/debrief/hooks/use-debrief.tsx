import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

// Define strict types for our data structures
interface Position {
    id: string;
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

    useEffect(() => {
        const fetchTodayStats = async () => {
            setIsLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0];

                const { data, error: fetchError } = await supabase
                    .from('positions')
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
                journal_entries(risk, reward, strategy),
                emotional_tags(tags)`)
                    .eq('entry_date', today);

                if (fetchError) throw new Error(fetchError.message);
                if (!data) throw new Error('No data received from database');

                setPositions(data.map((position) => ({
                    id: position.id,
                    time: new Date(position.entry_date).toLocaleTimeString(),
                    entry_date: position.entry_date,
                    closing_date: position.closing_date,
                    symbol: position.symbol,
                    market: position.asset_type,
                    type: position.position_type,
                    entry: position.fill_price,
                    exit: position.stop_price,
                    strategy: position.journal_entries.strategy,
                    risk: position.journal_entries.risk,
                    reward: position.journal_entries.reward,
                    outcome: position.pnl > 0 ? 'WIN' : 'LOSS',
                    pnl: position.pnl,
                    tags: position.emotional_tags.tags
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
    }, []);

    return { positions, isLoading, error };
};