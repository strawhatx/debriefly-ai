import { supabase } from "@/integrations/supabase/client";

export const fetchJournalEntry = async (positionId: string, setJournal: Function) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("journal_entries")
        .select("user_id,position_id,entry_text,strategy,reward,created_at,updated_at")
        .eq("position_id", positionId)
        .maybeSingle();

    if (error) {
        console.error(error);
        return;
    }

    if (data) setJournal(data);
    else setJournal({
        user_id: user.id,
        position_id: positionId,
        entry_text: "",
        strategy: "",
        reward: 2,
        created_at: null,
        updated_at: null
    });
};

export const saveJournalEntry = async (journal: any) => {
    await supabase.from("journal_entries").upsert(
        journal, { onConflict: "position_id" }
    );
};
