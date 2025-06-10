import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { memo } from "react"
import { AccountForm } from "./AccountForm"
import type { EditingAccount } from "@/types/trading"

interface DialogContentProps {
  editingAccount: EditingAccount | null
  form: any
  brokers: any[]
  isLoading: boolean
  onSubmit: (data: EditingAccount) => Promise<void>
  onClose: () => void
}

const DialogContent = memo(({ 
  editingAccount, 
  form, 
  brokers, 
  isLoading, 
  onSubmit,
  onClose
}: DialogContentProps) => (
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        {editingAccount?.isNew ? "Add Account" : "Edit Account"}
      </AlertDialogTitle>
      <AlertDialogDescription>
        {editingAccount?.isNew
          ? "Create a new trading account."
          : "Update your trading account's details."}
      </AlertDialogDescription>
    </AlertDialogHeader>
    
    <AccountForm form={form} brokers={brokers} onSubmit={onSubmit} />
    
    <AlertDialogFooter>
      <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
      <Button 
        type="submit"
        form="account-form"
        disabled={isLoading}
        aria-label={editingAccount?.isNew ? "Create account" : "Save account changes"}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {editingAccount?.isNew ? "Create" : "Save"}
      </Button>
    </AlertDialogFooter>
  </AlertDialogContent>
))

DialogContent.displayName = 'DialogContent'

interface AccountDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingAccount: EditingAccount | null;
  form: any;
  brokers: any[];
  isLoading: boolean;
  onSubmit: (data: EditingAccount) => Promise<void>;
}

export const AccountDialog = memo(({ 
  isOpen, 
  onOpenChange, 
  editingAccount, 
  form, 
  brokers, 
  isLoading, 
  onSubmit 
}: AccountDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        editingAccount={editingAccount}
        form={form}
        brokers={brokers}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onClose={() => onOpenChange(false)}
      />
    </AlertDialog>
  )
})

AccountDialog.displayName = 'AccountDialog'
