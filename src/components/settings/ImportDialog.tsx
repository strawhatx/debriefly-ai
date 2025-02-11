
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { AccountSelect } from "@/components/import/AccountSelect";

interface ImportDialogProps {
  tradingAccounts: any[];
  onImportComplete: () => void;
}

export const ImportDialog = ({ tradingAccounts, onImportComplete }: ImportDialogProps) => {
  const { toast } = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setIsUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create a unique file path including user ID and original filename
      const timestamp = new Date().getTime();
      const sanitizedFileName = selectedFile.name.replace(/[^\x00-\x7F]/g, '');
      const filePath = `${user.id}/${timestamp}-${sanitizedFileName}`;

      // Upload file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('import_files')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Create import record with file information
      const { error: importError } = await supabase
        .from('imports')
        .insert({
          user_id: user.id,
          trading_account_id: selectedAccount,
          import_type: selectedFile.type.includes('spreadsheetml') ? 'excel' : 'csv',
          status: 'pending',
          original_filename: sanitizedFileName,
          file_path: filePath,
          file_size: selectedFile.size,
          file_type: selectedFile.type
        });

      if (importError) throw importError;

      toast({
        title: "Import started",
        description: "Your file is being processed",
      });

      setUploadOpen(false);
      onImportComplete();

      // Reset form
      setSelectedFile(null);
      setSelectedAccount("");
    } catch (error: any) {
      console.error('Error starting import:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start import",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
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
          <AccountSelect
            accounts={tradingAccounts}
            selectedAccount={selectedAccount}
            onAccountChange={setSelectedAccount}
          />
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
          <Button 
            onClick={handleImport} 
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Start Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
