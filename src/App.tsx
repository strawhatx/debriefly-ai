
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
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Trades from "./pages/Trades";
import Insights from "./pages/Insights";
import Replay from "./pages/Replay";
import Settings from "./pages/Settings";
import ImportTrades from "./pages/ImportTrades";
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
                  <Route path="/pricing" element={<Pricing />} />
                  
                  {/* Protected routes */}
                  <Route element={<AuthGuard />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/trades" element={<Trades />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/replay" element={<Replay />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/import" element={<ImportTrades />} />
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
