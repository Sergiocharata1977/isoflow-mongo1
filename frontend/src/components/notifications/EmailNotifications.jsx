
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Bell, Settings } from "lucide-react";

function EmailNotifications() {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState(() => {
    const saved = localStorage.getItem("email_notification_settings");
    return saved ? JSON.parse(saved) : {
      email: "",
      notifications: {
        tasks: true,
        nonConformities: true,
        documents: true,
        deadlines: true
      }
    };
  });

  const handleSave = () => {
    try {
      localStorage.setItem("email_notification_settings", JSON.stringify(settings));
      toast({
        title: "Configuración guardada",
        description: "Las preferencias de notificaciones han sido actualizadas"
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Bell className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Notificaciones por Correo</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            placeholder="tu@email.com"
          />
        </div>

        <div className="space-y-4">
          <Label>Notificarme cuando:</Label>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tasks"
                checked={settings.notifications.tasks}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      tasks: checked
                    }
                  })
                }
              />
              <label
                htmlFor="tasks"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se me asigne una tarea
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="nonConformities"
                checked={settings.notifications.nonConformities}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      nonConformities: checked
                    }
                  })
                }
              />
              <label
                htmlFor="nonConformities"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se genere una no conformidad
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="documents"
                checked={settings.notifications.documents}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      documents: checked
                    }
                  })
                }
              />
              <label
                htmlFor="documents"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se comente un documento
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="deadlines"
                checked={settings.notifications.deadlines}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      deadlines: checked
                    }
                  })
                }
              />
              <label
                htmlFor="deadlines"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se acerque una fecha límite
              </label>
            </div>
          </div>
        </div>

        <Button onClick={handleSave}>
          <Settings className="mr-2 h-4 w-4" />
          Guardar Preferencias
        </Button>
      </div>
    </div>
  );
}

export default EmailNotifications;
