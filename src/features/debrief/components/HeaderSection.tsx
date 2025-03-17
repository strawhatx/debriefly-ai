import { format } from "date-fns";
import { Clock, Download, Share2 } from "lucide-react";



export const HeaderSection = () => {

  return (
    <div className="flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold mb-2">Trading Session Debrief</h1>
      <div className="flex items-center gap-2 text-gray-400">
        <Clock className="w-4 h-4" />
        <span>={format(new Date(), 'MMM d, yyyy')}• 09:30 - 16:00 EST</span>
      </div>
    </div>
    <div className="flex gap-4">
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
        <Download className="w-4 h-4" />
        Export PDF
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
        <Share2 className="w-4 h-4" />
        Share Report
      </button>
    </div>
  </div>
  );
};
