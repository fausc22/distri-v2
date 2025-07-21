// components/reportes/VentasAnalytics.jsx
import { useEffect, useState } from 'react';
import { useReportesContext } from '../../context/ReportesContext';
import { MetricsCard, FinancialMetricsCard, MetricsGrid } from '../charts/MetricsCard';
import { CustomLineChart, CustomBarChart, HorizontalBarChart } from '../charts/CustomCharts';

export function VentasAnalytics() {
  const {
    cargarDatos,
    isLoading,
    getData,
    getTotales,
    formatCurrency,
    formatPercentage,
    filtros
  } = useReportesContext();

  const [datosVentas, setDatosVentas] = useState({
    gananciasDetalladas: null,
    gananciasPorEmpleado: null,
    gananciasPorProducto: null,
    totales: null
  });

  // Cargar datos cuando cambie el componente o filtros
  useEffect(() => {
    cargarDatosVentas();
  }, [filtros]);

  const cargarDatosVentas = async () => {
    try {
      const [ganancias, empleados, productos] = await Promise.all([
        cargarDatos('gananciasDetalladas'),
        cargarDatos('gananciasPorEmpleado'),
        cargarDatos('gananciasPorProducto', { limite: 15 })
      ]);

      setDatosVentas({
        gananciasDetalladas: ganancias.success ? ganancias.data : null,
        gananciasPorEmpleado: empleados.success ? empleados.data : null,
        gananciasPorProducto: productos.success ? productos.data : null,
        totales: ganancias.success ? ganancias.totales : null
      });
    } catch (error) {
      console.error('Error cargando datos de ventas:', error);
    }
  };

  const { 
    gananciasDetalladas, 
    gananciasPorEmpleado, 
    gananciasPorProducto, 
    totales 
  } = datosVentas;

  const isLoadingAny = isLoading('gananciasDetalladas') || 
                      isLoading('gananciasPorEmpleado') || 
                      isLoading('gananciasPorProducto');

  // Calcular métricas derivadas
  const ticketPromedio = totales?.total_ventas > 0 ? 
    totales.ingresos_totales / totales.total_ventas : 0;

  const margenPromedio = totales?.ingresos_totales > 0 ? 
    (totales.ganancia_estimada / totales.ingresos_totales) * 100 : 0;

  // Preparar datos para gráficos de empleados
  const topEmpleados = gananciasPorEmpleado?.slice(0, 8) || [];
  const empleadosConMargen = gananciasPorEmpleado?.map(emp => ({
    ...emp,
    margen_calculado: emp.ingresos_generados > 0 ? 
      (emp.ganancia_generada / emp.ingresos_generados) * 100 : 0
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Análisis de Ventas</h2>
          <p className="text-sm text-gray-500 mt-1">
            Performance detallado de ventas, empleados y productos
          </p>
        </div>
        
        <button
          onClick={cargarDatosVentas}
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

      {/* KPIs de Ventas */}
      <MetricsGrid columns={4}>
        <FinancialMetricsCard
          title="Ingresos del Período"
          value={totales?.ingresos_totales || 0}
          formatCurrency={formatCurrency}
          color="green"
          loading={isLoadingAny}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
        />

        <FinancialMetricsCard
          title="Ganancia Total"
          value={totales?.ganancia_estimada || 0}
          formatCurrency={formatCurrency}
          color="blue"
          loading={isLoadingAny}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />

        <MetricsCard
          title="Margen Promedio"
          value={formatPercentage(margenPromedio)}
          color="purple"
          loading={isLoadingAny}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

      {/* Evolución Temporal */}
      <CustomLineChart
        data={gananciasDetalladas}
        xKey="periodo"
        yKeys={[
          { dataKey: 'ingresos_totales', name: 'Ingresos', color: '#10B981' },
          { dataKey: 'ganancia_estimada', name: 'Ganancia', color: '#3B82F6' },
          { dataKey: 'ticket_promedio', name: 'Ticket Promedio', color: '#F59E0B' }
        ]}
        title="Evolución de Ventas en el Tiempo"
        height={350}
        formatCurrency={formatCurrency}
        loading={isLoadingAny}
      />

      {/* Performance de Empleados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HorizontalBarChart
          data={topEmpleados}
          xKey="empleado_nombre"
          yKey="ganancia_generada"
          title="Ganancias por Empleado"
          height={300}
          formatCurrency={formatCurrency}
          loading={isLoadingAny}
          maxItems={8}
        />

        <CustomBarChart
          data={empleadosConMargen?.slice(0, 6)}
          xKey="empleado_nombre"
          yKeys={[
            { dataKey: 'margen_calculado', name: 'Margen %', color: '#8B5CF6' },
            { dataKey: 'total_ventas', name: 'Cantidad Ventas', color: '#06B6D4' }
          ]}
          title="Margen y Volumen por Empleado"
          height={300}
          formatPercentage={formatPercentage}
          loading={isLoadingAny}
        />
      </div>

      {/* Análisis de Productos */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Top Productos por Ganancia
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad Vendida
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ganancia
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margen %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gananciasPorProducto?.slice(0, 10).map((producto, index) => (
                <tr key={producto.producto_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {producto.producto_nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {producto.producto_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {producto.cantidad_total_vendida}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                    {formatCurrency(producto.ingresos_producto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-600">
                    {formatCurrency(producto.ganancia_estimada)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      producto.margen_porcentaje >= 30 
                        ? 'bg-green-100 text-green-800'
                        : producto.margen_porcentaje >= 20
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {formatPercentage(producto.margen_porcentaje)}
                    </span>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {isLoadingAny ? 'Cargando productos...' : 'No hay datos de productos'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen de Métricas Adicionales */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Insights del Período</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Empleados Activos</div>
                <div className="text-2xl font-bold text-gray-900">
                  {gananciasPorEmpleado?.length || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Productos Vendidos</div>
                <div className="text-2xl font-bold text-gray-900">
                  {gananciasPorProducto?.length || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total de Ventas</div>
                <div className="text-2xl font-bold text-gray-900">
                  {totales?.total_ventas || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}