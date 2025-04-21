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
  };

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
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              value={account?.broker_id || ""}
              onChange={(e) => setAccount({ ...account, broker_id: e.target.value })}
            >
              <option value="" disabled>
                Select broker
              </option>
              {brokers?.map((broker) => (
                <option key={broker.id} value={broker.id}>
                  {broker.name}
                </option>
              ))}
            </select>
          </div>

          {/* Market Selection */}
          <div className="space-y-2">
            <Label>Market</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              value={account?.market || ""}
              onChange={(e) => setAccount({ ...account, market: e.target.value as MARKET })}
            >
              <option value="" disabled>
                Select market
              </option>
              {['STOCKS', 'OPTIONS', 'CRYPTO', 'FOREX', 'FUTURES'].map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>
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
          <Button variant="default" disabled={isUploading} onClick={handleSave} className="w-full">
            <Check className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Start Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
