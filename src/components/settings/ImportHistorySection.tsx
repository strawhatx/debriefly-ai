
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Upload, RefreshCw } from "lucide-react";

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
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [tradingAccounts, setTradingAccounts] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.type.includes('spreadsheetml')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedAccount || !selectedFile) {
      toast({
        title: "Missing information",
        description: "Please select an account and upload a file",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileType = selectedFile.type.includes('spreadsheetml') ? 'excel' : 'csv';

      const { data, error } = await supabase
        .from('imports')
        .insert({
          user_id: user.id,
          trading_account_id: selectedAccount,
          import_type: fileType,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Import started",
        description: "Your file is being processed",
      });

      setUploadOpen(false);
      fetchImports();

      // Reset form
      setSelectedFile(null);
      setSelectedAccount("");
    } catch (error) {
      console.error('Error starting import:', error);
      toast({
        title: "Error",
        description: "Failed to start import",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'processing':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Import History</h3>
          <div className="space-x-2">
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Trades
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Trades</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="account">Trading Account</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent>
                        {tradingAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">File</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                    />
                    <p className="text-sm text-muted-foreground">
                      Supported formats: CSV, Excel
                    </p>
                  </div>
                  <Button onClick={handleImport} className="w-full">
                    Start Import
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imports.map((import_) => (
                  <TableRow key={import_.id}>
                    <TableCell>
                      {format(new Date(import_.created_at), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>{import_.account_name}</TableCell>
                    <TableCell className="capitalize">
                      {import_.import_type.replace('_', ' ')}
                    </TableCell>
                    <TableCell>
                      <span className={getStatusColor(import_.status)}>
                        {import_.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-red-500">
                      {import_.error_message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </Card>
  );
};
