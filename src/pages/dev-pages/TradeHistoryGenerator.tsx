import { saveAs } from "file-saver";

const generateTradesCSV = () => {
    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "JPM", "V", "WMT"];
    const numTrades = 10; // 10 trades (each with an entry + exit)
    const trades = [];
    let orderId = 1762849200;

    const today = new Date();
    const recentDates = [...Array(5)].map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date;
    });

    const randomPrice = (base = 100, variation = 5) => (base + Math.random() * variation * 2 - variation).toFixed(2);

    // Generate 50 random trades
    for (let i = 0; i < 50; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const side = Math.random() > 0.5 ? "Buy" : "Sell";
        const qty = Math.floor(Math.random() * 10) + 1;
        const entryPrice = parseFloat((Math.random() * 100 + 50).toFixed(2));
        const stopPrice = parseFloat((entryPrice * (side === "Buy" ? 0.95 : 1.05)).toFixed(2));
        const commission = parseFloat((Math.random() * 5).toFixed(2));
        const placingTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const closingTime = new Date(placingTime.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        // Entry Trade (Buy/Sell)
        trades.push([
            symbol, side, "Market", qty, stopPrice, entryPrice, "Filled", commission, placingTime.toISOString(), "", orderId
        ]);
        orderId++;

        // Determine if this will be a winning trade (70% chance of winning)
        const isWinningTrade = Math.random() < 0.7;
        
        // Calculate exit price with bias toward profitable outcomes
        let exitPrice;
        if (isWinningTrade) {
            // For winning trades, ensure a profitable exit
            const minProfitPercent = 0.02; // 2% minimum profit
            const maxProfitPercent = 0.15; // 15% maximum profit
            const profitPercent = minProfitPercent + Math.random() * (maxProfitPercent - minProfitPercent);
            
            if (side === "Buy") {
                exitPrice = parseFloat((entryPrice * (1 + profitPercent)).toFixed(2));
            } else {
                exitPrice = parseFloat((entryPrice * (1 - profitPercent)).toFixed(2));
            }
        } else {
            // For losing trades, ensure a loss but not too big
            const maxLossPercent = 0.08; // 8% maximum loss
            const lossPercent = Math.random() * maxLossPercent;
            
            if (side === "Buy") {
                exitPrice = parseFloat((entryPrice * (1 - lossPercent)).toFixed(2));
            } else {
                exitPrice = parseFloat((entryPrice * (1 + lossPercent)).toFixed(2));
            }
        }

        // Exit Trade (Sell) - Same qty, different price
        trades.push([
            symbol, side === "Buy" ? "Sell" : "Buy", "Market", qty, "", exitPrice, "Filled", commission, closingTime.toISOString(), "", orderId
        ]);
        orderId++;
    }

    const csvContent = [
        ["Symbol", "Side", "Type", "Qty", "Stop Price", "Fill Price", "Status", "Commission", "Placing Time", "Closing Time", "Order ID"],
        ...trades
    ].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "trading_history.csv");
};

export const TradeHistoryGenerator = () => {
    return (
        <div className="p-6 bg-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-4">Trade History Generator</h2>

            <button onClick={generateTradesCSV} className="bg-blue-500 text-white p-2 rounded">
                Generate & Download CSV
            </button>
        </div>

    );
};