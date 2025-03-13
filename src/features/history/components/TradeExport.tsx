import { Download } from 'lucide-react';
import Papa from "papaparse";
import { Button } from "@/components/ui/button";

interface TradeExportProps {
    trades: any[] | null;
}

export const TradeExport = ({ trades }: TradeExportProps) => {
    const handleExport = () => {
        const csv = Papa.unparse(trades);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "trade_history.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Button className="gap-2 text-gray-300 bg-gray-800 hover:bg-gray-700" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
        </Button>
    );
};
