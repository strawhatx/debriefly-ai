"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowDownRight, ArrowUpRight, Calendar, Search } from "lucide-react"
import { ReviewDialog } from "./ReviewDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAssetIcon } from "@/utils/asset-icons"
import { Skeleton } from "@/components/ui/skeleton"

interface Trade {
    id: string;
    date: string;
    asset: string;
    type: 'LONG' | 'SHORT';
    market: string;
    pnl: number;
    strategy: string | null;
    reward: number;
    tags: string[];
    symbol: string; // Added to match ReviewDialog requirements
}

interface TradeListProps {
    data: Trade[];
    onTradeSelect?: (trade: Trade) => void;
}

export const TradeList = ({ data, onTradeSelect }: TradeListProps) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [assetIcons, setAssetIcons] = React.useState<Record<string, string>>({});
    const [loadingIcons, setLoadingIcons] = React.useState<Record<string, boolean>>({});

    // Memoized search handler
    const handleSearch = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    // Memoized filtered trades
    const filteredTrades = React.useMemo(() => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(trade =>
            trade.asset.toLowerCase().includes(query) ||
            trade.strategy?.toLowerCase().includes(query) ||
            trade.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }, [data, searchQuery]);

    // Load asset icons with debouncing
    React.useEffect(() => {
        const loadIcons = async () => {
            const newIcons: Record<string, string> = {};
            const newLoadingStates: Record<string, boolean> = {};

            for (const trade of filteredTrades) {
                if (!assetIcons[trade.asset] && !loadingIcons[trade.asset]) {
                    newLoadingStates[trade.asset] = true;
                    try {
                        newIcons[trade.asset] = await getAssetIcon(trade.asset, trade.market);
                    } catch (error) {
                        console.error(`Failed to load icon for ${trade.asset}:`, error);
                    }
                    newLoadingStates[trade.asset] = false;
                }
            }

            setAssetIcons(prev => ({ ...prev, ...newIcons }));
            setLoadingIcons(prev => ({ ...prev, ...newLoadingStates }));
        };

        const timeoutId = setTimeout(loadIcons, 300); // Debounce for 300ms
        return () => clearTimeout(timeoutId);
    }, [filteredTrades, assetIcons, loadingIcons]);

    // Memoized trade click handler
    const handleTradeClick = React.useCallback((trade: Trade) => {
        onTradeSelect?.(trade);
    }, [onTradeSelect]);

    return (
        <Card>
            <CardHeader>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search trades..."
                        className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </CardHeader>
            <CardContent className="grid gap-6">
                {filteredTrades.map((trade) => (
                    <div
                        key={trade.id}
                        className="flex items-center justify-between space-x-4 p-4 hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
                        onClick={() => handleTradeClick(trade)}
                    >
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-8 w-8">
                                {loadingIcons[trade.asset] ? (
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                ) : (
                                    <AvatarImage
                                        src={assetIcons[trade.asset] || '/default-icon.png'}
                                        alt={`${trade.asset} icon`}
                                    />
                                )}
                                <AvatarFallback className="bg-background text-sm">{trade.asset.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`flex items-center gap-1 text-sm ${trade.type === 'LONG' ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                        {trade.type === 'LONG' ? (
                                            <ArrowUpRight className="w-4 h-4" />
                                        ) : (
                                            <ArrowDownRight className="w-4 h-4" />
                                        )}
                                        <p className="text-gray-300">{trade.asset}</p>
                                    </span>
                                    <span className={`font-semibold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                        {trade.pnl >= 0 ? '+' : '-'}${Math.abs(trade.pnl).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm italic text-gray-400">
                                        {new Date(trade.date).toLocaleDateString()}
                                    </span>
                                </div>
                                
                            </div>
                        </div>

                        <ReviewDialog data={{ ...trade, symbol: trade.asset }} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};