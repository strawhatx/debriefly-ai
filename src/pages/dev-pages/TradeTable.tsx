import { DataTable } from "@/components/ui/data-table";34

export const TradeTable = ({ columns, data }) => {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4">
        <DataTable
          columns={columns}
          data={data}
          searchKey="asset"
          searchPlaceholder="Search by asset..."
          showPagination={false}
          pageSize={data.length}
        />
      </div>
    </div>
  );
};