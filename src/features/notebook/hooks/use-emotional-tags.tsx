import { supabase } from "@/integrations/supabase/client";
import useTradeStore from "@/store/trade";
import { useEffect } from "react";

export const useEmotionalTags = (onChange: (values: string[]) => void) => {
    const selectedTrade = useTradeStore((state) => state.selected);
    
    // Available emotion tags
    const allEmotionTags = [
        'CALM', 'CONFIDENT', 'DISCIPLINED', 'PATIENT',
        'HESITANT', 'ANXIOUS', 'FEARFUL', 'DOUBTFUL',
        'FOMO', 'GREEDY', 'EXCITED', 'OVERCONFIDENT',
        'REVENGE', 'ANGRY', 'FRUSTRATED', 'IMPULSIVE'
    ];
    
    useEffect(() => {
        const fetchEmotionTags = async () => {
            if (!selectedTrade?.id) return;
            const { data, error } = await supabase
                .from("emotional_tags").select("tags").eq("position_id", selectedTrade.id).maybeSingle();

            if (error) {
                console.error("Error fetching emotional tags:", error);
                return;
            }

            onChange(data?.tags ? JSON.parse(data.tags) : []);
        };

        fetchEmotionTags();
    }, [selectedTrade]);

    const handleTagChange = async (selected: string[]) => {
        onChange(selected);
        if (!selectedTrade?.id) return;

        const { error } = await supabase
            .from("emotional_tags")
            .upsert(
                { position_id: selectedTrade.id, tags: JSON.stringify(selected) },
                { onConflict: "position_id" } // Now it will work because `position_id` is unique
            );

        if (error) {
            console.error("Error saving emotional tags:", error);
        }
    };
    return {
        allEmotionTags,
        handleTagChange
    };
};