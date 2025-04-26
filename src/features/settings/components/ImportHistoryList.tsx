"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useImportHistorySection } from "../hooks/use-import-history-section"

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

// Status badge component
const StatusBadge = React.memo(({ status, error }: { status: string; error?: string | null }) => {
    const getStatusColor = () => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-emerald-500/10 text-emerald-500';
            case 'failed':
                return 'bg-red-500/10 text-red-500';
            case 'processing':
                return 'bg-blue-500/10 text-blue-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {status.toLowerCase() === 'completed' && <CheckCircle2 className="w-3 h-3" />}
            {status.toLowerCase() === 'failed' && <AlertCircle className="w-3 h-3" />}
            {status.toLowerCase() === 'processing' && <div className="w-3 h-3 animate-spin rounded-full border-2 border-current border-t-transparent" />}
            {status}
        </div>
    );
});

StatusBadge.displayName = 'StatusBadge';

// File info component
const FileInfo = React.memo(({ size, type }: { size?: number; type?: string }) => {
    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'N/A';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    return (
        <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-xs">({formatFileSize(size)})</span>
            {type && <span className="text-xs">{type.toUpperCase()}</span>}
        </div>
    );
});

FileInfo.displayName = 'FileInfo';

// Import card component
const ImportCard = React.memo(({ importData }: { importData: Import }) => {
    const timeAgo = useMemo(() =>
        formatDistanceToNow(new Date(importData.created_at), { addSuffix: true }),
        [importData.created_at]
    );

    return (
        <div className="p-4 bg-gray-900/50 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="font-medium">{importData.account_name || 'Unknown Account'}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FileText className="w-4 h-4" />
                        <span className="">{importData.original_filename || 'Unknown file'}</span>
                    </div>

                </div>
                <StatusBadge status={importData.status} error={importData.error_message} />
            </div>
            {importData.error_message && (
                <div className="text-sm text-red-400 bg-red-500/10 p-2 rounded">
                    {importData.error_message}
                </div>
            )}
            <div className="flex justify-between items-center text-xs text-gray-400">
                <FileInfo size={importData.file_size} type={importData.file_type} />
                <span>{timeAgo}</span>
            </div>
        </div>
    );
});

ImportCard.displayName = 'ImportCard';

// Empty state component
const EmptyState = React.memo(() => (
    <div className="text-center py-8 text-gray-400">
        No import history found.
    </div>
));

EmptyState.displayName = 'EmptyState';

export const ImportHistoryList = React.memo(() => {
    const { imports, loading } = useImportHistorySection();

    const sortedImports = useMemo(() =>
        [...imports].sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateB.getTime() - dateA.getTime(); // Sort in descending order (newest first)
        }),
        [imports]
    );

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">Import History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {sortedImports.length === 0 ? (
                    <EmptyState />
                ) : (
                    sortedImports.map((importData) => (
                        <ImportCard key={importData.id} importData={importData} />
                    ))
                )}
            </CardContent>
        </Card>
    );
});

ImportHistoryList.displayName = 'ImportHistoryList';