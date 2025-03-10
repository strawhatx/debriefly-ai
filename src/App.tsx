
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthGuard from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import { Blog } from "./pages/Blog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { StrategyOptimization } from "./pages/StrategyOptimization";
import Dashboard from "./pages/Dashboard";
import { Debrief } from "./pages/Debrief";
import { TradeHistory } from "./pages/TradeHistory";
import { BehaviorialPatterns } from "./pages/BehaviorialPatterns";
import Settings from "./pages/Settings";
import TradeImport from "./pages/TradeImport";
import Sidebar from "./components/Sidebar";
import { Header } from "./components/Header";
import { Notebook } from "./pages/Notebook";
import TradeSidebar from "./components/notebook/TradeSidebar";
import { EdgeFunctions } from "./pages/EdgeFunctions";

const queryClient = new QueryClient();

const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <main className="flex-1">
        <Header />
        {children}
      </main>
    </div>
  )
}

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

const NotebookLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <TradeSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>

            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <NavbarLayout>
                  <Index />
                </NavbarLayout>
              } />
              <Route path="/blog" element={
                <NavbarLayout>
                  <Blog />
                </NavbarLayout>
              } />
              <Route path="/contact" element={
                <NavbarLayout>
                  <Contact />
                </NavbarLayout>
              } />
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route element={<AuthGuard />}>
                <Route path="/app/dashboard" element={
                  <SidebarLayout>
                    <Dashboard />
                  </SidebarLayout>
                } />
                <Route path="/app/debrief" element={
                  <SidebarLayout>
                    <Debrief />
                  </SidebarLayout>
                } />
                <Route path="/app/trade-history" element={
                  <SidebarLayout>
                    <TradeHistory />
                  </SidebarLayout>
                } />
                <Route path="/app/strategy-optimization" element={
                  <SidebarLayout>
                    <StrategyOptimization />
                  </SidebarLayout>
                } />
                <Route path="/app/behavioral-patterns" element={
                  <SidebarLayout>
                    <BehaviorialPatterns />
                  </SidebarLayout>
                } />
                <Route path="/settings" element={
                  <SidebarLayout>
                    <Settings />
                  </SidebarLayout>
                } />
                <Route path="/app/trade-import" element={
                  <SidebarLayout>
                    <TradeImport />
                  </SidebarLayout>
                } />
                <Route path="/app/notebook" element={
                  <NotebookLayout>
                    <Notebook />
                  </NotebookLayout>
                } />
                <Route path="/dev/edge-functions" element={<EdgeFunctions />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
