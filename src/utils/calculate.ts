// ✅ Advanced P&L Calculator (Futures, Forex, Stocks, Crypto, Options) with Real-Time Currency Conversion
import { getAssetType, getFuturesInfo } from "./asset-detection";

const convertForexUnitsToLots = (quantity: number): number => {
    if (quantity >= 100000) return quantity / 100000; // Standard Lot
    if (quantity >= 10000) return quantity / 10000;   // Mini Lot
    if (quantity >= 1000) return quantity / 1000;     // Micro Lot
    return quantity; // Already in lots
};

const getForexConversionRate = async (quoteCurrency: string, accountCurrency: string = "USD"): Promise<number> => {
    try {
        if (quoteCurrency === accountCurrency) return 1;

        const response = await fetch(`https://api.exchangerate.host/latest?base=${quoteCurrency}&symbols=${accountCurrency}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
      
          const data = await response.json();
      
          return data.rates[accountCurrency] || 1;
    } catch (error) {
        console.error(`Forex API error:`, error);
        return 1;
    }
};

const calculateForexPnL = async (
    entryPrice: number,
    exitPrice: number,
    lotSize: number,
    contractSize: number = 100000,
    quoteCurrency: string,
    accountCurrency: string = "USD"
): Promise<number> => {
    const conversionRate = await getForexConversionRate(quoteCurrency, accountCurrency);
    return ((exitPrice - entryPrice) * lotSize * contractSize) / conversionRate;
};

export const calculatePnL = async (symbol: string, buy_price: number, sell_price: number, quantity: number, fees = 0, option_type = null, premium = null) => {
    const asset_type = await getAssetType(symbol);
    let pnl = 0;

    switch (asset_type) {
        case "STOCK":
        case "CRYPTO":
            pnl = (sell_price - buy_price) * quantity - fees;
            break;
        case "FUTURES":
            const { tick_size, tick_value } = await getFuturesInfo(symbol);
            pnl = ((sell_price - buy_price) / tick_size) * tick_value * quantity - fees;
            break;
        case "FOREX": {
            const [baseCurrency, quoteCurrency] = symbol.includes("/") ? symbol.split("/") : [symbol.slice(0, 3), symbol.slice(3, 6)];
            pnl = await calculateForexPnL(buy_price, sell_price, convertForexUnitsToLots(quantity), 100000, quoteCurrency);
            pnl -= fees;
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

