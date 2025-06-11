import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { 
  LineChart,
  Card, 
  Title, 
  Text,
  Flex,
  Grid,
} from "@tremor/react";

// Datos de ejemplo para cumplimiento
const datosTendencia = [
  { mes: "Dic", "Cumplimiento": 76 },
  { mes: "Ene", "Cumplimiento": 78 },
  { mes: "Feb", "Cumplimiento": 82 },
  { mes: "Mar", "Cumplimiento": 85 },
  { mes: "Abr", "Cumplimiento": 91 },
  { mes: "May", "Cumplimiento": 89 },
];

const datosDocumentos = [
  { name: "Manual de calidad", estado: "actualizado", fecha: "15/03/2025", responsable: "Juan Pérez" },
  { name: "Política de calidad", estado: "actualizado", fecha: "15/03/2025", responsable: "Juan Pérez" },
  { name: "Objetivos de calidad", estado: "actualizado", fecha: "15/03/2025", responsable: "Juan Pérez" },
  { name: "Procedimientos críticos", estado: "revisión pendiente", fecha: "15/01/2025", responsable: "María López" },
  { name: "Registros de calidad", estado: "actualizado", fecha: "02/04/2025", responsable: "María López" },
];

const valueFormatter = (number) => 
  `${Intl.NumberFormat("es-AR").format(number).toString()}%`;

function CumplimientoPanel() {
  const { isDark } = useTheme();
  
  // Clases condicionales según el tema
  const cardClasses = isDark 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-200";
    
  const textClasses = isDark 
    ? "text-gray-300" 
    : "text-gray-600";

  return (
    <Grid numItemsMd={2} numItemsLg={2} className="gap-6 mt-6">
      <Card className={cardClasses}>
        <Title className={isDark ? "text-white" : "text-gray-900"}>Tendencia de cumplimiento</Title>
        <Text className={textClasses}>Últimos 6 meses</Text>
        <LineChart
          className="mt-4 h-80"
          data={datosTendencia}
          index="mes"
          categories={["Cumplimiento"]}
          colors={["emerald"]}
          valueFormatter={valueFormatter}
          showLegend={false}
          showYAxis={true}
          showGradient={true}
        />
      </Card>
      
      <Card className={cardClasses}>
        <Title className={isDark ? "text-white" : "text-gray-900"}>Estado de documentación</Title>
        <Text className={textClasses}>Documentos críticos del sistema</Text>
        <div className="mt-8">
          {datosDocumentos.map((item, index) => (
            <div key={index} className={`p-4 mb-3 rounded-lg ${item.estado === "actualizado" ? (isDark ? "bg-emerald-900/20" : "bg-emerald-50") : (isDark ? "bg-amber-900/20" : "bg-amber-50")}`}>
              <Flex alignItems="start">
                <div>
                  <Text className={isDark ? "text-white font-medium" : "text-gray-900 font-medium"}>{item.name}</Text>
                  <Flex className="mt-1">
                    <Text className={`text-xs ${item.estado === "actualizado" ? "text-emerald-600" : "text-amber-600"}`}>
                      {item.estado.toUpperCase()}
                    </Text>
                    <Text className="text-xs text-gray-500 ml-3">
                      Actualizado: {item.fecha}
                    </Text>
                  </Flex>
                </div>
                <div className="ml-auto text-right">
                  <Text className="text-xs text-gray-500">
                    Responsable
                  </Text>
                  <Text className={isDark ? "text-gray-300 text-xs" : "text-gray-700 text-xs"}>
                    {item.responsable}
                  </Text>
                </div>
              </Flex>
            </div>
          ))}
        </div>
      </Card>
    </Grid>
  );
}

export default CumplimientoPanel;
