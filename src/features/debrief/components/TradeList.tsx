"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, Search } from "lucide-react"
import { emotionAttributes } from "@/utils/constants"
import { Badge } from "@/components/ui/badge"

export interface Trade {
    id: string;
    time: string;
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

const TradeCard = React.memo(({ trade }: { trade: Trade }) => {
    const isWin = trade.pnl >= 0;
    const pnlColor = isWin ? "text-emerald-400" : "text-red-400";
    const arrowIcon = React.useMemo(() =>
        trade.type === "LONG" ? (
            <ArrowUpRight className="w-4 h-4" />
        ) : (
            <ArrowDownRight className="w-4 h-4" />
        ),
        [trade.type]
    );

    return (
        <div className="p-4 bg-gray-900/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 ${pnlColor}`}>
                        {arrowIcon}
                        {trade.symbol}
                    </span>
                </div>
                <span className="text-sm text-gray-400">{trade.time}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-300">
                    {trade.entry} → {trade.exit}
                </span>
                <span className={`font-medium ${pnlColor}`}>
                    {isWin ? "+" : "-"}${Math.abs(trade.pnl).toFixed(2)}
                </span>
            </div>
            <div className="flex items-end gap-2 flex-wrap mt-2">
                {trade.tags.map((tag, index) => (
                    <TradeTag key={`${trade.id}-${tag}-${index}`} tag={tag} />
                ))}
            </div>
        </div>
    );
});

TradeCard.displayName = 'TradeCard';

export const TradeList = ({ data }: TradeListProps) => {
    const sortedTrades = [...data].sort((a, b) => {
        return a.time.localeCompare(b.time)
    });

    if (!sortedTrades || sortedTrades.length === 0) {
        return (
            <Card className="w-full">
                <p className="text-gray-400">No trades found for this account.</p>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">Trades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {sortedTrades.length === 0 ? (
                    <div className="text-center py-8 text-gray-400"> No trades found </div>
                ) : (
                    sortedTrades.map((trade) => (
                        <TradeCard key={trade.id} trade={trade} />
                    ))
                )}
            </CardContent>
        </Card>
    );
};