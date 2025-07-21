// components/reportes/ProductAnalytics.jsx
import { useEffect, useState } from 'react';
import { useReportesContext } from '../../context/ReportesContext';
import { MetricsCard, FinancialMetricsCard, MetricsGrid } from '../charts/MetricsCard';
import { CustomPieChart, HorizontalBarChart, CustomBarChart } from '../charts/CustomCharts';

export function ProductAnalytics() {
  const {
    cargarDatos,
    isLoading,
    getData,
    getTotales,
    formatCurrency,
    formatPercentage,
    filtros
  } = useReportesContext();

  const [datosProductos, setDatosProductos] = useState({
    productosMasRentables: null,
    productosMasVendidos: null,
    gananciasPorProducto: null
  });

  // Cargar datos cuando cambie el componente o filtros
  useEffect(() => {
    cargarDatosProductos();
  }, [filtros]);

  const cargarDatosProductos = async () => {
    try {
      const [rentables, vendidos, ganancias] = await Promise.all([
        cargarDatos('productosMasRentables', { limite: 20 }),
        cargarDatos('productosMasVendidos', { limite: 20 }),
        cargarDatos('gananciasPorProducto', { limite: 30 })
      ]);

      setDatosProductos({
        productosMasRentables: rentables.success ? rentables.data : null,
        productosMasVendidos: vendidos.success ? vendidos.data : null,
        gananciasPorProducto: ganancias.success ? ganancias.data : null
      });
    } catch (error) {
      console.error('Error cargando datos de productos:', error);
    }
  };

  const { 
    productosMasRentables, 
    productosMasVendidos, 
    gananciasPorProducto 
  } = datosProductos;

  const isLoadingAny = isLoading('productosMasRentables') || 
                      isLoading('productosMasVendidos') || 
                      isLoading('gananciasPorProducto');

  // Calcular métricas generales
  const totalProductosVendidos = gananciasPorProducto?.length || 0;
  const totalCantidadVendida = gananciasPorProducto?.reduce((acc, item) => 
    acc + (parseInt(item.cantidad_total_vendida) || 0), 0) || 0;
  const totalIngresosPorProductos = gananciasPorProducto?.reduce((acc, item) => 
    acc + (parseFloat(item.ingresos_producto) || 0), 0) || 0;
  const totalGananciaPorProductos = gananciasPorProducto?.reduce((acc, item) => 
    acc + (parseFloat(item.ganancia_estimada) || 0), 0) || 0;

  // Calcular margen promedio
  const margenPromedio = totalIngresosPorProductos > 0 ? 
    (totalGananciaPorProductos / totalIngresosPorProductos) * 100 : 0;

  // Preparar datos para gráfico de distribución por margen
  const productosPorMargen = gananciasPorProducto?.reduce((acc, producto) => {
    const margen = parseFloat(producto.margen_porcentaje || 0);
    let categoria;
    
    if (margen >= 40) categoria = 'Alto (40%+)';
    else if (margen >= 25) categoria = 'Medio (25-40%)';
    else if (margen >= 15) categoria = 'Bajo (15-25%)';
    else categoria = 'Muy Bajo (<15%)';
    
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {}) || {};

  const datosDistribucionMargen = Object.entries(productosPorMargen).map(([categoria, cantidad]) => ({
    categoria,
    cantidad,
    porcentaje: totalProductosVendidos > 0 ? (cantidad / totalProductosVendidos) * 100 : 0
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Análisis de Productos</h2>
          <p className="text-sm text-gray-500 mt-1">
            Performance detallado de productos por rentabilidad y ventas
          </p>
        </div>
        
        <button
          onClick={cargarDatosProductos}
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

      {/* KPIs de Productos */}
      <MetricsGrid columns={4}>
        <MetricsCard
          title="Productos Analizados"
          value={totalProductosVendidos}
          color="blue"
          loading={isLoadingAny}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />

        <MetricsCard
          title="Unidades Vendidas"
          value={totalCantidadVendida.toLocaleString()}
          color="green"
          loading={isLoadingAny}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />

        <FinancialMetricsCard
          title="Ingresos Totales"
          value={totalIngresosPorProductos}
          formatCurrency={formatCurrency}
          color="purple"
          loading={isLoadingAny}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
        />

        <MetricsCard
          title="Margen Promedio"
          value={formatPercentage(margenPromedio)}
          color="yellow"
          loading={isLoadingAny}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </MetricsGrid>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Productos Más Rentables */}
        <HorizontalBarChart
          data={productosMasRentables?.slice(0, 10)}
          xKey="producto_nombre"
          yKey="ganancia_total"
          title="Top 10 Productos Más Rentables"
          height={350}
          formatCurrency={formatCurrency}
          loading={isLoadingAny}
          maxItems={10}
        />

        {/* Distribución por Margen */}
        <CustomPieChart
          data={datosDistribucionMargen}
          nameKey="categoria"
          valueKey="cantidad"
          title="Distribución por Margen de Ganancia"
          height={350}
          loading={isLoadingAny}
          showPercentage={true}
        />
      </div>

      {/* Comparativa Rentabilidad vs Volumen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HorizontalBarChart
          data={productosMasVendidos?.slice(0, 10)}
          xKey="producto_nombre"
          yKey="total_vendida"
          title="Top 10 Productos Más Vendidos (Cantidad)"
          height={300}
          loading={isLoadingAny}
          maxItems={10}
        />

        <CustomBarChart
          data={productosMasRentables?.slice(0, 8)}
          xKey="producto_nombre"
          yKeys={[
            { dataKey: 'margen_porcentaje', name: 'Margen %', color: '#8B5CF6' },
            { dataKey: 'cantidad_vendida', name: 'Cantidad Vendida', color: '#06B6D4' }
          ]}
          title="Rentabilidad vs Volumen"
          height={300}
          formatPercentage={formatPercentage}
          loading={isLoadingAny}
        />
      </div>

      {/* Tabla Detallada de Productos */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Análisis Detallado de Productos
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cant. Vendida
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Promedio
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gananciasPorProducto?.slice(0, 15).map((producto, index) => {
                const margen = parseFloat(producto.margen_porcentaje || 0);
                const performanceColor = margen >= 30 ? 'text-green-600' : 
                                       margen >= 20 ? 'text-yellow-600' : 'text-red-600';
                const performanceIcon = margen >= 30 ? '🟢' : 
                                      margen >= 20 ? '🟡' : '🔴';
                
                return (
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
                      {parseInt(producto.cantidad_total_vendida || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(producto.precio_promedio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                      {formatCurrency(producto.ingresos_producto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-600">
                      {formatCurrency(producto.ganancia_estimada)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        margen >= 30 
                          ? 'bg-green-100 text-green-800'
                          : margen >= 20
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {formatPercentage(margen)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`font-medium ${performanceColor}`}>
                        {performanceIcon} {margen >= 30 ? 'Excelente' : 
                                         margen >= 20 ? 'Buena' : 'Mejorable'}
                      </span>
                    </td>
                  </tr>
                );
              }) || (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    {isLoadingAny ? 'Cargando productos...' : 'No hay datos de productos'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights y Recomendaciones */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Insights de Productos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Producto Estrella</div>
                <div className="text-lg font-bold text-gray-900">
                  {productosMasRentables?.[0]?.producto_nombre?.slice(0, 20) || 'N/A'}
                  {productosMasRentables?.[0]?.producto_nombre?.length > 20 && '...'}
                </div>
                <div className="text-sm text-green-600">
                  {formatCurrency(productosMasRentables?.[0]?.ganancia_total || 0)} ganancia
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Productos Alta Rentabilidad</div>
                <div className="text-2xl font-bold text-gray-900">
                  {datosDistribucionMargen.find(d => d.categoria === 'Alto (40%+)')?.cantidad || 0}
                </div>
                <div className="text-sm text-blue-600">
                  {formatPercentage(datosDistribucionMargen.find(d => d.categoria === 'Alto (40%+)')?.porcentaje || 0)} del total
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Productos Bajo Margen</div>
                <div className="text-2xl font-bold text-gray-900">
                  {datosDistribucionMargen.find(d => d.categoria === 'Muy Bajo (<15%)')?.cantidad || 0}
                </div>
                <div className="text-sm text-red-600">
                  Requieren atención
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-md font-semibold text-blue-900 mb-2">🎯 Recomendaciones</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Promocionar productos con margen superior al 30% para maximizar rentabilidad</li>
            <li>• Revisar precios de productos con margen inferior al 15%</li>
            <li>• Analizar costos de productos más vendidos para optimizar ganancias</li>
            <li>• Considerar descontinuar productos con baja rentabilidad y pocas ventas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}