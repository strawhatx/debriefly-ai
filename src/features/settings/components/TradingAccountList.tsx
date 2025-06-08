
import { TradingAccount } from "@/types/trading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Props {
  onEdit: (account: TradingAccount) => void;
  onDelete: (accountId: string) => void;
}

export const TradingAccountList = ({ onEdit, onDelete }: Props) => {
  const { data: brokers } = useQuery({
    queryKey: ["brokers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brokers").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["tradingAccounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_accounts")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading accounts...</div>;
  }

  const getBrokerName = (brokerId: string) => {
    const broker = brokers?.find(b => b.id === brokerId);
    return broker?.name || "Unknown Broker";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts?.map((account) => (
        <Card key={account.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {account.account_name}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(account)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(account.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <p>Broker: {getBrokerName(account.broker_id)}</p>
              <p>Market: {account.market || "Not specified"}</p>
              <p>Balance: ${account.account_balance.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
