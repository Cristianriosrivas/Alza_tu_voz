import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  Trash2, 
  UserCheck, 
  UserX,
  Search, 
  ArrowLeft, 
  Lock,
  Edit3,
  X,
  AlertOctagon,
  MapPin,
  Calendar,
  Phone,
  Eye,
  Paperclip,
  ExternalLink,
  User,
  AlertTriangle
} from 'lucide-react';
import { useOperator, Denuncia } from '../../hooks/useOperator';

interface OperatorDashboardProps {
  onBack?: () => void;
  userEmail?: string;
}

export function OperatorDashboard({ 
  onBack, 
  userEmail = 'cristian.rios@correounivalle.edu.co' 
}: OperatorDashboardProps) {
  const { 
    isAllowedDomain, 
    usuarios, 
    denuncias, 
    updateDenunciaStatus, 
    deleteDenuncia, 
    toggleOperatorRole, 
    deleteUser 
  } = useOperator(userEmail);

  const [activeTab, setActiveTab] = useState<'denuncias' | 'usuarios'>('denuncias');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Estado para modal de edición de estado
  const [editingDenuncia, setEditingDenuncia] = useState<Denuncia | null>(null);
  const [newStatus, setNewStatus] = useState<Denuncia['estado']>('Pendiente');
  const [noteInput, setNoteInput] = useState('');

  // Estado para modal de confirmación de eliminación
  const [deleteModal, setDeleteModal] = useState<{
    type: 'denuncia' | 'usuario';
    id: string;
    label: string;
  } | null>(null);

  // Escuchar tecla ESC para cerrar modales
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingDenuncia(null);
      setDeleteModal(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Memoización para filtrado seguro y optimizado de denuncias
  const filteredDenuncias = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return (denuncias || []).filter((d) => {
      const usuario = String(d?.usuario || d?.emailUsuario || '').toLowerCase();
      const codigo = String(d?.codigoSeguimiento || d?.id || '').toLowerCase();
      const categoria = String(d?.categoria || '').toLowerCase();
      const descripcion = String(d?.descripcion || '').toLowerCase();
      const lugar = String(d?.lugar || '').toLowerCase();
      const testigos = String(d?.testigos || '').toLowerCase();
      const estado = String(d?.estado || '').toLowerCase();

      const matchesSearch = 
        !search ||
        usuario.includes(search) ||
        codigo.includes(search) ||
        categoria.includes(search) ||
        descripcion.includes(search) ||
        lugar.includes(search) ||
        testigos.includes(search);

      const matchesStatus = statusFilter === 'todos' || estado === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [denuncias, searchTerm, statusFilter]);

  // Memoización para filtrado de usuarios
  const filteredUsuarios = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return (usuarios || []).filter((u) => {
      const nombre = String(u?.nombre || '').toLowerCase();
      const email = String(u?.email || '').toLowerCase();
      return !search || nombre.includes(search) || email.includes(search);
    });
  }, [usuarios, searchTerm]);

  // Manejadores para edición y guardado
  const handleOpenEdit = (d: Denuncia) => {
    setEditingDenuncia(d);
    setNewStatus(d.estado);
    setNoteInput(d.notasInternas || '');
  };

  const handleSaveDenuncia = () => {
    if (editingDenuncia) {
      updateDenunciaStatus(editingDenuncia.id, newStatus, noteInput);
      setEditingDenuncia(null);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteModal) return;
    if (deleteModal.type === 'denuncia') {
      deleteDenuncia(deleteModal.id);
    } else {
      deleteUser(deleteModal.id);
    }
    setDeleteModal(null);
  };

  // Helper de estilos por estado
  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'En Proceso':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resuelto':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rechazado':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // PANTALLA DE BLOQUEO SI NO ES DOMINIO UNIVALLE
  if (!isAllowedDomain) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-red-100 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Acceso Restringido</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            El Modo Operador está reservado exclusivamente para cuentas autorizadas con dominio institucional <strong className="text-red-600">@correounivalle.edu.co</strong>.
          </p>
          <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-500 font-mono border border-gray-100">
            Sesión actual: {userEmail}
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow-sm"
            >
              Volver al inicio
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] p-4 md:p-8 font-sans pb-24">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-100 shadow-sm">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>Modo Operador Univalle</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Banner de estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-semibold">Total Denuncias</span>
              <FileText className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-xl font-bold text-gray-800">{(denuncias || []).length}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-semibold">Pendientes</span>
              <Clock className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-xl font-bold text-red-600">
              {(denuncias || []).filter((d) => d?.estado === 'Pendiente').length}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-semibold">Resueltas</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-xl font-bold text-emerald-600">
              {(denuncias || []).filter((d) => d?.estado === 'Resuelto').length}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-semibold font-sans">Operadores</span>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <span className="text-xl font-bold text-purple-600">
              {(usuarios || []).filter((u) => u?.rol === 'operador').length}
            </span>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('denuncias')}
            className={`pb-3 px-5 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'denuncias'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            Gestión de Denuncias ({filteredDenuncias.length})
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`pb-3 px-5 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'usuarios'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Usuarios y Operadores ({filteredUsuarios.length})
          </button>
        </div>

        {/* Filtros y Buscador */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código, dirección, persona..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {activeTab === 'denuncias' && (
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {['todos', 'Pendiente', 'En Proceso', 'Resuelto', 'Rechazado'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap capitalize transition ${
                    statusFilter === status
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TAB 1: GESTIÓN DE DENUNCIAS */}
        {activeTab === 'denuncias' && (
          <div className="space-y-4">
            {filteredDenuncias.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-xs text-gray-400 space-y-2">
                <AlertOctagon className="w-8 h-8 text-gray-300 mx-auto" />
                <p>No se encontraron denuncias registradas con los filtros aplicados.</p>
              </div>
            ) : (
              filteredDenuncias.map((denuncia) => {
                const mapsUrl = denuncia.latitud && denuncia.longitud
                  ? `https://www.google.com/maps?q=${denuncia.latitud},${denuncia.longitud}`
                  : denuncia.lugar
                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(denuncia.lugar)}`
                  : null;

                const evidenciasList = denuncia.evidencias || (denuncia as any).evidence || [];

                return (
                  <div
                    key={denuncia.id}
                    className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 hover:border-gray-300 transition"
                  >
                    {/* Header de tarjeta */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                          {denuncia.codigoSeguimiento || denuncia.id}
                        </span>
                        <span className="text-xs font-semibold bg-red-50 text-red-700 px-2.5 py-1 rounded-md">
                          {denuncia.categoria}
                        </span>
                        {denuncia.esAnonimo && (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200">
                            Anónimo
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400">• {denuncia.fechaRegistro}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full border ${getStatusBadge(
                            denuncia.estado
                          )}`}
                        >
                          {denuncia.estado}
                        </span>

                        <button
                          onClick={() => handleOpenEdit(denuncia)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Gestionar estado"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            setDeleteModal({
                              type: 'denuncia',
                              id: denuncia.id,
                              label: `denuncia #${denuncia.codigoSeguimiento || denuncia.id}`
                            })
                          }
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Descripción */}
                    <div>
                      <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line font-normal">
                        {denuncia.descripcion}
                      </p>
                    </div>

                    {/* Datos contextuales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-gray-50/80 rounded-xl text-xs text-gray-600 border border-gray-100">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-gray-700 block">Fecha del Incidente:</strong>
                          <span>{denuncia.fechaIncidente || 'No especificada'}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-gray-700 block">Testigos / Involucrados:</strong>
                          <span>{denuncia.testigos || 'Sin testigos registrados'}</span>
                        </div>
                      </div>

                      <div className="sm:col-span-2 flex items-start gap-2 border-t border-gray-200/60 pt-2.5">
                        <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <strong className="text-gray-700 block">Ubicación / Dirección:</strong>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>{denuncia.lugar || 'Ubicación no proporcionada'}</span>
                            {mapsUrl && (
                              <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline ml-1"
                              >
                                Ver mapa
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Galería de evidencias */}
                    {Array.isArray(evidenciasList) && evidenciasList.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1 mb-2">
                          <Paperclip className="w-3.5 h-3.5 text-red-500" />
                          Evidencias Adjuntas ({evidenciasList.length}):
                        </span>
                        <div className="flex gap-2.5 overflow-x-auto pb-1">
                          {evidenciasList.map((item: any, idx: number) => {
                            const rawUrl = typeof item === 'string' ? item : item?.url || item?.secure_url || '';
                            const isValidUrl = typeof rawUrl === 'string' && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'));

                            return (
                              <a
                                key={idx}
                                href={isValidUrl ? rawUrl : '#'}
                                target={isValidUrl ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  if (!isValidUrl) e.preventDefault();
                                }}
                                title={isValidUrl ? "Ver evidencia" : String(rawUrl)}
                                className="group relative flex flex-col items-center justify-center w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex-shrink-0 shadow-sm transition-all hover:border-red-500 overflow-hidden"
                              >
                                {isValidUrl ? (
                                  <>
                                    <img
                                      src={rawUrl}
                                      alt={`Evidencia ${idx + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                                      <Eye className="w-4 h-4" />
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center justify-center p-2 text-center text-gray-400 group-hover:text-red-500 transition">
                                    <Paperclip className="w-5 h-5 mb-1" />
                                    <span className="text-[9px] font-semibold truncate max-w-[64px]">
                                      {String(rawUrl || `Adjunto ${idx + 1}`)}
                                    </span>
                                  </div>
                                )}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Footer con datos del denunciante */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-gray-100 gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          Reportado por: <strong>{denuncia.usuario}</strong> ({denuncia.emailUsuario})
                        </span>
                        {denuncia.telefonoUsuario && denuncia.telefonoUsuario !== 'N/A' && (
                          <span className="flex items-center gap-1 ml-2 text-gray-600">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            {denuncia.telefonoUsuario}
                          </span>
                        )}
                      </div>

                      {denuncia.notasInternas && (
                        <div className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md border border-amber-200 text-[11px] font-medium">
                          <strong>Nota interna:</strong> {denuncia.notasInternas}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: GESTIÓN DE USUARIOS */}
        {activeTab === 'usuarios' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-4">Usuario</th>
                    <th className="p-4">Correo</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsuarios.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-400">
                        No se encontraron usuarios coincidentes.
                      </td>
                    </tr>
                  ) : (
                    filteredUsuarios.map((u) => {
                      const isUnivalle = String(u?.email || '').toLowerCase().endsWith('@correounivalle.edu.co');

                      return (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4 font-bold text-gray-800">{u.nombre}</td>
                          <td className="p-4 text-gray-600">{u.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                u.rol === 'operador'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {u.rol}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => toggleOperatorRole(u.id)}
                              disabled={!isUnivalle && u.rol === 'usuario'}
                              title={
                                !isUnivalle
                                  ? 'Requiere correo @correounivalle.edu.co'
                                  : u.rol === 'operador'
                                  ? 'Revocar operador'
                                  : 'Dar permiso de operador'
                              }
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                                u.rol === 'operador'
                                  ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                  : isUnivalle
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {u.rol === 'operador' ? (
                                <span className="flex items-center gap-1"><UserX className="w-3 h-3" /> Revocar</span>
                              ) : (
                                <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> Promover</span>
                              )}
                            </button>

                            <button
                              onClick={() =>
                                setDeleteModal({
                                  type: 'usuario',
                                  id: u.id,
                                  label: `usuario ${u.nombre}`
                                })
                              }
                              className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE EDICIÓN DE ESTADO */}
      {editingDenuncia && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setEditingDenuncia(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingDenuncia(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-gray-800 mb-1">
              Gestionar Denuncia {editingDenuncia.codigoSeguimiento || editingDenuncia.id}
            </h3>
            <p className="text-xs text-gray-500 mb-4">Actualiza el estado oficial y asigna notas internas.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Estado de la Denuncia</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Denuncia['estado'])}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Resuelto">Resuelto</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notas Internas de Seguimiento</label>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Detalles sobre las acciones realizadas..."
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDenuncia(null)}
                  className="w-1/3 py-2 text-xs font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveDenuncia}
                  className="w-2/3 bg-red-600 text-white py-2 text-xs font-semibold rounded-xl hover:bg-red-700 transition shadow-sm"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {deleteModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setDeleteModal(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-xs w-full p-6 shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">¿Confirmar eliminación?</h4>
              <p className="text-xs text-gray-500 mt-1">
                Está a punto de eliminar el registro de <strong className="text-gray-700">{deleteModal.label}</strong>. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteModal(null)}
                className="w-1/2 py-2 text-xs font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 bg-red-600 text-white py-2 text-xs font-semibold rounded-xl hover:bg-red-700 transition shadow-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OperatorDashboard;