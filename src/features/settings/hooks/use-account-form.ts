
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useDashboard } from "@/hooks/use-dashboard"
import { useUser } from "@/hooks/use-user"
import { formSchema, type FormData } from "../components/AccountForm"

export const useAccountForm = () => {
  const { user } = useUser()
  const { refetchAccounts } = useDashboard()
  const [isLoading, setIsLoading] = useState(false)
  const [brokers, setBrokers] = useState<{ id: string; name: string }[]>([])

  const editingAccount = useDashboard((state) => state.editingAccount)
  const setEditingAccount = useDashboard((state) => state.setEditingAccount)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account_name: editingAccount?.account_name || "",
      broker_id: editingAccount?.broker_id || "",
      account_balance: editingAccount?.account_balance,
      market: editingAccount?.market,
    },
  })

  useEffect(() => {
    const fetchBrokers = async () => {
      const { data, error } = await supabase.from("brokers").select("id, name")
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch brokers",
          variant: "destructive",
        })
        return
      }
      setBrokers(data)
    }

    fetchBrokers()
  }, [])

  useEffect(() => {
    if (editingAccount) {
      form.reset({
        account_name: editingAccount.account_name || "",
        broker_id: editingAccount.broker_id || "",
        account_balance: editingAccount.account_balance,
        market: editingAccount.market,
      })
    }
  }, [editingAccount, form])

  const onSubmit = async (values: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (editingAccount?.isNew) {
        // Create new account
        const { error } = await supabase
          .from("trading_accounts")
          .insert({
            user_id: user.id,
            broker_id: values.broker_id,
            account_balance: values.account_balance || 0,
            account_name: values.account_name,
            market: values.market || null
          });
          
        if (error) throw error;
      } else {
        // Update existing account
        const { error } = await supabase
          .from("trading_accounts")
          .update({
            account_name: values.account_name,
            broker_id: values.broker_id,
            account_balance: values.account_balance || 0,
            market: values.market || null
          })
          .eq("id", editingAccount?.id!);
          
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Account saved successfully",
      })
      refetchAccounts()
      setEditingAccount(undefined)
    } catch (error: any) {
      console.error("Error saving account:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return {
    form,
    brokers,
    isLoading,
    editingAccount,
    setEditingAccount,
    onSubmit
  }
}
