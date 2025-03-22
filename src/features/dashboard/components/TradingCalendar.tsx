import { useEffect, useRef, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../../../components/ui/button";
import { StepBack, StepForward } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export const TradingCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [trades, setTrades] = useState({});

  useEffect(() => {
    const fetchTrades = async () => {
      let { data, error } = await supabase.from("positions").select("entry_date, pnl");

      if (error) {
        console.error("Error fetching trades:", error);
        return;
      }

      // Aggregate trades per day
      const tradeMap = {};
      data.forEach((trade) => {
        const date = trade.entry_date.split("T")[0];
        if (!tradeMap[date]) {
          tradeMap[date] = { count: 0, totalPnl: 0 };
        }
        tradeMap[date].count += 1;
        tradeMap[date].totalPnl += trade.pnl;
      });

      setTrades(tradeMap);
    };

    fetchTrades();
  }, []);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDay = getDay(days[0]); // Offset to align the first day


  return (
    <div className="p-4">
      {/* Custom Toolbar */}
      <div className="flex items-center justify-between pb-4 p-2">
        {/* Left section */}
        <div className="flex items-center">
          <Button
            variant="link"
            className="text-foreground p-1"
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
          >
            <StepBack />
          </Button>
          <Button
            variant="link"
            className="text-foreground p-1 hover:decoration-0"
            onClick={() => setCurrentMonth(new Date())}
          >
            TODAY
          </Button>
          <Button
            variant="link"
            className="text-foreground p-1 mr-1"
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
          >
            <StepForward />
          </Button>

          {/* Dynamic Month & Year Title */}
          <h2 className="text-base">{format(currentMonth, "MMM yyyy")}</h2>
        </div>



        {/* Right section - Custom Buttons */}
        <div className="flex items-center gap-2">
          <p className="text-sm mr-2">Monthly Stats:</p>
          <Badge className="bg-emerald-200 text-emerald-500">$5.3K</Badge>
          <Badge className="bg-gray-700 text-gray-300">13 days</Badge>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-sm text-left text-gray-400 font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
        {Array(startDay).fill(null).map((_, idx) => (
          <div key={idx} className="h-20"></div>
        ))}
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const tradeInfo = trades[dateStr] || { count: 0, totalPnl: 0 };

          return (
            <div
              key={dateStr}
              className={`p-2 ${tradeInfo.totalPnl >= 0 ? (tradeInfo.totalPnl > 0 ? "bg-green-200 border border-green-300" : "bg-gray-700 border border-gray-600") : "bg-red-200 border border-red-300"} rounded-lg text-sm flex flex-col items-start min-h-20`}
            >
              <span className="text-foreground w-full text-right pb-2">{format(day, "d")}</span>

              {tradeInfo.count > 0 && (
                <>
                  <span className={`text-base ${tradeInfo.totalPnl >= 0 ? (tradeInfo.totalPnl > 0 ? "text-green-600" : "text-gray-300") : "text-red-600"}`}>
                    ${tradeInfo.totalPnl.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">Trades: {tradeInfo.count}</span>
                </>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};
