import React from "react";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "../theme/ThemeToggle";
import { 
  Card, 
  Title, 
  Text,
  TabList,
  Tab,
  TabGroup,
  TabPanel,
  TabPanels,
  Flex,
  Grid,
  Metric,
} from "@tremor/react";
import { 
  CalendarDays, 
  Users, 
  ClipboardCheck, 
  Activity,
  Gauge,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Importar los componentes de paneles
import CalidadPanel from "./CalidadPanel";
import ProcesosPanel from "./ProcesosPanel";
import AuditoriasPanel from "./AuditoriasPanel";
import CumplimientoPanel from "./CumplimientoPanel";

// Datos de ejemplo para los indicadores principales
const indicadoresData = [
  {
    name: "Tiempo de ciclo",
    valor: 15.5,
    delta: "-12.3%",
    deltaType: "decrease",
    descripcion: "Tiempo promedio del proceso en días",
    icon: Activity
  },
  {
    name: "Capacitaciones",
    valor: 24,
    delta: "+8.1%",
    deltaType: "increase",
    descripcion: "Capacitaciones completadas",
    icon: Users
  },
  {
    name: "Cumplimiento",
    valor: 89.2,
    delta: "+5.4%",
    deltaType: "increase",
    descripcion: "Porcentaje de cumplimiento",
    icon: CheckCircle
  },
  {
    name: "No conformidades",
    valor: 7,
    delta: "-3",
    deltaType: "decrease",
    descripcion: "Total de no conformidades abiertas",
    icon: AlertCircle
  },
];

function DashboardCentral() {
  const { isDark } = useTheme();
  
  // Clases condicionales según el tema
  const cardClasses = isDark 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-200";
    
  const textClasses = isDark 
    ? "text-gray-300" 
    : "text-gray-600";
    
  const tabClasses = isDark 
    ? "bg-gray-900" 
    : "bg-gray-50";

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Tablero Central
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Indicadores clave de desempeño del Sistema de Gestión de Calidad
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Tarjetas de KPI principales */}
      <Grid numItemsMd={2} numItemsLg={4} className="gap-6 mb-6">
        {indicadoresData.map((item) => (
          <Card key={item.name} decoration="top" decorationColor={item.deltaType === "increase" ? "emerald" : "rose"} className={cardClasses}>
            <Flex justifyContent="start" className="space-x-4">
              <item.icon className={`h-8 w-8 ${item.deltaType === "increase" ? "text-emerald-500" : "text-rose-500"}`} />
              <div className="truncate">
                <Text className={textClasses}>{item.name}</Text>
                <Metric className={isDark ? "text-white" : "text-gray-900"}>
                  {item.valor}{item.name === "Cumplimiento" ? "%" : ""}
                </Metric>
              </div>
            </Flex>
            <Flex className="mt-4 space-x-2">
              <Text className={`${item.deltaType === "increase" ? "text-emerald-500" : "text-rose-500"}`}>
                {item.delta}
              </Text>
              <Text className={textClasses}>{item.descripcion}</Text>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Sistema de pestañas */}
      <TabGroup className="mt-6">
        <TabList variant="solid" className={tabClasses}>
          <Tab>Calidad</Tab>
          <Tab>Procesos</Tab>
          <Tab>Auditorías</Tab>
          <Tab>Cumplimiento</Tab>
        </TabList>
        
        <TabPanels>
          {/* Panel de Calidad */}
          <TabPanel>
            <CalidadPanel />
          </TabPanel>
          
          {/* Panel de Procesos */}
          <TabPanel>
            <ProcesosPanel />
          </TabPanel>
          
          {/* Panel de Auditorías */}
          <TabPanel>
            <AuditoriasPanel />
          </TabPanel>
          
          {/* Panel de Cumplimiento */}
          <TabPanel>
            <CumplimientoPanel />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}

export default DashboardCentral;
