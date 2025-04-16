import { useImportHistorySection } from "../hooks/use-import-history-section";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

interface Import {
  id: string;
  trading_account_id: string;
  import_type: string;
  status: string;
  error_message: string | null;
  created_at: string;
  account_name?: string;
  original_filename?: string;
  file_size?: number;
  file_type?: string;
}

export const ImportHistorySection = () => {
  const { imports, loading } = useImportHistorySection();

  const columns: ColumnDef<Import>[] = [
    {
      accessorKey: "created_at",
      header: createSortableColumn("Date"),
      cell: ({ row }) =>
        format(new Date(row.original.created_at), "MMM d, yyyy HH:mm"),
    },
    {
      accessorKey: "account_name",
      header: "Account",
      meta: {
        className: "hidden lg:table-cell", // Hidden on small screens
      },
    },
    {
      accessorKey: "original_filename",
      header: "File",
      cell: ({ row }) => row.original.original_filename || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case "completed":
              return "text-green-500";
            case "failed":
              return "text-red-500";
            case "processing":
              return "text-yellow-500";
            default:
              return "text-gray-500";
          }
        };
        return (
          <span className={getStatusColor(row.original.status)}>
            {row.original.status}
          </span>
        );
      },
    },
    {
      accessorKey: "error_message",
      header: "Error Msg",
      cell: ({ row }) => (
        <span className="text-red-500">{row.original.error_message || "-"}</span>
      ),
      meta: {
        className: "hidden lg:table-cell", // Hidden on small screens
      },
    },
  ];

  return (
    <section className="bg-gray-800 mt-4 rounded-xl border border-gray-700">
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-bold">Trading Accounts</h3>
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : imports.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No import history available yet.
            </p>
          ) : (
            <DataTable
              columns={columns}
              data={imports}
              searchKey="account_name"
              searchPlaceholder="Search accounts..."
              pageSize={5}
              showPagination
              showColumnToggle={false}
              toolbarEnabled
            />
          )}
        </div>
    </section>
  );
};
