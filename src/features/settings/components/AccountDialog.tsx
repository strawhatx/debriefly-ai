
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { AccountForm } from "./AccountForm"
import { useAccountForm } from "../hooks/use-account-form"

export const AccountDialog = () => {
  const [open, setOpen] = useState(false)
  const {
    form,
    brokers,
    isLoading,
    editingAccount,
    setEditingAccount,
    onSubmit
  } = useAccountForm()

  useEffect(() => {
    setOpen(!!editingAccount)
  }, [editingAccount])

  const handleClose = () => {
    setOpen(false)
    setEditingAccount(null)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
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
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {editingAccount?.isNew ? "Create" : "Save"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
