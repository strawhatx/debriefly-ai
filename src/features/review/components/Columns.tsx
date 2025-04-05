import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Select } from "./Select";
import { allStrategies, allTags } from "../utils/constants";

export const Columns = (handleUpdate: (id: string, key: string, value: any) => void) => [
  {
    accessorKey: "date",
    header: "Date",
    meta: {
      className: "hidden lg:table-cell", // Hidden on small screens
    },
    cell: ({ row }) => (
      <div className="text-right">{new Date(row.getValue("date")).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "asset",
    header: "Asset",
  },
  {
    accessorKey: "type",
    header: "Type",
    meta: {
      className: "hidden lg:table-cell", // Hidden on small screens
    },
    cell: ({ row }) => (
      <span
        className={`flex items-center gap-1 ${
          row.getValue("type") === "LONG" ? "text-emerald-400" : "text-red-400"
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
    meta: {
      className: "hidden lg:table-cell", // Hidden on small screens
    },
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("entry")?.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "exit",
    header: "Exit",
    meta: {
      className: "hidden lg:table-cell", // Hidden on small screens
    },
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("exit")?.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "pnl",
    header: "P&L",
    cell: ({ row }) => (
      <div
        className={`text-right ${
          row.getValue("pnl") >= 0 ? "text-emerald-400" : "text-red-400"
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