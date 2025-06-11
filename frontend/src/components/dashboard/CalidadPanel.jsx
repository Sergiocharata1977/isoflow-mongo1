import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { 
  LineChart, 
  BarChart, 
  DonutChart,
  Card, 
  Title, 
  Text,
  Grid,
} from "@tremor/react";

// Datos de ejemplo para calidad
const datosCalidad = [
  {
    fecha: "Ene",
    "Productos conformes": 158,
    "No conformidades": 12,
  },
  {
    fecha: "Feb",
    "Productos conformes": 172,
    "No conformidades": 14,
  },
  {
    fecha: "Mar",
    "Productos conformes": 186,
    "No conformidades": 18,
  },
  {
    fecha: "Abr",
    "Productos conformes": 198,
    "No conformidades": 7,
  },
  {
    fecha: "May",
    "Productos conformes": 215,
    "No conformidades": 5,
  },
  {
    fecha: "Jun",
    "Productos conformes": 198,
    "No conformidades": 9,
  },
];

const datosSatisfaccion = [
  {
    fecha: "Ene 2025",
    "Satisfacción del cliente": 87,
  },
  {
    fecha: "Feb 2025",
    "Satisfacción del cliente": 89,
  },
  {
    fecha: "Mar 2025",
    "Satisfacción del cliente": 86,
  },
  {
    fecha: "Abr 2025",
    "Satisfacción del cliente": 91,
  },
  {
    fecha: "May 2025",
    "Satisfacción del cliente": 94,
  },
];

const datosNoConformidades = [
  { name: "Materias primas", value: 18 },
  { name: "Proceso de producción", value: 24 },
  { name: "Envasado", value: 12 },
  { name: "Almacenamiento", value: 9 },
  { name: "Distribución", value: 6 },
];

const valueFormatter = (number) => 
  `${Intl.NumberFormat("es-AR").format(number).toString()}%`;

function CalidadPanel() {
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
        <Title className={isDark ? "text-white" : "text-gray-900"}>Estadísticas de calidad</Title>
        <Text className={textClasses}>Productos conformes vs No conformidades</Text>
        <BarChart
          className="mt-4 h-80"
          data={datosCalidad}
          index="fecha"
          categories={["Productos conformes", "No conformidades"]}
          colors={["emerald", "rose"]}
          stack={false}
          yAxisWidth={48}
          showLegend={true}
        />
      </Card>
      
      <Card className={cardClasses}>
        <Title className={isDark ? "text-white" : "text-gray-900"}>Satisfacción del cliente</Title>
        <Text className={textClasses}>Tendencia mensual (%)</Text>
        <LineChart
          className="mt-4 h-80"
          data={datosSatisfaccion}
          index="fecha"
          categories={["Satisfacción del cliente"]}
          colors={["blue"]}
          valueFormatter={valueFormatter}
          showLegend={false}
          showYAxis={true}
          showGradient={true}
          startEndOnly={false}
          showAnimation={true}
        />
      </Card>
      
      <Card className={cardClasses}>
        <Title className={isDark ? "text-white" : "text-gray-900"}>Distribución de no conformidades</Title>
        <Text className={textClasses}>Por área del proceso</Text>
        <DonutChart
          className="mt-6 h-60"
          data={datosNoConformidades}
          index="name"
          category="value"
          colors={["emerald", "blue", "amber", "indigo", "rose"]}
          showAnimation={true}
        />
      </Card>
    </Grid>
  );
}

export default CalidadPanel;
