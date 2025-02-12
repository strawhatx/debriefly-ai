
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

    // If import_id is provided, process specific import, otherwise process all pending imports
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

        // Parse header row
        const lines = text.trim().split('\n')
        const headerRow = lines[0].split(',')
        console.log('CSV Headers:', headerRow)

        // Find indices of all possible columns
        const columnIndices = {
          symbol: headerRow.findIndex(col => 
            col?.toLowerCase?.()?.includes('symbol') ||
            col?.toLowerCase?.()?.includes('ticker')
          ),
          side: headerRow.findIndex(col => 
            col?.toLowerCase?.()?.includes('side') || 
            col?.toLowerCase?.()?.includes('direction') ||
            col?.toLowerCase?.()?.includes('buy/sell') ||
            col?.toLowerCase?.()?.includes('type')
          ),
          orderType: headerRow.findIndex(col => 
            col?.toLowerCase?.()?.includes('order type') ||
            col?.toLowerCase?.()?.includes('order_type')
          ),
          quantity: headerRow.findIndex(col => 
            col?.toLowerCase?.()?.includes('quantity') || 
            col?.toLowerCase?.()?.includes('size') ||
            col?.toLowerCase?.()?.includes('amount') ||
            col?.toLowerCase?.()?.includes('qty') ||
            col?.toLowerCase?.()?.includes('volume')
          ),
          stopPrice: headerRow.findIndex(col => 
            col?.toLowerCase?.()?.includes('stop') || 
            col?.toLowerCase?.()?.includes('exit price')
          ),
          fillPrice: headerRow.findIndex(col => 
            col?.toLowerCase?.()?.includes('fill') || 
            col?.toLowerCase?.()?.includes('entry price') ||
            col?.toLowerCase?.()?.includes('execution price') ||
            col?.toLowerCase?.()?.includes('price')
          ),
          status: headerRow.findIndex(col => col?.toLowerCase?.()?.includes('status')),
          commission: headerRow.findIndex(col => 
            col?.toLowerCase?.()?.includes('commission') || 
            col?.toLowerCase?.()?.includes('fee')
          ),
          closingTime: headerRow.findIndex(col => 
            col?.toLowerCase?.()?.includes('closing') || 
            col?.toLowerCase?.()?.includes('exit time') ||
            col?.toLowerCase?.()?.includes('close time')
          ),
          entryTime: headerRow.findIndex(col => 
            col?.toLowerCase?.()?.includes('entry time') ||
            col?.toLowerCase?.()?.includes('open time') ||
            col?.toLowerCase?.()?.includes('date') ||
            col?.toLowerCase?.()?.includes('time') ||
            col?.toLowerCase?.()?.includes('placing time')
          ),
          externalId: headerRow.findIndex(col => 
            col?.toLowerCase?.()?.includes('id') || 
            col?.toLowerCase?.()?.includes('trade id') ||
            col?.toLowerCase?.()?.includes('order id')
          ),
        }

        // Log found column indices for debugging
        console.log('Found column indices:', columnIndices)
        console.log('Header row for reference:', headerRow)

        // Required columns
        const requiredColumns = ['symbol', 'side', 'quantity', 'fillPrice', 'entryTime']
        const missingColumns = requiredColumns.filter(col => columnIndices[col] === -1)

        if (missingColumns.length > 0) {
          throw new Error(`Required columns missing: ${missingColumns.join(', ')}`)
        }

        console.log('Column mappings:', columnIndices)

        // Parse CSV
        const rows = await csv.parse(text, {
          skipFirstRow: true,
        })

        console.log(`Found ${rows.length} trades to process`)
        if (rows.length > 0) {
          console.log('Sample row:', rows[0])
        }

        // Function to normalize trade side
        const normalizeSide = (side: string): string => {
          const normalized = side.toLowerCase().trim()
          if (normalized.includes('buy') || normalized === 'b') return 'buy'
          if (normalized.includes('sell') || normalized === 's') return 'sell'
          throw new Error(`Invalid trade side: ${side}`)
        }

        // Process rows
        for (const row of rows) {
          const rawSide = row[columnIndices.side]
          if (!rawSide) {
            console.error('Missing side value for row:', row)
            continue
          }

          try {
            const tradeData = {
              user_id: import_.user_id,
              trading_account_id: import_.trading_account_id,
              import_id: import_.id,
              symbol: (row[columnIndices.symbol] || '').trim(),
              side: normalizeSide(rawSide),
              quantity: parseFloat(row[columnIndices.quantity] || '0'),
              entry_price: parseFloat(row[columnIndices.fillPrice] || '0'),
              entry_date: new Date(row[columnIndices.entryTime] || new Date()).toISOString(),
            }

            // Validate required fields
            if (!tradeData.symbol || !tradeData.quantity || !tradeData.entry_price) {
              console.error('Missing required fields:', { row, tradeData })
              continue
            }

            // Add optional fields if they exist and have values
            if (columnIndices.orderType !== -1 && row[columnIndices.orderType]) {
              tradeData.order_type = row[columnIndices.orderType].trim()
            }
            if (columnIndices.stopPrice !== -1 && row[columnIndices.stopPrice]) {
              tradeData.stop_price = parseFloat(row[columnIndices.stopPrice])
            }
            if (columnIndices.status !== -1 && row[columnIndices.status]) {
              tradeData.status = row[columnIndices.status].trim()
            }
            if (columnIndices.commission !== -1 && row[columnIndices.commission]) {
              tradeData.fees = parseFloat(row[columnIndices.commission])
            }
            if (columnIndices.closingTime !== -1 && row[columnIndices.closingTime]) {
              tradeData.closing_time = new Date(row[columnIndices.closingTime]).toISOString()
            }
            if (columnIndices.externalId !== -1 && row[columnIndices.externalId]) {
              tradeData.external_id = row[columnIndices.externalId].trim()
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
