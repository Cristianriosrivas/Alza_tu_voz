import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Upload, 
  CheckCircle, 
  Siren, 
  Navigation, 
  Map 
} from 'lucide-react';
import { MapPicker } from '../ui/MapPicker';

interface IncidentData {
  date: string;
  time: string;
  location: string;
  lat?: number;
  lng?: number;
  description: string;
  witnesses: 'yes' | 'no' | 'unsure' | null;
  witnessDetails: string;
  evidence: File[];
}

interface IncidentReportFlowProps {
  onComplete: (data: IncidentData) => void;
  onCancel: () => void;
}

export function IncidentReportFlow({ onComplete, onCancel }: IncidentReportFlowProps) {
  const [step, setStep] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Estados para la gestión del Mapa y GPS
  const [showMap, setShowMap] = useState(false);
  const [gettingGPS, setGettingGPS] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [data, setData] = useState<IncidentData>({
    date: '',
    time: '',
    location: '',
    description: '',
    witnesses: null,
    witnessDetails: '',
    evidence: [],
  });

  const updateData = (field: keyof IncidentData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Función para obtener la posición por GPS
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('La geolocalización no está soportada por tu navegador.');
      return;
    }

    setGettingGPS(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({ lat, lng });
        updateData('lat', lat);
        updateData('lng', lng);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const resData = await response.json();
          updateData('location', resData.display_name || `Ubicación GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        } catch {
          updateData('location', `Ubicación GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        } finally {
          setGettingGPS(false);
          setShowMap(true);
        }
      },
      () => {
        setGettingGPS(false);
        setGpsError('No se pudo obtener tu ubicación. Revisa los permisos de tu navegador.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  const handleFinish = () => {
    onComplete(data);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8FCEF] to-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-[#E8FCEF] rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-[#3FBF74]" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-[#1C1C1E] text-2xl font-bold">Tu denuncia fue enviada</h2>
            <p className="text-[#4A4A4A]">
              Gracias por confiar en nosotros. Te avisaremos cuando haya novedades.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={handleFinish}
              className="w-full bg-[#3FBF74] text-white py-4 px-6 rounded-xl hover:bg-[#3FBF74]/90 transition-colors font-semibold"
            >
              Ver mi denuncia
            </button>
            <button
              onClick={handleFinish}
              className="w-full bg-[#F3F3F3] text-[#4A4A4A] py-4 px-6 rounded-xl hover:bg-[#B6B6B6]/20 transition-colors font-semibold"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ECE8FF] to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#1C1C1E] transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Atrás</span>
          </button>
          <div className="flex items-center gap-2 text-[#6A4AE3] font-semibold">
            <Siren className="w-5 h-5" />
            <span className="hidden sm:inline">Registrar incidente</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-7 rounded-full transition-colors ${
                  s <= step ? 'bg-[#6A4AE3]' : 'bg-[#B6B6B6]/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-[#6A4AE3] text-2xl font-bold">Cuéntanos lo que ocurrió</h1>
              <p className="text-[#4A4A4A]">
                Te guiaremos paso a paso. Tu reporte es completamente confidencial.
              </p>
            </div>

            <div className="bg-[#E8FCEF] border border-[#3FBF74]/20 rounded-xl p-4">
              <p className="text-[#1C1C1E] text-sm">
                💙 Puedes detenerte cuando lo necesites y continuar después.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-[#6A4AE3] text-white py-4 px-6 rounded-xl hover:bg-[#563AC1] transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              Comenzar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-[#6A4AE3] text-xl font-bold">Paso 1 – Datos básicos</h2>

            <div className="space-y-5">
              {/* Fecha y Hora */}
              <div>
                <label className="block text-[#1C1C1E] mb-2 font-medium">¿Cuándo ocurrió?</label>
                <div className="space-y-3">
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B6B6B6]" />
                    <input
                      type="date"
                      value={data.date}
                      onChange={(e) => updateData('date', e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-[#B6B6B6] rounded-xl focus:ring-2 focus:ring-[#6A4AE3] focus:border-transparent bg-white text-sm outline-none"
                    />
                  </div>
                  <input
                    type="time"
                    value={data.time}
                    onChange={(e) => updateData('time', e.target.value)}
                    className="w-full px-4 py-3 border border-[#B6B6B6] rounded-xl focus:ring-2 focus:ring-[#6A4AE3] focus:border-transparent bg-white text-sm outline-none"
                  />
                </div>
              </div>

              {/* Dónde Ocurrió (3 Opciones: Texto, GPS y Mapa OpenStreetMap) */}
              <div>
                <label className="block text-[#1C1C1E] mb-2 font-medium">¿Dónde ocurrió?</label>
                <div className="space-y-3">
                  {/* OPCIÓN 1: Entrada manual */}
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B6B6B6]" />
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => updateData('location', e.target.value)}
                      placeholder="Escribe el lugar o selecciona en el mapa"
                      className="w-full pl-11 pr-4 py-3 border border-[#B6B6B6] rounded-xl focus:ring-2 focus:ring-[#6A4AE3] focus:border-transparent bg-white text-sm outline-none"
                    />
                  </div>

                  {/* OPCIÓN 2 y 3: Botones GPS y Mapa */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleUseGPS}
                      disabled={gettingGPS}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-[#6A4AE3]/30 text-[#6A4AE3] hover:bg-[#ECE8FF] rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <Navigation className="w-4 h-4" />
                      {gettingGPS ? 'Obteniendo GPS...' : 'Usar mi GPS'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-[#6A4AE3]/30 text-[#6A4AE3] hover:bg-[#ECE8FF] rounded-xl text-xs font-semibold transition-colors"
                    >
                      <Map className="w-4 h-4" />
                      {showMap ? 'Ocultar mapa' : 'Abrir mapa'}
                    </button>
                  </div>

                  {/* Error de GPS */}
                  {gpsError && (
                    <p className="text-xs text-red-500 font-medium mt-1">{gpsError}</p>
                  )}

                  {/* Desplegable de OpenStreetMap */}
                  {showMap && (
                    <div className="mt-2">
                      <MapPicker
                        initialCoords={coords}
                        onSelectLocation={(address, lat, lng) => {
                          updateData('location', address);
                          updateData('lat', lat);
                          updateData('lng', lng);
                          setCoords({ lat, lng });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-[#6A4AE3] text-white py-4 px-6 rounded-xl hover:bg-[#563AC1] transition-colors flex items-center justify-center gap-2 font-semibold mt-4"
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-[#6A4AE3] text-xl font-bold">Paso 2 – Descripción</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#1C1C1E] mb-2 font-medium">Describe el incidente</label>
                <textarea
                  value={data.description}
                  onChange={(e) => updateData('description', e.target.value)}
                  placeholder="Escribe lo que pasó…"
                  rows={8}
                  className="w-full px-4 py-3 border border-[#B6B6B6] rounded-xl focus:ring-2 focus:ring-[#6A4AE3] focus:border-transparent resize-none bg-white text-sm outline-none"
                />
                <p className="text-[#4A4A4A] text-xs mt-2">
                  Puedes incluir detalles que recuerdes: persona, acciones, entorno.
                </p>
              </div>
            </div>

            <div className="bg-[#E8FCEF] border border-[#3FBF74]/20 rounded-xl p-4">
              <p className="text-[#1C1C1E] text-sm">
                💙 No necesitas recordar todo con exactitud; escribe lo que puedas.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-[#6A4AE3] text-white py-4 px-6 rounded-xl hover:bg-[#563AC1] transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-[#6A4AE3] text-xl font-bold">Paso 3 – Testigos</h2>

            <div className="space-y-4">
              <label className="block text-[#1C1C1E] mb-3 font-medium">¿Hubo testigos?</label>

              <div className="space-y-3">
                {[
                  { value: 'yes', label: 'Sí, hubo testigos' },
                  { value: 'no', label: 'No hubo testigos' },
                  { value: 'unsure', label: 'No estoy segura' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateData('witnesses', option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium text-sm ${
                      data.witnesses === option.value
                        ? 'border-[#6A4AE3] bg-[#ECE8FF] text-[#6A4AE3]'
                        : 'border-[#B6B6B6]/50 bg-white hover:border-[#6A4AE3]/50 text-[#1C1C1E]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {data.witnesses === 'yes' && (
                <div className="mt-4 space-y-2">
                  <label className="block text-[#1C1C1E] text-sm font-medium">
                    Describe quiénes fueron o qué recuerdas
                  </label>
                  <textarea
                    value={data.witnessDetails}
                    onChange={(e) => updateData('witnessDetails', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-[#B6B6B6] rounded-xl focus:ring-2 focus:ring-[#6A4AE3] focus:border-transparent resize-none bg-white text-sm outline-none"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-[#6A4AE3] text-white py-4 px-6 rounded-xl hover:bg-[#563AC1] transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-[#6A4AE3] text-xl font-bold">Paso 4 – Evidencia (opcional)</h2>

            <div className="space-y-4">
              <p className="text-[#4A4A4A] text-sm">
                Si tienes fotos, videos o capturas, puedes subirlas aquí.
              </p>

              <div className="border-2 border-dashed border-[#B6B6B6] rounded-xl p-8 text-center hover:border-[#6A4AE3] transition-colors bg-white">
                <Upload className="w-10 h-10 text-[#B6B6B6] mx-auto mb-3" />
                <label className="cursor-pointer">
                  <span className="text-[#6A4AE3] font-semibold hover:text-[#563AC1]">
                    Subir archivo
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        updateData('evidence', Array.from(e.target.files));
                      }
                    }}
                  />
                </label>
                <p className="text-[#4A4A4A] text-xs mt-2">
                  Imágenes, videos o documentos
                </p>
              </div>

              {data.evidence.length > 0 && (
                <div className="space-y-2">
                  {data.evidence.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-[#F3F3F3] rounded-lg"
                    >
                      <Upload className="w-4 h-4 text-[#B6B6B6]" />
                      <span className="text-[#1C1C1E] text-xs truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-[#6A4AE3] text-white py-4 px-6 rounded-xl hover:bg-[#563AC1] transition-colors font-semibold"
            >
              Enviar denuncia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}