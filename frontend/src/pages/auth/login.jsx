import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";
import { AlertCircle } from "lucide-react";

function LoginPage({ onLogin }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: localStorage.getItem("rememberMe") === "true"
  });

  // Load saved credentials
  React.useEffect(() => {
    if (localStorage.getItem("rememberMe") === "true") {
      const savedEmail = localStorage.getItem("savedEmail");
      if (savedEmail) {
        setFormData(prev => ({
          ...prev,
          email: savedEmail
        }));
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Importar el servicio de autenticación dinámicamente
      const { authService } = await import("../../services/authService.js");
      
      // Intentar iniciar sesión
      const userData = await authService.login(formData.email, formData.password);
      
      // Guardar preferencias si "recordar sesión" está marcado
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
      }

      // Llamar a la función onLogin con los datos del usuario
      onLogin({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        id: userData.id
      });

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema"
      });
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      setError(error.message || "Usuario o contraseña incorrectos");
      toast({
        title: "Error de autenticación",
        description: error.message || "Usuario o contraseña incorrectos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img  
          className="absolute inset-0 w-full h-full object-cover"
          alt="Modern office with people working"
         src="https://images.unsplash.com/photo-1607615896122-6c919f897e55" />
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <img  
              alt="Company Logo"
              className="mx-auto h-16 w-auto mb-6"
              src="https://images.unsplash.com/photo-1485531865381-286666aa80a9" />
            <h2 className="text-2xl font-bold tracking-tight">
              Bienvenido al Sistema de Gestión de Calidad
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingrese sus credenciales para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 text-destructive rounded-lg p-3 flex items-center"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Usuario</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                  Recordar sesión
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⭮</span>
                  Iniciando sesión...
                </>
              ) : (
                "Ingresar al sistema"
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
