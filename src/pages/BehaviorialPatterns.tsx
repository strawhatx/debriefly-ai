
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { 
  Save, Search, Tag, Calendar, FileText, 
  PlusCircle, FolderPlus, ChevronDown, Clock, 
  CheckSquare, LayoutGrid, Edit3, Trash2, 
  DollarSign, BarChart 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const BehaviorialPatterns = () => {
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("All notes");
  const [tradeNote, setTradeNote] = useState("");
  const { toast } = useToast();

  // Sample folders for the sidebar
  const folders = [
    { id: "all", name: "All notes", count: 8 },
    { id: "trade", name: "Trade Notes", count: 5 },
    { id: "journal", name: "Daily Journal", count: 7 },
    { id: "recap", name: "Sessions Recap", count: 3 },
    { id: "goals", name: "Quarterly Goals 📊", count: 4 },
    { id: "plan", name: "Trading Plan 📝", count: 2 },
    { id: "2023", name: "2023 Goals + Plan📝", count: 1 },
    { id: "action", name: "Plan of Action💪", count: 2 },
    { id: "templates", name: "Templates", count: 5 },
  ];

  // Sample tags for the sidebar
  const tags = [
    { id: "fomc", name: "FOMC", count: 2 },
    { id: "equities", name: "Equities", count: 1 },
    { id: "futures", name: "Futures", count: 1 },
  ];

  // Sample trades data
  const sampleTrades = [
    { 
      id: 1, 
      symbol: "MES", 
      date: "Jun 25, 2024", 
      pnl: -300.00, 
      color: "text-red-500",
      timestamp: "07/08/2024"
    },
    { 
      id: 2, 
      symbol: "MES", 
      date: "Jun 25, 2024", 
      pnl: -300.00, 
      color: "text-red-500",
      timestamp: "07/07/2024"
    },
    { 
      id: 3, 
      symbol: "MES", 
      date: "Jun 19, 2024", 
      pnl: 607.50, 
      color: "text-green-500",
      timestamp: "07/07/2024",
      isSelected: true
    },
    { 
      id: 4, 
      symbol: "MES", 
      date: "Jun 25, 2024", 
      pnl: 900.00, 
      color: "text-green-500",
      timestamp: "07/02/2024"
    },
    { 
      id: 5, 
      symbol: "MES", 
      date: "Jun 26, 2024", 
      pnl: 262.50, 
      color: "text-green-500",
      timestamp: "07/02/2024"
    },
    { 
      id: 6, 
      symbol: "MES", 
      date: "Jun 26, 2024", 
      pnl: -300.00, 
      color: "text-red-500",
      timestamp: "07/02/2024"
    },
    { 
      id: 7, 
      symbol: "MES", 
      date: "Jun 21, 2024", 
      pnl: 0.00, 
      color: "text-gray-500",
      timestamp: "06/26/2024"
    },
  ];

  // Placeholder for the fetched trades (would use useQuery in a real app)
  const [trades] = useState(sampleTrades);
  const [activeTrade] = useState(sampleTrades.find(t => t.isSelected) || sampleTrades[0]);

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };

  const saveTrade = () => {
    toast({
      title: "Success",
      description: "Trade note saved successfully",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex h-[calc(100vh-64px)]">
        {/* Folders Sidebar */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <Button variant="outline" className="w-full flex items-center justify-start gap-2 mb-4">
              <FolderPlus className="h-4 w-4" />
              Add folder
            </Button>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium flex items-center justify-between">
                Folders
                <ChevronDown className="h-4 w-4" />
              </h3>
              <div className="mt-2 space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    className={`flex items-center justify-between w-full px-2 py-2 text-sm rounded-md ${
                      selectedFolder === folder.name ? "bg-purple-100 text-purple-600" : ""
                    }`}
                    onClick={() => handleFolderClick(folder.name)}
                  >
                    <span>{folder.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium flex items-center justify-between">
                Tags
                <ChevronDown className="h-4 w-4" />
              </h3>
              <div className="mt-2 space-y-1">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between px-2 py-1 text-sm rounded-md hover:bg-gray-100"
                  >
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs flex items-center">
                      {tag.name}
                      <span className="ml-1 bg-white text-xs px-1 rounded-full">{tag.count}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <Button variant="ghost" className="w-full flex items-center justify-start gap-2 text-gray-500">
              <Trash2 className="h-4 w-4" />
              Recently Deleted
            </Button>
          </div>
        </div>
        
        {/* Trade Notes List */}
        <div className="w-80 border-r bg-white overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                New note
              </Button>
              <Button variant="ghost" size="icon">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center mb-4">
              <Checkbox id="selectAll" />
              <label htmlFor="selectAll" className="ml-2 text-sm">
                Select All
              </label>
            </div>
            
            <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm mb-4">
              Organize your notebook with folders & tags
            </div>
          </div>
          
          <div>
            {trades.map((trade) => (
              <div 
                key={trade.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${trade.isSelected ? 'bg-purple-50' : ''}`}
                onClick={() => setSelectedTrade(trade)}
              >
                <div className="font-medium">
                  {trade.symbol} : {trade.date}
                </div>
                <div className={`${trade.color} font-medium text-sm mt-1`}>
                  NET P&L: {trade.pnl < 0 ? "-" : ""}${Math.abs(trade.pnl).toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {trade.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trade Detail View */}
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold">
                  {activeTrade.symbol} : {activeTrade.date}
                </h1>
                <div className="text-sm text-gray-500">
                  Created: Jul 07, 2024 03:34AM   Last updated: Jul 07, 2024 03:34AM
                </div>
              </div>
              <div>
                <Button variant="outline" size="icon" className="mr-2">
                  <span className="sr-only">More options</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </Button>
                <Button variant="secondary">View Trade Details</Button>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="text-lg font-medium mb-4">
                  Net P&L ${activeTrade.pnl.toFixed(2)}
                </div>
                
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Contracts Traded</div>
                    <div className="font-medium">30</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Volume</div>
                    <div className="font-medium">5</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Commissions</div>
                    <div className="font-medium">$0.00</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Net ROI</div>
                    <div className="font-medium">0.07%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Gross P&L</div>
                    <div className="font-medium">${activeTrade.pnl.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Recently used templates:</span>
                <Button 
                  variant="ghost" 
                  className="text-sm bg-purple-100 text-purple-600 hover:bg-purple-200 hover:text-purple-700"
                >
                  Review your trade details
                </Button>
              </div>
              <Button variant="outline" className="text-sm">+ Add Template</Button>
            </div>
            
            <div className="mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Add tag</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            
            <div className="mb-4 flex items-center gap-2 p-2 border rounded-md">
              <Button variant="ghost" size="sm" className="p-1 h-8">
                <Clock className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              
              <Button variant="ghost" size="sm" className="p-1 h-8 font-medium">
                Arial
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              
              <Button variant="ghost" size="sm" className="p-1 h-8 font-medium">
                15px
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button variant="ghost" size="sm" className="p-1 h-8">
                <span className="font-bold">B</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="p-1 h-8">
                <span className="italic">I</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="p-1 h-8">
                <span className="underline">U</span>
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              {/* More formatting buttons */}
              <div className="flex-1"></div>
              
              <Button variant="ghost" size="sm" className="p-1 h-8">
                <BarChart className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-white p-4 border rounded-md">
              <h2 className="text-xl font-semibold mb-4">Pre-Market Plan</h2>
              
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 border-b text-left font-medium">Symbol</th>
                      <th className="py-3 px-4 border-b text-left font-medium">Game Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 border-b">ES</td>
                      <td className="py-3 px-4 border-b">
                        <div className="h-2 bg-gray-200 w-3/4 rounded"></div>
                        <div className="h-2 bg-gray-200 w-1/2 mt-2 rounded"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b">MES</td>
                      <td className="py-3 px-4 border-b">
                        <div className="h-2 bg-gray-200 w-4/5 rounded"></div>
                        <div className="h-2 bg-gray-200 w-3/5 mt-2 rounded"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b">CL</td>
                      <td className="py-3 px-4 border-b">
                        <div className="h-2 bg-gray-200 w-4/5 rounded"></div>
                        <div className="h-2 bg-gray-200 w-2/5 mt-2 rounded"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Jot down your notes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
