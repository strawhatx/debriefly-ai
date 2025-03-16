import { Download } from 'lucide-react';
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Trade {
    id: string;
    symbol: string;
    entry_date: string;
    fill_price: number;
    stop_price: number;
    quantity: number;
    side: string;
    pnl: number | null;
    emotional_tags: string[]
  }
  

interface TradeExportProps {
    trades: Trade[] | null;
}

export const TradeExport = ({ trades }: TradeExportProps) => {
    const handleExport = () => {
        if (!trades || trades.length === 0) return;

        // Format trades for CSV
        const formattedTrades = trades.map(({ id, entry_date, symbol, side, fill_price, stop_price, pnl, emotional_tags }) => ({
            Date: format(new Date(entry_date), "yyyy-MM-dd"),
            Symbol: symbol,
            Type: side,
            "Entry Price": fill_price,
            "Stop Price": stop_price,
            "P&L": pnl !== null ? pnl.toFixed(2) : "N/A",
            "Top Emotion": emotional_tags.length > 0 ? emotional_tags[0] : "None",
        }));

        const csv = Papa.unparse(formattedTrades);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        // Generate file name with date
        const fileName = `trade_history_${format(new Date(), "yyyy-MM-dd")}.csv`;

        // Create and trigger download link
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Button className="gap-2 text-gray-300 bg-gray-800 hover:bg-gray-700" onClick={handleExport} disabled={!trades || trades.length === 0}>
            <Download className="w-4 h-4" />
            Export
        </Button>
    );
};
