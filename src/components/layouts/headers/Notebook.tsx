"use client"

import * as React from "react"
import {

  CornerUpLeft,
  LineChart,
  MoreHorizontal,
  Settings2,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = [
  [
    {
      label: "Share Entry",
      icon: Settings2,
    },
  ],
  [
    {
      label: "Raw Executions",
      icon: Settings2,
    },
    {
      label: "Trade Details",
      icon: Settings2,
    },
  ],
  [
    {
      label: "Analyze Trade",
      icon: CornerUpLeft,
    },
    {
      label: "View Trade Analysis",
      icon: LineChart,
    },
  ],
]

export const NotebookHeader = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="ml-auto px-3">
      <div className="flex items-center gap-2 text-sm">
        <div className="hidden font-medium text-muted-foreground md:inline-block">
          Edited Oct 08
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Star />
        </Button>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 data-[state=open]:bg-accent"
            >
              <MoreHorizontal />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 overflow-hidden border border-gray-700 rounded-lg p-0 bg-gray-900"
            align="end"
          >
            <Sidebar collapsible="none" className="bg-transparent">
              <SidebarContent>
                {data.map((group, index) => (
                  <SidebarGroup key={index} className="border-b last:border-none">
                    <SidebarGroupContent className="gap-0">
                      <SidebarMenu>
                        {group.map((item, index) => (
                          <SidebarMenuItem key={index}>
                            <SidebarMenuButton>
                              <item.icon /> <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                ))}
              </SidebarContent>
            </Sidebar>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
