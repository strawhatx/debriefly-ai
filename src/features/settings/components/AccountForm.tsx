
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
import { MARKETS } from "@/types/trading"
import { BrokerSelect } from "./BrokerSelect"
import { UseFormReturn } from "react-hook-form"
import * as z from "zod"

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

type FormData = z.infer<typeof formSchema>

interface AccountFormProps {
  form: UseFormReturn<FormData>
  brokers: { id: string; name: string }[]
  onSubmit: (values: FormData) => void
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
      </form>
    </Form>
  )
}

export { formSchema, type FormData }
