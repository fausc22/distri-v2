// hooks/useFinanzasData.js
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { axiosAuth } from '../utils/apiClient';

export function useFinanzasData() {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  // Función helper para manejar loading por endpoint
  const setLoadingState = (endpoint, isLoading) => {
    setLoading(prev => ({
      ...prev,
      [endpoint]: isLoading
    }));
  };

  // Función helper para manejar errores
  const handleError = (error, endpoint) => {
    console.error(`Error en ${endpoint}:`, error);
    const message = error.response?.data?.message || `Error al cargar ${endpoint}`;
    setError(message);
    toast.error(message);
    return { success: false, data: null, error: message };
  };

  // 📊 OBTENER GANANCIAS DETALLADAS
  const obtenerGananciasDetalladas = useCallback(async (filtros = {}) => {
    const endpoint = 'ganancias-detalladas';
    setLoadingState(endpoint, true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });

      const response = await axiosAuth.get(`/finanzas/ganancias-detalladas?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data, totales: response.data.totales, periodo: response.data.periodo };
      } else {
        return handleError(new Error(response.data.message), endpoint);
      }
    } catch (error) {
      return handleError(error, endpoint);
    } finally {
      setLoadingState(endpoint, false);
    }
  }, []);

  // 🏆 OBTENER GANANCIAS POR PRODUCTO
  const obtenerGananciasPorProducto = useCallback(async (filtros = {}) => {
    const endpoint = 'ganancias-por-producto';
    setLoadingState(endpoint, true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });

      const response = await axiosAuth.get(`/finanzas/ganancias-por-producto?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return handleError(new Error(response.data.message), endpoint);
      }
    } catch (error) {
      return handleError(error, endpoint);
    } finally {
      setLoadingState(endpoint, false);
    }
  }, []);

  // 👥 OBTENER GANANCIAS POR EMPLEADO
  const obtenerGananciasPorEmpleado = useCallback(async (filtros = {}) => {
    const endpoint = 'ganancias-por-empleado';
    setLoadingState(endpoint, true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });

      const response = await axiosAuth.get(`/finanzas/ganancias-por-empleado?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return handleError(new Error(response.data.message), endpoint);
      }
    } catch (error) {
      return handleError(error, endpoint);
    } finally {
      setLoadingState(endpoint, false);
    }
  }, []);

  // 🌍 OBTENER GANANCIAS POR CIUDAD
  const obtenerGananciasPorCiudad = useCallback(async (filtros = {}) => {
    const endpoint = 'ganancias-por-ciudad';
    setLoadingState(endpoint, true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });

      const response = await axiosAuth.get(`/finanzas/ganancias-por-ciudad?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return handleError(new Error(response.data.message), endpoint);
      }
    } catch (error) {
      return handleError(error, endpoint);
    } finally {
      setLoadingState(endpoint, false);
    }
  }, []);

  // 📈 OBTENER RESUMEN FINANCIERO
  const obtenerResumenFinanciero = useCallback(async (filtros = {}) => {
    const endpoint = 'resumen-financiero';
    setLoadingState(endpoint, true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });

      const response = await axiosAuth.get(`/finanzas/resumen-financiero?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return handleError(new Error(response.data.message), endpoint);
      }
    } catch (error) {
      return handleError(error, endpoint);
    } finally {
      setLoadingState(endpoint, false);
    }
  }, []);

  // 💰 OBTENER PRODUCTOS MÁS RENTABLES
  const obtenerProductosMasRentables = useCallback(async (filtros = {}) => {
    const endpoint = 'productos-mas-rentables';
    setLoadingState(endpoint, true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });

      const response = await axiosAuth.get(`/finanzas/productos-mas-rentables?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return handleError(new Error(response.data.message), endpoint);
      }
    } catch (error) {
      return handleError(error, endpoint);
    } finally {
      setLoadingState(endpoint, false);
    }
  }, []);

  // 📊 OBTENER BALANCE GENERAL (usar función existente)
  const obtenerBalanceGeneral = useCallback(async (filtros = {}) => {
    const endpoint = 'balance-general';
    setLoadingState(endpoint, true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });

      const response = await axiosAuth.get(`/finanzas/balance-general?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data, totales: response.data.totales };
      } else {
        return handleError(new Error(response.data.message), endpoint);
      }
    } catch (error) {
      return handleError(error, endpoint);
    } finally {
      setLoadingState(endpoint, false);
    }
  }, []);

  // 📋 OBTENER PRODUCTOS MÁS VENDIDOS (usar función existente)
  const obtenerProductosMasVendidos = useCallback(async (filtros = {}) => {
    const endpoint = 'ventas-productos';
    setLoadingState(endpoint, true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });

      const response = await axiosAuth.get(`/finanzas/ventas-productos?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return handleError(new Error(response.data.message), endpoint);
      }
    } catch (error) {
      return handleError(error, endpoint);
    } finally {
      setLoadingState(endpoint, false);
    }
  }, []);

  // 🔄 FUNCIÓN PARA RECARGAR TODOS LOS DATOS
  const recargarTodosLosDatos = useCallback(async (filtros = {}) => {
    setError(null);
    
    const resultados = await Promise.allSettled([
      obtenerResumenFinanciero(filtros),
      obtenerGananciasDetalladas(filtros),
      obtenerGananciasPorProducto({ ...filtros, limite: 10 }),
      obtenerGananciasPorEmpleado(filtros),
      obtenerGananciasPorCiudad({ ...filtros, limite: 10 }),
      obtenerProductosMasRentables({ ...filtros, limite: 10 }),
      obtenerProductosMasVendidos({ ...filtros, limite: 10 })
    ]);

    const errores = resultados
      .filter(resultado => resultado.status === 'rejected')
      .map(resultado => resultado.reason);

    if (errores.length > 0) {
      console.error('Errores cargando datos:', errores);
      toast.error(`Error cargando ${errores.length} conjunto(s) de datos`);
    } else {
      toast.success('Todos los datos actualizados');
    }

    return {
      resumenFinanciero: resultados[0].status === 'fulfilled' ? resultados[0].value : null,
      gananciasDetalladas: resultados[1].status === 'fulfilled' ? resultados[1].value : null,
      gananciasPorProducto: resultados[2].status === 'fulfilled' ? resultados[2].value : null,
      gananciasPorEmpleado: resultados[3].status === 'fulfilled' ? resultados[3].value : null,
      gananciasPorCiudad: resultados[4].status === 'fulfilled' ? resultados[4].value : null,
      productosMasRentables: resultados[5].status === 'fulfilled' ? resultados[5].value : null,
      productosMasVendidos: resultados[6].status === 'fulfilled' ? resultados[6].value : null
    };
  }, [
    obtenerResumenFinanciero,
    obtenerGananciasDetalladas,
    obtenerGananciasPorProducto,
    obtenerGananciasPorEmpleado,
    obtenerGananciasPorCiudad,
    obtenerProductosMasRentables,
    obtenerProductosMasVendidos
  ]);

  // 🧹 LIMPIAR ERRORES
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  // 📊 FORMATEAR CURRENCY
  const formatCurrency = useCallback((value) => {
    if (value === undefined || value === null || isNaN(value)) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }, []);

  // 📈 FORMATEAR PORCENTAJE
  const formatPercentage = useCallback((value) => {
    if (value === undefined || value === null || isNaN(value)) return '0%';
    return `${parseFloat(value).toFixed(1)}%`;
  }, []);


  const obtenerVentasPorVendedor = useCallback(async (filtros = {}) => {
  const endpoint = 'ventas-vendedores';
  setLoadingState(endpoint, true);
  setError(null);

  try {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosAuth.get(`/finanzas/ventas-vendedores?${params.toString()}`);
    
    if (response.data.success) {
      return { success: true, data: response.data.data };
    } else {
      return handleError(new Error(response.data.message), endpoint);
    }
  } catch (error) {
    return handleError(error, endpoint);
  } finally {
    setLoadingState(endpoint, false);
  }
}, []);

// 📊 OBTENER BALANCE POR CUENTA
const obtenerBalancePorCuenta = useCallback(async (filtros = {}) => {
  const endpoint = 'balance-cuenta';
  setLoadingState(endpoint, true);
  setError(null);

  try {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosAuth.get(`/finanzas/balance-cuenta?${params.toString()}`);
    
    if (response.data.success) {
      return { success: true, data: response.data.data };
    } else {
      return handleError(new Error(response.data.message), endpoint);
    }
  } catch (error) {
    return handleError(error, endpoint);
  } finally {
    setLoadingState(endpoint, false);
  }
}, []);

// 💰 OBTENER FLUJO DE FONDOS
const obtenerFlujoDeFondos = useCallback(async (filtros = {}) => {
  const endpoint = 'flujo-fondos';
  setLoadingState(endpoint, true);
  setError(null);

  try {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosAuth.get(`/finanzas/flujo-fondos?${params.toString()}`);
    
    if (response.data.success) {
      return { success: true, data: response.data.data, totales: response.data.totales };
    } else {
      return handleError(new Error(response.data.message), endpoint);
    }
  } catch (error) {
    return handleError(error, endpoint);
  } finally {
    setLoadingState(endpoint, false);
  }
}, []);

// 📈 OBTENER DISTRIBUCIÓN DE INGRESOS
const obtenerDistribucionIngresos = useCallback(async (filtros = {}) => {
  const endpoint = 'distribucion-ingresos';
  setLoadingState(endpoint, true);
  setError(null);

  try {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosAuth.get(`/finanzas/distribucion-ingresos?${params.toString()}`);
    
    if (response.data.success) {
      return { success: true, data: response.data.data, total: response.data.total };
    } else {
      return handleError(new Error(response.data.message), endpoint);
    }
  } catch (error) {
    return handleError(error, endpoint);
  } finally {
    setLoadingState(endpoint, false);
  }
}, []);

// 🏷️ OBTENER GASTOS POR CATEGORÍA
const obtenerGastosPorCategoria = useCallback(async (filtros = {}) => {
  const endpoint = 'gastos-categoria';
  setLoadingState(endpoint, true);
  setError(null);

  try {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });

    const response = await axiosAuth.get(`/finanzas/gastos-categoria?${params.toString()}`);
    
    if (response.data.success) {
      return { success: true, data: response.data.data, total: response.data.total };
    } else {
      return handleError(new Error(response.data.message), endpoint);
    }
  } catch (error) {
    return handleError(error, endpoint);
  } finally {
    setLoadingState(endpoint, false);
  }
}, []);

// 📅 OBTENER AÑOS DISPONIBLES
const obtenerAniosDisponibles = useCallback(async () => {
  const endpoint = 'anios-disponibles';
  setLoadingState(endpoint, true);
  setError(null);

  try {
    const response = await axiosAuth.get('/finanzas/anios-disponibles');
    
    if (response.data.success) {
      return { success: true, data: response.data.data };
    } else {
      return handleError(new Error(response.data.message), endpoint);
    }
  } catch (error) {
    return handleError(error, endpoint);
  } finally {
    setLoadingState(endpoint, false);
  }
}, []);

// 🔄 FUNCIÓN PARA RECARGAR TODOS LOS DATOS EXTENDIDA
const recargarTodosLosDatosExtendido = useCallback(async (filtros = {}) => {
  setError(null);
  
  const resultados = await Promise.allSettled([
    obtenerResumenFinanciero(filtros),
    obtenerGananciasDetalladas(filtros),
    obtenerGananciasPorProducto({ ...filtros, limite: 15 }),
    obtenerGananciasPorEmpleado(filtros),
    obtenerGananciasPorCiudad({ ...filtros, limite: 15 }),
    obtenerProductosMasRentables({ ...filtros, limite: 15 }),
    obtenerProductosMasVendidos({ ...filtros, limite: 15 }),
    obtenerBalanceGeneral(filtros),
    obtenerBalancePorCuenta(filtros),
    obtenerFlujoDeFondos(filtros),
    obtenerVentasPorVendedor(filtros),
    obtenerDistribucionIngresos(filtros),
    obtenerGastosPorCategoria(filtros)
  ]);

  const errores = resultados
    .filter(resultado => resultado.status === 'rejected')
    .map(resultado => resultado.reason);

  if (errores.length > 0) {
    console.error('Errores cargando datos extendidos:', errores);
    toast.error(`Error cargando ${errores.length} conjunto(s) de datos`);
  } else {
    toast.success('Todos los datos actualizados exitosamente');
  }

  return {
    resumenFinanciero: resultados[0].status === 'fulfilled' ? resultados[0].value : null,
    gananciasDetalladas: resultados[1].status === 'fulfilled' ? resultados[1].value : null,
    gananciasPorProducto: resultados[2].status === 'fulfilled' ? resultados[2].value : null,
    gananciasPorEmpleado: resultados[3].status === 'fulfilled' ? resultados[3].value : null,
    gananciasPorCiudad: resultados[4].status === 'fulfilled' ? resultados[4].value : null,
    productosMasRentables: resultados[5].status === 'fulfilled' ? resultados[5].value : null,
    productosMasVendidos: resultados[6].status === 'fulfilled' ? resultados[6].value : null,
    balanceGeneral: resultados[7].status === 'fulfilled' ? resultados[7].value : null,
    balancePorCuenta: resultados[8].status === 'fulfilled' ? resultados[8].value : null,
    flujoDeFondos: resultados[9].status === 'fulfilled' ? resultados[9].value : null,
    ventasPorVendedor: resultados[10].status === 'fulfilled' ? resultados[10].value : null,
    distribucionIngresos: resultados[11].status === 'fulfilled' ? resultados[11].value : null,
    gastosPorCategoria: resultados[12].status === 'fulfilled' ? resultados[12].value : null
  };
}, [
  obtenerResumenFinanciero,
  obtenerGananciasDetalladas,
  obtenerGananciasPorProducto,
  obtenerGananciasPorEmpleado,
  obtenerGananciasPorCiudad,
  obtenerProductosMasRentables,
  obtenerProductosMasVendidos,
  obtenerBalanceGeneral,
  obtenerBalancePorCuenta,
  obtenerFlujoDeFondos,
  obtenerVentasPorVendedor,
  obtenerDistribucionIngresos,
  obtenerGastosPorCategoria
]);

  return {
  loading,
  error,

  // Funciones principales existentes (mantener todas)
  obtenerGananciasDetalladas,
  obtenerGananciasPorProducto,
  obtenerGananciasPorEmpleado,
  obtenerGananciasPorCiudad,
  obtenerResumenFinanciero,
  obtenerProductosMasRentables,
  obtenerBalanceGeneral,
  obtenerProductosMasVendidos,

  // ✅ NUEVAS FUNCIONES
  obtenerVentasPorVendedor,
  obtenerBalancePorCuenta,
  obtenerFlujoDeFondos,
  obtenerDistribucionIngresos,
  obtenerGastosPorCategoria,
  obtenerAniosDisponibles,

  // Utilidades existentes (mantener)
  recargarTodosLosDatos,
  limpiarError,
  formatCurrency,
  formatPercentage,

  // ✅ NUEVA UTILIDAD EXTENDIDA
  recargarTodosLosDatosExtendido,

  // Helpers para verificar loading (mantener)
  isLoading: (endpoint) => loading[endpoint] || false,
  isAnyLoading: Object.values(loading).some(Boolean)
  };
}