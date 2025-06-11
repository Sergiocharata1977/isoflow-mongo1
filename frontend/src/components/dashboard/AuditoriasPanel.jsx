import React from "react";
import { useTheme } from "@/context/ThemeContext";
import ReactECharts from 'echarts-for-react';

// Datos de ejemplo para auditorías
const datosAuditorias = [
  {
    name: "4.1 Entendimiento de la organización",
    value: 92,
  },
  {
    name: "4.2 Comprensión necesidades",
    value: 88,
  },
  {
    name: "5.1 Liderazgo y compromiso",
    value: 96,
  },
  {
    name: "6.1 Acciones para abordar riesgos",
    value: 82,
  },
  {
    name: "7.1 Recursos",
    value: 90,
  },
  {
    name: "8.1 Planificación operacional",
    value: 79,
  },
];

const datosHallazgos = [
  { name: "No conformidad mayor", value: 3 },
  { name: "No conformidad menor", value: 12 },
  { name: "Observación", value: 24 },
  { name: "Oportunidad de mejora", value: 18 },
];

const datosAcciones = [
  { name: "Completadas", value: 32 },
  { name: "En proceso", value: 15 },
  { name: "Pendientes", value: 8 },
  { name: "Retrasadas", value: 4 },
];

const valueFormatter = (number) => 
  `${Intl.NumberFormat("es-AR").format(number).toString()}%`;

function AuditoriasPanel() {
  const { isDark } = useTheme();
  
  // Colores para los gráficos
  const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const backgroundColor = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? '#374151' : '#e5e7eb';

  // Opciones para el tema claro/oscuro
  const getChartTheme = () => ({
    backgroundColor: backgroundColor,
    textStyle: {
      color: textColor,
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Cumplimiento por cláusula ISO</h3>
        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Resultados de última auditoría</p>
        <div className="h-72 mt-4">
          <ReactECharts
            option={{
              grid: {
                left: '3%',
                right: '8%',
                bottom: '3%',
                top: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                axisLabel: {
                  formatter: '{value}%',
                  color: textColor
                },
                splitLine: {
                  lineStyle: {
                    color: isDark ? '#374151' : '#e5e7eb'
                  }
                }
              },
              yAxis: {
                type: 'category',
                data: datosAuditorias.map(item => item.name),
                axisLabel: {
                  color: textColor
                }
              },
              series: [
                {
                  type: 'bar',
                  data: datosAuditorias.map(item => item.value),
                  itemStyle: {
                    color: '#3b82f6'
                  },
                  label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}%',
                    color: textColor
                  }
                }
              ],
              tooltip: {
                trigger: 'axis',
                formatter: '{b}: {c}%',
                backgroundColor: isDark ? '#374151' : '#ffffff',
                borderColor: isDark ? '#4b5563' : '#e5e7eb',
                textStyle: {
                  color: textColor
                }
              }
            }}
            theme={getChartTheme()}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>
      
      <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Distribución de hallazgos</h3>
        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Por tipo de no conformidad</p>
        <div className="h-60 mt-4">
          <ReactECharts 
            option={{
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
                backgroundColor: isDark ? '#374151' : '#ffffff',
                borderColor: isDark ? '#4b5563' : '#e5e7eb',
                textStyle: {
                  color: textColor
                }
              },
              legend: {
                orient: 'vertical',
                right: 10,
                top: 'center',
                data: datosHallazgos.map(item => item.name),
                textStyle: {
                  color: textColor
                }
              },
              series: [
                {
                  name: 'Hallazgos',
                  type: 'pie',
                  radius: ['40%', '70%'],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 10,
                    borderColor: borderColor,
                    borderWidth: 2
                  },
                  label: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: '14',
                      fontWeight: 'bold',
                      color: textColor
                    }
                  },
                  labelLine: {
                    show: false
                  },
                  data: datosHallazgos.map((item, index) => ({
                    value: item.value,
                    name: item.name,
                    itemStyle: {
                      color: colors[index % colors.length]
                    }
                  }))
                }
              ]
            }}
            theme={getChartTheme()}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>
      
      <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Estado de acciones</h3>
        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Acciones correctivas y preventivas</p>
        <div className="h-60 mt-4">
          <ReactECharts 
            option={{
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
                backgroundColor: isDark ? '#374151' : '#ffffff',
                borderColor: isDark ? '#4b5563' : '#e5e7eb',
                textStyle: {
                  color: textColor
                }
              },
              legend: {
                orient: 'vertical',
                right: 10,
                top: 'center',
                data: datosAcciones.map(item => item.name),
                textStyle: {
                  color: textColor
                }
              },
              series: [
                {
                  name: 'Acciones',
                  type: 'pie',
                  radius: ['30%', '60%'],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 10,
                    borderColor: borderColor,
                    borderWidth: 2
                  },
                  label: {
                    show: false
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: '14',
                      fontWeight: 'bold',
                      color: textColor
                    }
                  },
                  labelLine: {
                    show: false
                  },
                  data: datosAcciones.map((item, index) => ({
                    value: item.value,
                    name: item.name,
                    itemStyle: {
                      color: colors[index % colors.length]
                    }
                  }))
                }
              ]
            }}
            theme={getChartTheme()}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}

export default AuditoriasPanel;
