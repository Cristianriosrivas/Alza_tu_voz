import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  FileText, 
  Users, 
  MessageSquare, 
  Phone, 
  X, 
  Upload, 
  Save,
  Pencil,
  Calendar,
  CheckCircle,
  Paperclip,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { uploadMultipleToCloudinary } from '../../../lib/cloudinary';

interface IncidentData {
  id?: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  witnesses?: string;
  evidence?: string[];
}

interface IncidentDetailProps {
  onBack?: () => void;
  incidentData?: IncidentData;
  onUpdateReport?: (updatedData: IncidentData) => void;
  onDeleteReport?: (reportId?: string) => void;
}

export function IncidentDetailView({ onBack, incidentData, onUpdateReport, onDeleteReport }: IncidentDetailProps) {
  // Estado local para los datos actualizables del incidente
  const [currentData, setCurrentData] = useState<IncidentData>({
    id: incidentData?.id || '',
    date: incidentData?.date || '',
    time: incidentData?.time || '',
    location: incidentData?.location || '',
    description: incidentData?.description || '',
    witnesses: incidentData?.witnesses || 'No está segura',
    evidence: incidentData?.evidence || []
  });

  // Sincronizar si las props cambian
  useEffect(() => {
    if (incidentData) {
      setCurrentData({
        id: incidentData.id || '',
        date: incidentData.date || '',
        time: incidentData.time || '',
        location: incidentData.location || '',
        description: incidentData.description || '',
        witnesses: incidentData.witnesses || 'No está segura',
        evidence: incidentData.evidence || []
      });
    }
  }, [incidentData]);

  // Modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estado del formulario de edición
  const [formData, setFormData] = useState<IncidentData>({ ...currentData });
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Estado de subida a Cloudinary y errores del proceso de guardado
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Abrir modal de edición y cargar datos actuales
  const handleOpenEditModal = () => {
    setFormData({ ...currentData });
    setNewFiles([]);
    setIsSaved(false);
    setUploadError(null);
    setShowEditModal(true);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (field: keyof IncidentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Guardar los cambios actualizados: primero sube las nuevas evidencias a
  // Cloudinary y solo después persiste las URLs resultantes (nunca el
  // nombre local del archivo).
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setIsUploading(true);

    try {
      let newEvidenceUrls: string[] = [];
      if (newFiles.length > 0) {
        newEvidenceUrls = await uploadMultipleToCloudinary(newFiles);
      }

      const updatedEvidence = [
        ...(currentData.evidence || []),
        ...newEvidenceUrls
      ];

      const updatedReport: IncidentData = {
        ...formData,
        evidence: updatedEvidence
      };

      setCurrentData(updatedReport);

      if (onUpdateReport) {
        onUpdateReport(updatedReport);
      }

      setNewFiles([]);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setShowEditModal(false);
      }, 1200);
    } catch (err: any) {
      console.error('Error al subir evidencia a Cloudinary:', err);
      setUploadError(
        err?.message || 'No se pudo subir la evidencia a Cloudinary. Intenta de nuevo.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Confirmar y eliminar denuncia
  const handleConfirmDelete = () => {
    if (onDeleteReport) {
      onDeleteReport(currentData.id || incidentData?.id);
    }
    setShowDeleteModal(false);
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] p-4 md:p-8 font-sans pb-24">
      {/* Header */}
      <div className="max-w-2xl mx-auto flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </button>
        <span className="text-pink-500 font-medium text-sm">Detalle de denuncia</span>
      </div>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Card: Estado actual */}
        <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Estado actual de tu denuncia</h2>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">En revisión</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Estamos trabajando en tu caso. Te notificaremos cualquier avance.
              </p>
            </div>
          </div>
        </div>

        {/* Card: Información del incidente */}
        <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-gray-700">Información del incidente</h2>
            <button
              onClick={handleOpenEditModal}
              className="text-xs text-[#FF5A93] hover:underline font-medium flex items-center gap-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Fecha y hora</p>
                <p className="text-gray-800 font-medium">
                  {currentData.date || '-'} {currentData.time ? `a las ${currentData.time}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Ubicación</p>
                <p className="text-gray-800 font-medium">{currentData.location || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Descripción</p>
                <p className="text-gray-800 font-medium whitespace-pre-line">
                  {currentData.description || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Testigos</p>
                <p className="text-gray-800 font-medium">{currentData.witnesses || 'No está segura'}</p>
              </div>
            </div>

            {currentData.evidence && currentData.evidence.length > 0 && (
              <div className="flex items-start gap-3 pt-1">
                <Paperclip className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Archivos adjuntos</p>
                  <ul className="text-xs text-gray-700 list-disc list-inside mt-1 space-y-0.5">
                    {currentData.evidence.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3 pt-2">
          {/* Editar / Añadir información */}
          <button
            onClick={handleOpenEditModal}
            className="w-full bg-[#FF5A93] hover:bg-[#e0487f] text-white py-3.5 px-4 rounded-xl font-medium transition shadow-sm flex items-center justify-center gap-2 text-sm"
          >
            <Pencil className="w-4 h-4" />
            Editar o añadir información
          </button>

          {/* Contactar apoyo */}
          <button
            onClick={() => setShowSupportModal(true)}
            className="w-full bg-white border border-[#FF5A93] text-[#FF5A93] hover:bg-pink-50 py-3.5 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 text-sm"
          >
            <Phone className="w-4 h-4" />
            Contactar apoyo
          </button>

          {/* Eliminar denuncia */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 text-xs mt-4"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar esta denuncia
          </button>
        </div>
      </div>

      {/* MODAL 1: EDITAR Y AÑADIR INFORMACIÓN */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-800 mb-1">Actualizar denuncia</h3>
            <p className="text-xs text-gray-500 mb-5">
              Modifica los datos existentes o añade nuevos detalles y evidencias a tu reporte.
            </p>

            {isSaved ? (
              <div className="p-6 bg-green-50 text-green-700 rounded-xl text-center flex flex-col items-center gap-2 my-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
                <span className="font-semibold text-sm">¡Información actualizada con éxito!</span>
              </div>
            ) : (
              <form onSubmit={handleSaveChanges} className="space-y-4">
                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Fecha y Hora */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" /> Fecha
                    </label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5A93]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> Hora
                    </label>
                    <input
                      type="time"
                      value={formData.time || ''}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5A93]"
                    />
                  </div>
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> Ubicación
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Dirección o punto de referencia"
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5A93]"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-gray-400" /> Descripción de los hechos
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe detalladamente lo sucedido..."
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5A93] resize-none"
                  />
                </div>

                {/* Testigos */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-400" /> Detalles de Testigos
                  </label>
                  <input
                    type="text"
                    value={formData.witnesses || ''}
                    onChange={(e) => handleInputChange('witnesses', e.target.value)}
                    placeholder="Información o descripción de testigos si hubo"
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5A93]"
                  />
                </div>

                {/* Adjuntar más archivos */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Añadir nuevas fotos o evidencias
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#FF5A93] transition cursor-pointer bg-gray-50/50">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && setNewFiles(Array.from(e.target.files))}
                      className="hidden"
                      id="edit-file-input"
                      disabled={isUploading}
                    />
                    <label htmlFor="edit-file-input" className="cursor-pointer flex flex-col items-center gap-1">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-xs text-[#FF5A93] font-medium">Subir nuevos archivos</span>
                    </label>
                  </div>

                  {newFiles.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600 bg-pink-50 p-2 rounded-lg">
                      <p className="font-semibold text-gray-700 mb-1">Nuevos archivos seleccionados:</p>
                      <ul className="space-y-0.5">
                        {newFiles.map((f, idx) => (
                          <li key={idx} className="truncate">• {f.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Botones Guardar / Cancelar */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={isUploading}
                    className="w-1/3 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-2/3 bg-[#FF5A93] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#e0487f] transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isUploading ? 'Subiendo evidencia...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMACIÓN DE ELIMINACIÓN */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-gray-800 mb-2">¿Eliminar esta denuncia?</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Esta acción eliminará el registro de tu expediente. Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 bg-red-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-red-700 transition flex items-center justify-center gap-1 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONTACTAR APOYO */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-800 mb-1">Centros de apoyo y orientación</h3>
            <p className="text-xs text-gray-500 mb-5">
              Estamos aquí para acompañarte. Selecciona el canal por el que prefieras comunicarte:
            </p>

            <div className="space-y-3">
              <a
                href="tel:155"
                className="flex items-center justify-between p-4 rounded-xl border border-pink-100 bg-pink-50/50 hover:bg-pink-100/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF5A93] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Línea de orientación 155</p>
                    <p className="text-xs text-gray-500">Atención gratuita 24/7 y confidencial</p>
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/3135081132"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Escribir por WhatsApp</p>
                    <p className="text-xs text-gray-500">Respuesta por chat en tiempo real</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IncidentDetailView;