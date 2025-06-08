import { saveAs } from "file-saver";

const generateTradesCSV = () => {
    const baseSymbols = ["BTC", "ETH", "BNB", "XRP", "ADA", "SOL", "DOGE", "DOT", "MATIC", "LTC"]; // Popular cryptocurrencies
    const quoteSymbols = ["USD", "USDT", "EUR"]; // Common quote currencies
    const trades = [];
    let orderId = 1762849200;

    const randomPrice = (base = 1000, variation = 200) => (base + Math.random() * variation * 2 - variation).toFixed(2);

    // Generate 50 random trades
    for (let i = 0; i < 50; i++) {
        // Randomly decide whether to use a single symbol or a trading pair
        const isTradingPair = Math.random() > 0.5;
        const symbol = isTradingPair
            ? `${baseSymbols[Math.floor(Math.random() * baseSymbols.length)]}${quoteSymbols[Math.floor(Math.random() * quoteSymbols.length)]}`
            : baseSymbols[Math.floor(Math.random() * baseSymbols.length)];

        const side = Math.random() > 0.5 ? "Buy" : "Sell";
        const qty = parseFloat((Math.random() * 5 + 0.1).toFixed(4)); // Crypto quantities are often fractional
        const entryPrice = parseFloat(randomPrice());
        const stopPrice = parseFloat((entryPrice * (side === "Buy" ? 0.95 : 1.05)).toFixed(2));
        const commission = parseFloat((Math.random() * 0.01).toFixed(4)); // Lower commission for crypto
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
            const minProfitPercent = 0.01; // 1% minimum profit
            const maxProfitPercent = 0.2; // 20% maximum profit
            const profitPercent = minProfitPercent + Math.random() * (maxProfitPercent - minProfitPercent);

            if (side === "Buy") {
                exitPrice = parseFloat((entryPrice * (1 + profitPercent)).toFixed(2));
            } else {
                exitPrice = parseFloat((entryPrice * (1 - profitPercent)).toFixed(2));
            }
        } else {
            const maxLossPercent = 0.1; // 10% maximum loss
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
    saveAs(blob, "crypto_trading_history.csv");
};

export const TradeHistoryGenerator = () => {
    return (
        <div className="p-6 bg-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-4">Crypto Trade History Generator</h2>

            <button onClick={generateTradesCSV} className="bg-blue-500 text-white p-2 rounded">
                Generate & Download CSV
            </button>
        </div>
    );
};