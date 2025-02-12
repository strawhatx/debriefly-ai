
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useFileImport = (selectedAccount: string) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

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
      console.log('Starting import process...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      console.log('User authenticated:', user.id);

      const timestamp = new Date().getTime();
      const sanitizedFileName = selectedFile.name.replace(/[^\x00-\x7F]/g, '');
      const filePath = `${user.id}/${timestamp}-${sanitizedFileName}`;
      console.log('File path:', filePath);

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('import_files')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }
      
      console.log('File uploaded successfully:', uploadData);

      const fileExtension = sanitizedFileName.split('.').pop();
      const { data: importRecord, error: importError } = await supabase
        .from('imports')
        .insert({
          user_id: user.id,
          trading_account_id: selectedAccount,
          import_type: fileExtension === 'csv' ? 'csv' : 'excel',
          status: 'pending',
          original_filename: sanitizedFileName,
          file_path: filePath,
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

      // Call the edge function to process the import
      const { error: processError } = await supabase.functions.invoke('process-imports', {
        body: { import_id: importRecord.id }
      });

      if (processError) {
        console.error('Error triggering import processing:', processError);
        throw processError;
      }

      toast({
        title: "Import started",
        description: "Your file is being processed",
      });

      return true;
    } catch (error: any) {
      console.error('Error in import process:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start import",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    handleImport
  };
};
