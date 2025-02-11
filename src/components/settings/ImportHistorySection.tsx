
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";
import { ImportDialog } from "./ImportDialog";
import { ImportsTable } from "./ImportsTable";

type Import = {
  id: string;
  trading_account_id: string;
  import_type: string;
  status: string;
  error_message: string | null;
  created_at: string;
  account_name?: string;
};

export const ImportHistorySection = () => {
  const { toast } = useToast();
  const [imports, setImports] = useState<Import[]>([]);
  const [loading, setLoading] = useState(true);
  const [tradingAccounts, setTradingAccounts] = useState<any[]>([]);

  const fetchImports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: importsData, error: importsError } = await supabase
        .from('imports')
        .select(`
          *,
          trading_accounts (
            account_name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (importsError) throw importsError;

      const formattedImports = importsData.map(imp => ({
        ...imp,
        account_name: imp.trading_accounts?.account_name
      }));

      setImports(formattedImports);
    } catch (error) {
      console.error('Error fetching imports:', error);
      toast({
        title: "Error",
        description: "Failed to load import history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTradingAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('trading_accounts')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setTradingAccounts(data);
    } catch (error) {
      console.error('Error fetching trading accounts:', error);
    }
  };

  useEffect(() => {
    fetchImports();
    fetchTradingAccounts();
  }, []);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Import History</h3>
          <div className="space-x-2">
            <ImportDialog
              tradingAccounts={tradingAccounts}
              onImportComplete={fetchImports}
            />
            <Button variant="outline" onClick={fetchImports}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : imports.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No import history available yet.
            </p>
          ) : (
            <ImportsTable imports={imports} />
          )}
        </div>
      </div>
    </Card>
  );
};
