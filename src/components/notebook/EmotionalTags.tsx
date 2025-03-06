'use client'

import { useEffect, useState } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import useTradeStore from '@/store/trade'
import { supabase } from '@/integrations/supabase/client'
import { Tag } from 'lucide-react'

interface EmotionalTagProps {
    emotionTags: string[];
    onChange: (values: string[]) => void;
}

// Available emotion tags
const allEmotionTags = [
    'CALM', 'CONFIDENT', 'DISCIPLINED', 'PATIENT',
    'HESITANT', 'ANXIOUS', 'FEARFUL', 'DOUBTFUL',
    'FOMO', 'GREEDY', 'EXCITED', 'OVERCONFIDENT',
    'REVENGE', 'ANGRY', 'FRUSTRATED', 'IMPULSIVE'
];

export const EmotionalTags = ({ emotionTags, onChange }: EmotionalTagProps) => {
    const selectedTrade = useTradeStore((state) => state.selected);

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

    return (
        <div className="py-3 px-2">
            <div className="flex justify-between items-center mb-4">
                <Listbox as="div" value={emotionTags} onChange={handleTagChange} multiple>
                    <div className="relative mt-2 w-64">
                        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-full border border-gray-600 py-1.5 pr-2 pl-3 text-left text-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                            <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6 text-gray-400">
                                <Tag className="w-3" />
                                <span className="block truncate text-xs">Add Tags</span>
                            </span>
                            <ChevronUpDownIcon aria-hidden="true" className="col-start-1 row-start-1 size-5 self-center justify-self-end text-white sm:size-4" />
                        </ListboxButton>

                        <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none">
                            {allEmotionTags.map((emotion) => (
                                <ListboxOption key={emotion} value={emotion} className="group relative cursor-default py-2 pr-9 pl-3 select-none text-white data-focus:bg-indigo-600">
                                    <div className="flex items-center text-gray-400">
                                        <Tag className="w-4" />
                                        <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{emotion}</span>
                                    </div>
                                    {emotionTags.includes(emotion) && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                                            <CheckIcon aria-hidden="true" className="size-5" />
                                        </span>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </Listbox>

                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{emotionTags.length} tags</span>
                </div>
            </div>

            <div className="flex gap-2">
                {emotionTags.length > 0 ? (
                    emotionTags.map(tag => (
                        <div key={tag} className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-full text-sm">
                            <span>{tag}</span>
                            <button
                                onClick={() => handleTagChange(emotionTags.filter(t => t !== tag))}
                                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-600"
                            >
                                ×
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500">No emotions tagged yet</div>
                )}
            </div>

        </div>
    );
}
