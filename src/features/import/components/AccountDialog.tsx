import { Button } from "@/components/ui/button";
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
import { Check } from "lucide-react";
import { MARKET } from "../hooks/use-account-dialog";
import { useAccountDialog } from "../hooks/use-account-dialog"; // Import the custom hook
import useBrokerStore from "@/store/broker";

interface AccountDialogProps {
  onSave: () => void;
}

export const AccountDialog = ({ onSave }: AccountDialogProps) => {
  const { uploadOpen, setUploadOpen, account, setAccount, isUploading, handleSave: save } = useAccountDialog();
  const { brokers } = useBrokerStore();

  const handleSave = async () => {
    await save();
    onSave();
  }

  return (
    <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
      <DialogTrigger asChild>
        <Button variant="link">here</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Account Name */}
          <div className="space-y-2">
            <Label>Account Name</Label>
            <Input
              value={account?.account_name || ""}
              onChange={(e) => setAccount({ ...account, account_name: e.target.value })}
              placeholder="Enter account name"
            />
          </div>

          {/* Broker Selection */}
          <div className="space-y-2">
            <Label>Broker</Label>
            <Select
              value={account?.broker_id}
              onValueChange={(value) => setAccount({ ...account, broker_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select broker" />
              </SelectTrigger>
              <SelectContent>
                {brokers?.map((broker) => (
                  <SelectItem key={broker.id} value={broker.id}>
                    {broker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Market Selection */}
          <div className="space-y-2">
            <Label>Market</Label>
            <Select
              value={account?.market}
              onValueChange={(value) => setAccount({ ...account, market: value as MARKET })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                {['STOCKS', 'OPTIONS', 'CRYPTO', 'FOREX', 'FUTURES'].map((market) => (
                  <SelectItem key={market} value={market}>
                    {market}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account Balance */}
          <div className="space-y-2">
            <Label>Balance</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={account?.account_balance || ""}
              onChange={(e) => setAccount({ ...account, account_balance: parseFloat(e.target.value) })}
              placeholder="Enter balance"
            />
          </div>

          {/* Save Button */}
          <Button size="icon" disabled={isUploading} onClick={handleSave}>
            <Check className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Start Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
