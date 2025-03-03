import React, { useEffect, useState } from 'react';
import { Edit, Save, Tag } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { TradeToolbar } from '@/components/notebook/TradeToolbar';
import useTradeStore from '@/store/trade';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EmotionalTags } from '@/components/notebook/EmotionalTags';
import { JournalEditor } from '@/components/notebook/JournalEditor';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface Journal {
    id: string | null;
    user_id: string;
    position_id: string;
    entry_text: string;
    created_at: string;
    updated_at: string;
}

interface EmotionTag {
    id: string | null;
    tag: string;
}

export const Notebook = () => {
    const [journal, setJournal] = useState<Journal>(null);
    const [emotionTags, setEmotionTags] = useState<EmotionTag[]>([]);
    const { toast } = useToast();

    const selectedTrade = useTradeStore((state) => state.selected);

    const handleSave = async () => {
        await supabase.from("journal_entries").upsert(journal);
    }

    useEffect(() => {
        const fetchJournal = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase.from("journal_entries").select("id,user_id,position_id,entry_text,created_at,updated_at")
                .eq("position_id", selectedTrade.id).maybeSingle();

            if (error) {
                console.error(error);
                return;
            }

            if (data) setJournal(data);

            else setJournal((prev: Journal) => ({ ...prev, user_id: user.id, position_id: selectedTrade.id }));
        };

        if (!selectedTrade) return;

        fetchJournal();
    }, [selectedTrade]);

    return (
        <div className="p-6 space-y-6">
            <Card className="p-6">
                {selectedTrade ? (
                    <>
                        <TradeToolbar symbol={selectedTrade.symbol} created_date={journal?.created_at} updated_date={journal?.updated_at} />

                        <div className="pt-6 gap-6">
                            {/* Trade Overview Card */}
                            <div className=" rounded-xl border border-gray-700">
                                <div className="flex justify-between items-center py-2 px-4">
                                    <h2 className="font-semibold mb-1 flex items-center gap-2">
                                        <span className={`${selectedTrade.position_type === 'Long' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            NET P&L: $ {selectedTrade.pnl}
                                        </span>

                                    </h2>
                                    <Button> View Trade Details</Button>
                                </div>
                                <Separator />

                                <div className="grid grid-cols-5 gap-2 py-2 px-4">
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Entry</div>
                                        <div className="text-sm font-medium">${selectedTrade.fill_price}</div>
                                    </div>
                                    <div >
                                        <div className="text-sm text-gray-400 mb-1">Exit</div>
                                        <div className="text-sm font-medium">${selectedTrade.stop_price}</div>
                                    </div>
                                    <div >
                                        <div className="text-sm text-gray-400 mb-1">Volume</div>
                                        <div className="text-sm font-medium">{selectedTrade.quantity}</div>
                                    </div>
                                    <div >
                                        <div className="text-sm text-gray-400 mb-1">Commission</div>
                                        <div className="text-sm font-medium">{selectedTrade.quantity}</div>
                                    </div>
                                    <div >
                                        <div className="text-sm text-gray-400 mb-1">Position Type</div>
                                        <div className={`text-sm font-medium ${selectedTrade.position_type === 'Long' ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                            {selectedTrade.position_type}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Emotional Tags Section */}
                            <EmotionalTags
                                emotionTags={emotionTags}
                                onChange={setEmotionTags}
                            />

                            {/* Notes Section */}
                            <RichTextEditor
                                content={journal?.entry_text}
                                onChange={(value) => setJournal((prev: Journal) => ({ ...prev, entry_text: value }))}
                            />

                            <div className="mt-6 flex justify-end">
                                <Button className="px-6" onClick={handleSave}>Save</Button>
                            </div>

                        </div>
                    </>
                ) : (
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex items-center justify-center h-64">
                        <p className="text-gray-400">Select a trade to view details</p>
                    </div>
                )}
            </Card>

        </div>
    );
}