import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Bell, Lock, LogOut, ChevronRight, Save, Clock, CheckCircle, AlertCircle, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Report {
  id: string;
  date: string;
  time: string;
  location: string;
  status: 'En revisión' | 'En proceso' | 'Completado';
  description: string;
}

interface ProfileProps {
  onBack: () => void;
  onLogout: () => void;
  reports: Report[];
}

function formatElapsedTime(startTime: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - startTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);
  if (diffMins === 0) return `${diffSecs}s`;
  if (diffMins < 60) return `${diffMins}m ${diffSecs}s`;
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
}

export function Profile({ onBack, onLogout, reports }: ProfileProps) {
  const { profile, updateUserProfile } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState('0s');
  const [sessionStart] = useState(() => new Date());
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    birthdate: profile?.birthdate || '',
    gender: profile?.gender || '',
  });

  // Si el perfil llega después del primer render (o cambia), sincronizamos
  // el formulario con los datos reales guardados en Firestore.
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        birthdate: profile.birthdate || '',
        gender: profile.gender || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(formatElapsedTime(sessionStart));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const menuItems = [
    { icon: User, label: 'Editar información', id: 'edit' },
    { icon: Bell, label: 'Preferencias de notificación', id: 'notifications' },
    { icon: Lock, label: 'Privacidad y seguridad', id: 'privacy' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En revisión': return 'bg-[#FFF5E2] text-[#F5A623] border-[#FFC04D]';
      case 'En proceso': return 'bg-[#ECE8FF] text-[#563AC1] border-[#6A4AE3]';
      case 'Completado': return 'bg-[#E8FCEF] text-[#31A862] border-[#3FBF74]';
      default: return 'bg-[#F3F3F3] text-[#4A4A4A] border-[#B6B6B6]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En revisión': return <Clock className="w-3.5 h-3.5" />;
      case 'En proceso': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'Completado': return <CheckCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const statusCounts = {
    'En revisión': reports.filter(r => r.status === 'En revisión').length,
    'En proceso': reports.filter(r => r.status === 'En proceso').length,
    'Completado': reports.filter(r => r.status === 'Completado').length,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        birthdate: formData.birthdate,
        gender: formData.gender,
      });
      setSelectedView(null);
    } finally {
      setSaving(false);
    }
  };

  const sessionStartStr = sessionStart.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  const sessionDateStr = sessionStart.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

  // Vista de Editar Información
  if (selectedView === 'edit') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#ECE8FF] to-white">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
            <button onClick={() => setSelectedView(null)} className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#1C1C1E] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Atrás</span>
            </button>
            <h1 className="text-[#6A4AE3]">Editar información</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="bg-white border border-[#B6B6B6] rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-[#6A4AE3] to-[#FF6FAF] rounded-full flex items-center justify-center shadow-lg shadow-[#6A4AE3]/30">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="text-[#6A4AE3] hover:text-[#6A4AE3]/80 transition-colors text-sm">
                Cambiar foto
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[#4A4A4A] mb-2 text-sm">Nombre completo <span className="text-[#E34242]">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#B6B6B6] rounded-xl focus:outline-none focus:border-[#6A4AE3] transition-colors"
                  placeholder="Ingresa tu nombre completo" />
              </div>
              <div>
                <label className="block text-[#4A4A4A] mb-2 text-sm">Correo electrónico</label>
                <input type="email" name="email" value={formData.email} disabled
                  className="w-full px-4 py-3 border border-[#B6B6B6] rounded-xl bg-[#F3F3F3] text-[#9A9A9A] cursor-not-allowed"
                  placeholder="correo@ejemplo.com" />
                <p className="text-xs text-[#9A9A9A] mt-1">El correo de tu cuenta no se puede modificar aquí.</p>
              </div>
              <div>
                <label className="block text-[#4A4A4A] mb-2 text-sm">Teléfono (opcional)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#B6B6B6] rounded-xl focus:outline-none focus:border-[#6A4AE3] transition-colors"
                  placeholder="+57 300 123 4567" />
              </div>
              <div>
                <label className="block text-[#4A4A4A] mb-2 text-sm">Fecha de nacimiento (opcional)</label>
                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#B6B6B6] rounded-xl focus:outline-none focus:border-[#6A4AE3] transition-colors" />
              </div>
              <div>
                <label className="block text-[#4A4A4A] mb-2 text-sm">Género (opcional)</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#B6B6B6] rounded-xl focus:outline-none focus:border-[#6A4AE3] transition-colors bg-white">
                  <option value="">Selecciona una opción</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="no-binario">No binario</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#6A4AE3]/5 to-transparent p-4 rounded-xl border-l-4 border-[#6A4AE3]">
              <p className="text-[#4A4A4A] text-sm">
                Tu información es confidencial y segura. Solo tú puedes verla y modificarla.
                Los campos marcados con <span className="text-[#E34242]">*</span> son obligatorios.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button onClick={handleSaveProfile} disabled={saving}
                className="w-full bg-[#6A4AE3] text-white py-3 px-6 rounded-xl shadow-lg shadow-[#6A4AE3]/40 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                <Save className="w-5 h-5" />
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button onClick={() => setSelectedView(null)}
                className="w-full bg-[#F3F3F3] text-[#4A4A4A] py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                Cancelar
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white border border-[#B6B6B6] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#1C1C1E] font-semibold mb-4">Información importante sobre tus datos</h3>
            <div className="space-y-4 text-[#4A4A4A] text-sm">
              {[
                { title: 'Privacidad', text: 'Tu información personal nunca será compartida con terceros sin tu consentimiento explícito.' },
                { title: 'Seguridad', text: 'Utilizamos cifrado de extremo a extremo para proteger tus datos personales.' },
                { title: 'Control', text: 'Puedes editar o eliminar tu información en cualquier momento desde esta sección.' },
                { title: 'Anonimato', text: 'Los datos que compartes en tus denuncias permanecen anónimos si así lo prefieres.' },
              ].map(item => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-2 h-2 bg-[#6A4AE3] rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong className="text-[#1C1C1E]">{item.title}:</strong> {item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-white border border-[#B6B6B6] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#1C1C1E] font-semibold mb-3">Seguridad de la cuenta</h3>
            <p className="text-[#4A4A4A] text-sm mb-4">Mantén tu cuenta segura actualizando tu contraseña regularmente.</p>
            <button className="w-full bg-[#F3F3F3] text-[#6A4AE3] py-3 px-6 rounded-xl shadow-sm hover:shadow-md hover:bg-[#ECE8FF]/50 transition-all">
              Cambiar contraseña
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
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#1C1C1E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Atrás</span>
          </button>
          <h1 className="text-[#6A4AE3]">Mi perfil</h1>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Avatar y nombre */}
        <div className="bg-white border border-[#B6B6B6] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-16 h-16 bg-gradient-to-br from-[#6A4AE3] to-[#FF6FAF] rounded-full flex items-center justify-center shadow-lg shadow-[#6A4AE3]/30">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-[#1C1C1E] font-semibold">{formData.name}</h2>
            <p className="text-[#4A4A4A] text-sm">{formData.email}</p>
          </div>
        </div>

        {/* Estado de denuncias */}
        <div className="bg-white border border-[#B6B6B6] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-[#1C1C1E] font-semibold">Estado de mis denuncias</h3>

          {reports.length === 0 ? (
            <p className="text-[#9A9A9A] text-sm">Aún no tienes denuncias registradas.</p>
          ) : (
            <>
              {/* Contadores por estado */}
              <div className="grid grid-cols-3 gap-3">
                {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => (
                  <div key={status} className={`rounded-xl p-3 border text-center ${getStatusColor(status)}`}>
                    <p className="text-xl font-bold">{count}</p>
                    <p className="text-xs mt-0.5 font-medium">{status}</p>
                  </div>
                ))}
              </div>

              {/* Lista reciente */}
              <div className="space-y-3 pt-2">
                <p className="text-[#9A9A9A] text-xs uppercase tracking-wide font-medium">Recientes</p>
                {reports.slice(0, 3).map((report) => (
                  <div key={report.id} className="flex items-center gap-3 py-2 border-b border-[#F3F3F3] last:border-0">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border flex-shrink-0 ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      {report.status}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1C1C1E] text-sm truncate">{report.location}</p>
                      <p className="text-[#9A9A9A] text-xs">{report.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Opciones de menú */}
        <div className="bg-white border border-[#B6B6B6] rounded-2xl overflow-hidden shadow-sm">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedView(item.id)}
                className={`w-full p-6 flex items-center gap-4 hover:bg-[#ECE8FF]/30 transition-all hover:shadow-inner text-left ${
                  index !== menuItems.length - 1 ? 'border-b border-[#B6B6B6]' : ''
                }`}
              >
                <Icon className="w-6 h-6 text-[#B6B6B6]" />
                <span className="flex-1 text-[#1C1C1E]">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-[#B6B6B6]" />
              </button>
            );
          })}
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-white border-2 border-[#E34242] text-[#E34242] py-4 px-6 rounded-xl shadow-sm shadow-[#E34242]/20 hover:shadow-md hover:bg-[#FFECEC] transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>

        {/* Widget de sesión */}
        <div className="bg-white border border-[#B6B6B6] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6A4AE3]/10 to-[#FF6FAF]/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#6A4AE3]" />
            </div>
            <div>
              <p className="text-[#1C1C1E] font-semibold text-sm">Información de sesión</p>
              <p className="text-[#9A9A9A] text-xs">Tu actividad en Alza Tu Voz</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[#F3F3F3]">
              <div className="flex items-center gap-2 text-[#4A4A4A] text-sm">
                <Calendar className="w-4 h-4 text-[#6A4AE3]" />
                <span>Inicio de sesión</span>
              </div>
              <div className="text-right">
                <p className="text-[#1C1C1E] text-sm font-medium">{sessionStartStr}</p>
                <p className="text-[#9A9A9A] text-xs">{sessionDateStr}</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#F3F3F3]">
              <div className="flex items-center gap-2 text-[#4A4A4A] text-sm">
                <Clock className="w-4 h-4 text-[#3FBF74]" />
                <span>Tiempo en sesión</span>
              </div>
              <span className="text-[#3FBF74] font-semibold text-sm bg-[#E8FCEF] px-3 py-1 rounded-full">{elapsed}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-[#4A4A4A] text-sm">
                <AlertCircle className="w-4 h-4 text-[#FF6FAF]" />
                <span>Denuncias registradas</span>
              </div>
              <span className="text-[#FF6FAF] font-bold text-sm bg-[#FFE5F1] px-3 py-1 rounded-full">{reports.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-6 shadow-xl">
            <h3 className="text-[#1C1C1E] font-semibold text-lg">¿Seguro que deseas salir?</h3>
            <p className="text-[#4A4A4A]">Puedes volver cuando quieras.</p>
            <div className="space-y-3">
              <button
                onClick={onLogout}
                className="w-full bg-[#E34242] text-white py-3 px-6 rounded-xl shadow-lg shadow-[#E34242]/40 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Sí, cerrar sesión
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-[#F3F3F3] text-[#4A4A4A] py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
