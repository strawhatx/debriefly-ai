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
import { usePasswordDialog } from "../hooks/use-password-dialog";

export const ProfilePasswordDialog = () => {
  const { isOpen, setIsOpen, passwords, updatePassword, handlePasswordUpdate } = usePasswordDialog();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="current">Current Password</Label>
            <Input
              id="current"
              type="password"
              value={passwords.current}
              onChange={(e) => updatePassword('current', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new">New Password</Label>
            <Input
              id="new"
              type="password"
              value={passwords.new}
              onChange={(e) => updatePassword('new', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Confirm New Password</Label>
            <Input
              id="confirm"
              type="password"
              value={passwords.confirm}
              onChange={(e) => updatePassword('confirm', e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePasswordUpdate}>
            Update Password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
