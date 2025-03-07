
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileImport } from "@/components/import/FileImport";
import { BrokerSync } from "@/components/import/BrokerSync";
import { Broker } from "@/components/import/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileImportDescription } from "@/components/import/FileImportDescription";
import useAssetStore from "@/store/assets";

const ImportTrades = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("file");
  const { currency_codes, futures_multipliers, get_currency_codes, get_futures_multipliers } = useAssetStore()
  const hasHydrated = useAssetStore.persist.hasHydrated()

  const { data: availableBrokers } = useQuery<Broker[]>({
    queryKey: ["availableBrokers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brokers")
        .select("*");

      if (error) {
        console.error("Error fetching brokers:", error);
        throw error;
      }

      return data as Broker[];
    },
  });

  // for later use
  useEffect(() => {
    const runTask = async () => {
      if (hasHydrated) {
        console.log('✅ State has been hydrated from storage!')

        // Only load initial data if state is still the default (or empty)
        if (!currency_codes || currency_codes.length === 0) {
          await get_currency_codes()
        }

        // Only load initial data if state is still the default (or empty)
        if (!futures_multipliers || futures_multipliers.length === 0) {
          await get_futures_multipliers()
        }
      }
    }

    runTask()
  }, [hasHydrated])

  return (
    <div className="p-6">
      <div className="flex items-center mb-6 bg-background/60 backdrop-blur-sm sticky top-0 z-10 -mt-6 py-4 px-6 border-b">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:text-foreground mr-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold">Import Trades</h1>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-[400px] mb-6">
            <TabsTrigger value="file" className="flex-1">File Upload</TabsTrigger>
            <TabsTrigger value="broker" className="flex-1">Broker Sync</TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6">
                <FileImport availableBrokers={availableBrokers} />
              </Card>
              <Card className="p-6">
                <FileImportDescription />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="broker">
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6">
                <BrokerSync availableBrokers={availableBrokers} />
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">How to Sync with Your Broker</h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>Currently, direct broker sync is supported for:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {availableBrokers
                      ?.filter(broker => broker.broker_sync_enabled)
                      .map(broker => (
                        <li key={broker.id}>{broker.name}</li>
                      ))}
                  </ul>
                  <p className="mt-4">To sync your trades directly from your broker:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Select your broker from the dropdown menu</li>
                    <li>Select the trading account you want to sync</li>
                    <li>Enter your broker API credentials</li>
                    <li>Click "Connect & Import" to start the sync process</li>
                  </ol>
                  <p>
                    Your trades will be automatically imported. The sync process runs in
                    the background, and you can check its status in the settings page
                    under "Import History".
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ImportTrades;
