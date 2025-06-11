import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { 
  BarChart, 
  BarList,
  Card, 
  Title, 
  Text,
  Grid,
  Flex,
  ProgressBar
} from "@tremor/react";

// Datos de ejemplo para procesos
const datosProcesos = [
  { name: "Gestión estratégica", value: 92 },
  { name: "Gestión de calidad", value: 87 },
  { name: "Compras y logística", value: 76 },
  { name: "Producción", value: 82 },
  { name: "Ventas", value: 91 },
  { name: "Servicio al cliente", value: 84 },
];

const datosMejoras = [
  {
    categoria: "Acciones correctivas",
    "Completadas": 18,
    "En proceso": 7,
    "Pendientes": 3,
  },
  {
    categoria: "Acciones preventivas",
    "Completadas": 12,
    "En proceso": 5,
    "Pendientes": 2,
  },
  {
    categoria: "Oportunidades de mejora",
    "Completadas": 8,
    "En proceso": 11,
    "Pendientes": 6,
  },
];

const datosCumplimiento = [
  { name: "Política ISO", value: 95 },
  { name: "Objetivos", value: 87 },
  { name: "Auditorías", value: 92 },
  { name: "Documentación", value: 79 },
  { name: "Formación", value: 83 },
  { name: "No conformidades", value: 88 },
];

const valueFormatter = (number) => 
  `${Intl.NumberFormat("es-AR").format(number).toString()}%`;

function ProcesosPanel() {
  const { isDark } = useTheme();
  
  // Clases condicionales según el tema
  const cardClasses = isDark 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-200";
    
  const textClasses = isDark 
    ? "text-gray-300" 
    : "text-gray-600";

  return (
    <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
      <Card className={cardClasses}>
        <Title className={isDark ? "text-white" : "text-gray-900"}>Rendimiento de procesos</Title>
        <Text className={textClasses}>Evaluación de desempeño (%)</Text>
        <BarList
          className="mt-4"
          data={datosProcesos}
          valueFormatter={valueFormatter}
          color="emerald"
        />
      </Card>
      
      <Card className={cardClasses}>
        <Title className={isDark ? "text-white" : "text-gray-900"}>Mejoras por categoría</Title>
        <Text className={textClasses}>Distribución por estado</Text>
        <BarChart
          className="mt-4 h-80"
          data={datosMejoras}
          index="categoria"
          categories={["Completadas", "En proceso", "Pendientes"]}
          colors={["emerald", "amber", "rose"]}
          stack={true}
          yAxisWidth={48}
        />
      </Card>
      
      <Card className={cardClasses}>
        <Title className={isDark ? "text-white" : "text-gray-900"}>Cumplimiento de objetivos</Title>
        <Text className={textClasses}>Progreso actual</Text>
        <div className="mt-8">
          {datosCumplimiento.map((item) => (
            <div key={item.name} className="mb-6">
              <Flex>
                <Text className={isDark ? "text-white" : "text-gray-900"}>{item.name}</Text>
                <Text className={textClasses}>{item.value}%</Text>
              </Flex>
              <ProgressBar value={item.value} color={item.value > 90 ? "emerald" : item.value > 75 ? "amber" : "rose"} className="mt-2" />
            </div>
          ))}
        </div>
      </Card>
    </Grid>
  );
}

export default ProcesosPanel;
