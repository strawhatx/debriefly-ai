
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
import { BarChart2, Settings, ClipboardList, Brain, LineChart, History, Home, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SelectAccount } from "../SelectAccount";

const navigationItems = [
  { title: "Dashboard", icon: Home, url: "/app/dashboard" },
  { title: "Debrief", icon: ClipboardList, url: "/app/debrief" },
  { title: "Trade History", icon: History, url: "/app/trade-history" },
  { title: "Trade Review", icon: Eye, url: "/app/trade-import/review" },
  { title: "Behavior", icon: Brain, url: "/app/behavioral-patterns" },
  { title: "Strategy", icon: LineChart, url: "/app/strategy-optimization" },
];

export const AppSidebar = () => {
  return (
    <ShadcnSidebar>
      <SidebarContent>
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <BarChart2 className="w-6 h-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Debriefly
            </span>
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-3 px-4 py-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="list-none">
            <div className="px-4 py-3 border-t">
              <SelectAccount />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 border-t">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-sm text-muted-foreground">john@example.com</span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};
