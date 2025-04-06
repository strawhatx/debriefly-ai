import { supabase } from "@/integrations/supabase/client";
import { allTags } from "@/utils/constants";
import { useEffect, useState } from "react";

export const useEmotionalTags = (id: string) => {
    const [emotionTags, setEmotionTags] = useState<string[]>([]);
    
    useEffect(() => {
        const fetchEmotionTags = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from("emotional_tags").select("tags").eq("position_id", id).maybeSingle();

            if (error) {
                console.error("Error fetching emotional tags:", error);
                return;
            }

            setEmotionTags(data?.tags ? JSON.parse(data.tags) : []);
        };

        fetchEmotionTags();
    }, [id]);

    const handleTagChange = async (selected: string[]) => {
        setEmotionTags(selected);
        if (!id) return;

        const { error } = await supabase
            .from("emotional_tags")
            .upsert(
                { position_id: id, tags: JSON.stringify(selected) },
                { onConflict: "position_id" } // Now it will work because `position_id` is unique
            );

        if (error) {
            console.error("Error saving emotional tags:", error);
        }
    };
    return {
        allTags,
        handleTagChange,
        emotionTags
    };
};