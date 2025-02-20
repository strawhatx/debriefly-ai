import { supabase } from "@/integrations/supabase/client";
import useAssetStore from "@/store/assets";

interface AssetConfig {
  assetType: 'STOCK' | 'OPTIONS' | 'FUTURES' | 'FOREX' | 'CRYPTO';
  multiplier: number;
  market?: string;
}

const {currency_codes, futures_multipliers}  = useAssetStore();

function getMultiplierForFuture(symbol: string): number {
  // First check our local cache
  const cachedMultiplier = futures_multipliers.get(symbol);
  if (cachedMultiplier) {
    return cachedMultiplier;
  }

  // If not in cache, log it temp to addit later
  console.log(`WARNING:  symbol not found: ${symbol}`);

  return 1;
}

function extractMarket(symbol: string): string | undefined {
  const parts = symbol.split(':');
  return parts.length === 2 ? parts[0] : undefined;
}

function extractCleanSymbol(symbol: string): string {
  const parts = symbol.split(':');
  return parts.length === 2 ? parts[1] : symbol;
}

function extractFuturesRoot(symbol: string): string {
  // Remove any month/year codes to get the root symbol
  return symbol.replace(/[FGHJKMNQUVXZ]\d{1,2}[!]?$/, '');
}

export async function detectAssetType(symbol: string): Promise<AssetConfig> {
  const normalizedSymbol = symbol.toUpperCase().trim();
  const market = extractMarket(normalizedSymbol);
  const cleanSymbol = extractCleanSymbol(normalizedSymbol);

  console.log(`symbol: ${cleanSymbol}`);
  
  // Futures detection
  const futuresRegex = /^[A-Z]{1,3}[FGHJKMNQUVXZ]\d{1,2}[!]?$/;
  console.log(`symbol: ${cleanSymbol}`)
  
  if (futuresRegex.test(cleanSymbol)) {
    const rootSymbol = extractFuturesRoot(cleanSymbol);
    const multiplier = getMultiplierForFuture(rootSymbol);
    return {
      assetType: 'FUTURES',
      multiplier,
      market
    };
  }

  // Options detection
  const optionsRegex = /^[A-Z]+(\d{6}[CP]\d+)$/;
  if (optionsRegex.test(cleanSymbol) || cleanSymbol.length > 10) {
    return {
      assetType: 'OPTIONS',
      multiplier: 100,
      market
    };
  }

  // Forex detection
  const forexWithSlashRegex = /^[A-Z]{3}\/[A-Z]{3}$/;
  const forexNoSlashRegex = /^[A-Z]{6}$/;
  
  if (forexWithSlashRegex.test(cleanSymbol)) {
    const [base, quote] = cleanSymbol.split('/');
    if (currency_codes.has(base) && currency_codes.has(quote)) {
      return {
        assetType: 'FOREX',
        multiplier: 100000,
        market
      };
    }
  }
  
  if (forexNoSlashRegex.test(cleanSymbol)) {
    const base = cleanSymbol.slice(0, 3);
    const quote = cleanSymbol.slice(3, 6);
    if (currency_codes.has(base) && currency_codes.has(quote)) {
      return {
        assetType: 'FOREX',
        multiplier: 100000,
        market
      };
    }
  }

  // Crypto detection
  const cryptoRegex = /^[A-Z]{3,5}\/[A-Z]{3,5}$/;
  const commonCryptos = ['BTC', 'ETH', 'USDT', 'BNB'];
  if (cryptoRegex.test(cleanSymbol) || 
      commonCryptos.some(crypto => cleanSymbol.includes(crypto))) {
    return {
      assetType: 'CRYPTO',
      multiplier: 1,
      market
    };
  }

  // Default to stock if no other patterns match
  return {
    assetType: 'STOCK',
    multiplier: 1,
    market
  };
}
