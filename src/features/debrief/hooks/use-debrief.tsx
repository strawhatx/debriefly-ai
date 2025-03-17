import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

// Define strict types for our data structures
interface Position {
    id: string;
    time: string;
    symbol: string;
    type: 'LONG' | 'SHORT';
    entry: number;
    exit: number;
    risk: number;
    reward: number;
    outcome: 'WIN' | 'LOSS';
    pnl: number;
    tags: string[];

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
                symbol,
                position_type, 
                fill_price,
                stop_price, 
                pnl, 
                journal_entries(risk, reward),
                emotional_tags(tags)`)
                    .eq('entry_date', today);

                if (fetchError) throw new Error(fetchError.message);
                if (!data) throw new Error('No data received from database');

                setPositions(data.map((position) => ({
                    id: position.id,
                    time: new Date(position.entry_date).toLocaleTimeString(),
                    symbol: position.symbol,
                    type: position.position_type,
                    entry: position.fill_price,
                    exit: position.stop_price,
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