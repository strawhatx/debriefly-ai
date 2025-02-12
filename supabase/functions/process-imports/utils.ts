
import { ImportRow, TradeData } from './types.ts';
import { normalizeSide, extractDateFromRow, extractNumberFromRow, extractStringFromRow, normalizeLeverage } from './trade-utils.ts';
import { lookupOrCreateSymbolConfig } from './symbol-utils.ts';
export { parseCSVContent } from './csv-parser.ts';

export const extractTradeData = async (
  row: ImportRow, 
  userId: string, 
  accountId: string, 
  importId: string,
  db: any
): Promise<TradeData> => {
  console.log('Raw row data:', row);
  
  // Get symbol configuration
  const rawSymbol = extractStringFromRow(row, ['Symbol', 'SYMBOL', 'symbol']) || '';
  const symbolConfig = await lookupOrCreateSymbolConfig(rawSymbol, db);
  
  // Extract trade data
  const side = extractStringFromRow(row, ['Side', 'SIDE', 'side']) || '';
  const quantity = extractNumberFromRow(row, ['Qty', 'QTY', 'Quantity', 'QUANTITY', 'Size', 'SIZE']);
  const entry_price = extractNumberFromRow(row, ['Fill Price', 'FILL PRICE', 'Price', 'PRICE', 'Entry Price', 'ENTRY PRICE']);
  const fees = extractNumberFromRow(row, ['Commission', 'COMMISSION', 'Fee', 'FEE']);
  
  const entry_date = extractDateFromRow(row, ['Placing Time', 'PLACING TIME', 'Entry Time', 'Time', 'DATE']);
  const exit_date = extractDateFromRow(row, ['Closing Time', 'CLOSING TIME', 'Exit Time'], null);
  
  const order_type = extractStringFromRow(row, ['Type', 'TYPE', 'ORDER TYPE', 'Order Type']);
  const status = extractStringFromRow(row, ['Status', 'STATUS']);
  const external_id = extractStringFromRow(row, ['Order ID', 'ORDER ID', 'Trade ID', 'ID']);

  // Extract and normalize leverage
  const rawLeverage = extractStringFromRow(row, ['Leverage', 'LEVERAGE']) || '1';
  const leverage = normalizeLeverage(rawLeverage);

  const tradeData = {
    user_id: userId,
    trading_account_id: accountId,
    import_id: importId,
    symbol: symbolConfig.symbol,
    side: normalizeSide(side),
    quantity,
    entry_price,
    exit_price: null,
    entry_date,
    exit_date,
    order_type,
    status,
    fees,
    external_id,
    asset_type: symbolConfig.assetType,
    multiplier: symbolConfig.multiplier,
    leverage
  };

  console.log('Final trade data:', tradeData);
  return tradeData;
};

