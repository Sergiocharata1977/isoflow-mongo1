// Definición de secciones para el menú principal
export const sections = [
  {
    id: 'noticias',
    title: 'Noticias',
    component: 'noticias/NoticiasListing',
    description: 'Gestión de Noticias',
    icon: 'file-text'
  },
  {
    id: 'calendario',
    title: 'Calendario',
    component: 'calendar/CalendarView',
    description: 'Gestión de Calendario',
    icon: 'calendar'
  },
  {
    id: 'chats',
    title: 'Chats',
    component: 'chat/ChatView',
    description: 'Gestión de Chats',
    icon: 'message-circle'
  },
  {
    id: 'encuestas',
    title: 'Encuestas',
    component: 'encuestas/EncuestasListing',
    description: 'Gestión de Encuestas',
    icon: 'clipboard-list'
  },
  {
    id: 'mejoras',
    title: 'Mejoras',
    component: 'mejoras/MejorasListing',
    description: 'Gestión de Mejoras',
    icon: 'arrow-up-circle'
  },
  {
    id: 'procesos',
    title: 'Procesos',
    component: 'procesos/ProcesosListing',
    description: 'Gestión de Procesos',
    icon: 'clipboard-list'
  },
  {
    id: 'notificaciones',
    title: 'Notificaciones',
    component: 'notifications/NotificationCenter',
    description: 'Gestión de Notificaciones',
    icon: 'bell'
  },
  {
    id: 'personal',
    title: 'Personal',
    component: 'personal/PersonalListing',
    description: 'Gestión de Personal',
    icon: 'users'
  },
  {
    id: 'rrhh',
    title: 'RRHH',
    component: 'rrhh/DepartamentosListing',
    description: 'Gestión de Recursos Humanos',
    icon: 'users'
  },
  {
    id: 'documentos',
    title: 'Documentos',
    component: 'documentos/DocumentosListing',
    description: 'Gestión de Documentos',
    icon: 'file-text'
  },
  {
    id: 'tickets',
    title: 'Tickets',
    component: 'tickets/TicketsListing',
    description: 'Gestión de Tickets',
    icon: 'ticket'
  },
  {
    id: 'usuarios',
    title: 'Usuarios',
    component: 'usuarios/UsuariosListing',
    description: 'Gestión de Usuarios',
    icon: 'users'
  }
  // Puedes agregar más secciones según necesites
];
