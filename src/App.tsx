import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "./store";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.jsx";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AuditLayer from "./pages/AuditLayer";
import NotFound from "./pages/NotFound";

const App = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/login/" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/chat/:sessionId" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/audit-layer" element={
                <ProtectedRoute>
                  <AuditLayer />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>
);

export default App;
