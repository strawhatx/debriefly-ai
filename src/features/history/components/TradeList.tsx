"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowDownRight, ArrowUpRight, ChevronsUpDown, ClipboardCopy, Database, MoreHorizontal, Search } from "lucide-react"
import { getAssetIcon } from "@/utils/asset-icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface Trade {
    id: string;
    date: string;
    asset: string;
    market: string;
    type: 'LONG' | 'SHORT';
    pnl: number;
}

interface TradeListProps {
    data: Trade[];
    onViewRawData: (tradeId: string) => void;
}

export const TradeList = ({ data, onViewRawData }: TradeListProps) => {
    const [searchTerm, setSearchTerm] = React.useState("");
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

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-gray-900" align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => navigator.clipboard.writeText(trade.id)}
                                    >
                                        <ClipboardCopy className="w-4 h-4 mr-2" />
                                        Copy trade ID
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => navigator.clipboard.writeText(trade.asset)}
                                    >
                                        <ClipboardCopy className="w-4 h-4 mr-2" />
                                        Copy asset
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onViewRawData(trade.id)}
                                    >
                                        <Database className="w-4 h-4 mr-2" />
                                        View raw data
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};