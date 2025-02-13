
interface AssetConfig {
  assetType: 'stock' | 'option' | 'future' | 'forex' | 'crypto';
  multiplier: number;
  market?: string;
}

let CURRENCY_CODES: Set<string> = new Set();

const COMMON_FUTURES = new Set([
  'ES', 'NQ', 'CL', 'GC', 'SI', 'ZB', 'ZN', 'ZF', 'ZC', 'ZS', 'ZW'
]);

async function loadCurrencyCodes(supabase: any) {
  try {
    const { data, error } = await supabase
      .from('currency_codes')
      .select('code');
    
    if (error) throw error;
    
    CURRENCY_CODES = new Set(data.map((row: { code: string }) => row.code));
    console.log(`Loaded ${CURRENCY_CODES.size} currency codes from database`);
  } catch (error) {
    console.error('Error loading currency codes:', error);
    // Fallback to common major currencies if database fetch fails
    CURRENCY_CODES = new Set(['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD']);
  }
}

export async function initializeAssetDetection(supabase: any) {
  await loadCurrencyCodes(supabase);
}

function extractMarket(symbol: string): string | undefined {
  // Check for market prefix (e.g., "NASDAQ:", "NYSE:", etc.)
  const marketMatch = symbol.match(/^([A-Z]+):/);
  if (marketMatch) {
    return marketMatch[1];
  }

  // Check for futures markets (e.g., "COMEX_MINI", "NYMEX", etc.)
  const futuresMarketMatch = symbol.match(/^([A-Z_]+)_/);
  if (futuresMarketMatch) {
    return futuresMarketMatch[1];
  }

  // Check for common crypto exchanges
  if (symbol.includes('BINANCE_')) return 'BINANCE';
  if (symbol.includes('COINBASE_')) return 'COINBASE';
  if (symbol.includes('FTX_')) return 'FTX';

  return undefined;
}

export function detectAssetType(symbol: string): AssetConfig {
  const normalizedSymbol = symbol.toUpperCase().trim();
  const market = extractMarket(normalizedSymbol);
  
  // Clean symbol by removing market prefix if present
  const cleanSymbol = normalizedSymbol.replace(/^[A-Z_]+[:_]/, '');
  
  // Futures detection
  const futuresRegex = /^[A-Z]{1,3}[FGHJKMNQUVXZ]\d{1,2}[!]?$/;
  if (futuresRegex.test(cleanSymbol) || 
      (cleanSymbol.length <= 3 && COMMON_FUTURES.has(cleanSymbol))) {
    return {
      assetType: 'future',
      multiplier: 1, // This will need to be adjusted based on the specific contract
      market
    };
  }

  // Options detection
  const optionsRegex = /^[A-Z]+(\d{6}[CP]\d+)$/;
  if (optionsRegex.test(cleanSymbol) || cleanSymbol.length > 10) {
    return {
      assetType: 'option',
      multiplier: 100,
      market
    };
  }

  // Forex detection
  const forexWithSlashRegex = /^[A-Z]{3}\/[A-Z]{3}$/;
  const forexNoSlashRegex = /^[A-Z]{6}$/;
  
  if (forexWithSlashRegex.test(cleanSymbol)) {
    const [base, quote] = cleanSymbol.split('/');
    if (CURRENCY_CODES.has(base) && CURRENCY_CODES.has(quote)) {
      return {
        assetType: 'forex',
        multiplier: 100000,
        market
      };
    }
  }
  
  if (forexNoSlashRegex.test(cleanSymbol)) {
    const base = cleanSymbol.slice(0, 3);
    const quote = cleanSymbol.slice(3, 6);
    if (CURRENCY_CODES.has(base) && CURRENCY_CODES.has(quote)) {
      return {
        assetType: 'forex',
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
      assetType: 'crypto',
      multiplier: 1,
      market
    };
  }

  // Default to stock if no other patterns match
  return {
    assetType: 'stock',
    multiplier: 1,
    market
  };
}
