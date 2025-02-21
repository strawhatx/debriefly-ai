

interface AssetConfig {
  assetType: 'STOCK' | 'OPTIONS' | 'FUTURES' | 'FOREX' | 'CRYPTO';
  multiplier: number;
  market?: string;
}

function getMultiplierForFuture(symbol: string, futures_multipliers: any[]): number {
  // First check our local cache
  const result = futures_multipliers.find((row) => row.symbol === symbol);
  
  if (result) {
    return result.multiplier;
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
  return symbol.replace(/([1-2]!|[FGHJKMNQUVXZ](\d{1,4}|[1-9]))$/, '');
}

export function detectAssetType(symbol: string, currency_codes: any[], futures_multipliers: any[]): AssetConfig {
  const normalizedSymbol = symbol.toUpperCase().trim();
  const market = extractMarket(normalizedSymbol);
  const cleanSymbol = extractCleanSymbol(normalizedSymbol);

  console.log(`symbol: ${cleanSymbol}`);

  // Futures detection
  const futuresRegex = /^[A-Z]{1,3}([1-2]!|[FGHJKMNQUVXZ](\d{1,4}|[1-9]))$/;

  if (futuresRegex.test(cleanSymbol)) {
    const rootSymbol = extractFuturesRoot(cleanSymbol);
    const multiplier = getMultiplierForFuture(rootSymbol, futures_multipliers);
    return {
      assetType: 'FUTURES',
      multiplier,
      market
    };
  }

  // Options detection
  const optionsRegex = /^[A-Z]+\d{6}[CP]\d+$/;
  if (optionsRegex.test(cleanSymbol) || cleanSymbol.length > 10) {
    return {
      assetType: 'OPTIONS',
      multiplier: 100,
      market
    };
  }

  // Forex detection
  const forexRegex = /^[A-Z]{3}\/?[A-Z]{3}$/;

  if (forexRegex.test(cleanSymbol)) {
    const [base, quote] = cleanSymbol.includes('/') ? cleanSymbol.split('/'): [cleanSymbol.slice(0, 3), cleanSymbol.slice(3, 6)];
    const hasBase = currency_codes.find(i => i.code === base);
    const hasQuote = currency_codes.find(i => i.code === quote) 
    if (hasBase && hasQuote) {
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
