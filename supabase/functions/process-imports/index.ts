
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as csv from 'https://deno.land/std@0.168.0/encoding/csv.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Process imports function triggered')
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey })
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const body = await req.json()
    const importId = body.import_id
    console.log('Processing import ID:', importId)

    const query = supabase
      .from('imports')
      .select(`
        *,
        trading_accounts!inner (
          broker_id
        )
      `)
      .eq('status', 'uploaded')

    if (importId) {
      query.eq('id', importId)
    }

    const { data: imports, error: fetchError } = await query
    console.log('Fetch response:', { data: imports?.length, error: fetchError })

    if (fetchError) {
      console.error('Error fetching imports:', fetchError)
      throw new Error(`Error fetching imports: ${fetchError.message}`)
    }

    if (!imports || imports.length === 0) {
      console.log('No pending imports found')
      return new Response(
        JSON.stringify({ message: 'No pending imports found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${imports.length} imports to process`)

    for (const import_ of imports) {
      try {
        console.log(`Processing import ${import_.id}`)

        // Update status to processing
        const { error: updateError } = await supabase
          .from('imports')
          .update({ 
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('id', import_.id)

        if (updateError) {
          console.error('Error updating import status:', updateError)
          throw new Error(`Error updating import status: ${updateError.message}`)
        }

        // Download file from storage
        console.log('Downloading file:', import_.file_path)
        const { data: fileData, error: downloadError } = await supabase
          .storage
          .from('import_files')
          .download(import_.file_path)

        if (downloadError) {
          console.error('Error downloading file:', downloadError)
          throw new Error(`Error downloading file: ${downloadError.message}`)
        }

        // Parse CSV data
        const text = await fileData.text()
        console.log('CSV content preview:', text.substring(0, 200))

        // Split the text into lines and remove empty lines
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
          throw new Error('CSV file is empty');
        }

        // Parse header row to get column names
        const headers = lines[0].split(',').map(header => header.trim());
        console.log('CSV Headers:', headers);

        // Parse the remaining lines
        const rows = [];
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
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          rows.push(row);
        }

        console.log('First row sample:', rows[0]);

        // Function to normalize trade side
        const normalizeSide = (side: string): string => {
          if (!side) throw new Error('Side is required')
          const normalized = side.toLowerCase().trim()
          if (normalized.includes('buy') || normalized === 'b') return 'buy'
          if (normalized.includes('sell') || normalized === 's') return 'sell'
          throw new Error(`Invalid trade side: ${side}`)
        }

        // Process rows
        for (const row of rows) {
          try {
            // Try different possible column names for each field
            const symbol = row['Symbol'] || row['SYMBOL'] || row['symbol'] || ''
            const side = row['Side'] || row['SIDE'] || row['side'] || row['Type'] || row['TYPE'] || ''
            const quantity = row['Qty'] || row['QTY'] || row['Quantity'] || row['QUANTITY'] || row['Size'] || row['SIZE'] || '0'
            const fillPrice = row['Fill Price'] || row['FILL PRICE'] || row['Price'] || row['PRICE'] || row['Entry Price'] || ''
            const entryTime = row['Placing Time'] || row['PLACING TIME'] || row['Entry Time'] || row['Time'] || row['DATE'] || new Date().toISOString()
            const closingTime = row['Closing Time'] || row['CLOSING TIME'] || row['Exit Time'] || null
            const orderType = row['Type'] || row['ORDER TYPE'] || row['Order Type'] || null
            const stopPrice = row['Stop Price'] || row['STOP PRICE'] || row['Stop'] || null
            const status = row['Status'] || row['STATUS'] || null
            const commission = row['Commission'] || row['COMMISSION'] || row['Fee'] || row['FEE'] || '0'
            const orderId = row['Order ID'] || row['ORDER ID'] || row['Trade ID'] || row['ID'] || null

            // Skip cancelled orders with no fill price
            if (status?.toLowerCase() === 'cancelled' && !fillPrice) {
              console.log('Skipping cancelled order with no fill price:', { orderId, symbol })
              continue
            }

            console.log('Processing row:', {
              symbol,
              side,
              quantity,
              fillPrice,
              entryTime,
              status
            })

            const tradeData = {
              user_id: import_.user_id,
              trading_account_id: import_.trading_account_id,
              import_id: import_.id,
              symbol: symbol.trim(),
              side: normalizeSide(side),
              quantity: parseFloat(quantity),
              entry_price: fillPrice ? parseFloat(fillPrice) : null,
              entry_date: new Date(entryTime).toISOString(),
              order_type: orderType?.trim() || null,
              stop_price: stopPrice ? parseFloat(stopPrice) : null,
              status: status?.trim() || null,
              fees: commission ? parseFloat(commission) : 0,
              closing_time: closingTime ? new Date(closingTime).toISOString() : null,
              external_id: orderId?.trim() || null
            }

            // Skip orders with missing required fields
            if (!tradeData.symbol || !tradeData.quantity || !tradeData.entry_price) {
              console.log('Skipping trade with missing required fields:', { 
                symbol: tradeData.symbol, 
                quantity: tradeData.quantity, 
                entry_price: tradeData.entry_price,
                status: tradeData.status 
              })
              continue
            }

            console.log('Inserting trade:', tradeData)

            const { error: insertError } = await supabase
              .from('trades')
              .insert(tradeData)

            if (insertError) {
              console.error('Error inserting trade:', insertError, 'Row data:', row)
              throw new Error(`Error inserting trade: ${insertError.message}`)
            }
          } catch (error) {
            console.error('Error processing row:', error, row)
            continue // Continue with next row instead of failing entire import
          }
        }

        // Update import status to completed
        console.log(`Completing import ${import_.id}`)
        const { error: completeError } = await supabase
          .from('imports')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', import_.id)

        if (completeError) {
          console.error('Error completing import:', completeError)
          throw new Error(`Error completing import: ${completeError.message}`)
        }

        console.log(`Successfully processed import ${import_.id}`)
      } catch (error) {
        console.error(`Error processing import ${import_.id}:`, error)
        
        // Update import status to failed
        await supabase
          .from('imports')
          .update({ 
            status: 'failed',
            error_message: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', import_.id)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Import processing completed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
