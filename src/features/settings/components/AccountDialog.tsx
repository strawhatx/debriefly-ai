import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { memo, useCallback } from "react"
import { AccountForm } from "./AccountForm"
import { useAccountForm } from "../hooks/use-account-form"
import type { EditingAccount } from "@/types/trading"

interface DialogContentProps {
  editingAccount: EditingAccount | null
  form: ReturnType<typeof useAccountForm>['form']
  brokers: ReturnType<typeof useAccountForm>['brokers']
  isLoading: boolean
  onSubmit: (data: EditingAccount) => Promise<void>
}

const DialogContent = memo(({ 
  editingAccount, 
  form, 
  brokers, 
  isLoading, 
  onSubmit 
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
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <Button 
        type="submit" 
        disabled={isLoading}
        onClick={form.handleSubmit(onSubmit)}
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

export const AccountDialog = memo(() => {
  const {
    form,
    brokers,
    isLoading,
    editingAccount,
    setEditingAccount,
    onSubmit,
    openDialog
  } = useAccountForm()

  const handleClose = useCallback(() => {
    setEditingAccount(null)
  }, [setEditingAccount])

  const handleSubmit = useCallback(async (data: EditingAccount) => {
    await onSubmit(data)
    handleClose()
  }, [onSubmit, handleClose])

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          onClick={() => openDialog()}
          aria-label="Open add account dialog"
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Add Account
        </Button>
      </AlertDialogTrigger>
      <DialogContent
        editingAccount={editingAccount}
        form={form}
        brokers={brokers}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </AlertDialog>
  )
})

AccountDialog.displayName = 'AccountDialog'
