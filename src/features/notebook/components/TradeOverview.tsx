import React from "react";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface TradeOverviewProps {
    trade: {
        id: string;
        pnl: number;
        fill_price: number;
        stop_price: number;
        quantity: number;
        position_type: string;
    };
}

export const TradeOverview: React.FC<TradeOverviewProps> = ({ trade }) => {
    return (
        <div className="rounded-xl border border-gray-700">
            <div className="flex justify-between items-center py-2 px-4">
                <h2 className="font-semibold mb-1 flex items-center gap-2">
                    <span className={`${trade.position_type === 'Long' ? 'text-emerald-400' : 'text-red-400'}`}>
                        NET P&L: $ {trade.pnl}
                    </span>
                </h2>
                <Button>View Trade Details</Button>
            </div>
            <Separator />
            <div className="grid grid-cols-5 gap-2 py-2 px-4">
                <TradeDetail label="Entry" value={`$${trade.fill_price}`} />
                <TradeDetail label="Exit" value={`$${trade.stop_price}`} />
                <TradeDetail label="Volume" value={trade.quantity} />
                <TradeDetail label="Commission" value={trade.quantity} />
                <TradeDetail 
                    label="Position Type" 
                    value={trade.position_type} 
                    className={trade.position_type === 'Long' ? 'text-emerald-400' : 'text-red-400'} 
                />
            </div>
        </div>
    );
};

const TradeDetail: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
    <div>
        <div className="text-sm text-gray-400 mb-1">{label}</div>
        <div className={`text-sm font-medium ${className}`}>{value}</div>
    </div>
);
