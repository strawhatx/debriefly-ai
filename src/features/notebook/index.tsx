// This file is part of the Trading Journal feature 
// rigt now its not fully funtional because we move things around 
// and no longer fit in our sequence but its possible that it may become 
// a feature request so i wount completely remove the work but as for now the page is disabled.

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useParams } from 'react-router-dom';
import { useJournal } from './hooks/use-journal';
import { EmotionalTags } from './components/EmotionalTags';
import { TradingStrategy } from './components/TradingStrategy';
import RiskToReward from './components/RiskToReward';


export const Notebook = () => {
    const { id } = useParams<{ id: string }>();
    const {
        journal,
        trade,
        isLoading,
        error,
        saveJournal,
        updateJournalField
    } = useJournal(id || '');

    if (!id) {
        return <NoTradeSelected />;
    }

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} />;
    }

    if (!trade || !journal) {
        return <NoTradeSelected />;
    }

    return (
        <div className="p-4 space-y-6">
            <div className="gap-6 ">
                <div className="pt-6 gap-6">

                    <EmotionalTags id={id} />

                    <TradingStrategy
                        strategy={journal.strategy}
                        onChange={(value) => updateJournalField('strategy', value)}
                    />

                    <RiskToReward
                        value={journal.reward}
                        onChange={(value) => updateJournalField('reward', value)}
                    />

                    <RichTextEditor
                        content={journal.entry_text}
                        onChange={(value) => updateJournalField('entry_text', value)}
                    />

                    <div className="mt-6 flex justify-end">
                        <Button
                            className="px-6"
                            onClick={() => saveJournal(journal)}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div> 
        </div>
    );
};

// Extracted components for better organization
const LoadingState = () => (
    <div className="p-6">
        <Card className="p-6">
            <div className="flex items-center justify-center h-44">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
        </Card>
    </div>
);

const ErrorState = ({ error }: { error: Error }) => (
    <div className="p-6">
        <Card className="p-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-center justify-center h-44">
                <p className="text-red-500">Error: {error.message}</p>
            </div>
        </Card>
    </div>
);

const NoTradeSelected = () => (
    <div className="p-6">
        <Card className="p-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex items-center justify-center h-44">
                <p className="text-gray-400">Select a trade to view details</p>
            </div>
        </Card>
    </div>
);
