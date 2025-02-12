
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
      row[header as keyof ImportRow] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

export const extractTradeData = (row: ImportRow, userId: string, accountId: string, importId: string): TradeData => {
  const symbol = row['Symbol'] || row['SYMBOL'] || row['symbol'] || ''
  const side = row['Side'] || row['SIDE'] || row['side'] || ''
  const quantity = row['Qty'] || row['QTY'] || row['Quantity'] || row['QUANTITY'] || row['Size'] || row['SIZE'] || '0'
  const fillPrice = row['Fill Price'] || row['FILL PRICE'] || row['Price'] || row['PRICE'] || row['Entry Price'] || row['ENTRY PRICE']|| ''
  const entryTime = row['Placing Time'] || row['PLACING TIME'] || row['Entry Time'] || row['Time'] || row['DATE'] || new Date().toISOString()
  const closingTime = row['Closing Time'] || row['CLOSING TIME'] || row['Exit Time'] || null
  const orderType = row['Type'] || row['TYPE'] || row['ORDER TYPE'] || row['Order Type'] || null
  const stopPrice = row['Stop Price'] || row['STOP PRICE'] || row['Stop'] || row['STOP'] || null
  const status = row['Status'] || row['STATUS'] || null
  const commission = row['Commission'] || row['COMMISSION'] || row['Fee'] || row['FEE'] || '0'
  const orderId = row['Order ID'] || row['ORDER ID'] || row['Trade ID'] || row['ID'] || null

  // For sell orders, the fill price is actually the exit price
  const normalizedSide = normalizeSide(side)
  const entry_price = normalizedSide === 'sell' ? null : parseFloat(fillPrice)
  const exit_price = normalizedSide === 'sell' ? parseFloat(fillPrice) : null

  return {
    user_id: userId,
    trading_account_id: accountId,
    import_id: importId,
    symbol: symbol.trim(),
    side: normalizedSide,
    quantity: parseFloat(quantity),
    entry_price,
    exit_price,
    entry_date: new Date(entryTime).toISOString(),
    order_type: orderType?.trim() || null,
    stop_price: stopPrice ? parseFloat(stopPrice) : null,
    status: status?.trim() || null,
    fees: commission ? parseFloat(commission) : 0,
    exit_date: closingTime ? new Date(closingTime).toISOString() : null,
    external_id: orderId?.trim() || null
  }
}
