import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
    const navigate = useNavigate();
    return (
        <Button
            size="sm"
            className="gap-2 text-sm"
            onClick={() => navigate("/app/trade-import")}
        >
            <Import className="w-3.5 h-3.5" />
            Import Trades
        </Button>
    );
};