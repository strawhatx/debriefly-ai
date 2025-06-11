import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Select } from "./Select";
import { allStrategies, allTagObjects as allTags } from "../../../utils/constants";
import { MultiSelect } from "./MultiSelect";
import { displayTotal } from "@/utils/utils";

export const Columns = [
  {
    accessorKey: "date",
    header: "Date",
    meta: {
      className: "hidden lg:table-cell", // Hidden on small screens
    },
    cell: ({ row }) => (
      <div className="text-right">{new Date(row.date).toLocaleDateString()}</div>
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
          row.type === "LONG" ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {row.type === "LONG" ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownRight className="w-4 h-4" />
        )}
        {row.type}
      </span>
    ),
  },
  {
    accessorKey: "pnl",
    header: "P&L",
    cell: ({ row }) => (
      <div
        className={`text-right ${
          row.pnl >= 0 ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {displayTotal(row.pnl >= 0, row.pnl)}
      </div>
    ),
  },
  {
    accessorKey: "strategy",
    header: "Strategy",
    cell: ({ row, updateData, isEditing }) => {
      if (!isEditing) {
        return <div className="text-gray-300">{row.strategy || 'Not set'}</div>;
      }

      return (
        <Select
          options={allStrategies}
          value={row.strategy}
          onChange={(newStrategy) => updateData?.(newStrategy)}
        />
      );
    },
  },
  {
    accessorKey: "reward",
    header: "Reward",
    cell: ({ row, updateData, isEditing }) => {
      if (!isEditing) {
        return (
          <div className="text-right text-gray-300">
            {row.reward ? row.reward.toFixed(1) : 'Not set'}
          </div>
        );
      }

      return (
        <input
          type="number"
          className="w-full bg-gray-800 text-right text-white border border-gray-600 rounded px-4 py-2"
          value={row.reward ?? ''}
          min={0.5}
          max={10}
          step={0.5}
          onChange={(e) => {
            const value = e.target.value === '' ? null : parseFloat(e.target.value);
            updateData?.(value);
          }}
        />
      );
    },
  },
  {
    accessorKey: "tags",
    header: "Emotions",
    cell: ({ row, updateData, isEditing }) => {
      if (!isEditing) {
        return (
          <div className="text-gray-300">
            {row.tags?.length > 0 
              ? row.tags.join(', ')
              : 'No emotions tagged'}
          </div>
        );
      }

      return (
        <MultiSelect
          options={allTags}
          values={row.tags}
          onValueChange={(newTags) => updateData?.(newTags)}
        />
      );
    },
  },
];