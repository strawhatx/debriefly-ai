import { Link } from "react-router-dom";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ArrowDownRight, ArrowUpRight, CircleChevronLeft, SortAsc } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import useTradeStore from "@/store/trade";
import { Button } from "../ui/button";

const TradeSidebar = () => {
  const [trades, setTrades] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  const setTrade = useTradeStore((state) => state.update);
  const selectedTrade = useTradeStore((state) => state.selected);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const fetchTrades = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("positions")
        .select("id,symbol,position_type,pnl,fees,quantity,fill_price,stop_price,entry_date")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: sortOrder === "asc" });

      if (error) {
        console.error(error);
        return;
      }

      setTrades(data);
      if (!selectedTrade && data.length > 0) setTrade(data[0]);
    };

    fetchTrades();
  }, [sortOrder]);

  return (
    <ShadcnSidebar>
      <SidebarContent>
        <div className="p-4">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <Link to="/app/dashboard" className="flex items-center gap-2 text-xl font-bold">
              <CircleChevronLeft className="w-6 h-6 text-primary" />
            </Link>
            <Button
              variant="link"
              className="p-2 hover:bg-gray-700 rounded-lg"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <SortAsc className={`w-4 h-4 ${sortOrder === "asc" ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="divide-y-2 border-gray-300">
              {trades.map((trade) => (
                <SidebarMenuItem key={trade.id}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => setTrade(trade)}
                    className={`hover:bg-gray-700 ${trade.id === selectedTrade?.id ? "bg-gray-700" : ""}`}
                  >
                    <div className="flex flex-col h-fit">
                      <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-1">
                          <h3 className="font-semibold"> {trade.symbol}:</h3>
                          <span className="text-sm text-gray-300">{formatDate(trade.entry_date)}</span>
                        </div>
                        <div
                          className={`text-sm ${trade.position_type === "LONG" ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {trade.position_type === "LONG" ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                      <div className="items-left w-full">
                        <span className="text-xs font-medium mr-2 text-gray-400">NET P&L:</span>
                        <span
                          className={`font-semibold ${trade.pnl >= 0 ? "text-emerald-300" : "text-red-400"}`}
                        >
                          {trade.pnl >= 0 ? "+" : ""} ${trade.pnl?.toFixed(2)}
                        </span>
                      </div>
                      <div className="items-left text-xs w-full text-gray-500">
                        {trade.fill_price} → {trade.stop_price}
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default TradeSidebar;
