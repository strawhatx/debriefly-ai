import { useEffect, useState } from 'react';
import useTradeStore from '@/store/trade';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TradeToolbar } from './components/TradeToolbar';
import { EmotionalTags } from './components/EmotionalTags';
import { TradingStrategy } from './components/TradingStrategy';
import { TradeOverview } from './components/TradeOverview';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { fetchJournalEntry, saveJournalEntry } from './services/journal';

interface Journal {
    user_id: string;
    position_id: string;
    entry_text: string;
    strategy: string;
    created_at: string;
    updated_at: string;
}

export const Notebook = () => {
    const [journal, setJournal] = useState<Journal>({
        user_id: "",
        position_id: "",
        entry_text: "",
        strategy: "",
        created_at: "",
        updated_at: "",
    });

    const [emotionTags, setEmotionTags] = useState<string[]>([]);
    const { toast } = useToast();
    const selectedTrade = useTradeStore((state) => state.selected);

    useEffect(() => {
        if (!selectedTrade) return;

        fetchJournalEntry(selectedTrade.id, setJournal);
    }, [selectedTrade]);

    const handleSave = async () => {
        await saveJournalEntry(journal);
        await fetchJournalEntry(selectedTrade.id, setJournal);
    };

    return (
        <div className="p-6 space-y-6">
            <Card className="p-6">
                {selectedTrade ? (
                    <>
                        <TradeToolbar 
                            symbol={selectedTrade.symbol} 
                            created_date={journal?.created_at} 
                            updated_date={journal?.updated_at} 
                        />

                        <div className="pt-6 gap-6">
                            <TradeOverview trade={selectedTrade} />

                            <EmotionalTags
                                emotionTags={emotionTags}
                                onChange={setEmotionTags}
                            />

                            <TradingStrategy
                                strategy={journal?.strategy}
                                onChange={(value) => setJournal((prev) => ({ ...prev, strategy: value }))}
                            />

                            <RichTextEditor
                                content={journal.entry_text}
                                onChange={(value) => setJournal((prev) => ({ ...prev, entry_text: value }))}
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
};
