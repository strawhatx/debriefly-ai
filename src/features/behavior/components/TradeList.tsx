"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { emotionAttributes } from "@/utils/constants"
import { Badge } from "@/components/ui/badge"

export interface Trade {
    id: string;
    date: string;
    symbol: string;
    entry: number;
    exit: number;
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

interface TradeCardProps {
    trade: Trade;
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

const PnLDisplay = React.memo(({ pnl }: { pnl: number }) => {
    const isWin = pnl >= 0;
    const pnlColor = isWin ? "text-emerald-400" : "text-red-400";
    
    return (
        <span className={`font-medium ${pnlColor}`}>
            {isWin ? "+" : "-"}${Math.abs(pnl).toFixed(2)}
        </span>
    );
});

PnLDisplay.displayName = 'PnLDisplay';

const TradeCard = React.memo(({ trade }: TradeCardProps) => {
    const isWin = trade.pnl >= 0;
    const pnlColor = isWin ? "text-emerald-400" : "text-red-400";
    const arrowIcon = useMemo(() =>
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
                <span className="text-sm text-gray-400">{trade.date}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-300">
                    {trade.entry} → {trade.exit}
                </span>
                <PnLDisplay pnl={trade.pnl} />
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

export const TradeList = React.memo(({ data }: TradeListProps) => {
    if (!data || data.length === 0) {
        return (
            <Card className="w-full">
                <p className="text-gray-400">No trades found for this account.</p>
            </Card>
        );
    }

    const sortedTrades = useMemo(() => 
        [...data].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime(); // Sort in descending order (newest first)
        }),
        [data]
    );

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">Trades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {sortedTrades.map((trade) => (
                    <TradeCard key={trade.id} trade={trade} />
                ))}
            </CardContent>
        </Card>
    );
});

TradeList.displayName = 'TradeList';