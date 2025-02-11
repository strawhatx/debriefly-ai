
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const TradeCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Dummy data for trade activity
  const tradeDates = {
    "2024-04-05": { wins: 3, losses: 1, profit: 450, trades: [
      { symbol: "AAPL", profit: 200, entry: 170.50, exit: 172.50, type: "LONG" },
      { symbol: "MSFT", profit: 150, entry: 380.25, exit: 382.75, type: "LONG" },
      { symbol: "GOOGL", profit: 180, entry: 147.75, exit: 149.50, type: "LONG" },
      { symbol: "META", profit: -80, entry: 500.25, exit: 498.75, type: "LONG" }
    ]},
    "2024-04-08": { wins: 1, losses: 2, profit: -250, trades: [
      { symbol: "NVDA", profit: -150, entry: 880.50, exit: 875.25, type: "LONG" },
      { symbol: "AMD", profit: -180, entry: 170.25, exit: 167.50, type: "LONG" },
      { symbol: "TSLA", profit: 80, entry: 165.75, exit: 167.25, type: "LONG" }
    ]},
    "2024-04-12": { wins: 2, losses: 0, profit: 320, trades: [
      { symbol: "AMZN", profit: 180, entry: 180.50, exit: 182.75, type: "LONG" },
      { symbol: "NFLX", profit: 140, entry: 620.25, exit: 623.50, type: "LONG" }
    ]},
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const selectedDateStr = selectedDate ? formatDate(selectedDate) : '';
  const selectedDayTrades = selectedDate ? tradeDates[selectedDateStr] : null;

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
        components={{
          DayContent: ({ date }) => {
            const dateStr = formatDate(date);
            const dayData = tradeDates[dateStr];
            
            return (
              <div className="relative w-full h-full flex items-center justify-center">
                <span>{date.getDate()}</span>
                {dayData && (
                  <div
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                      dayData.profit >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                )}
              </div>
            );
          },
        }}
      />

      {selectedDayTrades && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Daily Summary</h3>
              <span className={`font-bold ${selectedDayTrades.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${selectedDayTrades.profit}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Wins:</span>
                <span className="ml-2 text-green-500">{selectedDayTrades.wins}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Losses:</span>
                <span className="ml-2 text-red-500">{selectedDayTrades.losses}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Trades</h4>
              {selectedDayTrades.trades.map((trade, index) => (
                <div key={index} className="text-sm border rounded-md p-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{trade.symbol}</span>
                    <span className={trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                      ${trade.profit}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    Entry: ${trade.entry} → Exit: ${trade.exit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TradeCalendar;
