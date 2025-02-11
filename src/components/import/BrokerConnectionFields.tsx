
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BrokerField = {
  id: string;
  broker_id: string;
  field_name: string;
  field_type: 'text' | 'password' | 'api_key';
  required: boolean;
  display_name: string;
  description: string | null;
};

interface BrokerConnectionFieldsProps {
  brokerFields: BrokerField[];
  formValues: Record<string, string>;
  onFieldChange: (fieldName: string, value: string) => void;
}

export const BrokerConnectionFields = ({
  brokerFields,
  formValues,
  onFieldChange,
}: BrokerConnectionFieldsProps) => {
  if (!brokerFields || brokerFields.length === 0) return null;

  return (
    <div className="space-y-4">
      {brokerFields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.field_name}>
            {field.display_name}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={field.field_name}
            type={field.field_type === 'password' ? 'password' : 'text'}
            value={formValues[field.field_name] || ''}
            onChange={(e) => onFieldChange(field.field_name, e.target.value)}
            placeholder={field.description || ''}
          />
        </div>
      ))}
    </div>
  );
};
