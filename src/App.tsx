
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";
import { LandingPage } from "./pages/Landing";
import { BlogPage } from "./pages/Blog";
import { ContactPage } from "./pages/Contact";
import { NotFoundPage } from "./pages/NotFound";
import { LoginPage } from "./pages/Login";
import { StrategyPage } from "./pages/Strategy";
import { DashboardPage } from "./pages/Dashboard";
import { DebriefPage } from "./pages/Debrief";
import { TradeHistoryPage } from "./pages/TradeHistory";
import { BehaviorPage } from "./pages/Behavior";
import { SettingsPage } from "./pages/Settings";
import { TradeImportPage } from "./pages/TradeImport";
import { EdgeFunctions } from "./pages/dev-pages/EdgeFunctions";
import { DoubleLayout, PlainLayout, SidebarLayout } from "./components/layouts/Index";
import { NavbarLayout } from "./components/layouts/Index";
import { SignOutButton } from "./features/settings/components/SignOutButton";
import { DateRangeHeader } from "./components/layouts/headers/DateRange";
import { TradeHistoryHeader } from "./components/layouts/headers/TradeHistory";
import { DebriefHeader } from "./components/layouts/headers/Debrief";
import { DashboardHeader } from "./components/layouts/headers/Dashboard";
import { TradeHistoryGenerator } from "./pages/dev-pages/TradeHistoryGenerator";
import { ReviewPage } from "./pages/Review";
import { ReviewHeader } from "./components/layouts/headers/Review";
import { PositionReviewGenerator } from "./pages/dev-pages/PositionReviewGenerator";
const queryClient = new QueryClient();

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="/login" element={ <LoginPage /> } />

            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route path="/app/dashboard" element={
                <SidebarLayout
                  breadcrumbs={[{ name: "Trading Dashboard", href: "/app/dashboard" }]}
                  rightContent={<DashboardHeader />}
                >
                  <DashboardPage />
                </SidebarLayout>
              } />
              <Route path="/app/debrief" element={
                <SidebarLayout breadcrumbs={[{ name: "Debrief", href: "/app/debrief" }]}
                  rightContent={<DebriefHeader />}
                >
                  <DebriefPage />
                </SidebarLayout>
              } />
              <Route path="/app/trade-history" element={
                <SidebarLayout
                  breadcrumbs={[{ name: "Trade History", href: "/app/trade-history" }]}
                  rightContent={<TradeHistoryHeader />}
                >
                  <TradeHistoryPage />
                </SidebarLayout>
              } />
              <Route path="/app/strategy-optimization" element={
                <SidebarLayout
                  breadcrumbs={[{ name: "Strategy Optimization", href: "/app/strategy-optimization" }]}
                  rightContent={<DateRangeHeader />}
                >
                  <StrategyPage />
                </SidebarLayout>
              } />
              <Route path="/app/behavioral-patterns" element={
                <SidebarLayout
                  breadcrumbs={[{ name: "Behavior Analysis", href: "/app/behavioral-patterns" }]}
                  rightContent={<DateRangeHeader />}
                >
                  <BehaviorPage />
                </SidebarLayout>
              } />
              <Route path="/settings" element={
                <SidebarLayout
                  breadcrumbs={[{ name: "Settings", href: "/app/settings" }]}
                  rightContent={<SignOutButton />}
                >
                  <SettingsPage />
                </SidebarLayout>
              } />
              <Route path="/app/trade-import" element={
                <SidebarLayout breadcrumbs={[{ name: "Trade Import", href: "/app/trade-import" }]}>
                  <TradeImportPage />
                </SidebarLayout>
              } />
              <Route path="/app/trade-import/review" element={
                <SidebarLayout
                  breadcrumbs={[
                    { name: "Trade Import", href: "/app/trade-import" },
                    { name: "Review", href: "/app/trade-import/review" }]}
                  rightContent={<ReviewHeader />}>
                  <ReviewPage />
                </SidebarLayout>
              } />
              {/* <Route path="/app/notebook/:id" element={<NotebookWithSidebar />} />*/}
              <Route path="/dev/edge-functions" element={<EdgeFunctions />} />
              <Route path="/dev/trade-history-generator" element={<TradeHistoryGenerator />} />
              <Route path="/dev/position-review-generator" element={<PositionReviewGenerator />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
