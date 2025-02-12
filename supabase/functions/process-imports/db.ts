
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { TradeData } from './types.ts';

export class Database {
  private client: SupabaseClient;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  async getImportsToProcess(importId?: string) {
    const query = this.client
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

    const { data, error } = await query
    if (error) throw error
    return data
  }

  async updateImportStatus(importId: string, status: string, errorMessage?: string) {
    const { error } = await this.client
      .from('imports')
      .update({ 
        status,
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq('id', importId)

    if (error) throw error
  }

  async downloadImportFile(filePath: string) {
    const { data, error } = await this.client
      .storage
      .from('import_files')
      .download(filePath)

    if (error) throw error
    return data
  }

  async checkExistingTrade(accountId: string, externalId: string | null) {
    if (!externalId) return null;
    
    const { data } = await this.client
      .from('trades')
      .select('id')
      .eq('trading_account_id', accountId)
      .eq('external_id', externalId)
      .single()

    return data
  }

  async insertTrade(tradeData: TradeData) {
    console.log('Inserting trade with data:', tradeData);
    const { error, data } = await this.client
      .from('trades')
      .insert(tradeData)
      .select()
      .single();

    if (error) {
      console.error('Error inserting trade:', error);
      throw error;
    }
    console.log('Trade inserted successfully:', data);
  }
}
