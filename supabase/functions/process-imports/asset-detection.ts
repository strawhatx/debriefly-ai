interface AssetConfig {
  assetType: 'stock' | 'option' | 'future' | 'forex' | 'crypto';
  multiplier: number;
  market?: string;
}

let CURRENCY_CODES: Set<string> = new Set();
let FUTURES_MULTIPLIERS: Map<string, number> = new Map();

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
    CURRENCY_CODES = new Set(['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD']);
  }
}

async function loadFuturesMultipliers(supabase: any) {
  try {
    const { data, error } = await supabase
      .from('futures_multipliers')
      .select('symbol, multiplier');
    
    if (error) throw error;
    
    FUTURES_MULTIPLIERS = new Map(
      data.map((row: { symbol: string; multiplier: number }) => [row.symbol, row.multiplier])
    );
    console.log(`Loaded ${FUTURES_MULTIPLIERS.size} futures multipliers from database`);
  } catch (error) {
    console.error('Error loading futures multipliers:', error);
  }
}

async function getMultiplierForFuture(symbol: string, supabase: any): Promise<number> {
  // First check our local cache
  const cachedMultiplier = FUTURES_MULTIPLIERS.get(symbol);
  if (cachedMultiplier) {
    return cachedMultiplier;
  }

  // If not in cache, log it temp to addit later
  console.log(`WARNING:  symbol not found: ${symbol}`, error);

  return 1;
}

export async function initializeAssetDetection(supabase: any) {
  await Promise.all([
    loadCurrencyCodes(supabase),
    loadFuturesMultipliers(supabase)
  ]);
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

export async function detectAssetType(symbol: string, supabase: any): Promise<AssetConfig> {
  const normalizedSymbol = symbol.toUpperCase().trim();
  const market = extractMarket(normalizedSymbol);
  const cleanSymbol = extractCleanSymbol(normalizedSymbol);

  console.log(`symbol: ${cleanSymbol}`)
  
  // Futures detection
  const futuresRegex = /^[A-Z]{1,3}[FGHJKMNQUVXZ]\d{1,2}[!]?$/;
  console.log(`symbol: ${cleanSymbol}`)
  
  if (futuresRegex.test(cleanSymbol)) {
    const rootSymbol = extractFuturesRoot(cleanSymbol);
    const multiplier = await getMultiplierForFuture(rootSymbol, supabase);
    return {
      assetType: 'future',
      multiplier,
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
