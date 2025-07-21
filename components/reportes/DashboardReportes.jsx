// components/reportes/DashboardReportes.jsx
import { useEffect } from 'react';
import { useReportesContext } from '../../context/ReportesContext';
import { MetricsCard, FinancialMetricsCard, MetricsGrid } from '../charts/MetricsCard';
import { CustomLineChart, CustomPieChart, HorizontalBarChart } from '../charts/CustomCharts';

export function DashboardReportes() {
  const {
    dashboardData,
    isAnyLoading,
    cargarDashboard,
    formatCurrency,
    formatPercentage,
    error,
    lastUpdateFormatted
  } = useReportesContext();

  useEffect(() => {
    if (!dashboardData) {
      cargarDashboard();
    }
  }, []);

  if (error && !dashboardData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-800 mb-2">Error cargando dashboard</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => cargarDashboard()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const resumen = dashboardData?.resumen?.data;
  const ganancias = dashboardData?.ganancias?.data;
  const topProductos = dashboardData?.topProductos?.data;
  const empleados = dashboardData?.empleados?.data;
  const ciudades = dashboardData?.ciudades?.data;

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Financiero</h2>
          <p className="text-sm text-gray-500 mt-1">
            Última actualización: {lastUpdateFormatted}
          </p>
        </div>
        
        <button
          onClick={() => cargarDashboard()}
          disabled={isAnyLoading}
          className="mt-3 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg 
            className={`w-4 h-4 ${isAnyLoading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{isAnyLoading ? 'Actualizando...' : 'Actualizar'}</span>
        </button>
      </div>

      {/* KPIs Principales */}
      <MetricsGrid columns={4}>
        <FinancialMetricsCard
          title="Ingresos Totales"
          value={resumen?.ventas?.ingresos_totales || 0}
          formatCurrency={formatCurrency}
          color="green"
          loading={isAnyLoading}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
        />

        <FinancialMetricsCard
          title="Ganancia Estimada"
          value={resumen?.ganancias?.ganancia_estimada || 0}
          formatCurrency={formatCurrency}
          color="blue"
          loading={isAnyLoading}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />

        <MetricsCard
          title="Total Ventas"
          value={resumen?.ventas?.total_ventas || 0}
          color="purple"
          loading={isAnyLoading}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />

        <FinancialMetricsCard
          title="Ticket Promedio"
          value={resumen?.ventas?.ticket_promedio || 0}
          formatCurrency={formatCurrency}
          color="yellow"
          loading={isAnyLoading}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />
      </MetricsGrid>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolución de Ganancias */}
        <CustomLineChart
          data={ganancias}
          xKey="periodo"
          yKeys={[
            { dataKey: 'ingresos_totales', name: 'Ingresos', color: '#10B981' },
            { dataKey: 'ganancia_estimada', name: 'Ganancia', color: '#3B82F6' }
          ]}
          title="Evolución de Ingresos y Ganancias"
          height={300}
          formatCurrency={formatCurrency}
          loading={isAnyLoading}
        />

        {/* Top Productos por Ganancia */}
        <HorizontalBarChart
          data={topProductos}
          xKey="producto_nombre"
          yKey="ganancia_estimada"
          title="Top 5 Productos por Ganancia"
          height={300}
          formatCurrency={formatCurrency}
          maxItems={5}
          loading={isAnyLoading}
        />
      </div>

      {/* Análisis Detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance de Empleados */}
        <div className="lg:col-span-2">
          <HorizontalBarChart
            data={empleados}
            xKey="empleado_nombre"
            yKey="ganancia_generada"
            title="Performance de Empleados"
            height={250}
            formatCurrency={formatCurrency}
            loading={isAnyLoading}
            maxItems={8}
          />
        </div>

        {/* Ventas por Ciudad */}
        <CustomPieChart
          data={ciudades?.slice(0, 6)}
          nameKey="ciudad"
          valueKey="ganancia_estimada"
          title="Ganancias por Ciudad"
          height={250}
          formatCurrency={formatCurrency}
          loading={isAnyLoading}
          showPercentage={true}
        />
      </div>

      {/* Métricas Adicionales */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas Adicionales</h3>
        
        <MetricsGrid columns={3}>
          <MetricsCard
            title="Margen Promedio"
            value={formatPercentage(resumen?.ganancias?.margen_promedio)}
            color="green"
            size="small"
            loading={isAnyLoading}
          />
          
          <MetricsCard
            title="Total Egresos"
            value={formatCurrency(resumen?.egresos?.total_egresos)}
            color="red"
            size="small"
            loading={isAnyLoading}
          />
          
          <MetricsCard
            title="Resultado Neto"
            value={formatCurrency(resumen?.balance?.resultado_neto)}
            color={resumen?.balance?.resultado_neto >= 0 ? 'green' : 'red'}
            size="small"
            loading={isAnyLoading}
          />
        </MetricsGrid>
      </div>

      {/* Información del Sistema */}
      {dashboardData && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>Período analizado:</strong> {ganancias?.length || 0} registros
            </div>
            <div>
              <strong>Productos analizados:</strong> {topProductos?.length || 0} productos
            </div>
            <div>
              <strong>Empleados activos:</strong> {empleados?.length || 0} empleados
            </div>
          </div>
        </div>
      )}
    </div>
  );
}