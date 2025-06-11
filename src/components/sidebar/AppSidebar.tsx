import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart2, ClipboardList, Brain, LineChart, History, Home, Eye,
  Import, Lightbulb,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SelectAccount } from "../SelectAccount";
import { useProfile } from "@/hooks/use-profile";
import { Badge } from "@/components/ui/badge";
import { useEventBus } from "@/store/event";

const AppSidebar = () => {
  const subscribe = useEventBus((state) => state.subscribe);
  const [count, setCount] = useState(0);
  const { profile } = useProfile();

  const navigationItems = useMemo(
    () => [
      { title: "Dashboard", icon: Home, url: "/app/dashboard" },
      { title: "Debrief", icon: ClipboardList, url: "/app/debrief" },
      { title: "Trade History", icon: History, url: "/app/trade-history" },
      {
        title: "Trade Review",
        icon: Eye,
        url: "/app/trade-import/review",
        badge: count > 0 ? count : undefined
      },
      { title: "Behavior", icon: Brain, url: "/app/behavioral-patterns" },
      { title: "Strategy", icon: LineChart, url: "/app/strategy-optimization" },
      { title: "Feature Requests", icon: Lightbulb, url: "/app/feature-requests" },
    ],
    [count]
  );

  useEffect(() => {
    // Subscribe to the event when the component mounts
    const unsubscribe = subscribe('review_trades_refresh', (data: { tradeCount: number, refresh: ()=> void }) => {
      data.refresh();
      setCount(data.tradeCount);
    });

    // Cleanup function: Unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [subscribe]);

  const NavItem = ({
    title,
    icon: Icon,
    url,
    badge,
  }: {
    title: string;
    icon: React.ElementType;
    url: string;
    badge?: number;
  }) => (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to={url}
          className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors"
        >
          <Icon className="w-5 h-5" />
          <span>{title}</span>
          {badge !== undefined && (
            <Badge variant="secondary" className="ml-auto bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
              {badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const avatarUrl = profile?.avatar || "";
  const avatarFallback = profile?.avatar_backup || "NA";
  const fullName = profile?.full_name || "Anonymous";
  const email = profile?.email || "Not available";

  return (
    <ShadcnSidebar className="bg-background">
      <SidebarContent>
        {/* Branding */}
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2 text-md font-bold">
            <span className="sr-only">Debriefly</span>
            <BarChart2 className="w-6 h-6 text-primary" />
            <span className="text-grey-400">
              Debriefly
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link
                  to="/app/trade-import"
                  className="flex items-center gap-3 px-4 py-2 rounded-md bg-emerald-400 text-gray-800 hover:bg-emerald-500 transition-colors"
                >
                  <Import className="w-3.5 h-3.5" />
                  <span>Import Trades</span>
                </Link>
              </SidebarMenuItem>
              {navigationItems.map((item) => (
                <NavItem key={item.title} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: Select Account + Profile */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="list-none border-t px-4 py-3">
            <SelectAccount />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 border-t hover:bg-muted transition-colors rounded-md"
            >
              <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{fullName}</span>
                <span className="text-sm text-muted-foreground">{email}</span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export { AppSidebar };
