
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  ClipboardCheck,
  GraduationCap,
  Award,
  ArrowUpCircle
} from "lucide-react";

function CalendarView() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      
      // Cargar auditorías
      const savedAuditorias = localStorage.getItem("auditorias");
      const auditorias = savedAuditorias ? JSON.parse(savedAuditorias) : [];
      
      // Cargar capacitaciones
      const savedCapacitaciones = localStorage.getItem("capacitaciones");
      const capacitaciones = savedCapacitaciones ? JSON.parse(savedCapacitaciones) : [];
      
      // Cargar evaluaciones
      const savedEvaluaciones = localStorage.getItem("evaluaciones");
      const evaluaciones = savedEvaluaciones ? JSON.parse(savedEvaluaciones) : [];
      
      // Cargar mejoras
      const savedMejoras = localStorage.getItem("mejoras");
      const mejoras = savedMejoras ? JSON.parse(savedMejoras) : [];

      // Convertir a eventos del calendario
      const calendarEvents = [
        // Auditorías
        ...auditorias.map(auditoria => ({
          id: `auditoria-${auditoria.id}`,
          title: `Auditoría: ${auditoria.procesos_evaluar}`,
          start: auditoria.fecha_programada,
          end: auditoria.fecha_programada,
          backgroundColor: '#3b82f6', // blue-500
          borderColor: '#3b82f6',
          textColor: '#ffffff',
          extendedProps: {
            type: 'auditoria',
            description: auditoria.objetivo,
            icon: ClipboardCheck
          }
        })),

        // Capacitaciones
        ...capacitaciones.map(capacitacion => ({
          id: `capacitacion-${capacitacion.id}`,
          title: `Capacitación: ${capacitacion.titulo}`,
          start: capacitacion.fecha,
          end: capacitacion.fecha,
          backgroundColor: '#10b981', // emerald-500
          borderColor: '#10b981',
          textColor: '#ffffff',
          extendedProps: {
            type: 'capacitacion',
            description: capacitacion.descripcion,
            icon: GraduationCap
          }
        })),

        // Evaluaciones
        ...evaluaciones.map(evaluacion => ({
          id: `evaluacion-${evaluacion.id}`,
          title: `Evaluación: ${evaluacion.empleado}`,
          start: evaluacion.fecha,
          end: evaluacion.fecha,
          backgroundColor: '#8b5cf6', // violet-500
          borderColor: '#8b5cf6',
          textColor: '#ffffff',
          extendedProps: {
            type: 'evaluacion',
            description: `Evaluación de ${evaluacion.empleado}`,
            icon: Award
          }
        })),

        // Mejoras
        ...mejoras
          .filter(mejora => mejora.fecha_compromiso_correccion)
          .map(mejora => ({
            id: `mejora-${mejora.id}`,
            title: `Acción de Mejora: ${mejora.descripcion.substring(0, 30)}...`,
            start: mejora.fecha_compromiso_correccion,
            end: mejora.fecha_compromiso_correccion,
            backgroundColor: '#ef4444', // red-500
            borderColor: '#ef4444',
            textColor: '#ffffff',
            extendedProps: {
              type: 'mejora',
              description: mejora.descripcion,
              icon: ArrowUpCircle
            }
          }))
      ];

      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error loading calendar events:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos del calendario",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    toast({
      title: event.title,
      description: event.extendedProps.description,
      duration: 5000
    });
  };

  const renderEventContent = (eventInfo) => {
    const Icon = eventInfo.event.extendedProps.icon;
    return (
      <div className="flex items-center space-x-2 p-1">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{eventInfo.event.title}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Calendario de Eventos</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">Auditorías</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm">Capacitaciones</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-violet-500"></div>
            <span className="text-sm">Evaluaciones</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Mejoras</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          locale="es"
          height="auto"
          firstDay={1}
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
          }}
        />
      </motion.div>
    </div>
  );
}

export default CalendarView;
