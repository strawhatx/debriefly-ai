import React, { useState } from 'react';
import {
    Upload,
    FileSpreadsheet,
    Link as LinkIcon,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    RefreshCw,
    Edit,
    Save,
    X,
    Download
} from 'lucide-react';

interface Trade {
    id: string;
    date: string;
    asset: string;
    type: 'Long' | 'Short';
    entry: number;
    exit: number;
    volume: number;
    pnl: number;
    status: 'valid' | 'warning' | 'error';
    issues?: string[];
}

export const Review = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [importMethod, setImportMethod] = useState<'csv' | 'sync' | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [editingTrade, setEditingTrade] = useState<string | null>(null);

    // Mock trades data
    const mockTrades: Trade[] = [
        {
            id: '1',
            date: '2024-03-15',
            asset: 'BTC/USD',
            type: 'Long',
            entry: 65000,
            exit: 67000,
            volume: 0.5,
            pnl: 1000,
            status: 'valid'
        },
        {
            id: '2',
            date: '2024-03-15',
            asset: 'ETH/USD',
            type: 'Short',
            entry: 3200,
            exit: 3150,
            volume: 2,
            pnl: 100,
            status: 'warning',
            issues: ['Unusual volume size', 'High slippage detected']
        },
        {
            id: '3',
            date: '2024-03-14',
            asset: 'BTC/USD',
            type: 'Long',
            entry: 64500,
            exit: 64000,
            volume: 0.1,
            pnl: -50,
            status: 'error',
            issues: ['Missing stop-loss data']
        }
    ];

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <span className="text-gray-400">Total Trades</span>
                    <div className="text-2xl font-bold mt-1">{trades.length}</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <span className="text-gray-400">Valid Trades</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">
                        {trades.filter(t => t.status === 'valid').length}
                    </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <span className="text-gray-400">Warnings</span>
                    <div className="text-2xl font-bold text-amber-400 mt-1">
                        {trades.filter(t => t.status === 'warning').length}
                    </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <span className="text-gray-400">Errors</span>
                    <div className="text-2xl font-bold text-red-400 mt-1">
                        {trades.filter(t => t.status === 'error').length}
                    </div>
                </div>
            </div>

            {/* Trade Review Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold">Review Trades</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Asset</th>
                                <th className="px-6 py-3 text-left">Type</th>
                                <th className="px-6 py-3 text-left">Entry</th>
                                <th className="px-6 py-3 text-left">Exit</th>
                                <th className="px-6 py-3 text-left">Volume</th>
                                <th className="px-6 py-3 text-left">P&L</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trades.map((trade) => (
                                <tr key={trade.id} className="border-b border-gray-700">
                                    <td className="px-6 py-4">{trade.date}</td>
                                    <td className="px-6 py-4">{trade.asset}</td>
                                    <td className="px-6 py-4">
                                        <span className={`${trade.type === 'Long' ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                            {trade.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{trade.entry}</td>
                                    <td className="px-6 py-4">{trade.exit}</td>
                                    <td className="px-6 py-4">{trade.volume}</td>
                                    <td className={`px-6 py-4 ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                        {trade.pnl >= 0 ? '+' : ''}{trade.pnl}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {trade.status === 'valid' ? (
                                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                                <AlertTriangle className={`w-4 h-4 ${getStatusColor(trade.status)
                                                    }`} />
                                            )}
                                            <span className={getStatusColor(trade.status)}>
                                                {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                                            </span>
                                        </div>
                                        {trade.issues && (
                                            <div className="mt-1 text-sm text-gray-400">
                                                {trade.issues.map((issue, index) => (
                                                    <div key={index} className="flex items-center gap-1">
                                                        <span>•</span>
                                                        <span>{issue}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingTrade === trade.id ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleSaveTrade(trade.id)}
                                                    className="p-1 hover:bg-gray-700 rounded"
                                                >
                                                    <Save className="w-4 h-4 text-emerald-400" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingTrade(null)}
                                                    className="p-1 hover:bg-gray-700 rounded"
                                                >
                                                    <X className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEditTrade(trade.id)}
                                                className="p-1 hover:bg-gray-700 rounded"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                    Cancel Import
                </button>
                <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2">
                    Confirm & Import
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

