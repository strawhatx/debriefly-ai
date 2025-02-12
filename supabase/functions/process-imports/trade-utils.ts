
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
