
async function lookupSymbolOnPolygon(symbol: string): Promise<{ assetType: string; multiplier: number } | null> {
  const polygonApiKey = Deno.env.get('POLYGON_API_KEY');
  if (!polygonApiKey) {
    console.error('Polygon API key not found');
    return null;
  }

  try {
    // First try to get ticker details
    const response = await fetch(`https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${polygonApiKey}`);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results) {
      console.log('Polygon API response:', data.results);
      
      // Map Polygon market type to our asset types
      let assetType = 'stock';
      let multiplier = 1;
      
      switch (data.results.market) {
        case 'stocks':
          assetType = 'stock';
          break;
        case 'fx':
          assetType = 'forex';
          multiplier = 10000; // Standard for forex
          break;
        case 'crypto':
          assetType = 'crypto';
          break;
        case 'options':
          assetType = 'option';
          multiplier = 100; // Standard for options
          break;
        case 'futures':
          assetType = 'futures';
          // Get contract size if available
          multiplier = data.results.contract_unit_of_measure ? 
            parseInt(data.results.contract_unit_of_measure) || 1 : 1;
          break;
      }

      return { assetType, multiplier };
    }
  } catch (error) {
    console.error('Error fetching from Polygon:', error);
  }
  
  return null;
}

export const normalizeSymbol = (rawSymbol: string): string => {
  // Handle TradingView format [MARKET]:[Symbol]
  const symbol = rawSymbol.includes(':') ? rawSymbol.split(':')[1] : rawSymbol;
  return symbol.trim().toUpperCase();
};

export const lookupOrCreateSymbolConfig = async (symbol: string, db: any) => {
  const upperSymbol = normalizeSymbol(symbol);
  
  // Look up symbol configuration
  let { data: symbolConfig } = await db
    .from('symbol_configs')
    .select('asset_type, multiplier')
    .eq('symbol', upperSymbol)
    .single();

  // If not found in database, look up on Polygon and save to database
  if (!symbolConfig) {
    console.log(`Symbol ${upperSymbol} not found in database, looking up on Polygon...`);
    const polygonData = await lookupSymbolOnPolygon(upperSymbol);
    
    if (polygonData) {
      console.log(`Found ${upperSymbol} on Polygon:`, polygonData);
      
      // Save to database
      const { data: newConfig, error } = await db
        .from('symbol_configs')
        .insert({
          symbol: upperSymbol,
          asset_type: polygonData.assetType,
          multiplier: polygonData.multiplier
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving symbol config:', error);
      } else {
        symbolConfig = newConfig;
      }
    }
  }

  return {
    symbol: upperSymbol,
    assetType: symbolConfig?.asset_type || 'stock',
    multiplier: symbolConfig?.multiplier || 1
  };
};
