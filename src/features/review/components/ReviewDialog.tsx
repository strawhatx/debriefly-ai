import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, Loader2 } from "lucide-react";
import { allStrategies, allTagObjects as allTags } from "../../../utils/constants";
import { MultiSelect } from "./MultiSelect";
import { Select } from "./Select";
import { Trade, useReviewDialog } from "../hooks/use-review-dialog";

interface ReviewDialogProps {
    data: Trade;
    className?: string;
}

export const ReviewDialog = ({ data, className }: ReviewDialogProps) => {
    const { 
        open, 
        setOpen, 
        trade, 
        setTrade, 
        handleSave: save,
        isSaving = false,
        errors = {} 
    } = useReviewDialog();

    // Memoized handlers
    const handleRewardChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value >= 0.5 && value <= 10) {
            setTrade(prev => ({ ...prev, reward: value }));
        }
    }, [setTrade]);

    const handleStrategyChange = React.useCallback((value: string) => {
        setTrade(prev => ({ ...prev, strategy: value }));
    }, [setTrade]);

    const handleTagsChange = React.useCallback((values: string[]) => {
        setTrade(prev => ({ ...prev, tags: values }));
    }, [setTrade]);

    const handleSave = React.useCallback(async () => {
        await save();
    }, [save]);

    // Reset form when dialog opens/closes
    React.useEffect(() => {
        if (open) {
            setTrade(data);
        }
    }, [open, data, setTrade]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className={`border-gray-600 ${className || ''}`}>
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Review Position</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Risk Reward Input */}
                    <div className="space-y-2">
                        <Label htmlFor="reward">Risk Reward</Label>
                        <Input
                            id="reward"
                            type="number"
                            className={`bg-gray-800 text-right text-white border border-gray-600 rounded px-4 py-2 ${
                                errors?.reward ? 'border-red-500 focus:ring-red-500' : ''
                            }`}
                            value={trade?.reward}
                            min={0.5}
                            max={10}
                            step={0.5}
                            onChange={handleRewardChange}
                            disabled={isSaving}
                        />
                        {errors?.reward && (
                            <p className="text-sm text-red-500">{errors.reward}</p>
                        )}
                    </div>

                    {/* Strategy Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="strategy">Strategy</Label>
                        <Select
                            options={allStrategies}
                            value={trade?.strategy}
                            onChange={handleStrategyChange}
                        />
                        {errors?.strategy && (
                            <p className="text-sm text-red-500">{errors.strategy}</p>
                        )}
                    </div>

                    {/* Emotion Tags Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="tags">Emotion Tags</Label>
                        <MultiSelect
                            options={allTags}
                            values={trade?.tags}
                            onValueChange={handleTagsChange}
                        />
                        {errors?.tags && (
                            <p className="text-sm text-red-500">{errors.tags}</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        variant="default" 
                        onClick={handleSave} 
                        className="w-full"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Save
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
