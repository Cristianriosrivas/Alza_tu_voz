import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';[cite: 12, 13]

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

// Función auxiliar para subir imágenes a Cloudinary[cite: 12]
const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'tu_cloud_name';
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_PRESET || 'tu_upload_preset';

  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Error al subir la imagen: ${file.name}`);
    }

    const data = await res.json();
    return data.secure_url as string;
  });

  return Promise.all(uploadPromises);
};

export const IncidentReportFlow: React.FC<IncidentReportFlowProps> = ({ onComplete }) => {
  const { addReport } = useReports();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<IncidentReportData>({
    title: '',
    description: '',
    location: '',
    category: 'General',
    evidence: [],[cite: 12]
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
      // 1. Procesar subida de evidencia a Cloudinary[cite: 12]
      let evidenceUrls: string[] = [];
      if (formData.evidence.length > 0) {
        evidenceUrls = await uploadToCloudinary(formData.evidence);
      }

      // 2. Preparar el objeto con las URLs públicas generadas[cite: 12]
      const finalReportData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        category: formData.category,
        evidenceUrls,
        evidencias: evidenceUrls,
      };

      // 3. Guardar en Firestore[cite: 13]
      await addReport(finalReportData);

      // 4. Disparar callback de completado[cite: 12]
      if (onComplete) {
        onComplete(finalReportData);[cite: 12]
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