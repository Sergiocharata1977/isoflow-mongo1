
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, User, LogOut } from "lucide-react";

function UserHeader({ user, onLogout }) {
  // Si no hay usuario, no renderizamos nada
  if (!user) return null;
  
  // Obtener las iniciales del nombre para el avatar
  const getInitials = () => {
    if (!user.name) return user.email?.charAt(0).toUpperCase() || '?';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-2 flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 min-w-[120px]">
              <Avatar className="h-8 w-8 bg-primary">
                {/* Usar la URL de avatar si existe, o mostrar iniciales */}
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name || user.email} />
                ) : (
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                )}
              </Avatar>
              <span className="font-medium">{user.name || user.email}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              {user.role && (
                <span className="block text-xs text-muted-foreground mt-1">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </div>
  );
}

export default UserHeader;
