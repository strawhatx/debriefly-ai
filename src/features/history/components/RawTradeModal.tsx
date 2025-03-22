import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RawTrade } from "../hooks/use-raw-trade";
import { format } from "date-fns";

interface RawTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: RawTrade[] | null;
  isLoading: boolean;
  error: Error | null;
}

export const RawTradeModal = ({ isOpen, onClose, data, isLoading, error }: RawTradeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Raw Trade Data</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-500">Error: {error.message}</p>
          </div>
        ) : data?.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm">Symbol</TableHead>
                  <TableHead className="text-sm">Type</TableHead>
                  <TableHead className="text-sm">Side</TableHead>
                  <TableHead className="text-sm">Fill</TableHead>
                  <TableHead className="text-sm">Qty</TableHead>
                  <TableHead className="text-sm">Entry Date</TableHead>
                  <TableHead className="text-sm">Closing Date</TableHead>
                  <TableHead className="text-sm">Fees</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((trade, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm">{trade.symbol}</TableCell>
                    <TableCell className="text-sm">{trade.order_type}</TableCell>
                    <TableCell className={`text-sm ${trade.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.side?.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-sm">{trade.fill_price?.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">{trade.quantity}</TableCell>
                    <TableCell className="text-sm">{format(new Date(trade.entry_date), 'MMM d, yyyy HH:mm')}</TableCell>
                    <TableCell className="text-sm">{format(new Date(trade.closing_date), 'MMM d, yyyy HH:mm')}</TableCell>
                    <TableCell className="text-red-500 text-sm">-{trade.fees?.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No trade data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 