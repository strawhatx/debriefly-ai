import { Button } from "@/components/ui/button";
import { useDateStore } from "@/store/date";
import { Import } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
    const navigate = useNavigate();
    const { days, setDays } = useDateStore();

    return (
        <div className="flex gap-4">
            <Button size="sm" className="gap-2 text-sm"
                onClick={() => navigate("/app/trade-import")}>
                <Import className="w-3.5 h-3.5" /> Import Trades
            </Button>
            <select
                className="px-6 py-1 text-sm bg-gray-800 border border-gray-700 rounded-md focus:ring-1 focus:ring-emerald-500"
                value={days} 
                onChange={(e) => setDays(parseInt(e.target.value))}>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
            </select>
        </div>
    );
};