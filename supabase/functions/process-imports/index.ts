
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
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const importId = body.import_id

    // If import_id is provided, process specific import, otherwise process all pending imports
    const query = supabase
      .from('imports')
      .select('*, trading_accounts(broker_id)')
      .eq('status', 'pending')

    if (importId) {
      query.eq('id', importId)
    }

    const { data: imports, error: fetchError } = await query

    if (fetchError) {
      throw new Error(`Error fetching imports: ${fetchError.message}`)
    }

    if (!imports || imports.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending imports found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    for (const import_ of imports) {
      try {
        console.log(`Processing import ${import_.id}`)

        // Update status to processing
        await supabase
          .from('imports')
          .update({ status: 'processing' })
          .eq('id', import_.id)

        // Download file from storage
        const { data: fileData, error: downloadError } = await supabase
          .storage
          .from('import_files')
          .download(import_.file_path)

        if (downloadError) {
          throw new Error(`Error downloading file: ${downloadError.message}`)
        }

        // Parse CSV data
        const text = await fileData.text()
        const rows = await csv.parse(text, {
          skipFirstRow: true,
          columns: ['date', 'symbol', 'side', 'quantity', 'price']
        })

        // Process each row and insert into trades table
        for (const row of rows) {
          await supabase
            .from('trades')
            .insert({
              user_id: import_.user_id,
              trading_account_id: import_.trading_account_id,
              import_id: import_.id,
              entry_date: new Date(row.date).toISOString(),
              symbol: row.symbol,
              side: row.side.toLowerCase(),
              quantity: parseFloat(row.quantity),
              entry_price: parseFloat(row.price)
            })
        }

        // Update import status to completed
        await supabase
          .from('imports')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', import_.id)

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
