
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Import, RefreshCw, Search } from "lucide-react";
import { ImportDialog } from "./ImportDialog";
import { ImportsTable } from "./ImportsTable";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

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
    <section className="bg-gray-800 rounded-xl border border-gray-700" >
      <div className="overflow-x-auto">
        <div className="p-6 flex justify-between items-center">
          <h3 className="text-xl font-bold">Trading Accounts</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search accounts..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <Link to="/app/trade-import" className="inline-flex items-center gap-2 px-6 text-background py-2 bg-primary rounded-lg font-medium group">
            <Import className="" />
            Import Trades
            </Link>
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
    </section>
  );
};
