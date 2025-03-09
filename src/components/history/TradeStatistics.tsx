
interface TradeStatisticsProps {
    trades: any[] | null;
}

export const TradeStatistics = ({ trades }: TradeStatisticsProps) => {
    const totalTrades = trades.length;
    const totalPnL = trades.reduce((acc, trade) => acc + trade.pnl, 0);
    const winRate = totalTrades > 0 ? (trades.filter(t => t.pnl > 0).length / totalTrades) * 100 : 0;
    const avgTrade = totalTrades > 0 ? totalPnL / totalTrades : 0;

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <span className="text-gray-400">Total Trades</span>
                <div className="text-2xl font-semibold mt-1">{totalTrades}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <span className="text-gray-400">Win Rate</span>
                <div className="text-2xl font-semibold text-emerald-400 mt-1">{winRate.toFixed(2)}%</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <span className="text-gray-400">Total P&L</span>
                <div className={`text-2xl font-semibold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'} mt-1`}>{totalPnL.toFixed(2)}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <span className="text-gray-400">Avg Trade</span>
                <div className={`text-2xl font-semibold ${avgTrade >= 0 ? 'text-emerald-400' : 'text-red-400'} mt-1`}>{avgTrade.toFixed(2)}</div>
            </div>
        </section>
    );
};
