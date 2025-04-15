import React from "react";
import { BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { BreadcrumbItem, BreadcrumbList, BreadcrumbLink, Breadcrumb } from "../ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../ui/sidebar";
import { Header } from "../Header";
import { Separator } from "../ui/separator";
import { AppSidebar } from "../sidebar/AppSidebar";
import { NotebookSidebar } from "../sidebar/NotebookSidebar";


// Plain Layout
export const PlainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// Navbar Layout
export const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <main className="flex-1">
        <Header />
        {children}
      </main>
    </div>
  );
};

// Sidebar Layout
interface BreadcrumbItem {
  name: string;
  href: string;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  rightContent?: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

export const SidebarLayout = ({ children, breadcrumbs = [], rightContent }: SidebarLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          {/* Breadcrumbs on the Left */}
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {breadcrumbs.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((item, index) => (
                    <BreadcrumbItem key={item.href} className={index === breadcrumbs.length - 1 ? "font-semibold" : ""}>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{item.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                      )}
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>


          {/* Right Side Custom Content */}
          {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};


export const DoubleLayout = ({ children, breadcrumbs = [], rightContent, rightSidebar }: SidebarLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          {/* Breadcrumbs on the Left */}
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {breadcrumbs.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((item, index) => (
                    <BreadcrumbItem key={item.href} className={index === breadcrumbs.length - 1 ? "font-semibold" : ""}>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{item.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                      )}
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>


          {/* Right Side Custom Content */}
          {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
        </header>

        {/* Main Content */}
        <div className="flex flex-row">
           <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
          
          </div>  
        {rightSidebar}
        </div>
       
      </SidebarInset> 
    
    </SidebarProvider>
  );
};

