import React from "react";
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

    for (let i = 0; i < numTrades; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const qty = Math.floor(Math.random() * 5) + 1;
        const stopPrice = Math.random() > 0.5 ? randomPrice(100, 1) : "";
        const entryPrice = randomPrice(100, 2);
        const exitPrice = (parseFloat(entryPrice) + (Math.random() * 2 - 1)).toFixed(2); // Random exit within ±1 range
        const commission = (Math.random() * (1.0 - 0.2) + 0.2).toFixed(4);

        const tradeDate = i < 5 ? today : recentDates[Math.floor(Math.random() * recentDates.length)];
        const placingTime = new Date(tradeDate.getTime() - Math.random() * 7200000);
        const closingTime = new Date(placingTime.getTime() + Math.random() * 3600000);

        // Entry Trade (Buy)
        trades.push([
            symbol, "Buy", "Market", qty, stopPrice, entryPrice, "Filled", commission, placingTime.toISOString(), closingTime.toISOString(), orderId
        ]);
        orderId++;

        // Exit Trade (Sell) - Same qty, different price
        trades.push([
            symbol, "Sell", "Market", qty, "", exitPrice, "Filled", commission, closingTime.toISOString(), "", orderId
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