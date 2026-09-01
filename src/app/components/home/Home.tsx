import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface HomeProps {
  onNavigate?: (tab: string) => void;
  hasIncidents?: boolean;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState<'generic' | 'registrar'>('generic');
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const auth = getAuth();

  // Obtener y formatear el primer nombre (ej. CRISTIAN -> Cristian)
  const getFirstName = () => {
    if (!user) return '';
    const rawName = profile?.displayName || profile?.name || user.displayName || user.email?.split('@')[0] || '';
    const firstWord = rawName.trim().split(' ')[0];
    if (!firstWord) return '';
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
  };

  const firstName = getFirstName();

  const handleRegistrarClick = () => {
    if (user) {
      if (onNavigate) onNavigate('registrar');
    } else {
      setAuthReason('registrar');
      setIsAuthOpen(true);
    }
  };

  const handleHeaderAuthClick = () => {
    setAuthReason('generic');
    setIsAuthOpen(true);
  };

  const handleGoogleAuth = async () => {
    try {
      setErrorMsg('');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsAuthOpen(false);
      if (authReason === 'registrar' && onNavigate) {
        onNavigate('registrar');
      }
    } catch (err: any) {
      setErrorMsg('Error al conectar con Google: ' + err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setIsAuthOpen(false);
      if (authReason === 'registrar' && onNavigate) {
        onNavigate('registrar');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header Superior */}
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#6d28d9] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            A
          </div>
          <h1 className="text-xl font-bold text-[#6d28d9] tracking-tight">Alza Tu Voz</h1>
        </div>
        
        {user ? (
          <Button 
            onClick={() => onNavigate && onNavigate('perfil')}
            variant="outline"
            className="flex items-center gap-2 border-[#6d28d9] text-[#6d28d9] hover:bg-[#f5f3ff] font-medium px-4 py-2 rounded-xl transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Perfil
          </Button>
        ) : (
          <Button 
            onClick={handleHeaderAuthClick}
            className="bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-medium px-5 rounded-xl shadow-sm"
          >
            Iniciar sesión
          </Button>
        )}
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Banner de Bienvenida */}
        <div className="bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
              Espacio Seguro & Confidencial
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-3">
              {firstName ? `Hola ${firstName}, ¿cómo podemos ayudarte hoy?` : 'Hola, ¿cómo podemos ayudarte hoy?'}
            </h2>
            <p className="text-purple-100 text-sm mt-1 max-w-xl">
              Estamos aquí para brindarte apoyo, orientación y un canal seguro para alzar tu voz.
            </p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Tarjetas Principales en Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleRegistrarClick}
            className="flex items-start gap-4 bg-[#5b3cc4] text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all text-left group"
          >
            <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
            <div>
              <span className="text-lg font-bold block">Registrar incidente</span>
              <span className="text-xs text-purple-100 font-normal">Reporta situaciones de acoso o violencia con confidencialidad.</span>
            </div>
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('denuncias')}
            className="flex items-start gap-4 bg-[#ec4899] text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all text-left group"
          >
            <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <div>
              <span className="text-lg font-bold block">Mis denuncias</span>
              <span className="text-xs text-pink-100 font-normal">Consulta el avance y estado de tus reportes enviados.</span>
            </div>
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('recursos')}
            className="flex items-start gap-4 bg-[#10b981] text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all text-left group"
          >
            <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <div>
              <span className="text-lg font-bold block">Recursos de apoyo</span>
              <span className="text-xs text-emerald-100 font-normal">Accede a líneas de atención, guía legal y psicológica.</span>
            </div>
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('comunidad')}
            className="flex items-start gap-4 bg-[#f59e0b] text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all text-left group"
          >
            <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <div>
              <span className="text-lg font-bold block">Mi comunidad</span>
              <span className="text-xs text-amber-100 font-normal">Conéctate con redes comunitarias y espacios seguros.</span>
            </div>
          </button>
        </div>

        {/* Banner de Ayuda Inmediata / Líneas Rápidas */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">¿Necesitas orientación urgente?</h3>
              <p className="text-xs text-gray-500">Líneas gratuitas de atención nacional disponibles 24/7</p>
            </div>
          </div>
          <a 
            href="tel:155" 
            className="w-full sm:w-auto text-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-xl transition shadow-xs"
          >
            Llamar Línea 155
          </a>
        </div>

        {/* Sección Informativa y Consejos */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Información Útil</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
              <div className="text-[#6d28d9] mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h4 className="font-semibold text-xs text-gray-800">100% Confidencial</h4>
              <p className="text-[11px] text-gray-500 mt-1">Tus datos están protegidos y tienes control total sobre ellos.</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
              <div className="text-[#6d28d9] mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h4 className="font-semibold text-xs text-gray-800">Respuesta Rápida</h4>
              <p className="text-[11px] text-gray-500 mt-1">Recibe guía inmediata para activar protocolos institucionales.</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
              <div className="text-[#6d28d9] mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              <h4 className="font-semibold text-xs text-gray-800">Acompañamiento</h4>
              <p className="text-[11px] text-gray-500 mt-1">Red de apoyo psicológico y legal a tu disposición.</p>
            </div>
          </div>
        </div>

      </main>

      {/* Modal Emergente de Autenticación */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-[#6d28d9] font-bold">
              {authReason === 'registrar' 
                ? '¡Hola! Queremos proteger tu reporte 🔒' 
                : (isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mt-2">
              {authReason === 'registrar' ? (
                <span>
                  Por favor, inicia sesión para registrar tu incidente. Guardamos tus datos únicamente por motivos de seguridad y para que puedas dar seguimiento a tu caso. 
                  <strong className="block mt-2 text-xs text-[#6d28d9]">
                    ¡Recuerda que tienes control total y puedes eliminar tu información cuando quieras!
                  </strong>
                </span>
              ) : (
                'Accede a la plataforma para gestionar tus reportes'
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-2 border-gray-300 py-5 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">O con correo electrónico</span>
              </div>
            </div>

            {errorMsg && <p className="text-xs text-red-600 text-center font-medium">{errorMsg}</p>}

            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-[#6d28d9] hover:bg-[#5b21b6]">
                {isLoginView ? 'Entrar y continuar' : 'Registrarme y continuar'}
              </Button>
            </form>

            <div className="text-center text-xs text-gray-500 pt-2">
              {isLoginView ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <button 
                type="button" 
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-[#6d28d9] font-bold hover:underline"
              >
                {isLoginView ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;