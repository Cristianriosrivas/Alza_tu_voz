import React from 'react';
import { ArrowLeft, ChevronRight, Clock, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';

interface Report {
  id: string;
  date: string;
  location: string;
  status: 'En revisión' | 'En proceso' | 'Completado';
  description: string;
}

interface MyReportsProps {
  reports: Report[];
  onBack: () => void;
  onViewDetail: (reportId: string) => void;
}

export function MyReports({ reports, onBack, onViewDetail }: MyReportsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En revisión':
        return 'bg-[#FFF5E2] text-[#1C1C1E] border-[#FFC04D]';
      case 'En proceso':
        return 'bg-[#ECE8FF] text-[#563AC1] border-[#6A4AE3]';
      case 'Completado':
        return 'bg-[#E8FCEF] text-[#1C1C1E] border-[#3FBF74]';
      default:
        return 'bg-[#F3F3F3] text-[#4A4A4A] border-[#B6B6B6]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En revisión':
        return <Clock className="w-4 h-4" />;
      case 'En proceso':
        return <AlertCircle className="w-4 h-4" />;
      case 'Completado':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE5F1] to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#1C1C1E] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Atrás</span>
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#FF6FAF]" />
            <h1 className="text-[#FF6FAF]">Mis denuncias</h1>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {reports.length === 0 ? (
          <div className="bg-[#FFE5F1] border border-[#FF6FAF]/20 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-[#4A4A4A]">
              Aquí verás tus denuncias cuando registres tu primer incidente.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => onViewDetail(report.id)}
                className="w-full bg-white border border-[#B6B6B6] rounded-2xl p-6 hover:shadow-lg transition-all hover:border-[#FF6FAF] text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-[#1C1C1E] mb-1">
                        {report.location}
                      </p>
                      <p className="text-[#4A4A4A] text-sm">{report.date}</p>
                    </div>

                    <p className="text-[#4A4A4A] line-clamp-2">
                      {report.description}
                    </p>
                  </div>

                  <ChevronRight className="w-6 h-6 text-[#B6B6B6] flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}