
interface AssetConfig {
  assetType: 'stock' | 'option' | 'future' | 'forex' | 'crypto';
  multiplier: number;
}

const CURRENCY_CODES = new Set([
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'
]);

const COMMON_FUTURES = new Set([
  'ES', 'NQ', 'CL', 'GC', 'SI', 'ZB', 'ZN', 'ZF', 'ZC', 'ZS', 'ZW'
]);

export function detectAssetType(symbol: string): AssetConfig {
  const normalizedSymbol = symbol.toUpperCase().trim();
  
  // Futures detection
  const futuresRegex = /^[A-Z]{1,3}[FGHJKMNQUVXZ]\d{1,2}[!]?$/;
  if (futuresRegex.test(normalizedSymbol) || 
      (normalizedSymbol.length <= 3 && COMMON_FUTURES.has(normalizedSymbol))) {
    return {
      assetType: 'future',
      multiplier: 1 // This will need to be adjusted based on the specific contract
    };
  }

  // Options detection
  const optionsRegex = /^[A-Z]+(\d{6}[CP]\d+)$/;
  if (optionsRegex.test(normalizedSymbol) || normalizedSymbol.length > 10) {
    return {
      assetType: 'option',
      multiplier: 100
    };
  }

  // Forex detection
  const forexWithSlashRegex = /^[A-Z]{3}\/[A-Z]{3}$/;
  const forexNoSlashRegex = /^[A-Z]{6}$/;
  
  if (forexWithSlashRegex.test(normalizedSymbol)) {
    const [base, quote] = normalizedSymbol.split('/');
    if (CURRENCY_CODES.has(base) && CURRENCY_CODES.has(quote)) {
      return {
        assetType: 'forex',
        multiplier: 100000
      };
    }
  }
  
  if (forexNoSlashRegex.test(normalizedSymbol)) {
    const base = normalizedSymbol.slice(0, 3);
    const quote = normalizedSymbol.slice(3, 6);
    if (CURRENCY_CODES.has(base) && CURRENCY_CODES.has(quote)) {
      return {
        assetType: 'forex',
        multiplier: 100000
      };
    }
  }

  // Crypto detection
  const cryptoRegex = /^[A-Z]{3,5}\/[A-Z]{3,5}$/;
  const commonCryptos = ['BTC', 'ETH', 'USDT', 'BNB'];
  if (cryptoRegex.test(normalizedSymbol) || 
      commonCryptos.some(crypto => normalizedSymbol.includes(crypto))) {
    return {
      assetType: 'crypto',
      multiplier: 1
    };
  }

  // Default to stock if no other patterns match
  return {
    assetType: 'stock',
    multiplier: 1
  };
}
