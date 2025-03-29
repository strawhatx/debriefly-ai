import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTrades } from "./hooks/use-trades";
import { SummaryCards } from "./components/SummaryCards";
import { Select } from "./components/Select";
import { useToast } from "@/hooks/use-toast";

const allStrategies = [
  "BREAKOUT",
  "PULLBACK",
  "REVERSALS",
  "TREND FOLLOWING",
  "RANGE TRADING",
  "SCALPING",
  "MOMENTUM",
  "SWING TRADING",
  "ORDER BLOCK",
  "FVG",
];

const allTags = [
  "CALM",
  "CONFIDENT",
  "DISCIPLINED",
  "PATIENT",
  "HESITANT",
  "ANXIOUS",
  "FEARFUL",
  "DOUBTFUL",
  "FOMO",
  "GREEDY",
  "EXCITED",
  "OVERCONFIDENT",
  "REVENGE",
  "ANGRY",
  "FRUSTRATED",
  "IMPULSIVE",
];

export const Review = () => {
  const { trades, setTrades, error } = useTrades();

  const handleUpdate = (id: string, key: string, value: any) => {
    setTrades((prevTrades) =>
      prevTrades.map((trade) =>
        trade.id === id ? { ...trade, [key]: value } : trade
      )
    );
  };

  const columns = [
    {
      accessorKey: "date",
      header: createSortableColumn("Date"),
    },
    {
      accessorKey: "asset",
      header: "Asset",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span
          className={`flex items-center gap-1 ${row.getValue("type") === "LONG" ? "text-emerald-400" : "text-red-400"
            }`}
        >
          {row.getValue("type") === "LONG" ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {row.getValue("type")}
        </span>
      ),
    },
    {
      accessorKey: "entry",
      header: "Entry",
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("entry")?.toFixed(2)}</div>
      ),
    },
    {
      accessorKey: "exit",
      header: "Exit",
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("exit")?.toFixed(2)}</div>
      ),
    },
    {
      accessorKey: "pnl",
      header: createSortableColumn("P&L"),
      cell: ({ row }) => (
        <div
          className={`text-right ${row.getValue("pnl") >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
        >
          {row.getValue("pnl") >= 0 ? "+" : ""}
          {row.getValue("pnl")?.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "strategy",
      header: "Strategy",
      cell: ({ row }) => {
        const strategy = row.getValue("strategy");

        const handleStrategyChange = (newStrategy) => {
          handleUpdate(row.original.id, "strategy", newStrategy);
        };

        return (
          <Select
            label="Strategy"
            options={allStrategies}
            value={strategy}
            onChange={handleStrategyChange}
          />
        );
      },
    },
    {
      accessorKey: "reward",
      header: "Reward",
      cell: ({ row }) => (
        <input
          type="number"
          className="bg-gray-800 text-right text-white border border-gray-600 rounded px-2 py-1"
          value={row.getValue("reward")}
          min={0.5}
          max={10}
          step={0.5}
          onChange={(e) =>
            handleUpdate(row.original.id, "reward", parseFloat(e.target.value))
          }
        />
      ),
    },
    {
      accessorKey: "tags",
      header: "Emotions",
      cell: ({ row }) => {
        const tags = row.getValue("tags");

        const handleTagsChange = (newTags) => {
          handleUpdate(row.original.id, "tags", newTags);
        };

        return (
          <Select
            label="Emotions"
            options={allTags}
            value={tags}
            onChange={handleTagsChange}
            multiple={true}
          />
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Trade Table */}
      {(!trades || trades.length === 0) ? (
        <section className="text-gray-400 text-center p-4 bg-gray-800 rounded-xl border border-gray-700">
          No trade data available.
        </section>
      ) : (
        <>
          {/* Trade Statistics */}
          <SummaryCards trades={trades} />

          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4">
              <DataTable
                columns={columns}
                data={trades}
                searchKey="asset"
                searchPlaceholder="Search by asset..."
                showPagination={false}
                pageSize={trades.length}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
