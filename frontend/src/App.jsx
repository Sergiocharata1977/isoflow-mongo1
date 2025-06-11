import React from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MongoProvider } from "@/context/MongoContext";
import AppRoutes from "@/routes/AppRoutes";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
      <ThemeProvider>
        <MongoProvider>
          <AuthProvider>
              <div className="min-h-screen bg-background text-foreground">
                <AppRoutes />
                {/* AssistantButton removed */}
                <Toaster />
                <SonnerToaster position="top-right" richColors closeButton />
              </div>
          </AuthProvider>
        </MongoProvider>
      </ThemeProvider>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
