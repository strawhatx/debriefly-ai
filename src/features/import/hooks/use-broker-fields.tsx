import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrokerField } from "../../../types/broker";
import { useToast } from "@/components/ui/use-toast";

const fetchBrokerFields = async (selectedBroker: string, toast: any) => {
  if (!selectedBroker) return [];

  try {
    const { data, error } = await supabase
      .from("broker_connection_fields")
      .select("*")
      .eq("broker_id", selectedBroker);

    if (error) throw error;
    return data as BrokerField[];
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch broker connection fields",
      variant: "destructive",
    });
    return [];
  }
};

export const useBrokerFields = (selectedBroker: string) => {
  const { toast } = useToast();

  const { data: brokerFields = [], isLoading: isLoadingFields } = useQuery({
    queryKey: ["brokerFields", selectedBroker],
    queryFn: () => fetchBrokerFields(selectedBroker, toast),
    enabled: !!selectedBroker
  });

  return { brokerFields, isLoadingFields };
};
