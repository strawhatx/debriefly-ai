
import { ImportRow } from './types.ts';

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
};
