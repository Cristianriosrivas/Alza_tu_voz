import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function AuthScreen() {
  const { register, login, error } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (mode === 'register' && name.trim().length < 2) {
      setLocalError('Ingresa tu nombre completo.');
      return;
    }
    if (!email.trim()) {
      setLocalError('Ingresa un correo electrónico.');
      return;
    }
    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'register') {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const displayedError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ECE8FF] to-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#6A4AE3] to-[#FF6FAF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6A4AE3]/30 mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[#6A4AE3] font-semibold text-xl">Alza Tu Voz</h1>
          <p className="text-[#4A4A4A] text-sm mt-1">
            {mode === 'login' ? 'Bienvenida de vuelta' : 'Crea tu cuenta segura'}
          </p>
        </div>

        <div className="bg-white border border-[#B6B6B6] rounded-2xl p-6 shadow-sm">
          {/* Tabs */}
          <div className="flex bg-[#F3F3F3] rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setLocalError(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'login' ? 'bg-white text-[#6A4AE3] shadow-sm' : 'text-[#9A9A9A]'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setLocalError(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'register' ? 'bg-white text-[#6A4AE3] shadow-sm' : 'text-[#9A9A9A]'
              }`}
            >
              Registrarme
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-[#4A4A4A] mb-2 text-sm">Nombre completo</label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 text-[#9A9A9A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#B6B6B6] rounded-xl focus:outline-none focus:border-[#6A4AE3] transition-colors"
                    placeholder="Tu nombre"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#4A4A4A] mb-2 text-sm">Correo electrónico</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-[#9A9A9A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#B6B6B6] rounded-xl focus:outline-none focus:border-[#6A4AE3] transition-colors"
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#4A4A4A] mb-2 text-sm">Contraseña</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-[#9A9A9A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-[#B6B6B6] rounded-xl focus:outline-none focus:border-[#6A4AE3] transition-colors"
                  placeholder="Mínimo 6 caracteres"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-[#4A4A4A]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {displayedError && (
              <div className="flex items-start gap-2 bg-[#FFECEC] border border-[#E34242]/30 text-[#E34242] text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{displayedError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#6A4AE3] text-white py-3 px-6 rounded-xl shadow-lg shadow-[#6A4AE3]/40 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting
                ? 'Un momento...'
                : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#9A9A9A] text-xs mt-6">
          Tu información está protegida y se usa solo para ayudarte.
        </p>
      </div>
    </div>
  );
}
