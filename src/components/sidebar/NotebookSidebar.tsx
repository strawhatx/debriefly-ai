
import { Link } from "react-router-dom";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BarChart2, Settings, ClipboardList, Brain, LineChart, History, Home } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useJournal } from "@/features/notebook/hooks/use-journal";
import { format } from "date-fns";

const dataItems = [
  { title: "Dashboard", icon: Home, url: "/app/dashboard" },
  { title: "Debrief", icon: ClipboardList, url: "/app/debrief" },
  { title: "Trade History", icon: History, url: "/app/trade-history" },
  { title: "Behavior", icon: Brain, url: "/app/behavioral-patterns" },
  { title: "Strategy", icon: LineChart, url: "/app/strategy-optimization" },
];

export const NotebookSidebar = ({ id }: { id: string }) => {
  const { journal, trade } = useJournal(id || '');
  return (
    <ShadcnSidebar collapsible="none"
      className="sticky hidden lg:flex top-0 h-dvh border-l">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="grid grid-cols-3 gap-2 pt-6 ">
              <div className="col-span-2 gap-2">
                <div className="text-sm text-gray-400 mb-3">Gross PnL</div>
                <div className="text-sm text-gray-400 mb-3">Entry</div>
                <div className="text-sm text-gray-400 mb-3">Exit</div>
                <div className="text-sm text-gray-400 mb-3">Volume</div>
                <div className="text-sm text-gray-400 mb-3">Commission</div>
                <div className="text-sm text-gray-400 mb-3">Position Type</div>
              </div>

              <div className="col-span-1 gap-2">
                <div className="text-sm text-gray-400 mb-3">{trade?.pnl}</div>
                <div className="text-sm text-gray-400 mb-3">{trade?.fill_price}</div>
                <div className="text-sm text-gray-400 mb-3">{trade?.stop_price}</div>
                <div className="text-sm text-gray-400 mb-3">{trade?.quantity}</div>
                <div className="text-sm text-gray-400 mb-3">{trade?.fees}</div>
                <div className={`text-sm text-gray-400 mb-3 ${trade?.position_type === 'LONG' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trade?.position_type}
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="sticky bottom-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="text-sm text-gray-400">Created:</div>
            <div className="text-sm text-gray-400 mb-3">{journal?.created_at ? format(new Date(journal?.created_at), 'MMM d, yyyy') :'N/A'}</div>

          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="text-sm text-gray-400">Updated:</div>
            <div className="text-sm text-gray-400">{journal?.updated_at ? format(new Date(journal?.updated_at), 'MMM d, yyyy') : 'N/A'}</div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};
