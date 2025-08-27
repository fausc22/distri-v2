// pages/edicion/GestionClientes.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Head from 'next/head';
import useAuth from '../hooks/useAuth';
import { axiosAuth } from '../utils/apiClient';

// Componente del modal de edición
function ModalEditarCliente({ cliente, isOpen, onClose, onClienteActualizado }) {
  const [formData, setFormData] = useState({
    nombre: '',
    condicion_iva: '',
    cuit: '',
    dni: '',
    direccion: '',
    ciudad: '',
    ciudad_id: '',
    provincia: '',
    telefono: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  // Llenar formulario cuando se selecciona un cliente
  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        condicion_iva: cliente.condicion_iva || '',
        cuit: cliente.cuit || '',
        dni: cliente.dni || '',
        direccion: cliente.direccion || '',
        ciudad: cliente.ciudad || '',
        ciudad_id: cliente.ciudad_id || '',
        provincia: cliente.provincia || '',
        telefono: cliente.telefono || '',
        email: cliente.email || ''
      });
    }
  }, [cliente]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosAuth.put(`/personas/actualizar-cliente/${cliente.id}`, formData);
      
      if (response.data.success) {
        toast.success('Cliente actualizado correctamente');
        onClienteActualizado(); // Recargar la tabla
        onClose(); // Cerrar modal
      }
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar cliente');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Editar Cliente: {cliente?.nombre}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md"
              required
              disabled={loading}
            />
          </div>

          {/* Condición IVA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condición IVA
            </label>
            <select
              name="condicion_iva"
              value={formData.condicion_iva}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md"
              disabled={loading}
            >
              <option value="">SELECCIONE UNA CATEGORIA</option>
              <option value="Responsable Inscripto">Responsable Inscripto</option>
              <option value="Monotributo">Monotributo</option>
              <option value="Consumidor Final">Consumidor Final</option>
              <option value="Exento">Exento</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CUIT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CUIT
              </label>
              <input
                type="text"
                name="cuit"
                value={formData.cuit}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-md"
                placeholder="20-12345678-9"
                disabled={loading}
              />
            </div>

            {/* DNI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI
              </label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-md"
                placeholder="12345678"
                disabled={loading}
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md"
              placeholder="Dirección completa"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ciudad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-md"
                placeholder="Ciudad"
                disabled={loading}
              />
            </div>

            {/* Ciudad ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad ID
              </label>
              <input
                type="number"
                name="ciudad_id"
                value={formData.ciudad_id}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-md"
                placeholder="ID de la ciudad"
                disabled={loading}
              />
            </div>
          </div>

          {/* Provincia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provincia
            </label>
            <input
              type="text"
              name="provincia"
              value={formData.provincia}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md"
              placeholder="Provincia"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-md"
                placeholder="2302123456"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-md"
                placeholder="cliente@email.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-md ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Actualizar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente principal
export default function GestionClientes() {
  useAuth();

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Cargar todos los clientes
  const cargarClientes = async () => {
    setLoading(true);
    try {
      const response = await axiosAuth.get('/personas/buscar-cliente?search=');
      if (response.data.success) {
        setClientes(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cuit?.includes(searchTerm) ||
    cliente.dni?.includes(searchTerm)
  );

  // Paginación
  const totalPages = Math.ceil(clientesFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const clientesPaginados = clientesFiltrados.slice(startIndex, startIndex + itemsPerPage);

  const handleEditarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalAbierto(true);
  };

  const handleClienteActualizado = () => {
    cargarClientes(); // Recargar la tabla
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>VERTIMAR | Gestión de Clientes</title>
        <meta name="description" content="Administrar todos los clientes de VERTIMAR" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Gestión de Clientes
          </h1>
          
          {/* Barra de búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Buscar por nombre, ciudad, CUIT o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="text-sm text-gray-600 whitespace-nowrap">
              {clientesFiltrados.length} de {clientes.length} clientes
            </div>
          </div>
        </div>

        {/* Tabla de clientes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ciudad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ciudad ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provincia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesPaginados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    {/* Columna NOMBRE */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {cliente.nombre || '-'}
                      </div>
                      {cliente.nombre_alternativo && (
                        <div className="text-sm text-gray-500">
                          {cliente.nombre_alternativo}
                        </div>
                      )}
                    </td>
                    
                    {/* Columna DIRECCIÓN */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {cliente.direccion || '-'}
                      </div>
                    </td>
                    
                    {/* Columna CIUDAD */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.ciudad || '-'}
                    </td>
                    
                    {/* Columna CIUDAD ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cliente.ciudad_id ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cliente.ciudad_id || 'Sin ID'}
                      </span>
                    </td>
                    
                    {/* Columna PROVINCIA */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.provincia || '-'}
                    </td>
                    
                    {/* Columna ACCIONES */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditarCliente(cliente)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, clientesFiltrados.length)} de {clientesFiltrados.length} clientes
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                    {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      <ModalEditarCliente
        cliente={clienteSeleccionado}
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setClienteSeleccionado(null);
        }}
        onClienteActualizado={handleClienteActualizado}
      />
    </div>
  );
}