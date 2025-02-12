
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Database } from './db.ts'
import { parseCSVContent, extractTradeData } from './utils.ts'
import { ImportSummary } from './types.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Process imports function triggered')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const db = new Database(supabaseUrl, supabaseKey)
    
    const body = await req.json()
    const importId = body.import_id
    console.log('Processing import ID:', importId)

    const imports = await db.getImportsToProcess(importId)
    console.log('Fetch response:', { data: imports?.length })

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
        await db.updateImportStatus(import_.id, 'processing')

        // Download and parse file
        console.log('Downloading file:', import_.file_path)
        const fileData = await db.downloadImportFile(import_.file_path)
        const text = await fileData.text()
        console.log('CSV content preview:', text.substring(0, 200))

        const rows = parseCSVContent(text)
        console.log('First row sample:', rows[0])

        // Process rows
        const summary: ImportSummary = {
          processedCount: 0,
          skippedCount: 0,
          duplicateCount: 0
        }

        for (const row of rows) {
          try {
            // Extract trade data
            const tradeData = extractTradeData(row, import_.user_id, import_.trading_account_id, import_.id)

            // Skip cancelled orders with no fill price
            if (tradeData.status?.toLowerCase() === 'cancelled' && !tradeData.entry_price) {
              console.log('Skipping cancelled order with no fill price:', { 
                external_id: tradeData.external_id, 
                symbol: tradeData.symbol 
              })
              summary.skippedCount++;
              continue
            }

            // Skip orders with missing required fields
            if (!tradeData.symbol || !tradeData.quantity || !tradeData.entry_price) {
              console.log('Skipping trade with missing required fields:', { 
                symbol: tradeData.symbol, 
                quantity: tradeData.quantity, 
                entry_price: tradeData.entry_price,
                status: tradeData.status 
              })
              summary.skippedCount++;
              continue
            }

            // Check for duplicates
            const existingTrade = await db.checkExistingTrade(
              tradeData.trading_account_id, 
              tradeData.external_id
            )

            if (existingTrade) {
              console.log('Skipping duplicate trade:', { 
                external_id: tradeData.external_id, 
                symbol: tradeData.symbol 
              })
              summary.duplicateCount++;
              continue
            }

            // Insert trade
            await db.insertTrade(tradeData)
            summary.processedCount++;
          } catch (error) {
            console.error('Error processing row:', error, row)
            summary.skippedCount++;
            continue
          }
        }

        // Update import status with summary
        console.log(`Completing import ${import_.id}`)
        const summaryMessage = `Processed: ${summary.processedCount}, Skipped: ${summary.skippedCount}, Duplicates: ${summary.duplicateCount}`
        await db.updateImportStatus(import_.id, 'completed', summaryMessage)
        console.log(`Successfully processed import ${import_.id}:`, summaryMessage)
      } catch (error) {
        console.error(`Error processing import ${import_.id}:`, error)
        await db.updateImportStatus(import_.id, 'failed', error.message)
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
