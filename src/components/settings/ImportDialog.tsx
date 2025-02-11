
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
    console.log('Selected file:', file);
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
      console.log('Starting import process...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      console.log('User authenticated:', user.id);

      // First create the import record with pending status
      const { data: importRecord, error: importError } = await supabase
        .from('imports')
        .insert({
          user_id: user.id,
          trading_account_id: selectedAccount,
          import_type: selectedFile.type.includes('spreadsheetml') ? 'excel' : 'csv',
          status: 'pending',
          original_filename: selectedFile.name.replace(/[^\x00-\x7F]/g, ''),
          file_size: selectedFile.size,
          file_type: selectedFile.type
        })
        .select()
        .single();

      if (importError) {
        console.error('Error creating import record:', importError);
        throw importError;
      }
      console.log('Import record created:', importRecord);

      // Create a unique file path including import ID and timestamp
      const timestamp = new Date().getTime();
      const sanitizedFileName = selectedFile.name.replace(/[^\x00-\x7F]/g, '');
      const filePath = `${importRecord.id}/${timestamp}-${sanitizedFileName}`;
      console.log('File path:', filePath);

      // Upload file to storage
      console.log('Starting file upload to storage...');
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('import_files')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }
      console.log('File uploaded successfully:', uploadData);

      // Update import record with file path and status
      console.log('Updating import record status to uploaded...');
      const { error: updateError } = await supabase
        .from('imports')
        .update({
          file_path: filePath,
          status: 'uploaded'
        })
        .eq('id', importRecord.id);

      if (updateError) {
        console.error('Error updating import record:', updateError);
        throw updateError;
      }

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
      console.error('Error in import process:', error);
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
