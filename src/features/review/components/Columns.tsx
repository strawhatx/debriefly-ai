import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Select } from "./Select";
import { allStrategies, allTagObjects as allTags } from "../../../utils/constants";
import { MultiSelect } from "./MultiSelect";
import { displayTotal } from "@/utils/utils";

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
    accessorKey: "pnl",
    header: "P&L",
    cell: ({ row }) => (
      <div
        className={`text-right ${
          row.getValue("pnl") >= 0 ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {displayTotal(row.getValue("pnl") >= 0, row.getValue("pnl"))}
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
        className="bg-gray-800 text-right text-white border border-gray-600 rounded px-4 py-2"
        value={row.getValue("reward") || 0}
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
      const tags: string[] = row.getValue("tags");

      const handleTagsChange = (newTags: string[]) => {
        handleUpdate(row.original.id, "tags", newTags);
      };

      return (
        <MultiSelect
          options={allTags}
          values={tags}
          onValueChange={handleTagsChange}
        />
      );
    },
  },
];