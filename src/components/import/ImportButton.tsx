
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImportButtonProps {
  onClick: () => void;
  isUploading: boolean;
}

export const ImportButton = ({ onClick, isUploading }: ImportButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isUploading}
      className="w-full"
    >
      <Upload className="h-4 w-4 mr-2" />
      {isUploading ? "Uploading..." : "Start Import"}
    </Button>
  );
};
