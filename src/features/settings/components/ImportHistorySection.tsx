import { Import, Search } from "lucide-react";
import { ImportsTable } from "./ImportsTable";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useImportHistorySection } from "../hooks/use-import-history-section";

export const ImportHistorySection = () => {
  const { imports, loading } = useImportHistorySection();

  return (
    <section className="bg-gray-800 rounded-xl border border-gray-700" >
      <div className="overflow-x-auto">
        <div className="p-6 flex justify-between items-center">
          <h3 className="text-lg font-bold">Trading Accounts</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search accounts..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <Link to="/app/trade-import" className="inline-flex items-center gap-2 px-6 text-background py-2 bg-primary rounded-lg font-medium group">
            <Import className="" />
            Import Trades
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : imports.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No import history available yet.
            </p>
          ) : (
            <ImportsTable imports={imports} />
          )}
        </div>
      </div>
    </section>
  );
};
