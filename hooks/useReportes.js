// hooks/useReportes.js
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';

export function useReportes() {
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    desde: '',
    hasta: '',
    periodo: 'mensual', // diario, mensual, anual
    empleado_id: '',
    ciudad: '',
    limite: 20
  });

  // Estado para el reporte activo
  const [reporteActivo, setReporteActivo] = useState('dashboard');

  // Estado para mostrar/ocultar filtros
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Función para aplicar filtros por defecto al cargar
  useEffect(() => {
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const unMesAtras = new Date();
    unMesAtras.setMonth(hoy.getMonth() - 1);

    setFiltros(prev => ({
      ...prev,
      desde: prev.desde || unMesAtras.toISOString().split('T')[0],
      hasta: prev.hasta || hoy.toISOString().split('T')[0]
    }));
  }, []);

  // Función para actualizar filtros
  const updateFiltros = (nuevosFiltros) => {
    setFiltros(prev => ({
      ...prev,
      ...nuevosFiltros
    }));
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    const hoy = new Date();
    const unMesAtras = new Date();
    unMesAtras.setMonth(hoy.getMonth() - 1);

    setFiltros({
      desde: unMesAtras.toISOString().split('T')[0],
      hasta: hoy.toISOString().split('T')[0],
      periodo: 'mensual',
      empleado_id: '',
      ciudad: '',
      limite: 20
    });

    toast.success('Filtros restablecidos');
  };

  // Función para establecer período predefinido
  const setPeriodoPredefinido = (periodo) => {
    const hoy = new Date();
    let desde = new Date();

    switch (periodo) {
      case 'hoy':
        desde = new Date();
        setFiltros(prev => ({
          ...prev,
          desde: desde.toISOString().split('T')[0],
          hasta: hoy.toISOString().split('T')[0],
          periodo: 'diario'
        }));
        break;
      case 'semana':
        desde.setDate(hoy.getDate() - 7);
        setFiltros(prev => ({
          ...prev,
          desde: desde.toISOString().split('T')[0],
          hasta: hoy.toISOString().split('T')[0],
          periodo: 'diario'
        }));
        break;
      case 'mes':
        desde.setMonth(hoy.getMonth() - 1);
        setFiltros(prev => ({
          ...prev,
          desde: desde.toISOString().split('T')[0],
          hasta: hoy.toISOString().split('T')[0],
          periodo: 'mensual'
        }));
        break;
      case 'trimestre':
        desde.setMonth(hoy.getMonth() - 3);
        setFiltros(prev => ({
          ...prev,
          desde: desde.toISOString().split('T')[0],
          hasta: hoy.toISOString().split('T')[0],
          periodo: 'mensual'
        }));
        break;
      case 'año':
        desde.setFullYear(hoy.getFullYear() - 1);
        setFiltros(prev => ({
          ...prev,
          desde: desde.toISOString().split('T')[0],
          hasta: hoy.toISOString().split('T')[0],
          periodo: 'anual'
        }));
        break;
      default:
        break;
    }
  };

  // Función para formatear fechas para mostrar
  const formatearPeriodo = (desde, hasta) => {
    if (!desde || !hasta) return 'Período no definido';
    
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    
    const opcionesFormato = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    return `${fechaDesde.toLocaleDateString('es-AR', opcionesFormato)} - ${fechaHasta.toLocaleDateString('es-AR', opcionesFormato)}`;
  };

  // Función para construir query params
  const buildQueryParams = (filtrosPersonalizados = {}) => {
    const filtrosFinales = { ...filtros, ...filtrosPersonalizados };
    const params = new URLSearchParams();

    Object.entries(filtrosFinales).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });

    return params.toString();
  };

  // Validar si el período seleccionado es válido
  const isPeriodoValido = useMemo(() => {
    if (!filtros.desde || !filtros.hasta) return false;
    
    const desde = new Date(filtros.desde);
    const hasta = new Date(filtros.hasta);
    
    return desde <= hasta;
  }, [filtros.desde, filtros.hasta]);

  // Calcular días en el período seleccionado
  const diasEnPeriodo = useMemo(() => {
    if (!isPeriodoValido) return 0;
    
    const desde = new Date(filtros.desde);
    const hasta = new Date(filtros.hasta);
    const diferencia = hasta.getTime() - desde.getTime();
    
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }, [filtros.desde, filtros.hasta, isPeriodoValido]);

  // Función para validar filtros antes de hacer request
  const validarFiltros = () => {
    if (!isPeriodoValido) {
      toast.error('El período seleccionado no es válido');
      return false;
    }

    if (diasEnPeriodo > 365) {
      toast.warning('El período seleccionado es muy amplio, los datos pueden tardar en cargar');
    }

    return true;
  };

  return {
    // Estados
    filtros,
    reporteActivo,
    mostrarFiltros,
    isPeriodoValido,
    diasEnPeriodo,

    // Funciones de filtros
    updateFiltros,
    limpiarFiltros,
    setPeriodoPredefinido,
    validarFiltros,

    // Funciones de reporte
    setReporteActivo,
    setMostrarFiltros,

    // Utilidades
    formatearPeriodo: formatearPeriodo(filtros.desde, filtros.hasta),
    buildQueryParams,

    // Botones de período predefinido
    periodosPredefinidos: [
      { key: 'hoy', label: 'Hoy', periodo: 'diario' },
      { key: 'semana', label: 'Última semana', periodo: 'diario' },
      { key: 'mes', label: 'Último mes', periodo: 'mensual' },
      { key: 'trimestre', label: 'Último trimestre', periodo: 'mensual' },
      { key: 'año', label: 'Último año', periodo: 'anual' }
    ]
  };
}