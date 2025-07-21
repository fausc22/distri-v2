// components/reportes/GeographicAnalytics.jsx
import { useEffect, useState } from 'react';
import { useReportesContext } from '../../context/ReportesContext';
import { MetricsCard, FinancialMetricsCard, MetricsGrid } from '../charts/MetricsCard';
import { CustomPieChart, HorizontalBarChart, CustomBarChart } from '../charts/CustomCharts';

export function GeographicAnalytics() {
  const {
    cargarDatos,
    isLoading,
    getData,
    getTotales,
    formatCurrency,
    formatPercentage,
    filtros
  } = useReportesContext();

  const [datosGeograficos, setDatosGeograficos] = useState({
    gananciasPorCiudad: null,
    ventasPorVendedor: null
  });

  // Cargar datos cuando cambie el componente o filtros
  useEffect(() => {
    cargarDatosGeograficos();
  }, [filtros]);

  const cargarDatosGeograficos = async () => {
    try {
      const [ciudades, vendedores] = await Promise.all([
        cargarDatos('gananciasPorCiudad', { limite: 25 }),
        cargarDatos('ventasPorVendedor')
      ]);

      setDatosGeograficos({
        gananciasPorCiudad: ciudades.success ? ciudades.data : null,
        ventasPorVendedor: vendedores.success ? vendedores.data : null
      });
    } catch (error) {
      console.error('Error cargando datos geográficos:', error);
    }
  };

  const { 
    gananciasPorCiudad, 
    ventasPorVendedor 
  } = datosGeograficos;

  const isLoadingAny = isLoading('gananciasPorCiudad') || 
                      isLoading('ventasPorVendedor');

  // Calcular métricas generales
  const totalCiudades = gananciasPorCiudad?.length || 0;
  const totalClientesUnicos = gananciasPorCiudad?.reduce((acc, item) => 
    acc + (parseInt(item.clientes_unicos) || 0), 0) || 0;
  const totalVentasGeograficas = gananciasPorCiudad?.reduce((acc, item) => 
    acc + (parseInt(item.total_ventas) || 0), 0) || 0;
  const totalIngresosGeograficos = gananciasPorCiudad?.reduce((acc, item) => 
    acc + (parseFloat(item.ingresos_totales) || 0), 0) || 0;

  // Calcular ticket promedio por ciudad
  const ticketPromedio = totalVentasGeograficas > 0 ? 
    totalIngresosGeograficos / totalVentasGeograficas : 0;

  // Agrupar por provincia
  const ventasPorProvincia = gananciasPorCiudad?.reduce((acc, ciudad) => {
    const provincia = ciudad.provincia || 'Sin Provincia';
    if (!acc[provincia]) {
      acc[provincia] = {
        provincia,
        ciudades: 0,
        total_ventas: 0,
        clientes_unicos: 0,
        ingresos_totales: 0,
        ganancia_estimada: 0
      };
    }
    
    acc[provincia].ciudades += 1;
    acc[provincia].total_ventas += parseInt(ciudad.total_ventas) || 0;
    acc[provincia].clientes_unicos += parseInt(ciudad.clientes_unicos) || 0;
    acc[provincia].ingresos_totales += parseFloat(ciudad.ingresos_totales) || 0;
    acc[provincia].ganancia_estimada += parseFloat(ciudad.ganancia_estimada) || 0;
    
    return acc;
  }, {}) || {};

  const datosPorProvincia = Object.values(ventasPorProvincia)
    .sort((a, b) => b.ganancia_estimada - a.ganancia_estimada);

  // Preparar datos para distribución de clientes
  const distribucionClientes = gananciasPorCiudad?.map(ciudad => ({
    ciudad: ciudad.ciudad,
    clientes: parseInt(ciudad.clientes_unicos) || 0,
    ticketPromedio: parseInt(ciudad.total_ventas) > 0 ? 
      parseFloat(ciudad.ingresos_totales) / parseInt(ciudad.total_ventas) : 0
  })).sort((a, b) => b.clientes - a.clientes).slice(0, 10) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Análisis Geográfico</h2>
          <p className="text-sm text-gray-500 mt-1">
            Performance de ventas por ubicación geográfica y vendedores
          </p>
        </div>
        
        <button
          onClick={cargarDatosGeograficos}
          disabled={isLoadingAny}
          className="mt-3 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg 
            className={`w-4 h-4 ${isLoadingAny ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{isLoadingAny ? 'Actualizando...' : 'Actualizar'}</span>
        </button>
      </div>

      {/* KPIs Geográficos */}
      <MetricsGrid columns={4}>
        <MetricsCard
          title="Ciudades Atendidas"
          value={totalCiudades}
          color="blue"
          loading={isLoadingAny}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        <MetricsCard
          title="Clientes Únicos"
          value={totalClientesUnicos.toLocaleString()}
          color="green"
          loading={isLoadingAny}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
        />

        <FinancialMetricsCard
          title="Ingresos Totales"
          value={totalIngresosGeograficos}
          formatCurrency={formatCurrency}
          color="purple"
          loading={isLoadingAny}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
        />

        <FinancialMetricsCard
          title="Ticket Promedio"
          value={ticketPromedio}
          formatCurrency={formatCurrency}
          color="yellow"
          loading={isLoadingAny}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />
      </MetricsGrid>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Ciudades por Ganancia */}
        <HorizontalBarChart
          data={gananciasPorCiudad?.slice(0, 10)}
          xKey="ciudad"
          yKey="ganancia_estimada"
          title="Top 10 Ciudades por Ganancia"
          height={350}
          formatCurrency={formatCurrency}
          loading={isLoadingAny}
          maxItems={10}
        />

        {/* Distribución por Provincia */}
        <CustomPieChart
          data={datosPorProvincia.slice(0, 8)}
          nameKey="provincia"
          valueKey="ganancia_estimada"
          title="Distribución de Ganancias por Provincia"
          height={350}
          formatCurrency={formatCurrency}
          loading={isLoadingAny}
          showPercentage={true}
        />
      </div>

      {/* Performance de Vendedores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HorizontalBarChart
          data={ventasPorVendedor}
          xKey="empleado_nombre"
          yKey="total_vendido"
          title="Performance de Vendedores"
          height={300}
          formatCurrency={formatCurrency}
          loading={isLoadingAny}
          maxItems={8}
        />

        <CustomBarChart
          data={distribucionClientes}
          xKey="ciudad"
          yKeys={[
            { dataKey: 'clientes', name: 'Clientes Únicos', color: '#10B981' },
            { dataKey: 'ticketPromedio', name: 'Ticket Promedio', color: '#3B82F6' }
          ]}
          title="Clientes vs Ticket Promedio por Ciudad"
          height={300}
          formatCurrency={formatCurrency}
          loading={isLoadingAny}
        />
      </div>

      {/* Tabla Detallada por Ciudad */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Análisis Detallado por Ciudad
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ciudad / Provincia
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ventas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clientes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ganancia
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Promedio
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gananciasPorCiudad?.slice(0, 15).map((ciudad, index) => {
                const ticketCiudad = parseInt(ciudad.total_ventas) > 0 ? 
                  parseFloat(ciudad.ingresos_totales) / parseInt(ciudad.total_ventas) : 0;
                const participacion = totalIngresosGeograficos > 0 ? 
                  (parseFloat(ciudad.ingresos_totales) / totalIngresosGeograficos) * 100 : 0;
                const performanceLevel = participacion >= 10 ? 'Alta' : 
                                       participacion >= 5 ? 'Media' : 'Baja';
                const performanceColor = participacion >= 10 ? 'text-green-600' : 
                                       participacion >= 5 ? 'text-yellow-600' : 'text-gray-600';
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ciudad.ciudad}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ciudad.provincia}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {parseInt(ciudad.total_ventas || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {parseInt(ciudad.clientes_unicos || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                      {formatCurrency(ciudad.ingresos_totales)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-600">
                      {formatCurrency(ciudad.ganancia_estimada)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(ticketCiudad)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`font-medium ${performanceColor}`}>
                        {performanceLevel}
                      </span>
                      <div className="text-xs text-gray-500">
                        {formatPercentage(participacion)}
                      </div>
                    </td>
                  </tr>
                );
              }) || (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    {isLoadingAny ? 'Cargando datos geográficos...' : 'No hay datos geográficos'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Performance por Vendedor */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Performance de Vendedores
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad Ventas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Vendido
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promedio por Venta
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participación
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ventasPorVendedor?.map((vendedor, index) => {
                const totalVendidoTodos = ventasPorVendedor.reduce((acc, v) => 
                  acc + parseFloat(v.total_vendido), 0);
                const participacion = totalVendidoTodos > 0 ? 
                  (parseFloat(vendedor.total_vendido) / totalVendidoTodos) * 100 : 0;
                const promedioPorVenta = parseInt(vendedor.cantidad_ventas) > 0 ? 
                  parseFloat(vendedor.total_vendido) / parseInt(vendedor.cantidad_ventas) : 0;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vendedor.empleado_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {parseInt(vendedor.cantidad_ventas || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                      {formatCurrency(vendedor.total_vendido)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(promedioPorVenta)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        participacion >= 25 
                          ? 'bg-green-100 text-green-800'
                          : participacion >= 15
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {formatPercentage(participacion)}
                      </span>
                    </td>
                  </tr>
                );
              }) || (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {isLoadingAny ? 'Cargando datos de vendedores...' : 'No hay datos de vendedores'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Geográficos */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Insights Geográficos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🏙️</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Ciudad Top</div>
                <div className="text-lg font-bold text-gray-900">
                  {gananciasPorCiudad?.[0]?.ciudad || 'N/A'}
                </div>
                <div className="text-sm text-green-600">
                  {formatCurrency(gananciasPorCiudad?.[0]?.ganancia_estimada || 0)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Provincia Líder</div>
                <div className="text-lg font-bold text-gray-900">
                  {datosPorProvincia[0]?.provincia || 'N/A'}
                </div>
                <div className="text-sm text-blue-600">
                  {datosPorProvincia[0]?.ciudades || 0} ciudades
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">👑</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Top Vendedor</div>
                <div className="text-lg font-bold text-gray-900">
                  {ventasPorVendedor?.[0]?.empleado_nombre?.split(' ')[0] || 'N/A'}
                </div>
                <div className="text-sm text-purple-600">
                  {ventasPorVendedor?.[0]?.cantidad_ventas || 0} ventas
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Concentración</div>
                <div className="text-lg font-bold text-gray-900">
                  Top 5 ciudades
                </div>
                <div className="text-sm text-orange-600">
                  {formatPercentage(
                    gananciasPorCiudad?.slice(0, 5).reduce((acc, ciudad) => 
                      acc + parseFloat(ciudad.ganancia_estimada), 0) / 
                    totalIngresosGeograficos * 100 || 0
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendaciones Geográficas */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-md font-semibold text-blue-900 mb-2">🎯 Recomendaciones Geográficas</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ampliar cobertura en ciudades con alto ticket promedio</li>
            <li>• Fortalecer presencia en provincias con menor penetración</li>
            <li>• Analizar costos logísticos vs rentabilidad por zona</li>
            <li>• Desarrollar estrategias específicas para ciudades con pocos clientes pero alta facturación</li>
            <li>• Considerar incentivos para vendedores en zonas con menor performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}