"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowDownRight, ArrowUpRight, Search } from "lucide-react"
import { getAssetIcon } from "@/utils/asset-icons"
import { emotionAttributes } from "@/utils/constants"
import { Badge } from "@/components/ui/badge"

export interface Trade {
    id: string;
    date: string;
    symbol: string;
    entry: string;
    exit: string;
    type: 'LONG' | 'SHORT';
    pnl: number;
    tags: string[]
}

interface TradeListProps {
    data: Trade[];
}

interface TradeTagProps {
    tag: string;
}

const TradeTag = React.memo(({ tag }: TradeTagProps) => {
    const { colorClass, icon } = emotionAttributes[tag] || {
        colorClass: "text-gray-400 bg-gray-900/50",
        icon: "❓",
    };

    return (
        <Badge
            key={tag}
            className={`flex py-1 px-2 text-sm border border-gray-500/50 hover:bg-gray-900/70 ${colorClass}`}
        >
            {icon} {tag}
        </Badge>
    );
});

TradeTag.displayName = 'TradeTag';


const TradeCard = ({ trade }: { trade: Trade }) => {
    const isWin = trade.pnl >= 0;
    const pnlColor = isWin ? "text-emerald-400" : "text-red-400";
    const arrowIcon =
        trade.type === "LONG" ? (
            <ArrowUpRight className="w-4 h-4" />
        ) : (
            <ArrowDownRight className="w-4 h-4" />
        );

    return (
        <><div className="p-4 bg-gray-900/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 ${pnlColor}`}>
                        {arrowIcon}
                        {trade.symbol}
                    </span>
                </div>
                <span className="text-sm text-gray-400">{trade.date}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-300">
                    {trade.entry} → {trade.exit}
                </span>
                <span className={`font-medium ${pnlColor}`}>
                    {isWin ? "+" : "-"}${Math.abs(trade.pnl).toFixed(2)}
                </span>
            </div>
        </div>

            <div className="flex items-end gap-2 flex-wrap">
                {trade.tags.map((tag, index) => (
                    <TradeTag key={`${trade.id}-${tag}-${index}`} tag={tag} />
                ))}
            </div>
        </>

    );
};

export const TradeList = ({ data }: TradeListProps) => {
    const [searchTerm, setSearchTerm] = React.useState("");
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    // Memoize filtered trades with debounced search
    const filteredTrades = React.useMemo(() => {
        if (!searchTerm.trim()) return data;

        const lowerSearchTerm = searchTerm.toLowerCase();
        return data.filter(trade =>
            trade.symbol.toLowerCase().includes(lowerSearchTerm) ||
            trade.type.toLowerCase().includes(lowerSearchTerm) ||
            trade.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
        );
    }, [data, searchTerm]);

    // Memoize search handler with debounce
    const handleSearch = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    // Focus search input on mount
    React.useEffect(() => {
        searchInputRef.current?.focus();
    }, []);

    if (!filteredTrades || filteredTrades.length === 0) {
        return (
            <Card className="w-full">
                <p className="text-gray-400">No trades found for this account.</p>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Trades</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            ref={searchInputRef}
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
                        <TradeCard key={trade.id} trade={trade} />
                    ))
                )}
            </CardContent>
        </Card>
    );
};