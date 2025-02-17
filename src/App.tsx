
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthGuard from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import StrategyOptimization from "./pages/StrategyOptimization";
import Dashboard from "./pages/Dashboard";
import Debrief from "./pages/Debrief";
import Trades from "./pages/Trades";
import BehaviorialPatterns from "./pages/BehaviorialPatterns";
import Settings from "./pages/Settings";
import TradeEntry from "./pages/TradeEntry";
import Sidebar from "./components/Sidebar";
import Navigation from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => {
  const isAuthPage = window.location.pathname === "/login";
  const isLandingPage = ["/", "/blog", "/contact", "/pricing"].includes(
    window.location.pathname
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              {!isAuthPage && !isLandingPage && <Sidebar />}
              <main className="flex-1">
                {isLandingPage && <Navigation />}
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected routes */}
                  <Route element={<AuthGuard />}>
                    <Route path="/app/dashboard" element={<Dashboard />} />
                    <Route path="/app/debrief" element={<Debrief />} />
                    <Route path="/app/trades" element={<Trades />} />
                    <Route path="/app/strategy-optimization" element={<StrategyOptimization />} />
                    <Route path="/app/behavioral-patterns" element={<BehaviorialPatterns />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/app/trade-entry" element={<TradeEntry />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
