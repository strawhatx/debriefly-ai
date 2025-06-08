
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MARKETS, EditingAccount } from "@/types/trading"
import { BrokerSelect } from "./BrokerSelect"
import { UseFormReturn } from "react-hook-form"

interface AccountFormProps {
  form: UseFormReturn<EditingAccount>
  brokers: { id: string; name: string }[]
  onSubmit: (values: EditingAccount) => void
}

export const AccountForm = ({ form, brokers, onSubmit }: AccountFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
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
      </form>
    </Form>
  )
}
