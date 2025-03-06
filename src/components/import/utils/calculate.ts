// ✅ Advanced P&L Calculator (Futures, Forex, Stocks, Crypto, Options) with Real-Time Currency Conversion
import { detectAssetType, getAssetType, getFuturesInfo } from "./asset-detection";

const convertForexUnitsToLots = (quantity: number): number => {
    if (quantity >= 100000) return quantity / 100000; // Standard Lot
    if (quantity >= 10000) return quantity / 10000;   // Mini Lot
    if (quantity >= 1000) return quantity / 1000;     // Micro Lot
    return quantity; // Already in lots
  };

const getExchangeRate = async (quoteCurrency) => {
    if (quoteCurrency === "USD") return 1;
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        return data.rates[quoteCurrency] || 1;
    }
    catch (error) {
        console.error("Exchange rate fetch error:", error);
        return 1;
    }
};

export const calculatePnL = async (symbol, buy_price, sell_price, quantity, fees = 0, option_type = null, premium = null) => {
    const assetType = getAssetType(symbol)
    
    let pnl = 0;

    switch (assetType) {
        case "STOCK":
        case "CRYPTO":
            pnl = (sell_price - buy_price) * quantity - fees;
            break;
        case "FUTURES":
            const { tick_size, tick_value } = await getFuturesInfo(symbol);

            //P&L = (Exit Price - Entry Price) ÷ Tick Size × Tick Value × Quantity
            pnl = (sell_price - buy_price) / tick_size * tick_value * quantity - fees;
            break;
        case "FOREX": {
            const [baseCurrency, quoteCurrency] = symbol.includes("/") ? symbol.split("/") : [symbol.slice(0, 3), symbol.slice(3, 6)];
            const exchangeRate = await getExchangeRate(quoteCurrency);
            pnl = (sell_price - buy_price) * 100000 * convertForexUnitsToLots(quantity) * exchangeRate - fees;
            break;
        }
        case "OPTIONS": {
            if (option_type === "call") {
                pnl = (sell_price - buy_price) * quantity * 100 - (premium * quantity * 100) - fees;
            } else if (option_type === "put") {
                pnl = (buy_price - sell_price) * quantity * 100 - (premium * quantity * 100) - fees;
            }
            break;
        }
    }
    return pnl;
};
