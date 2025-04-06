import { Card } from "@/components/ui/card";
import { LineChartIcon } from "lucide-react";
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useMemo, useState } from "react";

interface Trade {
    pnl: number;
    tags: string[] | null | undefined;
    date: string; // Assuming trades have a `date` field in 'YYYY-MM-DD' format
}

interface BehaviorChartProps {
    trades: Trade[];
}

export const BehaviorChart = ({ trades }: BehaviorChartProps) => {
    const [timeFrame, setTimeFrame] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('30d');

    // Helper function to group data based on the selected time frame
    const groupDataByTimeFrame = (data: any[], interval: number) => {
        const groupedData: any[] = [];
        for (let i = 0; i < data.length; i += interval) {
            const chunk = data.slice(i, i + interval);
            const aggregated = chunk.reduce(
                (acc, curr) => {
                    acc.date = `${chunk[0].date} - ${chunk[chunk.length - 1].date}`;
                    Object.keys(curr).forEach((key) => {
                        if (key !== 'date') {
                            acc[key] = (acc[key] || 0) + curr[key];
                        }
                    });
                    return acc;
                },
                { date: '' }
            );
            groupedData.push(aggregated);
        }
        return groupedData;
    };

    // Process trades to generate behaviorTrendData
    const behaviorTrendData = useMemo(() => {
        const tagCountsByDate: { [date: string]: { [tag: string]: number } } = {};

        trades.forEach((trade) => {
            const date = new Date(trade.date).toLocaleDateString('en-US', { weekday: 'short' }); // Convert to day of the week
            if (!tagCountsByDate[date]) {
                tagCountsByDate[date] = { FOMO: 0, Hesitation: 0, Revenge: 0, Calm: 0 };
            }

            trade.tags?.forEach((tag) => {
                if (tagCountsByDate[date][tag] !== undefined) {
                    tagCountsByDate[date][tag]++;
                }
            });
        });

        const rawData = Object.entries(tagCountsByDate).map(([date, tags]) => ({
            date,
            ...tags,
        }));

        // Determine the grouping interval based on the selected time frame
        const interval = timeFrame === '7d' ? 1 : timeFrame === '30d' ? 3 : timeFrame === '3m' ? 7 : timeFrame === '6m' ? 14 : 30;

        return groupDataByTimeFrame(rawData, interval);
    }, [trades, timeFrame]);

    return (
        <Card className="bg-gray-800 border border-gray-700 p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <LineChartIcon className="text-blue-400" />
                Behavior Frequency Over Time
            </h2>
            <div className="mb-4">
                <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as '7d' | '30d' | '3m' | '6m' | '1y')}
                    className="bg-gray-700 text-white p-2 rounded"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="3m">Last 3 Months</option>
                    <option value="6m">Last 6 Months</option>
                    <option value="1y">Last Year</option>
                </select>
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={behaviorTrendData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                            labelStyle={{ color: '#f9fafb' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="FOMO" stroke="#f59e0b" strokeWidth={2} />
                        <Line type="monotone" dataKey="Hesitation" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="Revenge" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="Calm" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
