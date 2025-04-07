interface Trade {
    id: string;
    pnl: number | null;
  }

interface TradeStatisticsProps {
    trades: Trade[] | null;
}

// Reusable Stat Card Component
const StatCard = ({ title, value, textColor = "text-white" }: { title: string, value: string | number, textColor?: string }) => (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <span className="text-gray-400 text-sm">{title}</span>
        <div className={`text-lg font-semibold mt-1 ${textColor}`}>{value}</div>
    </div>
);

export const SummaryCards = ({ trades }: TradeStatisticsProps) => {
    if (!trades || trades.length === 0) {
        return (
            <section className="text-gray-400 text-center p-4 bg-gray-800 rounded-xl border border-gray-700">
                No trade data available.
            </section>
        );
    }

    const totalTrades = trades.length;
    const totalPnL = trades.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0);
    const winningTrades = trades.filter(t => (t.pnl ?? 0) > 0).length;
    const winRate = (winningTrades / totalTrades) * 100;
    const avgTrade = totalTrades > 0 ? totalPnL / totalTrades : 0;

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Trades" value={totalTrades} />
            <StatCard title="Win Rate" value={`${winRate.toFixed(2)}%`} textColor="text-emerald-400" />
            <StatCard 
                title="Total P&L" 
                value={`$${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
                textColor={totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'} 
            />
            <StatCard 
                title="Avg Trade" 
                value={`$${avgTrade.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
                textColor={avgTrade >= 0 ? 'text-emerald-400' : 'text-red-400'} 
            />
        </section>
    );
};