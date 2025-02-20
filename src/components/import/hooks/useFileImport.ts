
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as Papa from 'papaparse'; // For CSV parsing
import { mapTradeData } from "../utils/utils";
import { Position } from "../utils/types";
import { detectAssetType } from "../utils/asset-detection";

export const useFileImport = (selectedAccount: string) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [errorId, setErrorId] = useState("");

  const handleImport = async (selectedFile: File | null) => {
    if (!selectedAccount || !selectedFile) {
      toast({
        title: "Missing information",
        description: "Please select an account and upload a file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const timestamp = new Date().getTime();
      const sanitizedFileName = selectedFile.name.replace(/[^\x00-\x7F]/g, '');
      const filePath = `${user.id}/${timestamp}-${sanitizedFileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('import_files').upload(filePath, selectedFile);

      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      const fileExtension = sanitizedFileName.split('.').pop();
      const { data: importRecord, error: importError } = await supabase
        .from('imports')
        .insert({
          user_id: user.id,
          trading_account_id: selectedAccount,
          import_type: fileExtension === 'csv' ? 'csv' : 'excel',
          status: 'PENDING',
          original_filename: sanitizedFileName,
          file_path: filePath,
          file_size: selectedFile.size,
          file_type: selectedFile.type
        })
        .select()
        .single();

      //just in case
      setErrorId(importRecord.id);

      if (importError) {
        throw new Error(`Error creating import record: ${importError}`);
      }

      // Read and parse the CSV file
      Papa.parse(selectedFile, {
        complete: async (result) => {
          const trades = result.data;
          const rawHeaders = result.meta.fields; // Get CSV headers
          toast({
            title: "Import started",
            description: "Your file is being processed",
          });

          //set status to procesing
          const { data, error } = await supabase.from('imports').update({ tatus: 'PROCESSING' }).match({ id: importRecord.id})

          // Insert trades into Supabase
          await insertTradesToSupabase(trades, rawHeaders, user.id, selectedAccount, importRecord.id);
        },
        header: true, // Assuming the CSV file has headers
      });

      return true;
    }
    catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start import",
        variant: "destructive",
      });

      //set status to failed w/message
      await supabase.from('imports').update({ status: 'FAILED', error_message: error.message || "Failed to start import" }).match({ id: errorId})
      return false;
    }
    finally {
      setIsUploading(false);
    }
  };

  const insertTradesToSupabase = async (trades: any[], rawHeaders: {}, user_id: string, account_id: string, import_id: string) => {
    // Transform data if necessary (for example, ensure fields match the table schema)
    const transformedTrades = trades.map(trade => mapTradeData(trade, rawHeaders, user_id, account_id, import_id));

    // Insert trades into Supabase
    const { data, error } = await supabase.from('trade_history').insert(transformedTrades).select();

    if (error) {
      throw new Error(`Error inserting trades:${error}`);
    }

    const positions = processTradesIntoPositions(data);

    const { error: insertError } = await supabase.from('positions').insert(positions);
    if (insertError) console.error(insertError);
  };

  const processTradesIntoPositions = (trades: any[]) => {
    const openLongPositions: Position[] = [];
    const openShortPositions: Position[] = [];
    const closedPositions: any[] = [];

    trades
      .filter((trade) => trade.status.toUpperCase() === 'FILLED')
      .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime())
      .forEach((trade) => {
        const price = trade.fill_price; // Fill price
        const stopPrice = trade.stop_price; // Stop price (optional)
        const quantity = trade.quantity;

        if (trade.side === 'BUY') {
          // Check if this is closing a short or opening a long
          if (openShortPositions.length > 0) {
            const entry = openShortPositions.shift()!; // Close short
            const pnl = (entry.fill_price - price) * quantity;
            closedPositions.push({
              ...commonPositionFields(entry, trade),
              position_type: 'SHORT',
              fill_price: entry.fill_price,
              stop_price: price,
              pnl,
            });
          } else {
            // Open long position
            openLongPositions.push({...trade,  position_type: 'LONG'});
          }
        } else if (trade.side === 'SELL') {
          // Check if this is closing a long or opening a short
          if (openLongPositions.length > 0) {
            const entry = openLongPositions.shift()!; // Close long
            const pnl = (price - entry.fill_price) * quantity;
            closedPositions.push({
              ...commonPositionFields(entry, trade),
              position_type: 'LONG',
              fill_price: entry.fill_price,
              stop_price: price,
              pnl,
            });
          } else {
            // Open short position
            openShortPositions.push({...trade,  position_type: 'SHORT'});
          }
        }
      });

    return closedPositions;
  };

  const commonPositionFields = async (entry: any, exit: any) => {
    const asset = await detectAssetType(entry.symbol)

    return {
    user_id: entry.user_id,
    trading_account_id: entry.trading_account_id,
    symbol: entry.symbol,
    quantity: entry.quantity,
    entry_date: entry.entry_date,
    closing_date: exit.entry_date,
    fees: (entry.fees || 0) + (exit.fees || 0),
    leverage: entry.leverage,
    status: 'CLOSED',
    entry_trade_id: entry.id,
    close_trade_id: exit.id,
    asset_type: asset.assetType,
    multiplier: asset.multiplier,
  }};

  return {
    isUploading,
    handleImport
  };
};
