
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ControllerRenderProps } from "react-hook-form"

interface BrokerSelectProps {
  brokers: { id: string; name: string }[]
  field: ControllerRenderProps<any, "broker_id">
  placeholder: string
}

export const BrokerSelect = ({ brokers, field, placeholder }: BrokerSelectProps) => {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-gray-900">
        {brokers.map((broker) => (
          <SelectItem key={broker.id} value={broker.id} className="text-white hover:bg-gray-800">
            {broker.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
