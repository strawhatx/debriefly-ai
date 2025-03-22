import { SelectAccount } from "@/components/SelectAccount";
import { TradeExport } from "@/features/history/components/TradeExport";
import { useTrades } from "@/features/history/hooks/use-trades";

export const TradeHistoryHeader = () => {
    const { trades } = useTrades();
    return (
        <div className="flex gap-4 align-middle">
          <SelectAccount />
          <TradeExport trades={trades} />
        </div>
    );
};