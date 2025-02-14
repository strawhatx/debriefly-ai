
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { TradeData } from './types.ts'

export class Database {
  client: SupabaseClient;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  async getImportsToProcess(importId?: string) {
    console.log('Getting imports to process, importId:', importId);
    
    const query = this.client
      .from('imports')
      .select(`
        *,
        trading_accounts!inner (
          broker_id
        )
      `)
      .eq('status', 'uploaded');

    if (importId) {
      query.eq('id', importId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching imports:', error);
      throw error;
    }
    console.log('Imports fetched:', data);
    return data;
  }

  async updateImportStatus(importId: string, status: string, errorMessage?: string) {
    console.log(`Updating import ${importId} status to ${status}`);
    
    const { error } = await this.client
      .from('imports')
      .update({ 
        status,
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq('id', importId);

    if (error) {
      console.error('Error updating import status:', error);
      throw error;
    }
  }

  async downloadImportFile(filePath: string) {
    console.log('Downloading file:', filePath);
    
    const { data, error } = await this.client
      .storage
      .from('import_files')
      .download(filePath);

    if (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
    
    return data;
  }

  async checkExistingTrade(accountId: string, externalId: string | null) {
    if (!externalId) return null;
    
    console.log('Checking for existing trade:', { accountId, externalId });
    
    const { data, error } = await this.client
      .from('trades')
      .select('id')
      .eq('trading_account_id', accountId)
      .eq('external_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore not found error
      console.error('Error checking existing trade:', error);
      throw error;
    }
    
    return data;
  }

  async insertTrade(tradeData: TradeData) {
    console.log('Inserting trade:', tradeData);
    
    const { error } = await this.client
      .from('trades')
      .insert([tradeData]);

    if (error) {
      console.error('Error inserting trade:', error);
      throw error;
    }
  }
}
