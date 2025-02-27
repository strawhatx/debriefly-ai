
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as Papa from 'papaparse'; // For CSV parsing
import { mapTradeData } from "../utils/utils";
import { Position } from "../utils/types";
import { detectAssetType } from "../utils/asset-detection";
import useAssetStore from "@/store/assets";

export const useFileImport = (selectedAccount: string) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [errorId, setErrorId] = useState("");
  const { currency_codes, futures_multipliers } = useAssetStore()

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
          var trades = result.data;
          const rawHeaders = result.meta.fields; // Get CSV headers
          toast({
            title: "Import started",
            description: "Your file is being processed",
          });

          //set status to procesing
          const { data, error } = await supabase.from('imports').update({ status: 'PROCESSING' }).match({ id: importRecord.id })


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
      await supabase.from('imports').update({ status: 'FAILED', error_message: error.message || "Failed to start import" }).match({ id: errorId })
      return false;
    }
    finally {
      setIsUploading(false);
    }
  };

  const insertTradesToSupabase = async (trades: any[], rawHeaders: {}, user_id: string, account_id: string, import_id: string) => {
    // Transform data if necessary (for example, ensure fields match the table schema)
    var transformedTrades = trades.map(trade => mapTradeData(trade, rawHeaders, user_id, account_id, import_id));

    // 🔥 Filter out any trades that are NOT filled
    transformedTrades = transformedTrades.filter((trade) => trade.status.toUpperCase() === "FILLED");

    // Sort trades by time
    //transformedTrades.sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime());

    // Insert trades into Supabase
    const { data: history, error: historyError } = await supabase.from('trade_history').insert(transformedTrades).select();

    if (historyError) {
      throw new Error(`Error inserting trades:${historyError}`);
    }

    //set status to uploaded
    const { data: import_, error: importError } = await supabase.from('imports').update({ status: 'UPLOADED' }).match({ id: import_id })

    if (importError) {
      throw new Error(`Error updating status: ${importError}`);
    }

    const positions = processTradesIntoPositions(history);

    const { error: insertError } = await supabase.from('positions').insert(positions);
    if (insertError) console.error(insertError);
  };

  const processTradesIntoPositions = (trades: any[]) => {
    const openLongPositions: Record<string, Position[]> = {}; // Separate long positions by symbol
    const openShortPositions: Record<string, Position[]> = {};
    const closedPositions: any[] = [];

    trades
      .filter((trade) => trade.status.toUpperCase() === 'FILLED' && trade.quantity > 0) // Remove cancelled/partial fills
      //.sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()) // FIFO Sorting
      .sort((a, b) => parseInt(a.external_id) - parseInt(b.external_id)) // Use order_id for strict execution order
      .forEach((trade) => {
        const symbol = trade.symbol; // Ensure trades are matched per symbol
        const price = trade.fill_price;
        let remainingQuantity = trade.quantity;
        const { multiplier, assetType } = detectAssetType(symbol, currency_codes, futures_multipliers);

        if (!openLongPositions[symbol]) openLongPositions[symbol] = [];
        if (!openShortPositions[symbol]) openShortPositions[symbol] = [];

        if (trade.side === 'BUY') {
          while (remainingQuantity > 0 && openShortPositions[symbol].length > 0) {
            const entry = openShortPositions[symbol][0]; // FIFO: Take first available position
            const closeQty = Math.min(entry.quantity, remainingQuantity);
            const pnl = (entry.fill_price - price) * closeQty * multiplier;
            const common = commonPositionFields(entry, trade);

            closedPositions.push({
              ...common,
              position_type: 'SHORT',
              multiplier,
              asset_type: assetType,
              fill_price: entry.fill_price,
              stop_price: price,
              pnl,
              quantity: closeQty,
            });

            entry.quantity -= closeQty;
            remainingQuantity -= closeQty;
            if (entry.quantity === 0) openShortPositions[symbol].shift(); // Remove if fully closed
          }

          if (remainingQuantity > 0) {
            openLongPositions[symbol].push({ ...trade, quantity: remainingQuantity });
          }
        } else if (trade.side === 'SELL') {
          while (remainingQuantity > 0 && openLongPositions[symbol].length > 0) {
            const entry = openLongPositions[symbol][0]; // FIFO: Take first available position
            const closeQty = Math.min(entry.quantity, remainingQuantity);
            const pnl = (price - entry.fill_price) * closeQty * multiplier;
            const common = commonPositionFields(entry, trade);

            closedPositions.push({
              ...common,
              position_type: 'LONG',
              multiplier,
              asset_type: assetType,
              fill_price: entry.fill_price,
              stop_price: price,
              pnl,
              quantity: closeQty,
            });

            entry.quantity -= closeQty;
            remainingQuantity -= closeQty;
            if (entry.quantity === 0) openLongPositions[symbol].shift(); // Remove if fully closed
          }

          if (remainingQuantity > 0) {
            openShortPositions[symbol].push({ ...trade, quantity: remainingQuantity });
          }
        }
      });

    return closedPositions;

  };

  const commonPositionFields = (entry: any, exit: any) => ({
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
  });

  return {
    isUploading,
    handleImport
  };
};
