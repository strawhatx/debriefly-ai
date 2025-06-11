import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

export const TradeTable = ({ columns, data, onSave }) => {
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (row) => {
    setEditRowId(row.id);
    setEditData(row);
  };

  const handleSaveClick = () => {
    onSave(editData);
    setEditRowId(null);
    setEditData({});
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditData({});
  };

  const handleChange = (value, column, row) => {
    setEditData((prev) => ({
      ...prev,
      [column.accessorKey]: value
    }));
  };

  const renderCell = (row, column) => {
    const isEditing = row.id === editRowId;
    const isEditableColumn = ['strategy', 'reward', 'tags'].includes(column.accessorKey);

    if (!isEditing) {
      return column.cell ? column.cell({ row, isEditing: false }) : row[column.accessorKey];
    }

    if (!isEditableColumn) {
      return column.cell ? column.cell({ row, isEditing: false }) : row[column.accessorKey];
    }

    return column.cell({ 
      row: { ...editData },
      updateData: (value) => handleChange(value, column, row),
      isEditing: true
    });
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4">
        <DataTable
          columns={columns.map(column => ({
            ...column,
            cell: ({ row }) => {
              const isEditing = row.original.id === editRowId;
              const isEditableColumn = ['strategy', 'reward', 'tags'].includes(column.accessorKey);

              return (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    {renderCell(row.original, column)}
                  </div>
                  {isEditableColumn && column.accessorKey === 'tags' && (
                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveClick}
                            className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                            title="Save changes"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                            title="Cancel changes"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditClick(row.original)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit row"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            }
          }))}
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