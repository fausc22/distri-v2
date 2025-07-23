// components/reportes/DashboardReportes.jsx - VERSIÓN MEJORADA
import { useEffect, useState } from 'react';
import { useReportesContext } from '../../context/ReportesContext';
import { MetricsCard, FinancialMetricsCard, MetricsGrid } from '../charts/MetricsCard';
import { CustomLineChart, CustomBarChart } from '../charts/CustomCharts';

export function DashboardReportes() {
  const {
    dashboardData,
    isAnyLoading,
    cargarDashboard,
    formatCurrency,
    formatPercentage,
    error,
    lastUpdateFormatted,
    finanzasApi
  } = useReportesContext();

  const [topProductosTabla, setTopProductosTabla] = useState(null);
  const [loadingTopProductos, setLoadingTopProductos] = useState(false);

  useEffect(() => {
    if (!dashboardData) {
      cargarDashboard();
    }
  }, []);

  // ✅ Cargar top productos para tabla
  useEffect(() => {
    const cargarTopProductos = async () => {
      setLoadingTopProductos(true);
      try {
        const resultado = await finanzasApi.obtenerTopProductosTabla?.() || 
                          await finanzasApi.obtenerGananciasPorProducto({ limite: 5 });
        if (resultado.success) {
          setTopProductosTabla(resultado.data);
        }
      } catch (error) {
        console.error('Error cargando top productos:', error);
      } finally {
        setLoadingTopProductos(false);
      }
    };

    if (dashboardData) {
      cargarTopProductos();
    }
  }, [dashboardData]);

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
  const empleados = dashboardData?.empleados?.data;
  const ciudades = dashboardData?.ciudades?.data;

  // ✅ Verificar si hay suficientes datos para gráficos
  const tieneEvolucionDatos = ganancias && ganancias.length > 1;
  const tieneEmpleadosDatos = empleados && empleados.length > 0;
  const tieneCiudadesDatos = ciudades && ciudades.length > 0;

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

      {/* ✅ KPIs Principales - CAMBIADO TICKET POR FACTURA */}
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
          title="Factura Promedio"
          value={resumen?.ventas?.factura_promedio || resumen?.ventas?.ticket_promedio || 0}
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

      {/* ✅ EVOLUCIÓN TEMPORAL - Solo mostrar si hay datos suficientes */}
      {tieneEvolucionDatos ? (
        <CustomLineChart
          data={ganancias}
          xKey="periodo"
          yKeys={[
            { dataKey: 'ingresos_totales', name: 'Ingresos', color: '#10B981' },
            { dataKey: 'ganancia_estimada', name: 'Ganancia', color: '#3B82F6' }
          ]}
          title="Evolución de Ingresos y Ganancias"
          height={350}
          formatCurrency={formatCurrency}
          loading={isAnyLoading}
        />
      ) : (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Evolución de Ingresos y Ganancias</h3>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="mt-4 text-sm text-gray-500">
              Necesitas más datos históricos para ver la evolución temporal.
              <br />
              El gráfico se mostrará cuando tengas ventas en múltiples períodos.
            </p>
          </div>
        </div>
      )}

      {/* ✅ TOP 5 PRODUCTOS - TABLA EN LUGAR DE GRÁFICO */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top 5 Productos por Ganancia</h3>
        
        {loadingTopProductos ? (
          <div className="animate-pulse">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : topProductosTabla && topProductosTabla.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Promedio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad Vendida
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ganancia Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo Cálculo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProductosTabla.slice(0, 5).map((producto, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {producto.producto_nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {producto.categoria || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(producto.precio_promedio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {parseInt(producto.cantidad_vendida || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                      {formatCurrency(producto.ganancia_total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        producto.tipo_calculo === 'Con costo' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {producto.tipo_calculo || 'Estimado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No hay productos vendidos en el período seleccionado</p>
          </div>
        )}
      </div>

      {/* ✅ PERFORMANCE DE EMPLEADOS - TABLA MEJORADA */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance de Empleados</h3>
        
        {tieneEmpleadosDatos ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ventas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ganancia
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura Promedio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clientes Atendidos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margen %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {empleados.map((empleado, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {empleado.empleado_nombre}
                        </div>
                        {empleados.length === 1 && (
                          <div className="text-xs text-blue-600">
                            ⭐ Único vendedor activo
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {empleado.total_ventas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                      {formatCurrency(empleado.ingresos_generados)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-600">
                      {formatCurrency(empleado.ganancia_generada)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(empleado.factura_promedio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {empleado.clientes_atendidos || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        parseFloat(empleado.margen_promedio) >= 20 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {formatPercentage(empleado.margen_promedio)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {empleados.length === 1 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Solo hay un vendedor activo.</strong> Cuando tengas más vendedores podrás comparar su performance aquí.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No hay datos de empleados en el período seleccionado</p>
          </div>
        )}
      </div>

      {/* ✅ GANANCIAS POR CIUDAD - TABLA CON MÁS INFORMACIÓN */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ganancias por Ciudad</h3>
        
        {tieneCiudadesDatos ? (
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
                    Factura Promedio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % del Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ciudades.slice(0, 5).map((ciudad, index) => (
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
                      {ciudad.total_ventas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {ciudad.clientes_unicos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                      {formatCurrency(ciudad.ingresos_totales)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-600">
                      {formatCurrency(ciudad.ganancia_estimada)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(ciudad.factura_promedio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {ciudad.porcentaje_ingresos || '0'}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No hay datos de ciudades en el período seleccionado</p>
          </div>
        )}
      </div>

      {/* ✅ MÉTRICAS ÚTILES - REEMPLAZANDO LAS ADICIONALES */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas de Performance</h3>
        
        <MetricsGrid columns={3}>
          <MetricsCard
            title="Margen de Ganancia"
            value={formatPercentage(resumen?.ganancias?.margen_promedio || 0)}
            color="green"
            size="small"
            loading={isAnyLoading}
            subtitle="Promedio del período"
          />
          
          <MetricsCard
            title="Productos con Costo Definido"
            value={`${dashboardData?.ganancias?.data?.[0]?.productos_con_costo || 0}/${(dashboardData?.ganancias?.data?.[0]?.productos_con_costo || 0) + (dashboardData?.ganancias?.data?.[0]?.productos_sin_costo || 0)}`}
            color="blue"
            size="small"
            loading={isAnyLoading}
            subtitle="vs estimados (25%)"
          />
          
          <MetricsCard
            title="Concentración de Ventas"
            value={empleados?.length === 1 ? "1 vendedor" : `${empleados?.length || 0} vendedores`}
            color="purple"
            size="small"
            loading={isAnyLoading}
            subtitle="Equipo activo"
          />
        </MetricsGrid>
      </div>

      {/* ✅ INFORMACIÓN DEL SISTEMA MEJORADA */}
      {dashboardData && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>Período analizado:</strong> {ganancias?.length || 0} registros temporales
            </div>
            <div>
              <strong>Productos activos:</strong> {topProductosTabla?.length || 0} productos con ventas
            </div>
            <div>
              <strong>Empleados activos:</strong> {empleados?.length || 0} vendedores
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 <strong>Nota:</strong> Los productos sin costo definido usan un margen estimado del 25%. 
              Define costos reales para cálculos más precisos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}