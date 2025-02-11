
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { filesize } from "filesize";

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>File</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Error</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {imports.map((import_) => (
          <TableRow key={import_.id}>
            <TableCell>
              {format(new Date(import_.created_at), 'MMM d, yyyy HH:mm')}
            </TableCell>
            <TableCell>{import_.account_name}</TableCell>
            <TableCell>{import_.original_filename || '-'}</TableCell>
            <TableCell>
              {import_.file_size ? filesize(import_.file_size).toString() : '-'}
            </TableCell>
            <TableCell>{import_.file_type || import_.import_type}</TableCell>
            <TableCell>
              <span className={getStatusColor(import_.status)}>
                {import_.status}
              </span>
            </TableCell>
            <TableCell className="text-red-500">
              {import_.error_message}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
