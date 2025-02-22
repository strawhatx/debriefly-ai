
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import filesize from "filesize";
import { SortAsc } from "lucide-react";

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

interface ImportsTableProps {
  imports: Import[];
}

export const ImportsTable = ({ imports }: ImportsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'processing':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="px-6 py-3 text-left">
            <div className="flex items-center gap-2">
              Date
              <SortAsc className="w-4 h-4" />
            </div>
          </th>
          <th className="px-6 py-3 text-left">Account</th>
          <th className="px-6 py-3 text-left">File</th>
          <th className="px-6 py-3 text-left">Status</th>
          <th className="px-6 py-3 text-left">Error Msg</th>
        </tr>
      </thead>
      <tbody>
        {imports.map((import_) => (
          <tr key={import_.id} className="border-b border-gray-700 hover:bg-gray-700/50">
            <td className="px-6 py-4">
              {format(new Date(import_.created_at), 'MMM d, yyyy HH:mm')}
            </td>
            <td className="px-6 py-4">{import_.account_name}</td>
            <td className="px-6 py-4 max-w-44">{import_.original_filename || '-'}</td>
            <td className="px-6 py-4">
              <span className={getStatusColor(import_.status)}>
                {import_.status}
              </span>
            </td>
            <td className="px-6 py-4 text-red-500 min-w-48">
              {import_.error_message}
            </td>
          </tr>
        ))}

      </tbody>
    </table>
  );
};
