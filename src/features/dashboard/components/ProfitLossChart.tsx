
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { date: "2024-01", pnl: 1200 },
  { date: "2024-02", pnl: -800 },
  { date: "2024-03", pnl: 2400 },
  { date: "2024-04", pnl: 1600 },
  { date: "2024-05", pnl: -400 },
  { date: "2024-06", pnl: 3200 },
];

const config = {
  pnl: {
    label: "Profit/Loss",
    theme: {
      light: "#22c55e",
      dark: "#22c55e",
    },
  },
};

const ProfitLossChart = () => {
  return (
    <ChartContainer className="h-[300px]" config={config}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload) return null;
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Profit/Loss
                    </span>
                    <span className="font-bold text-muted-foreground">
                      ${payload[0].value}
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Line
          type="monotone"
          dataKey="pnl"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default ProfitLossChart;
