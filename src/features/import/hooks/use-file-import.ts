import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as Papa from 'papaparse';
import { mapTradeData } from "@/utils/utils";
import { getAssetType } from "@/utils/asset-detection";
import { calculatePnL } from "@/utils/calculate";

export const useFileImport = (selectedAccount: string) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleImport = async (selectedFile: File | null) => {
    if (!selectedAccount || !selectedFile) {
      showError("Missing information", "Please select an account and upload a file");
      return false;
    }

    try {
      setIsUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { sanitizedFileName, filePath } = generateFilePath(user.id, selectedFile);

      await uploadFile(selectedFile, filePath);

      const importRecord = await createImportRecord(user.id, selectedAccount, sanitizedFileName, filePath, selectedFile);

      await updateImportStatus(importRecord.id, 'PROCESSING');

      const result = await parseCSV(selectedFile);

      var trades = result.data;

      const rawHeaders = result.meta.fields;

      await insertTradesToSupabase(trades, rawHeaders, user.id, selectedAccount, importRecord.id);

      await runTradeAnalysis(user.id);

      return true;
    } catch (error: any) {
      showError("Error", error.message || "Failed to start import");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const generateFilePath = (userId: string, file: File) => {
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
    return {
      sanitizedFileName,
      filePath: `${userId}/${timestamp}-${sanitizedFileName}`,
    };
  };

  const uploadFile = async (file: File, path: string) => {
    const { error } = await supabase.storage.from('import_files').upload(path, file);
    if (error) throw new Error(`Failed to upload file: ${error.message}`);
  };

  const createImportRecord = async (userId: string, accountId: string, fileName: string, path: string, file: File) => {
    const fileExtension = fileName.split('.').pop();
    const { data, error } = await supabase.from('imports')
      .insert({
        user_id: userId,
        trading_account_id: accountId,
        import_type: fileExtension === 'csv' ? 'csv' : 'excel',
        status: 'PENDING',
        original_filename: fileName,
        file_path: path,
        file_size: file.size,
        file_type: file.type,
      })
      .select()
      .maybeSingle();

    if (error) throw new Error(`Error creating import record: ${error.message}`);
    return data;
  };

  const updateImportStatus = async (importId: string, status: string, errorMessage: string = '') => {
    await supabase.from('imports').update({ status, error_message: errorMessage }).match({ id: importId });
  };

  const parseCSV = (file: File): Promise<{ data: any[], meta: { fields: string[] } }> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result) => resolve(result),
        header: true,
        error: (error) => reject(error.message),
      });
    });
  };

  const insertTradesToSupabase = async (trades: any[], rawHeaders:string[], userId: string, accountId: string, importId: string) => {
    const transformedTrades = trades
      .map(trade => mapTradeData(trade, rawHeaders, userId, accountId, importId))
      .filter(trade => trade.status.toUpperCase() === "FILLED");

    const { error } = await supabase.from('trade_history').insert(transformedTrades);
    if (error) throw new Error(`Error inserting trades: ${error.message}`);

    await updateImportStatus(importId, 'UPLOADED');

    await processTradesIntoPositions(transformedTrades);
  };

  const processTradesIntoPositions = async (trades: any[]) => {
    const openPositions: Record<string, any[]> = { LONG: [], SHORT: [] };
    const closedPositions: any[] = [];

    for (const trade of trades) {
      const { symbol, side, quantity, fill_price } = trade;
      const assetType = await getAssetType(symbol);
      const direction = side === 'BUY' ? 'LONG' : 'SHORT';
      const oppositeDirection = side === 'BUY' ? 'SHORT' : 'LONG';

      openPositions[direction][symbol] ??= [];
      openPositions[oppositeDirection][symbol] ??= [];

      let remainingQty = quantity;

      while (remainingQty > 0 && openPositions[oppositeDirection][symbol].length > 0) {
        const entry = openPositions[oppositeDirection][symbol][0];
        const closeQty = Math.min(entry.quantity, remainingQty);
        const pnl = calculatePnL(symbol, entry.fill_price, fill_price, closeQty, (entry.fees || 0) + (trade.fees || 0));

        closedPositions.push({
          ...commonPositionFields(entry, trade),
          position_type: oppositeDirection,
          asset_type: assetType,
          pnl,
          quantity: closeQty,
        });

        entry.quantity -= closeQty;
        remainingQty -= closeQty;
        if (entry.quantity === 0) openPositions[oppositeDirection][symbol].shift();
      }

      if (remainingQty > 0) {
        openPositions[direction][symbol].push({ ...trade, quantity: remainingQty });
      }
    }

    await supabase.from('positions').insert(closedPositions);
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

  const runTradeAnalysis = async (userId: string) => {
    try {
      const API_URL = `${import.meta.env.VITE_SUPABASE_API}/ai-behavior-analysis`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);
    } catch (error) {
      console.error("❌ Error running trade analysis:", error);
    }
  };

  const showError = (title: string, description: string) => {
    toast({ title, description, variant: "destructive" });
  };

  return { isUploading, handleImport };
};
