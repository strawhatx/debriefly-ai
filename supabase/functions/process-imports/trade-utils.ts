
export const normalizeSide = (side: string): string => {
  if (!side) throw new Error('Side is required')
  const normalized = side.toLowerCase().trim()
  if (normalized.includes('buy') || normalized === 'b') return 'buy'
  if (normalized.includes('sell') || normalized === 's') return 'sell'
  throw new Error(`Invalid trade side: ${side}`)
}

export const extractDateFromRow = (row: Record<string, string>, dateFields: string[], defaultValue?: string): string => {
  const value = dateFields.reduce((acc, field) => acc || row[field], '') || defaultValue || new Date().toISOString();
  return new Date(value).toISOString();
};

export const extractNumberFromRow = (row: Record<string, string>, fields: string[], defaultValue: number = 0): number => {
  const value = fields.reduce((acc, field) => acc || row[field], '');
  return value ? parseFloat(value) : defaultValue;
};

export const extractStringFromRow = (row: Record<string, string>, fields: string[]): string | null => {
  const value = fields.reduce((acc, field) => acc || row[field], '');
  return value ? value.trim() : null;
};

export const normalizeLeverage = (leverageStr: string | number): number => {
  if (typeof leverageStr === 'number') return leverageStr;

  if (isNullOrEmpty(leverageStr)) return 50;
  
  // Handle "X:1" format
  const result = leverageStr.split(':')[0]
  if (result) {
    return parseInt(result, 10);
  }
  
  // Try to parse as number
  const num = parseFloat(leverageStr);
  if (!isNaN(num)) {
    return num;
  }
  
  // Default leverage
  return 50;
};


const isNullOrEmpty = (str: string): boolean => {
  return str === null || str.length === 0;
}
