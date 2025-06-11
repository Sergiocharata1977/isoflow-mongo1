
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

function RegisterPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return;
    }
    // Aquí iría la lógica de registro
    toast({
      title: "Registrando usuario",
      description: "Procesando su registro..."
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Imagen a la izquierda */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Campo agrícola al atardecer"
         src="https://images.unsplash.com/photo-1511846859610-ea7712ac1c3d" />
      </div>

      {/* Formulario a la derecha */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <img 
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/8dbf3f66-6a64-4665-ae25-f32f332f4fba/cc9b1df2cd322a7d7fae6946d9b31b50.jpg"
              alt="SGC ISO 9001"
              className="mx-auto h-16 w-auto mb-6"
            />
            <h2 className="text-2xl font-bold tracking-tight">
              Crear una nueva cuenta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete el formulario para registrarse
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full"
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full">
              Registrarse
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tiene una cuenta?{" "}
              <a href="/login" className="font-medium text-primary hover:text-primary/90">
                Iniciar sesión
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterPage;
