import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../theme/ThemeToggle";
import { LogOut, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function TopHeader() {
  const { currentUser, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-green-600/10 backdrop-blur-sm z-50 border-b h-12">
      <div className="flex justify-between items-center px-2 sm:px-4 py-1 sm:py-2 min-h-[48px]">
        {/* Logo o ThemeToggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
        </div>

        {/* Usuario y logout */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-2 border-r pr-2 sm:pr-4 max-w-[120px] sm:max-w-none overflow-hidden">
            <span className="hidden xs:inline text-xs sm:text-sm font-medium truncate">
              {currentUser?.displayName || currentUser?.email || 'Usuario'}
            </span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-1 sm:p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cierre de sesión</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que deseas cerrar sesión?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowLogoutConfirm(false);
                handleLogout();
              }}
            >
              Cerrar Sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
