
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const TradeCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Dummy data for trade activity
  const tradeDates = [
    new Date(2024, 3, 5),  // Win
    new Date(2024, 3, 8),  // Loss
    new Date(2024, 3, 12), // Win
    new Date(2024, 3, 15), // Win
    new Date(2024, 3, 19), // Loss
  ];

  const tradeResults = {
    [tradeDates[0].toDateString()]: "win",
    [tradeDates[1].toDateString()]: "loss",
    [tradeDates[2].toDateString()]: "win",
    [tradeDates[3].toDateString()]: "win",
    [tradeDates[4].toDateString()]: "loss",
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border w-full"
      modifiers={{
        trading: tradeDates,
      }}
      modifiersStyles={{
        trading: {
          fontWeight: "bold",
        },
      }}
      components={{
        DayContent: ({ date }) => {
          const result = tradeResults[date.toDateString()];
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <span>{date.getDate()}</span>
              {result && (
                <div
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                    result === "win" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              )}
            </div>
          );
        },
      }}
    />
  );
};

export default TradeCalendar;
