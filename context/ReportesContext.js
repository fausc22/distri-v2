// context/ReportesContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';
import { useReportes } from '../hooks/useReportes';
import { useFinanzasData } from '../hooks/useFinanzasData';

const ReportesContext = createContext();

// Reducer para manejar el estado de reportes
function reportesReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.key]: action.payload.data
        }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.loading
        }
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'SET_DASHBOARD_DATA':
      return {
        ...state,
        dashboardData: action.payload,
        lastUpdate: Date.now()
      };
    
    case 'REFRESH_DATA':
      return {
        ...state,
        refreshing: true,
        lastRefresh: Date.now()
      };
    
    case 'REFRESH_COMPLETE':
      return {
        ...state,
        refreshing: false,
        lastUpdate: Date.now()
      };
    
    default:
      return state;
  }
}

const initialState = {
  data: {
    resumenFinanciero: null,
    gananciasDetalladas: null,
    gananciasPorProducto: null,
    gananciasPorEmpleado: null,
    gananciasPorCiudad: null,
    productosMasRentables: null,
    productosMasVendidos: null,
    balanceGeneral: null,

    balancePorCuenta: null,
    flujoDeFondos: null,
    ventasPorVendedor: null,
    distribucionIngresos: null,
    gastosPorCategoria: null,
    aniosDisponibles: null

  },
  dashboardData: null,
  loading: {},
  error: null,
  refreshing: false,
  lastUpdate: null,
  lastRefresh: null
};

export function ReportesProvider({ children }) {
  const [state, dispatch] = useReducer(reportesReducer, initialState);
  
  // Hooks personalizados
  const reportesConfig = useReportes();
  const finanzasApi = useFinanzasData();

    // Función para cargar datos específicos
  const cargarDatos = async (tipoReporte, filtrosCustom = {}) => {
    dispatch({ type: 'SET_LOADING', payload: { key: tipoReporte, loading: true } });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const filtros = { ...reportesConfig.filtros, ...filtrosCustom };
      let resultado;

      switch (tipoReporte) {
        // Casos existentes (mantener todos)
        case 'resumenFinanciero':
          resultado = await finanzasApi.obtenerResumenFinanciero(filtros);
          break;
        case 'gananciasDetalladas':
          resultado = await finanzasApi.obtenerGananciasDetalladas(filtros);
          break;
        case 'gananciasPorProducto':
          resultado = await finanzasApi.obtenerGananciasPorProducto(filtros);
          break;
        case 'gananciasPorEmpleado':
          resultado = await finanzasApi.obtenerGananciasPorEmpleado(filtros);
          break;
        case 'gananciasPorCiudad':
          resultado = await finanzasApi.obtenerGananciasPorCiudad(filtros);
          break;
        case 'productosMasRentables':
          resultado = await finanzasApi.obtenerProductosMasRentables(filtros);
          break;
        case 'productosMasVendidos':
          resultado = await finanzasApi.obtenerProductosMasVendidos(filtros);
          break;
        case 'balanceGeneral':
          resultado = await finanzasApi.obtenerBalanceGeneral(filtros);
          break;
        
        // ✅ NUEVOS CASOS
        case 'balancePorCuenta':
          resultado = await finanzasApi.obtenerBalancePorCuenta(filtros);
          break;
        case 'flujoDeFondos':
          resultado = await finanzasApi.obtenerFlujoDeFondos(filtros);
          break;
        case 'ventasPorVendedor':
          resultado = await finanzasApi.obtenerVentasPorVendedor(filtros);
          break;
        case 'distribucionIngresos':
          resultado = await finanzasApi.obtenerDistribucionIngresos(filtros);
          break;
        case 'gastosPorCategoria':
          resultado = await finanzasApi.obtenerGastosPorCategoria(filtros);
          break;
        case 'aniosDisponibles':
          resultado = await finanzasApi.obtenerAniosDisponibles();
          break;
        
        default:
          throw new Error(`Tipo de reporte no reconocido: ${tipoReporte}`);
      }

      if (resultado.success) {
        dispatch({
          type: 'SET_DATA',
          payload: { key: tipoReporte, data: resultado }
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: resultado.error });
      }

      return resultado;

    } catch (error) {
      const errorMsg = error.message || 'Error cargando datos';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: tipoReporte, loading: false } });
    }
  };

  // Función para cargar dashboard completo
  const cargarDashboard = async (filtrosCustom = {}) => {
  dispatch({ type: 'REFRESH_DATA' });

  try {
    const filtros = { ...reportesConfig.filtros, ...filtrosCustom };
    
    // ✅ Cargar datos principales + nuevos datos para dashboard
    const resultados = await Promise.allSettled([
      finanzasApi.obtenerResumenFinanciero(filtros),
      finanzasApi.obtenerGananciasDetalladas(filtros),
      finanzasApi.obtenerGananciasPorProducto({ ...filtros, limite: 5 }),
      finanzasApi.obtenerGananciasPorEmpleado(filtros),
      finanzasApi.obtenerGananciasPorCiudad({ ...filtros, limite: 5 }),
      finanzasApi.obtenerVentasPorVendedor(filtros), // ✅ NUEVO
      finanzasApi.obtenerBalanceGeneral(filtros),    // ✅ NUEVO
      finanzasApi.obtenerProductosMasVendidos({ ...filtros, limite: 5 }) // ✅ NUEVO
    ]);

    // Procesar resultados
    const dashboardData = {
      resumen: resultados[0].status === 'fulfilled' ? resultados[0].value : null,
      ganancias: resultados[1].status === 'fulfilled' ? resultados[1].value : null,
      topProductos: resultados[2].status === 'fulfilled' ? resultados[2].value : null,
      empleados: resultados[3].status === 'fulfilled' ? resultados[3].value : null,
      ciudades: resultados[4].status === 'fulfilled' ? resultados[4].value : null,
      vendedores: resultados[5].status === 'fulfilled' ? resultados[5].value : null, // ✅ NUEVO
      balance: resultados[6].status === 'fulfilled' ? resultados[6].value : null,    // ✅ NUEVO
      topVendidos: resultados[7].status === 'fulfilled' ? resultados[7].value : null // ✅ NUEVO
    };

    // Verificar si hay errores
    const errores = resultados
      .filter(resultado => resultado.status === 'rejected')
      .map(resultado => resultado.reason?.message || 'Error desconocido');

    if (errores.length > 0) {
      dispatch({ type: 'SET_ERROR', payload: `Errores cargando: ${errores.join(', ')}` });
    }

    dispatch({ type: 'SET_DASHBOARD_DATA', payload: dashboardData });
    
    return { success: true, data: dashboardData, errores };

  } catch (error) {
    const errorMsg = error.message || 'Error cargando dashboard';
    dispatch({ type: 'SET_ERROR', payload: errorMsg });
    return { success: false, error: errorMsg };
  } finally {
    dispatch({ type: 'REFRESH_COMPLETE' });
  }
};

  // Función para actualizar todo
  const actualizarTodo = async () => {
    if (!reportesConfig.validarFiltros()) {
      return { success: false, error: 'Filtros inválidos' };
    }

    return await cargarDashboard();
  };

  // Función para limpiar datos
  const limpiarDatos = () => {
    dispatch({ type: 'SET_DASHBOARD_DATA', payload: null });
    Object.keys(state.data).forEach(key => {
      dispatch({ type: 'SET_DATA', payload: { key, data: null } });
    });
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Auto-cargar datos cuando cambien los filtros principales
  useEffect(() => {
    if (reportesConfig.filtros.desde && reportesConfig.filtros.hasta) {
      cargarDashboard();
    }
  }, [reportesConfig.filtros.desde, reportesConfig.filtros.hasta, reportesConfig.filtros.periodo]);

  // Valores del contexto
  const contextValue = {
    // Estado
    ...state,
    
    // Configuración de reportes
    ...reportesConfig,
    
    // API de finanzas
    finanzasApi,
    
    // Funciones principales
    cargarDatos,
    cargarDashboard,
    actualizarTodo,
    limpiarDatos,
    
    // Utilidades
    isLoading: (key) => state.loading[key] || false,
    isAnyLoading: Object.values(state.loading).some(Boolean) || state.refreshing,
    hasData: (key) => !!state.data[key]?.success,
    getData: (key) => state.data[key]?.data || null,
    getTotales: (key) => state.data[key]?.totales || null,
    
    // Información de estado
    lastUpdateFormatted: state.lastUpdate ? 
      new Date(state.lastUpdate).toLocaleTimeString('es-AR') : 
      'Nunca',
    
    // Helpers para formateo
    formatCurrency: finanzasApi.formatCurrency,
    formatPercentage: finanzasApi.formatPercentage
  };

  return (
    <ReportesContext.Provider value={contextValue}>
      {children}
    </ReportesContext.Provider>
  );
}

export function useReportesContext() {
  const context = useContext(ReportesContext);
  if (!context) {
    throw new Error('useReportesContext debe ser usado dentro de ReportesProvider');
  }
  return context;
}