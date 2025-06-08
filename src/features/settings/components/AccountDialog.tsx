import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useDashboard } from "@/hooks/use-dashboard"
import { supabase } from "@/integrations/supabase/client"
import { EditingAccount, MARKETS, TradingAccount } from "@/types/trading"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { BrokerSelect } from "./BrokerSelect"
import { useUser } from "@/hooks/use-user"

const formSchema = z.object({
  account_name: z.string().min(2, {
    message: "Account name must be at least 2 characters.",
  }),
  broker_id: z.string().min(1, {
    message: "Please select a broker.",
  }),
  account_balance: z.number().optional(),
  market: z.enum(MARKETS).optional(),
})

interface AccountFormProps {
  editingAccount?: EditingAccount
  onClose: () => void
}

export const AccountDialog = () => {
  const { user } = useUser();
  const { refetchAccounts } = useDashboard()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [brokers, setBrokers] = useState<{ id: string; name: string }[]>([])
  const [accountsToCreate, setAccountsToCreate] = useState<any[]>([{ user_id: user?.id }]);

  const editingAccount = useDashboard((state) => state.editingAccount)
  const setEditingAccount = useDashboard((state) => state.setEditingAccount)

  const form = useForm<z.infer<typeof formSchema>>({
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
    setOpen(!!editingAccount)
    form.reset(editingAccount)
  }, [editingAccount])

  const handleClose = () => {
    setOpen(false)
    setEditingAccount(undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        // For bulk insert, we need to pass individual objects, not an array
        for (const account of accountsToCreate) {
          const { error } = await supabase
            .from("trading_accounts")
            .insert({
              user_id: account.user_id,
              broker_id: account.broker_id!,
              account_balance: account.account_balance || 0,
              account_name: account.account_name!,
              market: account.market || null
            });
            
          if (error) throw error;
        }
      } else {
        // Update existing account
        const { error } = await supabase
          .from("trading_accounts")
          .update({
            account_name: editingAccount.account_name!,
            broker_id: editingAccount.broker_id!,
            account_balance: editingAccount.account_balance || 0,
            market: editingAccount.market || null
          })
          .eq("id", editingAccount.id!);
          
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Account saved successfully",
      })
      refetchAccounts()
      handleClose()
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
  };

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
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="account_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Trading Account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="broker_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broker</FormLabel>
                  <FormControl>
                    <BrokerSelect
                      brokers={brokers}
                      field={field}
                      placeholder="Select a broker"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account_balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Balance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1000"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        form.setValue("account_balance", isNaN(value) ? undefined : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a market" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MARKETS.map((market) => (
                        <SelectItem key={market} value={market}>
                          {market}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingAccount?.isNew ? "Create" : "Save"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
