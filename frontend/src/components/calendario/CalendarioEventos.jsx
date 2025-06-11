import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import esLocale from '@fullcalendar/core/locales/es';
import { toast } from "sonner";

const TIPOS_EVENTO = {
  MEJORA: { title: 'Mejora', color: '#0ea5e9' },
  AUDITORIA: { title: 'Auditoría', color: '#f97316' }
};

export default function CalendarioEventos() {
  const calendarRef = React.useRef(null);
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Auditoría de Procesos',
      start: '2025-05-15',
      end: '2025-05-15',
      tipo: 'AUDITORIA',
      backgroundColor: TIPOS_EVENTO.AUDITORIA.color,
      extendedProps: {
        descripcion: 'Auditoría interna de procesos',
        mejora_id: null
      }
    },
    {
      id: '2',
      title: 'Revisión de Mejora #123',
      start: '2025-05-20',
      end: '2025-05-20',
      tipo: 'MEJORA',
      backgroundColor: TIPOS_EVENTO.MEJORA.color,
      extendedProps: {
        descripcion: 'Seguimiento de la mejora implementada',
        mejora_id: '123'
      }
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    tipo: 'MEJORA',
    descripcion: '',
    mejora_id: null
  });

  const handleDateSelect = (selectInfo) => {
    setNewEvent({
      title: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      tipo: 'MEJORA'
    });
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setNewEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      tipo: clickInfo.event.extendedProps.tipo
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    try {
      const eventToSave = {
        id: selectedEvent ? selectedEvent.id : Date.now().toString(),
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        tipo: newEvent.tipo,
        backgroundColor: TIPOS_EVENTO[newEvent.tipo].color,
        extendedProps: {
          descripcion: newEvent.descripcion || '',
          mejora_id: newEvent.mejora_id
        }
      };

      if (selectedEvent) {
        // Actualizar evento existente
        setEvents(events.map(event => 
          event.id === eventToSave.id ? eventToSave : event
        ));
        toast.success('Evento actualizado correctamente');
      } else {
        // Crear nuevo evento
        setEvents([...events, eventToSave]);
        toast.success('Evento creado correctamente');
      }
    } catch (error) {
      console.error('Error al guardar evento:', error);
      toast.error('Error al guardar el evento');
      return;
    }

    setIsModalOpen(false);
    setSelectedEvent(null);
    setNewEvent({ title: '', start: '', end: '', tipo: 'MEJORA' });
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      try {
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        toast.success('Evento eliminado correctamente');
        setIsModalOpen(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        toast.error('Error al eliminar el evento');
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-end items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.today();
            }}
          >
            Hoy
          </Button>
          <div className="border-l h-6 mx-2" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.prev();
            }}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.next();
            }}
          >
            Siguiente
          </Button>
          <div className="border-l h-6 mx-2" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.changeView('dayGridMonth');
            }}
          >
            Mes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.changeView('timeGridWeek');
            }}
          >
            Semana
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.changeView('timeGridDay');
            }}
          >
            Día
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Calendario de Eventos</h2>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TIPOS_EVENTO.MEJORA.color }} />
              <span className="text-sm">Mejoras</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TIPOS_EVENTO.AUDITORIA.color }} />
              <span className="text-sm">Auditorías</span>
            </div>
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: '',
            center: 'title',
            right: ''
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          locale={esLocale}
          height="auto"
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent ? 'Editar Evento' : 'Nuevo Evento'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Título del evento"
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  value={newEvent.descripcion}
                  onChange={(e) => setNewEvent({ ...newEvent, descripcion: e.target.value })}
                  placeholder="Descripción del evento"
                />
              </div>
              <div className="space-y-2">
                <Label>ID de Mejora Relacionada (opcional)</Label>
                <Input
                  value={newEvent.mejora_id || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, mejora_id: e.target.value || null })}
                  placeholder="ID de la mejora relacionada"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Evento</Label>
                <Select
                  value={newEvent.tipo}
                  onValueChange={(value) => setNewEvent({ ...newEvent, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEJORA">Mejora</SelectItem>
                    <SelectItem value="AUDITORIA">Auditoría</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha Inicio</Label>
                  <Input
                    type="date"
                    value={newEvent.start.split('T')[0]}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Fin</Label>
                  <Input
                    type="date"
                    value={newEvent.end.split('T')[0]}
                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              {selectedEvent && (
                <Button variant="destructive" onClick={handleDeleteEvent}>
                  Eliminar
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEvent}>
                  {selectedEvent ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
