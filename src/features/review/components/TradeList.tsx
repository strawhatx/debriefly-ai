"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowDownRight, ArrowUpRight, ChevronsUpDown, Search } from "lucide-react"
import { ReviewDialog } from "./ReviewDialog"
import { Trade } from "../hooks/use-review-dialog"
import { getAssetIcon } from "@/utils/asset-icons"

// Extend the Trade interface to include asset property
interface ExtendedTrade extends Trade {
    asset: string;
    market: string;
}

interface TradeListProps {
    data: ExtendedTrade[];
    refresh?: () => void;
}

export const TradeList = ({ data, refresh }: TradeListProps) => {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedTrade, setSelectedTrade] = React.useState<ExtendedTrade | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [assetIcons, setAssetIcons] = React.useState<Record<string, string>>({});

    // Memoize filtered trades
    const filteredTrades = React.useMemo(() => {
        if (!searchTerm.trim()) return data;

        const lowerSearchTerm = searchTerm.toLowerCase();
        return data.filter(trade =>
            trade.asset.toLowerCase().includes(lowerSearchTerm) ||
            trade.type.toLowerCase().includes(lowerSearchTerm)
        );
    }, [data, searchTerm]);

    // Memoize search handler
    const handleSearch = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    // Memoize open dialog handler
    const handleOpenDialog = React.useCallback((trade: ExtendedTrade) => {
        setSelectedTrade(trade);
        setIsDialogOpen(true);
    }, []);

    // Memoize close dialog handler
    const handleCloseDialog = React.useCallback(() => {
        setIsDialogOpen(false);
        setSelectedTrade(null);
    }, []);

    // Memoize save handler
    const handleSave = React.useCallback(() => {
        if (refresh) refresh();
        handleCloseDialog();
    }, [refresh, handleCloseDialog]);

    // Load asset icons
    React.useEffect(() => {
        const loadIcons = async () => {
            const icons: Record<string, string> = {};

            for (const trade of data) {
                if (!icons[trade.asset]) {
                    try {
                        const icon = await getAssetIcon(trade.asset, trade.market);
                        if (icon) {
                            icons[trade.asset] = icon;
                        }
                    } catch (error) {
                        console.error(`Error loading icon for ${trade.asset}:`, error);
                    }
                }
            }

            setAssetIcons(icons);
        };

        loadIcons();
    }, [data]);

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Trades</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search trades..."
                            className="pl-8 bg-gray-800 text-white border-gray-600"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {filteredTrades.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        {searchTerm ? "No trades match your search" : "No trades found"}
                    </div>
                ) : (
                    filteredTrades.map((trade) => (
                        <div key={trade.id} className="flex items-center justify-between py-4 border-b border-gray-700 last:border-0">
                            <div className="flex items-center space-x-4">
                                {assetIcons[trade.asset] ? (
                                    <img
                                        src={assetIcons[trade.asset]}
                                        alt={trade.asset}
                                        className="w-8 h-8 rounded-full"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                        <span className="text-xs font-bold">{trade.asset.substring(0, 2)}</span>
                                    </div>
                                )}
                                <div>
                                    <div className="font-medium text-sm">{trade.asset}</div>
                                    <div className="flex gap-1 text-xs italic text-gray-400">
                                        <span className={`flex ${trade.type === 'LONG' ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                            {trade.type === 'LONG' ? (
                                                <ArrowUpRight className="w-4 h-4 pr-1" />
                                            ) : (
                                                <ArrowDownRight className="w-4 h-4 pr-1" />
                                            )}
                                            {trade.type}
                                        </span>
                                        •
                                        <span className={`${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                            {trade.pnl >= 0 ? '+' : '-'}${Math.abs(trade.pnl).toFixed(2)}
                                        </span>
                                        •
                                        <span>
                                            {new Date(trade.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenDialog(trade)}
                                className="border-gray-600"
                            >
                                Edit
                            </Button>
                        </div>
                    ))
                )}
            </CardContent>

            {/* Single instance of ReviewDialog */}
            {selectedTrade && (
                <ReviewDialog
                    data={{ ...selectedTrade, symbol: selectedTrade.asset }}
                    onSave={handleSave}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            )}
        </Card>
    );
};