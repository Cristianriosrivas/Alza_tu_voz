import React, { useState } from 'react';
import { useReports } from '../../hooks/useReports';
import { uploadMultipleToCloudinary } from '../../../lib/cloudinary';

interface IncidentReportData {
  title: string;
  description: string;
  location: string;
  category: string;
  evidence: File[];
}

interface IncidentReportFlowProps {
  onComplete?: (data: any) => void;
}

export const IncidentReportFlow: React.FC<IncidentReportFlowProps> = ({ onComplete }) => {
  const { addReport } = useReports();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<IncidentReportData>({
    title: '',
    description: '',
    location: '',
    category: 'General',
    evidence: [],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        evidence: Array.from(e.target.files || []),
      }));
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Procesar subida de evidencia a Cloudinary (usando la config
      //    compartida de src/lib/cloudinary.ts, con las variables de
      //    entorno de Vite ya configuradas correctamente).
      let evidenceUrls: string[] = [];
      if (formData.evidence.length > 0) {
        evidenceUrls = await uploadMultipleToCloudinary(formData.evidence);
      }

      // 2. Preparar el objeto con las URLs públicas generadas
      const finalReportData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        category: formData.category,
        evidenceUrls,
        evidencias: evidenceUrls,
      };

      // 3. Guardar en Firestore
      await addReport(finalReportData);

      // 4. Disparar callback de completado
      if (onComplete) {
        onComplete(finalReportData);
      }
    } catch (err: any) {
      setError(err.message || 'Error al enviar la denuncia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitReport} className="p-6 max-w-xl mx-auto space-y-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold">Registrar Denuncia</h2>

      {error && <div className="p-3 text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Archivos de Evidencia</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Subiendo imágenes y enviando...' : 'Enviar Reporte'}
      </button>
    </form>
  );
};