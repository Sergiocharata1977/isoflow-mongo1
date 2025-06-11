import React from 'react';
import { Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import ReactECharts from 'echarts-for-react';

// Datos de ejemplo para mostrar en el dashboard si no se proporcionan mejoras
const mejorasEjemplo = [
  { id: 1, estado: 'Hallazgo', proceso_involucrado: 'Producción', fechaCreacion: '2025-03-15' },
  { id: 2, estado: 'Corrección', proceso_involucrado: 'Calidad', fechaCreacion: '2025-03-20' },
  { id: 3, estado: 'Análisis de Causas', proceso_involucrado: 'Logística', fechaCreacion: '2025-03-25' },
  { id: 4, estado: 'Acción Correctiva', proceso_involucrado: 'Producción', fechaCreacion: '2025-04-01' },
  { id: 5, estado: 'Acción Preventiva', proceso_involucrado: 'Ventas', fechaCreacion: '2025-04-05' },
  { id: 6, estado: 'Planificación control', proceso_involucrado: 'Administración', fechaCreacion: '2025-04-10' },
  { id: 7, estado: 'Control Hecho', proceso_involucrado: 'Calidad', fechaCreacion: '2025-04-15' },
  { id: 8, estado: 'Hallazgo', proceso_involucrado: 'Producción', fechaCreacion: '2025-04-18' },
  { id: 9, estado: 'Corrección', proceso_involucrado: 'Logística', fechaCreacion: '2025-04-19' },
  { id: 10, estado: 'Análisis de Causas', proceso_involucrado: 'Ventas', fechaCreacion: '2025-04-20' }
];

// Datos de ejemplo para procesos
const procesosEjemplo = [
  { id: 1, titulo: 'Producción' },
  { id: 2, titulo: 'Calidad' },
  { id: 3, titulo: 'Logística' },
  { id: 4, titulo: 'Ventas' },
  { id: 5, titulo: 'Administración' }
];

function MejorasDashboard({ mejoras = mejorasEjemplo }) {
  const { isDark } = useTheme();
  const [procesoFiltro, setProcesoFiltro] = React.useState("");
  const [procesos, setProcesos] = React.useState(procesosEjemplo);

  React.useEffect(() => {
    // Cargar procesos
    const saved = localStorage.getItem("procesos");
    if (saved) {
      setProcesos(JSON.parse(saved));
    }
  }, []);

  // Obtener la fecha de hace un mes
  const unMesAtras = new Date();
  unMesAtras.setMonth(unMesAtras.getMonth() - 1);

  // Filtrar mejoras por proceso y último mes
  const mejorasFiltradas = mejoras.filter(mejora => 
    new Date(mejora.fechaCreacion) >= unMesAtras &&
    (!procesoFiltro || mejora.proceso_involucrado === procesoFiltro)
  );

  // Colores y configuración del tema
  const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const backgroundColor = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? '#374151' : '#e5e7eb';

  // Datos para los gráficos
  const estadosData = [
    'Hallazgo',
    'Corrección',
    'Análisis de Causas',
    'Acción Correctiva',
    'Acción Preventiva',
    'Planificación control',
    'Control Hecho'
  ].map((estado, index) => ({
    name: estado,
    value: mejorasFiltradas.filter(m => m.estado === estado).length,
    itemStyle: { color: colors[index] }
  }));

  const procesoData = procesos.map(proceso => ({
    name: proceso.titulo,
    value: mejorasFiltradas.filter(m => m.proceso_involucrado === proceso.titulo).length
  }));

  // Configuración del tema para ECharts
  const getChartTheme = () => ({
    backgroundColor: backgroundColor,
    textStyle: { color: textColor }
  });

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Resumen del Último Mes</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
              value={procesoFiltro}
              onChange={(e) => setProcesoFiltro(e.target.value)}
            >
              <option value="">Todos los procesos</option>
              {procesos.map((proceso) => (
                <option key={proceso.id} value={proceso.titulo}>
                  {proceso.titulo}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm text-gray-500">
            {unMesAtras.toLocaleDateString()} - {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Resumen de estados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className={`p-6 ${isDark ? 'bg-card' : 'bg-white'}`}>
          <h3 className="text-lg font-semibold mb-4">Estado de Mejoras</h3>
          <div className="h-80">
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b}: {c} ({d}%)',
                  backgroundColor: isDark ? '#374151' : '#ffffff',
                  borderColor: borderColor,
                  textStyle: { color: textColor }
                },
                legend: {
                  orient: 'vertical',
                  right: 10,
                  top: 'center',
                  textStyle: { color: textColor }
                },
                series: [{
                  name: 'Estados',
                  type: 'pie',
                  radius: ['40%', '70%'],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 10,
                    borderColor: borderColor,
                    borderWidth: 2
                  },
                  label: { show: false },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: '14',
                      fontWeight: 'bold',
                      color: textColor
                    }
                  },
                  labelLine: { show: false },
                  data: estadosData
                }]
              }}
              theme={getChartTheme()}
              style={{ height: '100%' }}
            />
          </div>
        </Card>

        <Card className={`p-6 ${isDark ? 'bg-card' : 'bg-white'}`}>
          <h3 className="text-lg font-semibold mb-4">Mejoras por Proceso</h3>
          <div className="h-80">
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'shadow' },
                  backgroundColor: isDark ? '#374151' : '#ffffff',
                  borderColor: borderColor,
                  textStyle: { color: textColor }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  data: procesoData.map(item => item.name),
                  axisLabel: {
                    color: textColor,
                    rotate: 45
                  }
                },
                yAxis: {
                  type: 'value',
                  axisLabel: { color: textColor }
                },
                series: [{
                  name: 'Mejoras',
                  type: 'bar',
                  data: procesoData.map(item => item.value),
                  itemStyle: {
                    color: '#3b82f6',
                    borderRadius: [4, 4, 0, 0]
                  }
                }]
              }}
              theme={getChartTheme()}
              style={{ height: '100%' }}
            />
          </div>
        </Card>

        <Card className={`p-6 ${isDark ? 'bg-card' : 'bg-white'} lg:col-span-3`}>
          <h3 className="text-lg font-semibold mb-4">Resumen de Estados</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {estadosData.map((estado, index) => (
              <div key={estado.name} className="text-center p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold" style={{ color: colors[index] }}>
                  {estado.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{estado.name}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default MejorasDashboard;
