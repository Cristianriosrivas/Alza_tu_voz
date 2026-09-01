import React from 'react';
import { ArrowLeft, MapPin, Calendar, FileText, Image, MessageCircle } from 'lucide-react';

interface Report {
  id: string;
  date: string;
  time: string;
  location: string;
  status: 'En revisión' | 'En proceso' | 'Completado';
  description: string;
  witnesses: string;
  evidence: string[];
}

interface ReportDetailProps {
  report: Report;
  onBack: () => void;
}

export function ReportDetail({ report, onBack }: ReportDetailProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE5F1] to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#1C1C1E] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Atrás</span>
          </button>
          <h1 className="text-[#FF6FAF]">Detalle de denuncia</h1>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Estado actual */}
        <div className="bg-white border border-[#B6B6B6] rounded-2xl p-6">
          <h2 className="text-[#1C1C1E] mb-4">Estado actual de tu denuncia</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#ECE8FF] rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#6A4AE3]" />
            </div>
            <div>
              <p className="text-[#1C1C1E]">{report.status}</p>
              <p className="text-[#4A4A4A] text-sm">
                Estamos trabajando en tu caso. Te notificaremos cualquier avance.
              </p>
            </div>
          </div>
        </div>

        {/* Información del incidente */}
        <div className="bg-white border border-[#B6B6B6] rounded-2xl p-6 space-y-4">
          <h3 className="text-[#1C1C1E]">Información del incidente</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#B6B6B6] mt-0.5" />
              <div>
                <p className="text-[#4A4A4A] text-sm">Fecha y hora</p>
                <p className="text-[#1C1C1E]">{report.date} - {report.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#B6B6B6] mt-0.5" />
              <div>
                <p className="text-[#4A4A4A] text-sm">Ubicación</p>
                <p className="text-[#1C1C1E]">{report.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-[#B6B6B6] mt-0.5" />
              <div>
                <p className="text-[#4A4A4A] text-sm">Descripción</p>
                <p className="text-[#1C1C1E]">{report.description}</p>
              </div>
            </div>

            {report.witnesses && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#B6B6B6] mt-0.5" />
                <div>
                  <p className="text-[#4A4A4A] text-sm">Testigos</p>
                  <p className="text-[#1C1C1E]">{report.witnesses}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Evidencias aportadas */}
        {report.evidence.length > 0 && (
          <div className="bg-white border border-[#B6B6B6] rounded-2xl p-6 space-y-4">
            <h3 className="text-[#1C1C1E]">Evidencias aportadas</h3>
            <div className="grid grid-cols-2 gap-3">
              {report.evidence.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-[#F3F3F3] rounded-lg"
                >
                  <Image className="w-5 h-5 text-[#B6B6B6]" />
                  <span className="text-[#1C1C1E] text-sm truncate">{file}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-3">
          <button className="w-full bg-[#FF6FAF] text-white py-4 px-6 rounded-xl hover:bg-[#FF6FAF]/90 transition-colors">
            Añadir más información
          </button>
          <button className="w-full bg-white border-2 border-[#FF6FAF] text-[#FF6FAF] py-4 px-6 rounded-xl hover:bg-[#FFE5F1] transition-colors">
            Contactar apoyo
          </button>
        </div>
      </div>
    </div>
  );
}