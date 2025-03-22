import { Download, Share2 } from "lucide-react";

export const DebriefHeader = () => {
    return (
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg">
                <Download className="w-4 h-4" />
                Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg">
                <Share2 className="w-4 h-4" />
                Share Report
            </button>
        </div>
    );
};