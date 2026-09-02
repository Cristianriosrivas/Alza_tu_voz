import React, { useState, useRef } from 'react';
import { useReports } from '../../hooks/useReports';
import { uploadMultipleToCloudinary } from '../../../lib/cloudinary';
import { ErrorMessage } from '../shared/ErrorMessage';
import { LocationPicker } from './LocationPicker';

interface IncidentReportData {
  title: string;
  description: string;
  location: string;
  category: string;
  date: string;
  time: string;
  hadWitnesses: boolean;
  witnessesDescription: string;
  isAnonymous: boolean;
  latitude: number | null;
  longitude: number | null;
  evidence: File[];
}

interface IncidentReportFlowProps {
  onComplete?: (data: any) => void;
  onBack: () => void;
}

const CATEGORIES = [
  'Acoso verbal',
  'Acoso físico',
  'Acoso sexual',
  'Acoso laboral',
  'Ciberacoso',
  'Discriminación',
  'Otro',
];

const initialFormData: IncidentReportData = {
  title: '',
  description: '',
  location: '',
  category: 'Acoso verbal',
  date: '',
  time: '',
  hadWitnesses: false,
  witnessesDescription: '',
  isAnonymous: false,
  latitude: null,
  longitude: null,
  evidence: [],
};

export const IncidentReportFlow: React.FC<IncidentReportFlowProps> = ({ onComplete, onBack }) => {
  const { addReport } = useReports();
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState<'general' | 'empty' | 'file' | 'date' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState<IncidentReportData>(initialFormData);

  // Guarda dura contra doble envío: no depende solo del render de React,
  // así que un doble clic muy rápido (antes de que `disabled` surta efecto
  // en el botón) no dispara dos veces addReport().
  const isSubmittingRef = useRef(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        evidence: Array.from(e.target.files || []),
      }));
    }
  };

  const validateForm = (): { type: 'empty' | 'date'; message: string } | null => {
    if (!formData.title.trim()) return { type: 'empty', message: 'Falta el título de la denuncia.' };
    if (!formData.date) return { type: 'empty', message: 'Falta la fecha del incidente.' };
    if (!formData.location.trim()) return { type: 'empty', message: 'Falta indicar dónde ocurrió.' };
    if (!formData.description.trim()) return { type: 'empty', message: 'Falta describir la situación.' };

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) return { type: 'date', message: 'La fecha no puede ser en el futuro.' };

    return null;
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    // Evita envíos duplicados si el usuario hace doble clic o doble Enter
    if (isSubmittingRef.current || loading) return;

    const validationError = validateForm();
    if (validationError) {
      setErrorType(validationError.type);
      setErrorMsg(validationError.message);
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    setErrorType(null);
    setErrorMsg(undefined);

    try {
      // 1. Subir evidencia a Cloudinary (si el usuario adjuntó archivos)
      let evidenceUrls: string[] = [];
      if (formData.evidence.length > 0) {
        try {
          evidenceUrls = await uploadMultipleToCloudinary(formData.evidence);
        } catch (uploadErr) {
          setErrorType('file');
          throw uploadErr;
        }
      }

      // 2. Armar el objeto final con las claves que useReports.addReport() espera
      const finalReportData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        category: formData.category,
        dateIncident: formData.date,
        time: formData.time,
        witnesses: formData.hadWitnesses ? 'Sí' : 'No',
        witnessDetails: formData.hadWitnesses ? formData.witnessesDescription.trim() : '',
        isAnonymous: formData.isAnonymous,
        latitude: formData.latitude,
        longitude: formData.longitude,
        evidenceUrls,
        evidencias: evidenceUrls,
      };

      // 3. Guardar en Firestore (una sola vez; App.tsx NO debe volver a llamar addReport)
      await addReport(finalReportData);

      // 4. Resetear el formulario y avisar al padre de que ya se guardó
      setFormData(initialFormData);
      if (onComplete) {
        onComplete(finalReportData);
      }
    } catch (err: any) {
      if (!errorType) setErrorType('general');
      setErrorMsg(err?.message);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE5F1] to-white">
      <div className="max-w-xl mx-auto px-6 py-8">
        {/* Botón de volver */}
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#1C1C1E] font-medium mb-4 transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 111.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Volver al inicio
        </button>

        <form
          onSubmit={handleSubmitReport}
          className="p-6 space-y-5 bg-white border border-[#B6B6B6] rounded-2xl shadow-sm"
        >
          <div>
            <h2 className="text-[#FF6FAF] text-2xl font-bold">Registrar Denuncia</h2>
            <p className="text-sm text-[#4A4A4A] mt-1">
              Estás en un espacio seguro. Cuéntanos con el mayor detalle posible lo que ocurrió; toda la
              información que compartas es confidencial y nos ayuda a actuar mejor.
            </p>
          </div>

          {errorType && <ErrorMessage type={errorType} message={errorMsg} />}

          {/* Anónimo */}
          <div className="bg-[#ECE8FF] border border-[#6A4AE3]/20 rounded-xl p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-[#563AC1]">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="h-4 w-4 rounded border-[#6A4AE3] focus:ring-[#6A4AE3]"
              />
              Denunciar de forma anónima
            </label>
            <p className="text-xs text-[#563AC1]/80 mt-1 ml-6">
              Tu nombre y correo no se guardarán junto con esta denuncia.
            </p>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E]">Título de la denuncia</label>
            <input
              type="text"
              required
              placeholder="Ej: Comentarios inapropiados en reunión de equipo"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full mt-1 p-2 border border-[#B6B6B6] rounded-md focus:ring-2 focus:ring-[#FF6FAF] focus:outline-none"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E]">Tipo de situación</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full mt-1 p-2 border border-[#B6B6B6] rounded-md focus:ring-2 focus:ring-[#FF6FAF] focus:outline-none bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1C1C1E]">Fecha del incidente</label>
              <input
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full mt-1 p-2 border border-[#B6B6B6] rounded-md focus:ring-2 focus:ring-[#FF6FAF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1C1C1E]">Hora aproximada</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full mt-1 p-2 border border-[#B6B6B6] rounded-md focus:ring-2 focus:ring-[#FF6FAF] focus:outline-none"
              />
            </div>
          </div>

          {/* Ubicación (texto) */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E]">¿Dónde ocurrió?</label>
            <input
              type="text"
              required
              placeholder="Ej: Oficina, piso 3 / Sala de reuniones / Chat de trabajo"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full mt-1 p-2 border border-[#B6B6B6] rounded-md focus:ring-2 focus:ring-[#FF6FAF] focus:outline-none"
            />
          </div>

          {/* Ubicación en mapa (OpenStreetMap) */}
          <LocationPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            onChange={(lat, lng) => setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
          />

          {/* Descripción detallada */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E]">Describe la situación</label>
            <textarea
              required
              rows={5}
              placeholder="Describe qué pasó, quién estuvo involucrado y cómo te hizo sentir. Entre más detalle, mejor podremos ayudarte."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mt-1 p-2 border border-[#B6B6B6] rounded-md focus:ring-2 focus:ring-[#FF6FAF] focus:outline-none"
            />
          </div>

          {/* Testigos */}
          <div className="bg-[#F3F3F3] border border-[#B6B6B6] rounded-lg p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1C1C1E]">
              <input
                type="checkbox"
                checked={formData.hadWitnesses}
                onChange={(e) => setFormData({ ...formData, hadWitnesses: e.target.checked })}
                className="h-4 w-4 rounded border-[#B6B6B6] focus:ring-[#FF6FAF]"
              />
              ¿Hubo testigos presentes?
            </label>

            {formData.hadWitnesses && (
              <textarea
                rows={3}
                placeholder="Nombres o descripción de las personas que presenciaron el incidente (opcional)"
                value={formData.witnessesDescription}
                onChange={(e) => setFormData({ ...formData, witnessesDescription: e.target.value })}
                className="w-full mt-2 p-2 border border-[#B6B6B6] rounded-md focus:ring-2 focus:ring-[#FF6FAF] focus:outline-none"
              />
            )}
          </div>

          {/* Evidencia */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E]">Archivos de evidencia (opcional)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mt-1 p-2 border border-[#B6B6B6] rounded-md file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#ECE8FF] file:text-[#563AC1]"
            />
            <p className="text-xs text-[#4A4A4A] mt-1">
              Puedes adjuntar capturas de pantalla, fotos u otro material que respalde tu denuncia.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-[#FF6FAF] text-white font-semibold rounded-xl shadow hover:bg-[#FF6FAF]/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Enviando tu denuncia...' : 'Enviar Denuncia'}
          </button>
        </form>
      </div>
    </div>
  );
};