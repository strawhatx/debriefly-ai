
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileImport } from "@/components/import/FileImport";
import { BrokerSync } from "@/components/import/BrokerSync";

const ImportTrades = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("file");

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

      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="file">File Upload</TabsTrigger>
              <TabsTrigger value="broker">Broker Sync</TabsTrigger>
            </TabsList>
            <TabsContent value="file">
              <FileImport />
            </TabsContent>
            <TabsContent value="broker">
              <BrokerSync />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ImportTrades;
