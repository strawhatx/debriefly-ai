'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import { Tag } from 'lucide-react'
import { useEmotionalTags } from '../hooks/use-emotional-tags'

interface EmotionalTagProps {
    id: string;
}

export const EmotionalTags = ({ id }: EmotionalTagProps) => {
    const { emotionTags, allTags, handleTagChange } = useEmotionalTags(id)

    return (
        <div className="py-3 px-2">            
            <p className="text-sm text-gray-400">Emotion Tags</p>
            <div className="flex justify-between items-center mb-4">

                <Listbox as="div" value={emotionTags} onChange={handleTagChange} multiple>
                    <div className="relative mt-2 w-64">
                        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-full border border-gray-600 py-1 pr-2 pl-3 text-left text-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6">
                            <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6 text-gray-400">
                                <Tag className="w-3" />
                                <span className="block truncate text-sm">Add Tags</span>
                            </span>
                            <ChevronUpDownIcon aria-hidden="true" className="col-start-1 row-start-1 size-5 self-center justify-self-end text-white sm:size-4" />
                        </ListboxButton>

                        <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none">
                            {allTags.map((emotion) => (
                                <ListboxOption key={emotion} value={emotion} className="group relative cursor-default py-2 pr-9 pl-3 select-none text-white data-focus:bg-primary">
                                    <div className="flex items-center text-gray-400">
                                        <Tag className="w-4" />
                                        <span className="ml-3 block truncate font-normal group-data-selected:font-semibold text-sm">{emotion}</span>
                                    </div>
                                    {emotionTags.includes(emotion) && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary group-not-data-selected:hidden group-data-focus:text-white">
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
                            <span className="text-gray-400 text-sm">{tag}</span>
                            <button
                                onClick={() => handleTagChange(emotionTags.filter(t => t !== tag))}
                                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-600"
                            >
                                ×
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-sm">No emotions tagged yet</div>
                )}
            </div>

        </div>
    );
}
