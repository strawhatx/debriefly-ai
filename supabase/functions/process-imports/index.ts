
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
        console.log('CSV content preview:', text.substring(0, 200)) // Log first 200 chars of CSV

        // First, parse the header row to understand the column structure
        const lines = text.trim().split('\n')
        const headerRow = lines[0].split(',')
        console.log('CSV Headers:', headerRow)

        // Find the indices of required columns
        const columnIndices = {
          date: headerRow.findIndex(col => col.toLowerCase().includes('date')),
          symbol: headerRow.findIndex(col => col.toLowerCase().includes('symbol')),
          side: headerRow.findIndex(col => col.toLowerCase().includes('side') || col.toLowerCase().includes('type')),
          quantity: headerRow.findIndex(col => col.toLowerCase().includes('quantity') || col.toLowerCase().includes('size')),
          price: headerRow.findIndex(col => col.toLowerCase().includes('price'))
        }

        // Validate that we found all required columns
        const missingColumns = Object.entries(columnIndices)
          .filter(([_, index]) => index === -1)
          .map(([col]) => col)

        if (missingColumns.length > 0) {
          throw new Error(`Required columns missing: ${missingColumns.join(', ')}`)
        }

        console.log('Column mappings:', columnIndices)

        // Parse the CSV with the correct column mapping
        const rows = await csv.parse(text, {
          skipFirstRow: true,
        })

        console.log(`Found ${rows.length} trades to process`)
        if (rows.length > 0) {
          console.log('Sample row:', rows[0]) // Log first row for debugging
        }

        // Process each row and insert into trades table
        for (const row of rows) {
          const { error: insertError } = await supabase
            .from('trades')
            .insert({
              user_id: import_.user_id,
              trading_account_id: import_.trading_account_id,
              import_id: import_.id,
              entry_date: new Date(row[columnIndices.date]).toISOString(),
              symbol: row[columnIndices.symbol],
              side: row[columnIndices.side].toLowerCase(),
              quantity: parseFloat(row[columnIndices.quantity]),
              entry_price: parseFloat(row[columnIndices.price])
            })

          if (insertError) {
            console.error('Error inserting trade:', insertError, 'Row data:', row)
            throw new Error(`Error inserting trade: ${insertError.message}`)
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
