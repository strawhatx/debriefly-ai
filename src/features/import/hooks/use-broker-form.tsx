import { useState } from "react";

export const useBrokerForm = () => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const resetForm = () => {
    setFormValues({});
  };

  return { formValues, handleFieldChange, resetForm };
};
