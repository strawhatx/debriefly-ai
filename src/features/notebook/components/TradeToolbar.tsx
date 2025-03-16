import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

interface TradeToolbarProps {
    symbol: string;
    created_date: string;
    updated_date: string;
}

export const TradeToolbar = ({ symbol, created_date, updated_date }: TradeToolbarProps) => {

    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold">{symbol}</h1>
                {created_date && (
                    <p className="text-base text-gray-500">Created: {created_date}  Last Updated: {updated_date}</p>
                )}

            </div>

            <div className="flex gap-4">
                <Button className="bg-gray-700 text-primary">
                    <SlidersHorizontal />
                </Button>
            </div>
        </div>
    );
}