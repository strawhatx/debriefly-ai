
import { ImportRow, TradeData } from './types.ts';
import { normalizeSide, normalizeSymbol, extractDateFromRow, extractNumberFromRow, extractStringFromRow, normalizeLeverage } from './trade-utils.ts';
import { detectAssetType } from './asset-detection.ts';
export { parseCSVContent } from './csv-parser.ts';

export const extractTradeData = async (
  row: ImportRow, 
  userId: string, 
  accountId: string, 
  importId: string,
  db: any
): Promise<TradeData> => {
  console.log('Raw row data:', row);
  
  // Extract and normalize symbol
  const rawSymbol = extractStringFromRow(row, ['Symbol', 'SYMBOL', 'symbol']) || '';
  const symbol = rawSymbol.toUpperCase().trim();
  
  // Detect asset type and multiplier
  const { assetType, multiplier } = detectAssetType(symbol);
  
  // Extract trade data
  const side = extractStringFromRow(row, ['Side', 'SIDE', 'side']) || '';
  const quantity = extractNumberFromRow(row, ['Qty', 'QTY', 'Quantity', 'QUANTITY', 'Size', 'SIZE']);
  const entry_price = extractNumberFromRow(row, ['Fill Price', 'FILL PRICE', 'Price', 'PRICE', 'Entry Price', 'ENTRY PRICE']);
  const exit_price = extractNumberFromRow(row, ['Stop Price', 'STOP PRICE', 'Exit Price', ' EXIT PRICE', 'Stop', 'Stop']);
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
    symbol: normalizeSymbol(symbol),
    side: normalizeSide(side),
    quantity,
    entry_price,
    exit_price,
    entry_date,
    exit_date,
    order_type,
    status,
    fees,
    external_id,
    asset_type: assetType,
    multiplier,
    leverage
  };

  console.log('Final trade data:', tradeData);
  return tradeData;
};