// ✅ Updated Asset Detection with Asset Store Integration
import useAssetStore from "@/store/assets";
import { normalizeSymbol } from "./utils";
import { fetchWithAuth } from "@/integrations/fetch/api";

interface FuturesAssetConfig {
  tick_size: number;
  tick_value: number;
}

const extractFuturesRoot = (symbol: string): string => {
  return symbol.replace(/([1-2]!|[FGHJKMNQUVXZ](\d{1,4}|[1-9]))$/, '');
};

const getCryptoInfo = async (symbol: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    return data[symbol.toLowerCase()]?.usd || 1;
  } catch (error) {
    console.error(`Crypto API error for ${symbol}:`, error);
    return 1;
  }
};

const getForexInfo = async (symbol: string): Promise<{}> => {
  try {
    const data = await fetchWithAuth("/validate-forex", {
      method: "POST",
      body: JSON.stringify({ symbol })
    });
    return data.exists;
  } catch (error) {
    console.error(`Forex validation error for ${symbol}:`, error);
    return false;
  }
};

const isFutures = (symbol: string): boolean => {
  try {
    const futuresRegex = /^[A-Z]{1,3}([1-2]!|[FGHJKMNQUVXZ](\d{1,4}|[1-9]))$/;
    if (futuresRegex.test(symbol)) return true;

    return false;
  }
  catch (error) {
    console.error(`Futures test error for ${symbol}:`, error);
    return false;
  }
};

const isOptions = (symbol: string): boolean => {
  try {
    const optionsRegex = /^[A-Z]+\d{6}[CP]\d+$/;
    if (optionsRegex.test(symbol) || symbol.length > 10) return true;

    return false;
  }
  catch (error) {
    console.error(`Crypto API error for ${symbol}:`, error);
    return false;
  }
};

const isForex = async (symbol: string): Promise<boolean> => {
  try {
    const normalizedSymbol = symbol.includes('/') ? symbol.replace('/', '') : symbol;

    const forexRegex = /^[A-Za-z]{3}\/?[A-Za-z]{3}$/;
    if (forexRegex.test(symbol)) {
      const found = await getForexInfo(normalizedSymbol);
      if (found) return true;
    }

    return false
  }
  catch (error) {
    console.error(`Error validating Forex symbol ${symbol}:`, error);
    return false;
  }
};

const isCrypto = async (symbol: string): Promise<boolean> => {
  try {
    // Normalize the symbol by removing slashes and converting to uppercase
    const normalizedSymbol = symbol.replace('/', '').toUpperCase();

    // Extract the base symbol (e.g., BTC from BTC/USD or BTCUSD)
    const baseSymbol = symbol.includes('/') ? symbol.split('/')[0] : normalizedSymbol;

    // Check if the base symbol exists in the crypto API
    const found = await getCryptoInfo(baseSymbol);
    if (found) return true;


    return false;
  } catch (error) {
    console.error(`Crypto API error for ${symbol}:`, error);
    return false;
  }
};

export const extractMarket = (symbol: string): string | undefined => {
  const parts = symbol.split(':');
  return parts.length === 2 ? parts[0] : undefined;
};

export const getAssetType = async (symbol: string): Promise<string> => {
  const capsSymbol = symbol.toUpperCase().trim();
  const cleanSymbol = normalizeSymbol(capsSymbol);

  console.log(`Detecting asset type for: ${cleanSymbol}`);

  // Check synchronous conditions first
  if (isFutures(cleanSymbol)) return 'FUTURES';
  if (isOptions(cleanSymbol)) return 'OPTIONS';

  const isForexResult = await isForex(cleanSymbol);
  if (isForexResult) return 'FOREX';

  const isCryptoResult = await isCrypto(cleanSymbol);
  if (isCryptoResult) return 'CRYPTO';

  // Default to STOCK if no other patterns match
  return 'STOCK';
};

export const getFuturesInfo = async (symbol: string): Promise<FuturesAssetConfig> => {
  const { futures_multipliers, get_futures_multipliers } = useAssetStore.getState();

  if (futures_multipliers.length === 0) await get_futures_multipliers();

  const capsSymbol = symbol.toUpperCase().trim();
  const cleanSymbol = normalizeSymbol(capsSymbol);

  console.log(`Detecting asset type for: ${cleanSymbol}`);

  // Futures Detection
  const rootSymbol = extractFuturesRoot(cleanSymbol);
  const result = futures_multipliers.find((row) => row.symbol === rootSymbol);

  return { tick_size: result.tick_size, tick_value: result.tick_value, };

};
