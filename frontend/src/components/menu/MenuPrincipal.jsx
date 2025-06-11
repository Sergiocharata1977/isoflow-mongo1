import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import TopHeader from "../layout/TopHeader";
import ThemeToggle from "../theme/ThemeToggle";
import {
  ClipboardList,
  FileText,
  Users,
  BarChart2,
  Calendar,
  Bell,
  BookOpen,
  FileCheck,
  Settings,
  Building2,
  Briefcase,
  Target,
  Activity,
  LineChart,
  Clipboard,
  UserCheck,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  ClipboardCheck,
  MessageSquare,
  BarChart,
  ArrowUpCircle,
  Package,
  LogOut,
  Bot,
  Sparkles,
} from "lucide-react";

// Importar componentes de dropdown
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Importar directamente nuestros componentes
import PersonalListing from "../personal/PersonalListing";
import AuditoriasList from "../auditorias/AuditoriasList";
import NormasList from "../normas/NormasList";
import DocumentosList from "../documentos/DocumentosList";
import SectionPlaceholder from "../common/SectionPlaceholder";
import UsuariosListing from "../usuarios/UsuariosListing";
import ProcesosListing from "../procesos/ProcesosListing";
import ObjetivosListing from "../procesos/ObjetivosListing";
import IndicadoresListing from "../procesos/IndicadoresListing";
import MedicionesListing from "../procesos/MedicionesListing";
import DepartamentosListing from "../rrhh/DepartamentosListing";
import PuestosListing from "../rrhh/PuestosListing";
import CapacitacionesListing from "../rrhh/CapacitacionesListing";
import EvaluacionesListing from "../rrhh/EvaluacionesListing";
import TicketsListing from "../tickets/TicketsListing";
import EncuestasListing from "../encuestas/EncuestasListing";
import MejorasListing from "../mejoras/MejorasListing";
import NoticiasListing from "../noticias/NoticiasListing";
import ProductosListing from "../productos/ProductosListing";
import UserHeader from "../auth/UserHeader";
import DashboardCentral from "../dashboard/DashboardCentral";
import CalendarioEventos from "../calendario/CalendarioEventos";
import Noticias from "../noticias/Noticias";
import ObjetivosCalidadPage from "@/pages/ObjetivosCalidadPage";

const MenuPrincipal = () => {
  const { isDark } = useTheme();
  const [selectedSection, setSelectedSection] = useState("noticias");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleSectionChange = (id) => {
    setSelectedSection(id);
    setDrawerOpen(false); // Cierra el drawer al seleccionar en mobile
  };

  const renderSection = () => {
    if (!selectedSection) {
      return (
        <div className="flex items-center justify-center h-full">
          <h2 className="text-xl font-semibold text-gray-700">
            Seleccione una opción del menú
          </h2>
        </div>
      );
    }

    // Renderizar componentes directamente
    switch (selectedSection) {
      case "noticias":
        return <Noticias />;
      case "tablero":
        return <DashboardCentral />;
      case "personal":
        return <PersonalListing />;
      case "auditorias":
        return <AuditoriasList />;
      case "normas":
        return <NormasList />;
      case "documentos":
        return <DocumentosList />;
      case "usuarios":
        return <UsuariosListing />;
      case "procesos":
        return <ProcesosListing />;
      case "objetivos":
        return <ObjetivosCalidadPage />;
      case "indicadores":
        return <IndicadoresListing />;
      case "mediciones":
        return <MedicionesListing />;
      case "departamentos":
        return <DepartamentosListing />;
      case "puestos":
        return <PuestosListing />;
      case "capacitaciones":
        return <CapacitacionesListing />;
      case "evaluaciones":
        return <EvaluacionesListing />;
      case "tickets":
        return <TicketsListing />;
      case "encuestas":
        return <EncuestasListing />;
      case "mejoras":
        return <MejorasListing />;
      case "productos":
        return <ProductosListing />;
      case "calendario":
        return <CalendarioEventos />;
      default:
        return <SectionPlaceholder sectionName={selectedSection} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} pt-12`}>
      <TopHeader />
      {/* Botón hamburguesa sólo visible en mobile */}
      <button
        className="md:hidden fixed top-2 left-2 z-50 p-2 rounded bg-green-600 text-white shadow-lg focus:outline-none"
        onClick={() => setDrawerOpen(true)}
        aria-label="Abrir menú"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex h-[calc(100vh-48px)]">
        {/* Sidebar - Menú lateral desktop */}
        <div className="hidden md:block w-64 flex-shrink-0 bg-gray-900 text-white overflow-y-auto">
          <div className="p-4 flex items-center space-x-3">
            <div className="rounded-full bg-white text-green-800 w-10 h-10 flex items-center justify-center font-bold">
              SGC
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">Los Señores del Agro</div>
              <div className="text-xs opacity-80">Sistema de Gestión de Calidad</div>
            </div>
          </div>

          <nav className="space-y-4">
            {/* Opciones de menú individuales */}
            <div className="space-y-1">
              <button
                onClick={() => handleSectionChange("noticias")}
                className={`flex items-center w-full px-4 py-2 text-left ${
                  selectedSection === "noticias"
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Bell className="h-5 w-5 mr-2" />
                <span>Noticias</span>
              </button>

              <button
                onClick={() => handleSectionChange("tablero")}
                className={`flex items-center w-full px-4 py-2 text-left ${
                  selectedSection === "tablero"
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <BarChart2 className="h-5 w-5 mr-2" />
                <span>Tablero Central</span>
              </button>

              <button
                onClick={() => handleSectionChange("calendario")}
                className={`flex items-center w-full px-4 py-2 text-left ${
                  selectedSection === "calendario"
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Calendar className="h-5 w-5 mr-2" />
                <span>Calendario</span>
              </button>

              {/* Botón de Mejoras independiente */}
              <button
                onClick={() => handleSectionChange("mejoras")}
                className={`flex items-center w-full px-4 py-2 text-left ${
                  selectedSection === "mejoras"
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <ArrowUpCircle className="h-5 w-5 mr-2" />
                <span>Mejoras</span>
              </button>

              {/* Botón de Auditorías independiente */}
              <button
                onClick={() => handleSectionChange("auditorias")}
                className={`flex items-center w-full px-4 py-2 text-left ${
                  selectedSection === "auditorias"
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <ClipboardList className="h-5 w-5 mr-2" />
                <span>Auditorías</span>
              </button>

            {/* Recursos Humanos */}
            <div className="mt-2 px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
              Recursos Humanos
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center w-full px-4 py-2 text-left ${
                    [
                      "personal",
                      "departamentos",
                      "puestos",
                      "capacitaciones",
                      "evaluaciones",
                    ].includes(selectedSection)
                      ? "bg-green-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  <span>Recursos Humanos</span>
                  <ChevronDown className="ml-auto h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className={`min-w-[220px] ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}
              >
                <DropdownMenuItem
                  onClick={() => handleSectionChange("personal")}
                  className={isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}
                >
                  <Users className="h-5 w-5 mr-3" />
                  <span>Personal</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSectionChange("departamentos")}
                  className={isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}
                >
                  <Building2 className="h-5 w-5 mr-3" />
                  <span>Departamentos</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSectionChange("puestos")}
                  className={isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  <span>Puestos</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSectionChange("capacitaciones")}
                  className={isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}
                >
                  <GraduationCap className="h-5 w-5 mr-3" />
                  <span>Capacitaciones</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSectionChange("evaluaciones")}
                  className={isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}
                >
                  <ClipboardCheck className="h-5 w-5 mr-3" />
                  <span>Evaluaciones</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Procesos - Ahora con dropdown */}
            <div className="mt-2 px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
              Sistema de Gestión
            </div>

            {/* Objetivos de Calidad */}
            <button
              onClick={() => handleSectionChange("objetivos")}
              className={`flex items-center w-full px-4 py-2 text-left ${
                selectedSection === "objetivos"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Target className="h-5 w-5 mr-2" />
              <span>Objetivos de Calidad</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center w-full px-4 py-2 text-left ${
                    [
                      "procesos",
                      "objetivos",
                      "indicadores",
                      "mediciones",
                      "mejoras",
                    ].includes(selectedSection)
                      ? "bg-green-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Activity className="h-5 w-5 mr-2" />
                  <span>Procesos</span>
                  <ChevronDown className="ml-auto h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className={`min-w-[220px] ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}
              >
                <DropdownMenuItem 
                  onClick={() => handleSectionChange("procesos")}
                  className={isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}
                >
                  <Activity className="h-5 w-5 mr-3" />
                  <span>Procesos</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleSectionChange("objetivos")}
                  className={isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}
                >
                  <Target className="h-5 w-5 mr-3" />
                  <span>Objetivos</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSectionChange("indicadores")}
                  className={isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}
                >
                  <LineChart className="h-5 w-5 mr-3" />
                  <span>Indicadores</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSectionChange("mediciones")}
                  className={isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}
                >
                  <BarChart2 className="h-5 w-5 mr-3" />
                  <span>Mediciones</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => handleSectionChange("documentos")}
              className={`flex items-center w-full px-4 py-2 text-left ${
                selectedSection === "documentos"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              <span>Documentos</span>
            </button>

            <button
              onClick={() => handleSectionChange("normas")}
              className={`flex items-center w-full px-4 py-2 text-left ${
                selectedSection === "normas"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              <span>Puntos de Norma</span>
            </button>

            {/* Planificación y Desarrollo de Productos */}
            <div className="mt-2 px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
              Planificación y Desarrollo de Productos
            </div>

            <button
              onClick={() => handleSectionChange("productos")}
              className={`flex items-center w-full px-4 py-2 text-left ${
                selectedSection === "productos"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Package className="h-5 w-5 mr-2" />
              <span>Productos</span>
            </button>

            {/* Satisfacción */}
            <div className="mt-2 px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
              Satisfacción
            </div>

            <button
              onClick={() => handleSectionChange("tickets")}
              className={`flex items-center w-full px-4 py-2 text-left ${
                selectedSection === "tickets"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span>Tickets</span>
            </button>

            <button
              onClick={() => handleSectionChange("encuestas")}
              className={`flex items-center w-full px-4 py-2 text-left ${
                selectedSection === "encuestas"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <BarChart className="h-5 w-5 mr-2" />
              <span>Encuestas</span>
            </button>

            {/* Administración */}
            <div className="mt-2 px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
              Administración
            </div>

            <button
              onClick={() => handleSectionChange("usuarios")}
              className={`flex items-center w-full px-4 py-2 text-left ${
                selectedSection === "usuarios"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <UserCheck className="h-5 w-5 mr-2" />
              <span>Usuarios</span>
            </button>

            <button
              onClick={() => handleSectionChange("configuracion")}
              className={`flex items-center w-full px-4 py-2 text-left ${
                selectedSection === "configuracion"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              <span>Configuración</span>
            </button>
            </div>
          </nav>
        </div>

        {/* Drawer lateral mobile */}
        {drawerOpen && (
          <div className="fixed inset-0 z-40 flex">
            {/* Fondo oscuro para cerrar el drawer */}
            <div
              className="fixed inset-0 bg-black bg-opacity-40"
              onClick={() => setDrawerOpen(false)}
              aria-label="Cerrar menú"
            ></div>
            <div className="relative w-64 max-w-full h-full bg-gray-900 text-white shadow-xl animate-slide-in-left">
              <button
                className="absolute top-2 right-2 p-2 rounded-full bg-green-700 text-white focus:outline-none"
                onClick={() => setDrawerOpen(false)}
                aria-label="Cerrar menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Contenido del menú (copiado del sidebar) */}
              <div className="p-4 flex items-center space-x-3">
                <div className="rounded-full bg-white text-green-800 w-10 h-10 flex items-center justify-center font-bold">
                  SGC
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">Los Señores del Agro</div>
                  <div className="text-xs opacity-80">Sistema de Gestión de Calidad</div>
                </div>
              </div>
              <nav className="space-y-4 overflow-y-auto h-[calc(100vh-64px)] pb-8">
  <div className="space-y-1">
    {/* --- Botones de menú (idénticos al sidebar desktop) --- */}
    <button
      onClick={() => handleSectionChange("noticias")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "noticias"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <Bell className="h-5 w-5 mr-2" />
      <span>Noticias</span>
    </button>
    <button
      onClick={() => handleSectionChange("tablero")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "tablero"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <BarChart2 className="h-5 w-5 mr-2" />
      <span>Tablero Central</span>
    </button>
    <button
      onClick={() => handleSectionChange("calendario")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "calendario"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <Calendar className="h-5 w-5 mr-2" />
      <span>Calendario</span>
    </button>
    <button
      onClick={() => handleSectionChange("mejoras")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "mejoras"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <ArrowUpCircle className="h-5 w-5 mr-2" />
      <span>Mejoras</span>
    </button>
    <button
      onClick={() => handleSectionChange("auditorias")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "auditorias"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <ClipboardList className="h-5 w-5 mr-2" />
      <span>Auditorías</span>
    </button>
    {/* Recursos Humanos */}
    <div className="mt-2 px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
      Recursos Humanos
    </div>
    <button
      onClick={() => handleSectionChange("personal")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "personal"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <Users className="h-5 w-5 mr-2" />
      <span>Personal</span>
    </button>
    <button
      onClick={() => handleSectionChange("departamentos")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "departamentos"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <Building2 className="h-5 w-5 mr-2" />
      <span>Departamentos</span>
    </button>
    <button
      onClick={() => handleSectionChange("puestos")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "puestos"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <Briefcase className="h-5 w-5 mr-2" />
      <span>Puestos</span>
    </button>
    <button
      onClick={() => handleSectionChange("capacitaciones")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "capacitaciones"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <GraduationCap className="h-5 w-5 mr-2" />
      <span>Capacitaciones</span>
    </button>
    <button
      onClick={() => handleSectionChange("evaluaciones")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "evaluaciones"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <ClipboardCheck className="h-5 w-5 mr-2" />
      <span>Evaluaciones</span>
    </button>
    {/* Sistema de Gestión */}
    <div className="mt-2 px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
      Sistema de Gestión
    </div>
    <button
      onClick={() => handleSectionChange("procesos")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "procesos"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <Clipboard className="h-5 w-5 mr-2" />
      <span>Procesos</span>
    </button>

    <button
      onClick={() => handleSectionChange("indicadores")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "indicadores"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <LineChart className="h-5 w-5 mr-2" />
      <span>Indicadores</span>
    </button>
    <button
      onClick={() => handleSectionChange("mediciones")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "mediciones"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <Activity className="h-5 w-5 mr-2" />
      <span>Mediciones</span>
    </button>
    {/* Documentos y Normas */}
    <button
      onClick={() => handleSectionChange("documentos")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "documentos"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <FileText className="h-5 w-5 mr-2" />
      <span>Documentos</span>
    </button>
    <button
      onClick={() => handleSectionChange("normas")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "normas"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <BookOpen className="h-5 w-5 mr-2" />
      <span>Puntos de Norma</span>
    </button>
    {/* Productos */}
    <div className="mt-2 px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
      Planificación y Desarrollo de Productos
    </div>
    <button
      onClick={() => handleSectionChange("productos")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "productos"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <Package className="h-5 w-5 mr-2" />
      <span>Productos</span>
    </button>
    {/* Satisfacción */}
    <div className="mt-2 px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
      Satisfacción
    </div>
    <button
      onClick={() => handleSectionChange("tickets")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "tickets"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <MessageSquare className="h-5 w-5 mr-2" />
      <span>Tickets</span>
    </button>
    <button
      onClick={() => handleSectionChange("encuestas")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "encuestas"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <BarChart className="h-5 w-5 mr-2" />
      <span>Encuestas</span>
    </button>
    {/* Administración */}
    <div className="mt-2 px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
      Administración
    </div>
    <button
      onClick={() => handleSectionChange("usuarios")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "usuarios"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <UserCheck className="h-5 w-5 mr-2" />
      <span>Usuarios</span>
    </button>
    <button
      onClick={() => handleSectionChange("configuracion")}
      className={`flex items-center w-full px-4 py-2 text-left ${
        selectedSection === "configuracion"
          ? "bg-green-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <Settings className="h-5 w-5 mr-2" />
      <span>Configuración</span>
    </button>
    <button
      onClick={() => navigate("/iso-assistant")}
      className={`flex items-center w-full px-4 py-2 text-left bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 mt-2 border-l-2 border-blue-500`}
    >
      <Bot className="h-5 w-5 mr-2" />
      <span>Asistente ISO</span>
      <Sparkles className="h-3 w-3 ml-2" />
    </button>
  </div>
</nav>
            </div>
          </div>
        )}
        {/* Main content */}
        <div className={`flex-1 overflow-auto ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default MenuPrincipal;
