
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthGuard from "@/components/AuthGuard";
import {LandingPage} from "./pages/Landing";
import { BlogPage } from "./pages/Blog";
import {ContactPage} from "./pages/Contact";
import {NotFoundPage} from "./pages/NotFound";
import {LoginPage} from "./pages/Login";
import { StrategyOptimizationPage } from "./pages/StrategyOptimization";
import {DashboardPage} from "./pages/Dashboard";
import { DebriefPage } from "./pages/Debrief";
import { TradeHistoryPage } from "./pages/TradeHistory";
import { BehaviorialPatternsPage } from "./pages/BehaviorialPatterns";
import { SettingsPage } from "./pages/Settings";
import { TradeImportPage } from "./pages/TradeImport";
import Sidebar from "./components/Sidebar";
import { Header } from "./components/Header";
import { NotebookPage } from "./pages/Notebook";
import TradeSidebar from "./features/notebook/components/TradeSidebar";
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
                  <LandingPage />
                </NavbarLayout>
              } />
              <Route path="/blog" element={
                <NavbarLayout>
                  <BlogPage />
                </NavbarLayout>
              } />
              <Route path="/contact" element={
                <NavbarLayout>
                  <ContactPage />
                </NavbarLayout>
              } />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected routes */}
              <Route element={<AuthGuard />}>
                <Route path="/app/dashboard" element={
                  <SidebarLayout>
                    <DashboardPage />
                  </SidebarLayout>
                } />
                <Route path="/app/debrief" element={
                  <SidebarLayout>
                    <DebriefPage />
                  </SidebarLayout>
                } />
                <Route path="/app/trade-history" element={
                  <SidebarLayout>
                    <TradeHistoryPage />
                  </SidebarLayout>
                } />
                <Route path="/app/strategy-optimization" element={
                  <SidebarLayout>
                    <StrategyOptimizationPage />
                  </SidebarLayout>
                } />
                <Route path="/app/behavioral-patterns" element={
                  <SidebarLayout>
                    <BehaviorialPatternsPage />
                  </SidebarLayout>
                } />
                <Route path="/settings" element={
                  <SidebarLayout>
                    <SettingsPage />
                  </SidebarLayout>
                } />
                <Route path="/app/trade-import" element={
                  <SidebarLayout>
                    <TradeImportPage />
                  </SidebarLayout>
                } />
                <Route path="/app/notebook" element={
                  <NotebookLayout>
                    <NotebookPage />
                  </NotebookLayout>
                } />
                <Route path="/dev/edge-functions" element={<EdgeFunctions />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
