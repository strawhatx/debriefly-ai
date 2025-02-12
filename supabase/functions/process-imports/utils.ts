import { ImportRow, TradeData } from './types.ts';

export const normalizeSide = (side: string): string => {
  if (!side) throw new Error('Side is required')
  const normalized = side.toLowerCase().trim()
  if (normalized.includes('buy') || normalized === 'b') return 'buy'
  if (normalized.includes('sell') || normalized === 's') return 'sell'
  throw new Error(`Invalid trade side: ${side}`)
}

export const parseCSVContent = (text: string): ImportRow[] => {
  // Split the text into lines and remove empty lines
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  console.log('CSV Headers:', lines[0]); // Log headers
  
  // Parse header row to get column names
  const headers = lines[0].split(',').map(header => header.trim());

  // Parse the remaining lines
  const rows: ImportRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split the line by comma, but handle quoted values
    const values = line.match(/(?:^|,)("(?:[^"]*"")*[^"]*"|[^,]*)/g)
      ?.map(value => {
        // Remove leading comma if present
        value = value.startsWith(',') ? value.slice(1) : value;
        // Remove quotes and trim
        return value.startsWith('"') && value.endsWith('"') 
          ? value.slice(1, -1).trim().replace(/""/g, '"')
          : value.trim();
      }) || [];

    // Create an object mapping headers to values
    const row: ImportRow = {};
    headers.forEach((header, index) => {
      if (values[index]) {
        row[header as keyof ImportRow] = values[index];
      }
    });
    
    // Log each row as it's parsed
    console.log('Parsed CSV Row:', row);
    rows.push(row);
  }

  return rows;
}

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

export const extractTradeData = async (
  row: ImportRow, 
  userId: string, 
  accountId: string, 
  importId: string,
  db: any // Supabase client instance
): Promise<TradeData> => {
  console.log('Raw row data:', row);
  
  // Extract and log each field individually
  const rawSymbol = row['Symbol'] || row['SYMBOL'] || row['symbol'] || '';
  // Handle TradingView format [MARKET]:[Symbol]
  const symbol = rawSymbol.includes(':') ? rawSymbol.split(':')[1] : rawSymbol;
  console.log('Symbol found:', symbol);
  
  const side = row['Side'] || row['SIDE'] || row['side'] || '';
  console.log('Side found:', side);
  
  const quantity = row['Qty'] || row['QTY'] || row['Quantity'] || row['QUANTITY'] || row['Size'] || row['SIZE'] || '0';
  console.log('Quantity found:', quantity);
  
  const fillPrice = row['Fill Price'] || row['FILL PRICE'] || row['Price'] || row['PRICE'] || row['Entry Price'] || row['ENTRY PRICE'] || '';
  console.log('Fill Price found:', fillPrice);
  
  const entryTime = row['Placing Time'] || row['PLACING TIME'] || row['Entry Time'] || row['Time'] || row['DATE'] || new Date().toISOString();
  const closingTime = row['Closing Time'] || row['CLOSING TIME'] || row['Exit Time'] || null;
  const orderType = row['Type'] || row['TYPE'] || row['ORDER TYPE'] || row['Order Type'] || null;
  const stopPrice = row['Stop Price'] || row['STOP PRICE'] || row['Stop'] || row['STOP'] || null;
  const status = row['Status'] || row['STATUS'] || null;
  const commission = row['Commission'] || row['COMMISSION'] || row['Fee'] || row['FEE'] || '0';
  const orderId = row['Order ID'] || row['ORDER ID'] || row['Trade ID'] || row['ID'] || null;

  const upperSymbol = symbol.trim().toUpperCase();

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

  // Use configuration or defaults
  const assetType = symbolConfig?.asset_type || 'stock';
  const multiplier = symbolConfig?.multiplier || 1;

  console.log(`Using asset type: ${assetType}, multiplier: ${multiplier} for symbol: ${upperSymbol}`);

  // Normalize side and calculate prices
  const normalizedSide = normalizeSide(side);
  console.log('Normalized side:', normalizedSide);
  
  let entry_price = fillPrice ? parseFloat(fillPrice) : null;
  let exit_price = stopPrice ? parseFloat(stopPrice) : null;
  
  console.log('Calculated entry_price:', entry_price);
  console.log('Calculated exit_price:', exit_price);
  
  const tradeData = {
    user_id: userId,
    trading_account_id: accountId,
    import_id: importId,
    symbol: upperSymbol,
    side: normalizedSide,
    quantity: parseFloat(quantity),
    entry_price,
    exit_price,
    entry_date: new Date(entryTime).toISOString(),
    exit_date: closingTime ? new Date(closingTime).toISOString() : null,
    order_type: orderType?.trim() || null,
    stop_price: stopPrice ? parseFloat(stopPrice) : null,
    status: status?.trim() || null,
    fees: commission ? parseFloat(commission) : 0,
    external_id: orderId?.trim() || null,
    asset_type: assetType,
    multiplier: multiplier
  };

  console.log('Final trade data:', tradeData);
  return tradeData;
}
