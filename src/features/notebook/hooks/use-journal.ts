import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface JournalEntry {
  user_id: string;
  position_id: string;
  entry_text: string;
  strategy: string;
  reward: number;
  created_at: string | null;
  updated_at: string | null;
}

interface Trade {
  id: string;
  symbol: string;
  position_type: string;
  pnl: number;
  fees: number;
  quantity: number;
  fill_price: number;
  stop_price: number;
  entry_date: string;
}

interface UseJournalReturn {
  journal: JournalEntry | null;
  trade: Trade | null;
  isLoading: boolean;
  error: Error | null;
  saveJournal: (journalData: Partial<JournalEntry>) => Promise<void>;
  updateJournalField: <K extends keyof JournalEntry>(
    field: K,
    value: JournalEntry[K]
  ) => void;
  resetJournal: () => void;
}

export function useJournal(positionId: string): UseJournalReturn {
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch both journal and trade data in parallel
      const [userResponse, journalResponse, tradeResponse] = await Promise.all([
        supabase.auth.getUser(),
        supabase
          .from("journal_entries")
          .select("user_id,position_id,entry_text,strategy,reward,created_at,updated_at")
          .eq("position_id", positionId)
          .maybeSingle(),
        supabase
          .from("positions")
          .select("id,symbol,position_type,pnl,quantity,fill_price,stop_price,entry_date,fees")
          .eq("id", positionId)
          .maybeSingle()
      ]);

      const { data: { user } } = userResponse;
      const { data: journalData, error: journalError } = journalResponse;
      const { data: tradeData, error: tradeError } = tradeResponse;

      if (journalError) throw journalError;
      if (tradeError) throw tradeError;

      // Set journal data or create new entry if none exists
      setJournal(
        journalData || {
          user_id: user.id,
          position_id: positionId,
          entry_text: "",
          strategy: "",
          reward: 2,
          created_at: null,
          updated_at: null
        }
      );

      setTrade(tradeData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [positionId]);

  const saveJournal = useCallback(async (journalData: Partial<JournalEntry>) => {
    try {
      if (!journal) throw new Error('No journal entry to update');

      const updatedJournal = {
        ...journal,
        ...journalData,
        updated_at: new Date().toISOString()
      };

      const { error: saveError } = await supabase
        .from("journal_entries")
        .upsert(updatedJournal, { onConflict: "position_id" });

      if (saveError) throw saveError;

      setJournal(updatedJournal);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save journal entry'));
      throw err;
    }
  }, [journal]);

  const updateJournalField = useCallback(<K extends keyof JournalEntry>(
    field: K,
    value: JournalEntry[K]
  ) => {
    setJournal((prev) => 
      prev ? { ...prev, [field]: value } : null
    );
  }, []);

  const resetJournal = useCallback(() => {
    setJournal(null);
    setTrade(null);
    setError(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    journal,
    trade,
    isLoading,
    error,
    saveJournal,
    updateJournalField,
    resetJournal
  };
} 